import { Response } from "express";
import { CreateBudgetSchema } from "../../validators/CreateBudgetSchema";
import {
  addBudget,
  deleteBudget,
  getBudget,
  getBudgets,
  updateBudget,
} from "../../usecases/budgetUseCase";
import { copyBudget } from "../../usecases/budgetUseCase";
import { CopyBudgetSchema } from "../../validators/CopyBudgetSchema";

export const getBudgetsHandler = async (req: any, res: Response) => {
  try {
    const userId = req.userInfo.id;

    const budgets = await getBudgets(userId);

    res.status(200).json({
      status: "success",
      data: budgets,
    });
  } catch (e: any) {
    console.log("Add contribution Error _>", e);
    return res.status(400).json({
      status: "fail",
      message: e.message || "Something went wrong",
    });
  }
};

export const getBudgetHandler = async (req: any, res: Response) => {
  try {
    const userId = req.userInfo.id;
    const { budgetId } = req.params;

    if (!Number(budgetId)) {
      return res.status(400).json({
        status: "fail",
        message: "Invalid id please make sure you selected a valid budget item",
      });
    }

    const budget = await getBudget(userId, Number(budgetId));

    if (!budget) {
      return res.status(404).json({
        status: "fail",
        message: `Budget with id of ${budgetId} not found`,
      });
    }

    return res.status(200).json({
      status: "success",
      data: budget,
    });
  } catch (e: any) {
    console.log("Get budget error _>", e);
    return res.status(400).json({
      status: "fail",
      message: e.message || "Something went wrong",
    });
  }
};

export const addBudgetHandler = async (req: any, res: Response) => {
  try {
    const userId = req.userInfo.id;
    const parsed = CreateBudgetSchema.safeParse(req.body);

    console.log(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        status: "fail",
        message: "Invalid input",
        errors: parsed.error.flatten(),
      });
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
  } catch (e: any) {
    console.log("Add contribution Error _>", e);
    return res.status(400).json({
      status: "fail",
      message: e.message || "Something went wrong",
    });
  }
};

export const updateBudgetHandler = async (req: any, res: Response) => {
  try {
    const userId = req.userInfo.id;
    const { budgetId } = req.params;
    const parsed = CreateBudgetSchema.partial().safeParse(req.body);

    if (!Number(budgetId)) {
      return res.status(400).json({
        status: "fail",
        message: "Invalid budget ID",
      });
    }

    if (!parsed.success) {
      return res.status(400).json({
        status: "fail",
        message: "Invalid input",
        errors: parsed.error.flatten(),
      });
    }

    await updateBudget(userId, Number(budgetId), parsed.data);

    return res.status(200).json({
      status: "success",
      message: "Budget updated successfully",
    });
  } catch (e: any) {
    console.error("Update budget error _>", e);
    return res.status(400).json({
      status: "fail",
      message: e.message || "Something went wrong",
    });
  }
};

export const deleteBudgetHandler = async (req: any, res: Response) => {
  try {
    const userId = req.userInfo.id;
    const { budgetId } = req.params;

    const id = Number(budgetId);
    if (!id) {
      return res.status(400).json({
        status: "fail",
        message: "Invalid id; please provide a valid budget item ID.",
      });
    }

    const deleted = await deleteBudget(userId, id);

    if (!deleted) {
      return res.status(404).json({
        status: "fail",
        message: `Budget with id ${budgetId} not found.`,
      });
    }

    return res.status(204).send(); // 👈 No Content on success
  } catch (e: any) {
    console.error("Delete budget error _>", e);
    return res.status(400).json({
      status: "fail",
      message: e.message || "Something went wrong",
    });
  }
};

export const copyBudgetHandler = async (req: any, res: Response) => {
  try {
    const userId = req.userInfo.id;
    const { budgetId } = req.params;
    const parsed = CopyBudgetSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        status: "fail",
        message: "Invalid input",
        errors: parsed.error.flatten(),
      });
    }

    const copied = await copyBudget(
      userId,
      Number(budgetId),
      parsed.data.newName
    );

    return res.status(201).json({
      status: "success",
      data: copied,
    });
  } catch (e: any) {
    console.error("Copy budget error _>", e);
    return res.status(400).json({
      status: "fail",
      message: e.message || "Something went wrong",
    });
  }
};
