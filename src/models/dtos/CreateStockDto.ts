export interface CreateStockDto {
  symbol: string;
  shares: number;
  purchasePrice: number;
  portfolioId: number;
}
