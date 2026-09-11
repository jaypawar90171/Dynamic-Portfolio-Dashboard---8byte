export interface Holding {
    name: string;
    symbol: string;
    exchange: "NSE" | "BSE";
    sector: string;
    purchasePrice: number;
    quantity: number;
}
export declare const holdings: Holding[];
//# sourceMappingURL=portfolio.d.ts.map