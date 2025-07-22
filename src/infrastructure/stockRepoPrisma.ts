import { prisma } from "../config/prisma";
import { CreateStockDto } from "../domain/dtos/CreateStockDto";

export class StockRepository {
  async createStock(stockData: CreateStockDto) {
    return await prisma.stock.create({
      data: stockData,
    });
  }

  async getAllStocks(userId: number) {
    return await prisma.stock.findMany({
      where: {},
    });
  }
}
