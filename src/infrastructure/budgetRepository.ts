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
      include: {
        budgetCategories: true,
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
      include: {
        budgetCategories: true,
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

  async getBudgetWithCategories(budgetId: number, userId: number) {
    return await prisma.budget.findFirst({
      where: {
        id: budgetId,
        userId,
      },
      include: {
        budgetCategories: true,
      },
    });
  }

  async createBudgetWithCategories(data: {
    name: string;
    startDate: Date;
    endDate: Date;
    totalIncome: number;
    userId: number;
    categories: { name: string; amount: number }[];
  }) {
    return await prisma.budget.create({
      data: {
        name: data.name,
        startDate: data.startDate,
        endDate: data.endDate,
        totalIncome: data.totalIncome,
        userId: data.userId,
        budgetCategories: {
          create: data.categories,
        },
      },
      include: {
        budgetCategories: true,
      },
    });
  }
}
