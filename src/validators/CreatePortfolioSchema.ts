import z from "zod";

export const CreatePortfolioSchema = z.object({
  name: z.string(),
});
