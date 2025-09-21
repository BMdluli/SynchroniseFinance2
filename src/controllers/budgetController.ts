import { Response } from "express";
import {
  addBudget,
  deleteBudget,
  getBudget,
  getBudgets,
  updateBudget,
  copyBudget,
} from "../usecases/budgetUseCase";
import { CreateBudgetSchema } from "../validators/CreateBudgetSchema";
import { CopyBudgetSchema } from "../validators/CopyBudgetSchema";
import { catchAsync } from "../utils/catchAsync";
import { AppError } from "../utils/AppError";

export const getBudgetsHandler = catchAsync(async (req: any, res: Response) => {
  const userId = req.userInfo.id;

  const result = await getBudgets(userId);

  res.status(200).json({
    status: "success",
    totalContributions: result.totalExpenses,
    data: result.data,
  });
});

export const getBudgetHandler = catchAsync(async (req: any, res: Response) => {
  const userId = req.userInfo.id;
  const { budgetId } = req.params;

  if (!Number(budgetId)) {
    throw new AppError("Invalid budget ID.", 400);
  }

  const budget = await getBudget(userId, Number(budgetId));

  res.status(200).json({
    status: "success",
    data: budget,
  });
});

export const addBudgetHandler = catchAsync(async (req: any, res: Response) => {
  const userId = req.userInfo.id;
  const parsed = CreateBudgetSchema.safeParse(req.body);

  if (!parsed.success) {
    throw new AppError("Invalid input", 400, parsed.error.flatten());
  }

  const { name, startDate, endDate, totalIncome } = parsed.data;

  const budget = await addBudget({
    name,
    startDate,
    endDate,
    totalIncome,
    userId,
  });

  res.status(201).json({
    status: "success",
    data: budget,
  });
});

export const updateBudgetHandler = catchAsync(
  async (req: any, res: Response) => {
    const userId = req.userInfo.id;
    const { budgetId } = req.params;

    if (!Number(budgetId)) {
      throw new AppError("Invalid budget ID.", 400);
    }

    const parsed = CreateBudgetSchema.partial().safeParse(req.body);

    if (!parsed.success) {
      throw new AppError("Invalid input", 400, parsed.error.flatten());
    }

    await updateBudget(userId, Number(budgetId), parsed.data);

    res.status(200).json({
      status: "success",
      message: "Budget updated successfully",
    });
  }
);

export const deleteBudgetHandler = catchAsync(
  async (req: any, res: Response) => {
    const userId = req.userInfo.id;
    const { budgetId } = req.params;

    if (!Number(budgetId)) {
      throw new AppError("Invalid budget ID.", 400);
    }

    await deleteBudget(userId, Number(budgetId));

    res.status(204).send();
  }
);

export const copyBudgetHandler = catchAsync(async (req: any, res: Response) => {
  const userId = req.userInfo.id;
  const { budgetId } = req.params;

  if (!Number(budgetId)) {
    throw new AppError("Invalid budget ID.", 400);
  }

  const parsed = CopyBudgetSchema.safeParse(req.body);

  if (!parsed.success) {
    throw new AppError("Invalid input", 400, parsed.error.flatten());
  }

  const copied = await copyBudget(
    userId,
    Number(budgetId),
    parsed.data.newName
  );

  res.status(201).json({
    status: "success",
    data: copied,
  });
});
