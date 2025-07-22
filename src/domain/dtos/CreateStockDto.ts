export interface CreateStockDto {
  id?: number;
  symbol: string;
  shares: number;
  companyName: string;
  purchacePrice: number;
  imageUrl: string;
  portfolioId: number;
}
