export interface Stock {
  symbol: string;
  shares: number;
  companyName: string;
  purchasePrice: number;
  imageUrl: string;
  industry: string;
  portfolioId: number;
  dividendYield?: number;
}
