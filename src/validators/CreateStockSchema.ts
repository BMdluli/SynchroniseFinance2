import z, { symbol } from "zod";

export const CreateStockSchema = z.object({
  symbol: z.string(),
  purchacePrice: z.number(),
  shares: z.number(),
  portfolioId: z.number(),
});
