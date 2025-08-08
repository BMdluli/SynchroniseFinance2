import { CreateBudgetDto } from "../domain/dtos/CreateBudgetDto";
import { BudgetRepository } from "../infrastructure/budgetRepository";
import { AppError } from "../utils/AppError";

const budgetRepo = new BudgetRepository();

export const addBudget = async (budgetData: CreateBudgetDto) => {
  const budget = await budgetRepo.addBudget(budgetData);

  if (!budget)
    throw new AppError(
      "There was a problem creating your budget... Please try again later",
      500
    );

  return budget;
};

export const getBudgets = async (userId: number) => {
  const budgets = await budgetRepo.getBudgets(userId);

  if (budgets.length === 0) {
    return {
      totalExpenses: 0,
      data: [],
    };
  }

  const budgetsWithContributions = budgets.map((budget) => {
    const totalExpenses =
      budget.budgetCategories?.reduce((sum, category) => {
        return sum + Number(category.amount || 0);
      }, 0) || 0;

    return {
      ...budget,
      totalExpenses,
    };
  });

  const overallTotalContributions = budgetsWithContributions.reduce(
    (sum, budget) => sum + budget.totalExpenses,
    0
  );

  return {
    totalExpenses: overallTotalContributions,
    data: budgetsWithContributions,
  };
};

export const getBudget = async (userId: number, budgetId: number) => {
  const budget = await budgetRepo.getBudget(userId, budgetId);

  if (!budget) throw new AppError(`Budget with id ${budgetId} not found.`, 404);

  return budget;
};

export const updateBudget = async (
  userId: number,
  budgetId: number,
  data: Partial<CreateBudgetDto>
) => {
  const budget = await budgetRepo.getBudget(userId, budgetId);
  if (!budget) {
    throw new AppError(`Budget with id ${budgetId} not found.`, 404);
  }

  const updated = await budgetRepo.updateBudget(budgetId, userId, data);

  if (updated.count === 0) {
    throw new AppError(`Budget update failed for id ${budgetId}`, 500);
  }

  return updated;
};

export const deleteBudget = async (userId: number, budgetId: number) => {
  const budget = await budgetRepo.getBudget(userId, budgetId);

  if (!budget) {
    throw new AppError(`Budget with id ${budgetId} not found.`, 404);
  }

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
    throw new AppError("Original budget not found or access denied.", 404);
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
