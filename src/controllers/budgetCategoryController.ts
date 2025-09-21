import { Response } from "express";

import { z } from "zod";
import { catchAsync } from "../utils/catchAsync";
import { AppError } from "../utils/AppError";
import {
  addCategory,
  deleteCategory,
  getCategoriesByBudget,
  getCategory,
  updateCategory,
} from "../usecases/budgetCategoryUseCase";

const CategorySchema = z.object({
  name: z.string(),
  amount: z.number(),
  budgetId: z.number(),
});

export const createCategoryHandler = catchAsync(
  async (req: any, res: Response) => {
    const parsed = CategorySchema.safeParse(req.body);
    const userId = req.userInfo.id;

    if (!parsed.success) {
      throw new AppError("Invalid input", 400, parsed.error.flatten());
    }

    const category = await addCategory(userId, parsed.data);
    res.status(201).json({ status: "success", data: category });
  }
);

export const getCategoriesHandler = catchAsync(
  async (req: any, res: Response) => {
    const { budgetId } = req.params;

    if (!Number(budgetId)) {
      throw new AppError("Invalid budget ID", 400);
    }

    const categories = await getCategoriesByBudget(Number(budgetId));
    res.status(200).json({ status: "success", data: categories });
  }
);

export const getCategoryHandler = catchAsync(
  async (req: any, res: Response) => {
    const { categoryId } = req.params;

    if (!Number(categoryId)) {
      throw new AppError("Invalid category ID", 400);
    }

    const category = await getCategory(Number(categoryId));
    res.status(200).json({ status: "success", data: category });
  }
);

export const updateCategoryHandler = catchAsync(
  async (req: any, res: Response) => {
    const { categoryId } = req.params;
    const data = req.body;

    if (!Number(categoryId)) {
      throw new AppError("Invalid category ID", 400);
    }

    const updated = await updateCategory(Number(categoryId), data);
    res.status(200).json({ status: "success", data: updated });
  }
);

export const deleteCategoryHandler = catchAsync(
  async (req: any, res: Response) => {
    const { categoryId } = req.params;

    if (!Number(categoryId)) {
      throw new AppError("Invalid category ID", 400);
    }

    await deleteCategory(Number(categoryId));
    res.status(204).send();
  }
);
