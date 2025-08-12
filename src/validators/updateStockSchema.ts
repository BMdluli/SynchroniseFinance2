import { z } from "zod";

export const UpdateStockSchema = z.object({
  purchasePrice: z.number().optional(),
  shares: z.number().optional(),
});
