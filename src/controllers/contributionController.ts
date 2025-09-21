import { Response, Request } from "express";
import { addContribution } from "../usecases/contributionUseCases";
import { CreateContributionSchema } from "../validators/CreateContributionSchema";
import { AppError } from "../utils/AppError";
import { catchAsync } from "../utils/catchAsync";

export const addContributionHandler = catchAsync(
  async (req: Request, res: Response) => {
    const parsed = CreateContributionSchema.safeParse(req.body);

    if (!parsed.success) {
      throw new AppError("Invalid input", 400, parsed.error.flatten());
    }

    const { amount, savingsId } = parsed.data;

    const contribution = await addContribution({
      amount,
      savingId: savingsId,
      userId: (req as any).userInfo.id,
    });

    res.status(201).json({
      status: "success",
      data: contribution,
    });
  }
);
