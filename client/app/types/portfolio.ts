export interface Stock { 
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
  gainLoss: number | null; 
  stockCount: number; 
} 
export default interface PortfolioResponse { 
  stocks: Stock[]; 
  sectors: SectorSummary[]; 
  lastUpdated: string; 
  errors: string[]; 
}