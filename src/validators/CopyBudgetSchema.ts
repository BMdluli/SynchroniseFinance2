import { z } from "zod";

export const CopyBudgetSchema = z.object({
  newName: z.string().min(1),
});
