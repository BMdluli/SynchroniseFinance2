import { CreateBudgetCategoryDto } from "../models/dtos/CreateBudgetCategoryDto";
import { BudgetCategoryRepository } from "../infrastructure/budgetCategoryRepo";
import { BudgetRepository } from "../infrastructure/budgetRepository";
import { AppError } from "../utils/AppError";

const repo = new BudgetCategoryRepository();
const budgetRepo = new BudgetRepository();

export const addCategory = async (
  userId: number,
  data: CreateBudgetCategoryDto
) => {
  const budget = await budgetRepo.getBudget(userId, data.budgetId);

  if (!budget) {
    throw new AppError("Budget not found", 404);
  }

  const totalAmount = budget.budgetCategories.reduce((sum, category) => {
    return sum + Number(category.amount || 0);
  }, 0);

  if (totalAmount + data.amount > Number(budget.totalIncome || 0)) {
    throw new AppError("Total budget amount exceeded", 400);
  }

  return repo.addCategory(data);
};

export const getCategoriesByBudget = async (budgetId: number) => {
  return repo.getCategoriesByBudget(budgetId);
};

export const getCategory = async (id: number) => {
  const category = await repo.getCategory(id);
  if (!category) {
    throw new AppError("Category not found", 404);
  }
  return category;
};

export const updateCategory = async (
  id: number,
  data: Partial<CreateBudgetCategoryDto>
) => {
  return repo.updateCategory(id, data);
};

export const deleteCategory = async (id: number) => {
  const deleted = await repo.deleteCategory(id);
  if (!deleted) {
    throw new AppError("Category not found", 404);
  }
  return deleted;
};
