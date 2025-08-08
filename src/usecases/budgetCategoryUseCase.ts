import { CreateBudgetCategoryDto } from "../domain/dtos/CreateBudgetCategoryDto";
import { BudgetCategoryRepository } from "../infrastructure/budgetCategoryRepo";
import { BudgetRepository } from "../infrastructure/budgetRepository";

const repo = new BudgetCategoryRepository();
const budgetRepo = new BudgetRepository();

export const addCategory = async (
  userId: number,
  data: CreateBudgetCategoryDto
) => {
  const budget = await budgetRepo.getBudget(userId, data.budgetId);

  if (!budget) {
    throw new Error("Budget not found");
  }

  // make sure that budget does not exceed the limit
  const totalAmount = budget.budgetCategories.reduce((sum, category) => {
    return sum + Number(category.amount || 0);
  }, 0);

  if (totalAmount + data.amount > Number(budget.totalIncome || 0)) {
    throw new Error("Total budget amount exceeded");
  }

  return repo.addCategory(data);
};

export const getCategoriesByBudget = async (budgetId: number) => {
  return repo.getCategoriesByBudget(budgetId);
};

export const getCategory = async (id: number) => {
  return repo.getCategory(id);
};

export const updateCategory = async (
  id: number,
  data: Partial<CreateBudgetCategoryDto>
) => {
  return repo.updateCategory(id, data);
};

export const deleteCategory = async (id: number) => {
  return repo.deleteCategory(id);
};
