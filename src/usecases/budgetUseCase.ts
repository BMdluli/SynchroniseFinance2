import { CreateBudgetDto } from "../domain/dtos/CreateBudgetDto";
import { BudgetRepository } from "../infrastructure/budgetRepository";

const budgetRepo = new BudgetRepository();

export const addBudget = async (budgetData: CreateBudgetDto) => {
  const budget = await budgetRepo.addBudget(budgetData);

  if (!budget)
    throw new Error(
      "There was a problem creating your budget... Please try again later"
    );

  return budget;
};

export const getBudgets = async (userId: number) => {
  const budgets = await budgetRepo.getBudgets(userId);

  if (budgets.length === 0) return [];

  return budgets;
};

export const getBudget = async (userId: number, budgetId: number) => {
  const budget = await budgetRepo.getBudget(userId, budgetId);

  if (!budget) return null;

  return budget;
};

export const updateBudget = async (
  userId: number,
  budgetId: number,
  data: Partial<CreateBudgetDto>
) => {
  const budget = await budgetRepo.getBudget(userId, budgetId);
  if (!budget) {
    throw new Error(`Budget with id ${budgetId} not found.`);
  }

  const updated = await budgetRepo.updateBudget(budgetId, userId, data);

  if (updated.count === 0) {
    throw new Error(`Budget update failed for id ${budgetId}`);
  }

  return updated;
};

export const deleteBudget = async (userId: number, budgetId: number) => {
  const budget = await budgetRepo.getBudget(userId, budgetId);

  if (!budget) return false;

  await budgetRepo.deleteBudget(budgetId);
  return true;
};

export const copyBudget = async (
  userId: number,
  originalBudgetId: number,
  newName: string
) => {
  const original = await budgetRepo.getBudgetWithCategories(
    originalBudgetId,
    userId
  );

  if (!original) {
    throw new Error("Original budget not found or access denied.");
  }

  const copied = await budgetRepo.createBudgetWithCategories({
    name: newName,
    startDate: original.startDate,
    endDate: original.endDate,
    totalIncome: +original.totalIncome,
    userId: original.userId,
    categories: original.budgetCategories.map((cat) => ({
      name: cat.name,
      amount: +cat.amount,
    })),
  });

  return copied;
};
