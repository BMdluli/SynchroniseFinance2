import { prisma } from "../config/prisma";
import { CreateBudgetDto } from "../domain/dtos/CreateBudgetDto";

export class BudgetRepository {
  async addBudget(budgetData: CreateBudgetDto) {
    return await prisma.budget.create({
      data: budgetData,
    });
  }

  async getBudgets(userId: number) {
    return await prisma.budget.findMany({
      where: {
        userId,
      },
    });
  }

  async updateBudget(
    budgetId: number,
    userId: number,
    data: Partial<CreateBudgetDto>
  ) {
    return await prisma.budget.updateMany({
      where: {
        id: budgetId,
        userId,
      },
      data,
    });
  }

  async getBudget(userId: number, budgetId: number) {
    return await prisma.budget.findFirst({
      where: {
        userId,
        id: budgetId,
      },
    });
  }

  async deleteBudget(budgetId: number) {
    return await prisma.budget.delete({
      where: {
        id: budgetId,
      },
    });
  }
}
