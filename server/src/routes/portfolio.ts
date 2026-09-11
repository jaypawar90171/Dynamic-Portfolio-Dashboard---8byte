import { Router } from "express";
import { holdings } from "../data/portfolio.js";
import type { Holding } from "../data/portfolio.js";
import { fetchYahooData } from "../services/yahooFinance.js";
import type { YahooData } from "../services/yahooFinance.js";
import { getCache, peekCache, setCache } from "../services/cache.js";
import { CACHE_TTL_MS, DEGRADED_TTL_MS } from "../services/cache.js";

const CACHE_KEY = "portfolio_data";
const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 50;

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

export interface PortfolioTotals {
  totalInvestment: number;
  totalPresentValue: number;
  gainLoss: number;
  holdingsCount: number;
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalStocks: number;
  limit: number;
}

export interface FullPortfolio {
  stocks: EnrichedStock[];
  sectors: SectorSummary[];
  totals: PortfolioTotals;
  lastUpdated: string;
  marketOpen: boolean;
  errors: string[];
}

export interface PortfolioResponse extends FullPortfolio {
  pagination: PaginationInfo;
}

function yahooKey(holding: Holding): string {
  return holding.exchange === "NSE"
    ? `${holding.symbol}.NS`
    : `${holding.symbol}.BO`;
}

function isMarketOpen(now: Date = new Date()): boolean {
  const utcMinutes = now.getUTCHours() * 60 + now.getUTCMinutes();
  const istMinutes = (utcMinutes + 330) % 1440;
  const day = (now.getUTCDay() + 6) % 7;
  const weekday = day < 5;
  const marketHours = istMinutes >= 555 && istMinutes <= 930;
  return weekday && marketHours;
}

async function buildFullPortfolio(): Promise<FullPortfolio> {
  const errors: string[] = [];
  let yahooData: Record<string, YahooData> = {};

  try {
    yahooData = await fetchYahooData(holdings);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    errors.push(`Yahoo Finance unavailable: ${message}`);
  }

  const totalInvestment = holdings.reduce(
    (sum, h) => sum + h.purchasePrice * h.quantity,
    0
  );

  let totalPresentValue = 0;

  const stocks: EnrichedStock[] = holdings.map((holding) => {
    const live = yahooData[yahooKey(holding)];

    if (live === undefined) {
      errors.push(`No live data for ${holding.symbol}`);
    }

    const investment = holding.purchasePrice * holding.quantity;
    const cmp = live?.cmp ?? null;
    const presentValue = cmp !== null ? cmp * holding.quantity : null;
    const gainLoss = presentValue !== null ? presentValue - investment : null;

    if (presentValue !== null) totalPresentValue += presentValue;

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
      const sInvestment = list.reduce((sum, s) => sum + s.investment, 0);
      const sPresentValue = list.reduce(
        (sum, s) => sum + (s.presentValue ?? 0),
        0
      );
      return {
        sector,
        totalInvestment: sInvestment,
        totalPresentValue: sPresentValue,
        gainLoss: sPresentValue - sInvestment,
        stockCount: list.length,
      };
    }
  );

  return {
    stocks,
    sectors,
    totals: {
      totalInvestment,
      totalPresentValue,
      gainLoss: totalPresentValue - totalInvestment,
      holdingsCount: holdings.length,
    },
    lastUpdated: new Date().toISOString(),
    marketOpen: isMarketOpen(),
    errors,
  };
}

function paginateResponse(
  full: FullPortfolio,
  page: number,
  limit: number
): PortfolioResponse {
  const totalStocks = full.stocks.length;
  const totalPages = Math.max(1, Math.ceil(totalStocks / limit));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * limit;
  const stocks = full.stocks.slice(start, start + limit);

  return {
    ...full,
    stocks,
    pagination: {
      currentPage: safePage,
      totalPages,
      totalStocks,
      limit,
    },
  };
}

const router = Router();

router.get("/", async (req, res, next) => {
  const page = Math.max(1, Number(req.query.page) || DEFAULT_PAGE);
  const limit = Math.min(
    MAX_LIMIT,
    Math.max(1, Number(req.query.limit) || DEFAULT_LIMIT)
  );

  const cached = getCache<FullPortfolio>(CACHE_KEY);
  if (cached) {
    res.json(paginateResponse(cached, page, limit));
    return;
  }

  try {
    const full = await buildFullPortfolio();
    const degraded = full.errors.length > 0;

    if (degraded) {
      const stale = peekCache<FullPortfolio>(CACHE_KEY);
      if (stale) {
        const merged: FullPortfolio = {
          ...stale,
          lastUpdated: new Date().toISOString(),
          errors: [...new Set([...stale.errors, ...full.errors])],
        };
        res.json(paginateResponse(merged, page, limit));
        return;
      }
    }

    setCache(CACHE_KEY, full, degraded ? DEGRADED_TTL_MS : CACHE_TTL_MS);
    res.json(paginateResponse(full, page, limit));
  } catch (error) {
    next(error);
  }
});

export default router;