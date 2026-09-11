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
declare const router: import("express-serve-static-core").Router;
export default router;
//# sourceMappingURL=portfolio.d.ts.map