import YahooFinance from "yahoo-finance2";
import type { Holding } from "../data/portfolio.js";

const yf = new YahooFinance();

export interface YahooData {
  cmp: number | null;
  peRatio: number | null;
  latestEarnings: string | null;
}

const MAX_RETRIES = 3;

function toYahooSymbol(holding: Holding): string {
  return holding.exchange === "NSE" ? `${holding.symbol}.NS`: `${holding.symbol}.BO`;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Fetches Yahoo Finance data for the given holdings, with retry logic in case of failures.
async function fetchOnce(holdings: Holding[]): Promise<Record<string, YahooData>> {
  const symbols = holdings.map(toYahooSymbol);
  const quotes = await yf.quote(symbols);

  const result: Record<string, YahooData> = {};
  for (const quote of quotes) {
    const cmp = quote.regularMarketPrice ?? null;
    const peRatio = quote.trailingPE ?? null;
    const latestEarnings = quote.earningsTimestamp ? quote.earningsTimestamp.toISOString().slice(0, 10) : null;

    result[quote.symbol] = { cmp, peRatio, latestEarnings };
  }
  return result;
}

export async function fetchYahooData(holdings: Holding[]): Promise<Record<string, YahooData>> {
  let attempt = 1;

  while (true) 
  {
    try 
    {
      return await fetchOnce(holdings);
    } 
    catch (error) 
    {
      if (attempt >= MAX_RETRIES) 
      {
        throw error;
      }
      const delay = 500 * 2 ** (attempt - 1);
      await sleep(delay);
      attempt += 1;
    }
  }
}