import { z } from "zod";

export const UpdateSavingSchema = z.object({
  name: z.string().optional(),
  targetAmount: z.number().optional(),
  contributedAmount: z.number().optional(),
  targetDate: z.coerce.date().optional(),
});
