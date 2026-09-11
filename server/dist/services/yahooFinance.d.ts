import type { Holding } from "../data/portfolio.js";
export interface YahooData {
    cmp: number | null;
    peRatio: number | null;
    latestEarnings: string | null;
}
export declare function fetchYahooData(holdings: Holding[]): Promise<Record<string, YahooData>>;
//# sourceMappingURL=yahooFinance.d.ts.map