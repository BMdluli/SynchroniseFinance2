import { prisma } from "../config/prisma";

export class PortfolioRepository {
  async createPortfolio(portfolioData: { name: string; userId: number }) {
    return await prisma.portfolio.create({
      data: portfolioData,
    });
  }

  async findPortfolioById(id: number, userId: number) {
    return await prisma.portfolio.findUnique({
      where: { id, userId },
      //   include: { user: true },
      include: { stocks: true },
    });
  }

  async getUserPortfolios(userId: number) {
    return await prisma.portfolio.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
  }

  async updatePortfolio(userId: number, id: number, newName: string) {
    return await prisma.portfolio.update({
      where: { id },
      data: { name: newName },
    });
  }

  async deletePortfolio(id: number) {
    return await prisma.portfolio.delete({
      where: { id },
    });
  }
}
