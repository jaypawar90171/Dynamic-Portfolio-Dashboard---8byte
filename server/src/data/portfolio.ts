export interface Holding {
  symbol: string;
  exchange: "NSE" | "BSE";
  sector: string;
  purchasePrice: number;
  quantity: number;
}

export const holdings: Holding[] = [
  { symbol: "HDFCBANK", exchange: "NSE", sector: "Financials", purchasePrice: 1652.4, quantity: 30 },
  { symbol: "ICICIBANK", exchange: "NSE", sector: "Financials", purchasePrice: 1187.8, quantity: 45 },
  { symbol: "SBIN", exchange: "NSE", sector: "Financials", purchasePrice: 812.2, quantity: 60 },
  { symbol: "TCS", exchange: "NSE", sector: "Technology", purchasePrice: 3905.6, quantity: 12 },
  { symbol: "INFY", exchange: "NSE", sector: "Technology", purchasePrice: 1523.9, quantity: 40 },
  { symbol: "WIPRO", exchange: "NSE", sector: "Technology", purchasePrice: 498.3, quantity: 100 },
  { symbol: "RELIANCE", exchange: "NSE", sector: "Energy", purchasePrice: 2912.5, quantity: 25 },
  { symbol: "ONGC", exchange: "NSE", sector: "Energy", purchasePrice: 248.7, quantity: 200 },
  { symbol: "HINDUNILVR", exchange: "NSE", sector: "FMCG", purchasePrice: 2387.1, quantity: 18 },
  { symbol: "ITC", exchange: "NSE", sector: "FMCG", purchasePrice: 452.6, quantity: 150 },
  { symbol: "NESTLEIND", exchange: "NSE", sector: "FMCG", purchasePrice: 2540.2, quantity: 10 },
  { symbol: "MARUTI", exchange: "NSE", sector: "Automobile", purchasePrice: 12145.0, quantity: 6 },
  { symbol: "TATAMOTORS", exchange: "NSE", sector: "Automobile", purchasePrice: 946.8, quantity: 55 },
  { symbol: "M&M", exchange: "NSE", sector: "Automobile", purchasePrice: 2834.4, quantity: 20 },
  { symbol: "SUNPHARMA", exchange: "NSE", sector: "Pharma", purchasePrice: 1798.5, quantity: 22 },
  { symbol: "DRREDDY", exchange: "NSE", sector: "Pharma", purchasePrice: 1312.7, quantity: 15 },
];