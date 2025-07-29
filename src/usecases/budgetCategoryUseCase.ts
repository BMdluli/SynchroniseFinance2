import { CreateBudgetCategoryDto } from "../domain/dtos/CreateBudgetCategoryDto";
import { BudgetCategoryRepository } from "../infrastructure/budgetCategoryRepo";

const repo = new BudgetCategoryRepository();

export const addCategory = async (data: CreateBudgetCategoryDto) => {
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
