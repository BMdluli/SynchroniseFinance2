import { prisma } from "../config/prisma";
import { Prisma } from "@prisma/client";
import { Stock } from "../domain/Stock";

export class StockRepository {
  async createStock(stockData: Stock) {
    try {
      return await prisma.stock.create({
        data: {
          symbol: stockData.symbol,
          shares: stockData.shares,
          companyName: stockData.companyName || "",
          purchasePrice: stockData.purchasePrice,
          imageUrl: stockData.imageUrl!,
          portfolioId: stockData.portfolioId,
        },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        throw new Error(
          `Stock with symbol '${stockData.symbol}' already exists`
        );
      }
      throw error;
    }
  }

  async getAllStocks(portfolioId: number) {
    try {
      return await prisma.stock.findMany({
        where: { portfolioId },
      });
    } catch (error: any) {
      throw new Error(
        `Failed to fetch stocks for portfolio ID ${portfolioId}: ${error.message}`
      );
    }
  }

  async deleteStock(stockId: number) {
    return await prisma.stock.delete({
      where: { id: stockId },
    });
  }

  async getStockById(stockId: number) {
    return await prisma.stock.findUnique({
      where: { id: stockId },
      include: {
        portfolio: true,
      },
    });
  }
}
