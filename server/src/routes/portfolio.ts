import { Router } from "express";
import { holdings } from "../data/portfolio.js";
import type { Holding } from "../data/portfolio.js";
import { fetchYahooData } from "../services/yahooFinance.js";
import type { YahooData } from "../services/yahooFinance.js";
import { getCache, setCache } from "../services/cache.js";

const CACHE_KEY = "portfolio_data";

export interface EnrichedStock {
  name: string;
  symbol: string;
  exchange: string;
  sector: string;
  purchasePrice: number;
  quantity: number;
  investment: number;
  portfolioPercent: number;
  cmp: number | null;
  presentValue: number | null;
  gainLoss: number | null;
  peRatio: number | null;
  latestEarnings: string | null;
}

export interface SectorSummary {
  sector: string;
  totalInvestment: number;
  totalPresentValue: number;
  gainLoss: number;
  stockCount: number;
}

export interface PortfolioResponse {
  stocks: EnrichedStock[];
  sectors: SectorSummary[];
  lastUpdated: string;
  errors: string[];
}

function yahooKey(holding: Holding): string {
  return holding.exchange === "NSE" ? `${holding.symbol}.NS` : `${holding.symbol}.BO`;
}

export async function buildPortfolioResponse(): Promise<PortfolioResponse> {
  const errors: string[] = [];
  let yahooData: Record<string, YahooData>;

  try 
  {
    yahooData = await fetchYahooData(holdings);
  } 
  catch (error) 
  {
    yahooData = {};
    const message = error instanceof Error ? error.message : String(error);
    errors.push(`Yahoo Finance fetch failed: ${message}`);
  }

  const totalInvestment = holdings.reduce((sum, holding) => sum + holding.purchasePrice * holding.quantity, 0);

  const stocks: EnrichedStock[] = holdings.map((holding) => {
    const live = yahooData[yahooKey(holding)];
    const investment = holding.purchasePrice * holding.quantity;
    const cmp = live?.cmp ?? null;
    const presentValue = cmp !== null ? cmp * holding.quantity : null;
    const gainLoss =
      presentValue !== null ? presentValue - investment : null;

    return {
      name: holding.name,
      symbol: holding.symbol,
      exchange: holding.exchange,
      sector: holding.sector,
      purchasePrice: holding.purchasePrice,
      quantity: holding.quantity,
      investment,
      portfolioPercent:
        totalInvestment > 0 ? investment / totalInvestment : 0,
      cmp,
      presentValue,
      gainLoss,
      peRatio: live?.peRatio ?? null,
      latestEarnings: live?.latestEarnings ?? null,
    };
  });

  const sectorMap = new Map<string, EnrichedStock[]>();
  for (const stock of stocks) {
    const list = sectorMap.get(stock.sector) ?? [];
    list.push(stock);
    sectorMap.set(stock.sector, list);
  }

  const sectors: SectorSummary[] = [...sectorMap.entries()].map(
    ([sector, list]) => {
      const totalInvestment = list.reduce(
        (sum, stock) => sum + stock.investment,
        0
      );
      const totalPresentValue = list.reduce(
        (sum, stock) => sum + (stock.presentValue ?? 0),
        0
      );
      return {
        sector,
        totalInvestment,
        totalPresentValue,
        gainLoss: totalPresentValue - totalInvestment,
        stockCount: list.length,
      };
    }
  );

  return {
    stocks,
    sectors,
    lastUpdated: new Date().toISOString(),
    errors,
  };
}

const router = Router();

router.get("/", async (_req, res) => {
  const cached = getCache<PortfolioResponse>(CACHE_KEY);
  if (cached) {
    res.json(cached);
    return;
  }

  const response = await buildPortfolioResponse();
  setCache(CACHE_KEY, response);
  res.json(response);
});

export default router;