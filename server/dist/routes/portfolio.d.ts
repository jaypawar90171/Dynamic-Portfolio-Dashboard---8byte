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
export declare function buildPortfolioResponse(): Promise<PortfolioResponse>;
declare const router: import("express-serve-static-core").Router;
export default router;
//# sourceMappingURL=portfolio.d.ts.map