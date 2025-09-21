import { prisma } from "../config/prisma";
import { CreateBudgetCategoryDto } from "../models/dtos/CreateBudgetCategoryDto";

export class BudgetCategoryRepository {
  async addCategory(data: CreateBudgetCategoryDto) {
    return prisma.budgetCategory.create({ data });
  }

  async getCategoriesByBudget(budgetId: number) {
    return prisma.budgetCategory.findMany({
      where: { budgetId },
    });
  }

  async getCategory(id: number) {
    return prisma.budgetCategory.findUnique({ where: { id } });
  }

  async updateCategory(id: number, data: Partial<CreateBudgetCategoryDto>) {
    return prisma.budgetCategory.update({
      where: { id },
      data,
    });
  }

  async deleteCategory(id: number) {
    return prisma.budgetCategory.delete({
      where: { id },
    });
  }
}
