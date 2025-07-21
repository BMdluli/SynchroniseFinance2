import { Response } from "express";
import { addContribution } from "../../usecases/contributionUseCases";
import { CreateContributionSchema } from "../../validators/CreateContributionSchema";

export const addContributionHandler = async (req: any, res: Response) => {
  try {
    const parsed = CreateContributionSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        status: "fail",
        message: "Invalid input",
        errors: parsed.error.flatten(),
      });
    }

    const { amount, savingsId } = parsed.data;

    const contribution = await addContribution({
      amount,
      savingId: savingsId,
      userId: req.userInfo.id,
    });

    if (!contribution) {
      return res.status(400).json({
        status: "fail",
        message: "Something went wrong while trying to add your contribution",
      });
    }

    res.status(201).json({
      status: "success",
      data: contribution,
    });
  } catch (e: any) {
    console.log("Add contribution Error _>", e);
    return res.status(400).json({
      status: "fail",
      message: e.message || "Something went wrong",
    });
  }
};
