import { Router } from "express";
import { holdings } from "../data/portfolio.js";
import type { Holding } from "../data/portfolio.js";
import { fetchYahooData } from "../services/yahooFinance.js";
import type { YahooData } from "../services/yahooFinance.js";
import { getCache, peekCache, setCache } from "../services/cache.js";
import { CACHE_TTL_MS, DEGRADED_TTL_MS } from "../services/cache.js";

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
  marketOpen: boolean;
  errors: string[];
}

function yahooKey(holding: Holding): string {
  return holding.exchange === "NSE"
    ? `${holding.symbol}.NS`
    : `${holding.symbol}.BO`;
}

/**
 * NSE/BSE equity market hours: 09:15–15:30 IST, Monday–Friday.
 */
function isMarketOpen(now: Date = new Date()): boolean {
  const utcMinutes = now.getUTCHours() * 60 + now.getUTCMinutes();
  const istMinutes = (utcMinutes + 330) % 1440;
  const day = (now.getUTCDay() + 6) % 7;
  const weekday = day < 5;
  const marketHours = istMinutes >= 555 && istMinutes <= 930;
  return weekday && marketHours;
}

export async function buildPortfolioResponse(): Promise<PortfolioResponse> {
  const errors: string[] = [];
  let yahooData: Record<string, YahooData> = {};

  try {
    yahooData = await fetchYahooData(holdings);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    errors.push(`Yahoo Finance unavailable: ${message}`);
  }

  const totalInvestment = holdings.reduce(
    (sum, holding) => sum + holding.purchasePrice * holding.quantity,
    0
  );

  const stocks: EnrichedStock[] = holdings.map((holding) => {
    const live = yahooData[yahooKey(holding)];

    if (live === undefined) {
      errors.push(`No live data for ${holding.symbol}`);
    }

    const investment = holding.purchasePrice * holding.quantity;
    const cmp = live?.cmp ?? null;
    const presentValue = cmp !== null ? cmp * holding.quantity : null;
    const gainLoss = presentValue !== null ? presentValue - investment : null;

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
      const sectorInvestment = list.reduce(
        (sum, stock) => sum + stock.investment,
        0
      );
      const sectorPresentValue = list.reduce(
        (sum, stock) => sum + (stock.presentValue ?? 0),
        0
      );
      return {
        sector,
        totalInvestment: sectorInvestment,
        totalPresentValue: sectorPresentValue,
        gainLoss: sectorPresentValue - sectorInvestment,
        stockCount: list.length,
      };
    }
  );

  return {
    stocks,
    sectors,
    lastUpdated: new Date().toISOString(),
    marketOpen: isMarketOpen(),
    errors,
  };
}

const router = Router();

router.get("/", async (_req, res, next) => {
  const cached = getCache<PortfolioResponse>(CACHE_KEY);
  if (cached) {
    res.json(cached);
    return;
  }

  try {
    const response = await buildPortfolioResponse();
    const degraded = response.errors.length > 0;

    // fallback: if Yahoo failed entirely and we have a previous (even expired) snapshot, serve it with an error flag.
    if (degraded) {
      const stale = peekCache<PortfolioResponse>(CACHE_KEY);
      if (stale) {
        res.json({
          ...stale,
          lastUpdated: new Date().toISOString(),
          errors: [...new Set([...stale.errors, ...response.errors])],
        });
        return;
      }
    }

    // Extend cache TTL when the fetch degraded (rate-limit relief).
    setCache(
      CACHE_KEY,
      response,
      degraded ? DEGRADED_TTL_MS : CACHE_TTL_MS
    );
    res.json(response);
  } catch (error) {
    next(error);
  }
});

export default router;