export interface Quote {
  symbol: string;
  price: number;
  change: number;
  changesPercentage: number;
  companyName: string;
  image?: string;
}
