import { z } from "zod";

export const CreateSavingSchema = z.object({
  name: z.string(),
  targetAmount: z.number(),
  contributedAmount: z.number(),
  targetDate: z.string().transform((date) => new Date(date)),
});
