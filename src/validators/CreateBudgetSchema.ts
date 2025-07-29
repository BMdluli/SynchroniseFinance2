import z from "zod";

export const CreateBudgetSchema = z.object({
  name: z.string(),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  totalIncome: z.number(),
});
