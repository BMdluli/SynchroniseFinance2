import { z } from "zod";

export const CreateSavingSchema = z.object({
  name: z.string(),
  targetAmount: z.number(),
  targetDate: z.string().transform((date) => new Date(date)),
});
