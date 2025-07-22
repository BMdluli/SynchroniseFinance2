import { CreateStockDto } from "../domain/dtos/CreateStockDto";
import { StockRepository } from "../infrastructure/stockRepoPrisma";

const stockRepo = new StockRepository();

export const createUserStock = async (stockData: CreateStockDto) => {
  const stock = await stockRepo.createStock(stockData);

  if (!stock) return null;

  return stock;
};
