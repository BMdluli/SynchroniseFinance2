import z from "zod";

export const CreateContributionSchema = z.object({
  amount: z.number(),
  savingsId: z.number(),
});
