import { Response } from "express";
import {
  addCategory,
  getCategoriesByBudget,
  getCategory,
  updateCategory,
  deleteCategory,
} from "../../usecases/budgetCategoryUseCase";
import { z } from "zod";

const CategorySchema = z.object({
  name: z.string(),
  amount: z.number(),
  budgetId: z.number(),
});

export const createCategoryHandler = async (req: any, res: Response) => {
  const parsed = CategorySchema.safeParse(req.body);
  if (!parsed.success) {
    return res
      .status(400)
      .json({ status: "fail", errors: parsed.error.flatten() });
  }

  const category = await addCategory(parsed.data);
  return res.status(201).json({ status: "success", data: category });
};

export const getCategoriesHandler = async (req: any, res: Response) => {
  const { budgetId } = req.params;

  const categories = await getCategoriesByBudget(Number(budgetId));
  return res.status(200).json({ status: "success", data: categories });
};

export const getCategoryHandler = async (req: any, res: Response) => {
  const { categoryId } = req.params;
  const category = await getCategory(Number(categoryId));
  if (!category) {
    return res
      .status(404)
      .json({ status: "fail", message: "Category not found" });
  }

  return res.status(200).json({ status: "success", data: category });
};

export const updateCategoryHandler = async (req: any, res: Response) => {
  const { categoryId } = req.params;
  const data = req.body;

  const category = await updateCategory(Number(categoryId), data);
  return res.status(200).json({ status: "success", data: category });
};

export const deleteCategoryHandler = async (req: any, res: Response) => {
  const { categoryId } = req.params;

  try {
    await deleteCategory(Number(categoryId));
    return res.status(204).send();
  } catch (e) {
    return res
      .status(404)
      .json({ status: "fail", message: "Category not found" });
  }
};
