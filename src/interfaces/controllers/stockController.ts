import { Response } from "express";
import { CreateStockSchema } from "../../validators/CreateStockSchema";
import {
  createUserStock,
  deleteUserStock,
  getUserStock,
  getUserStocks,
  updateUserStock,
} from "../../usecases/stockUseCases";
import { PortfolioRepository } from "../../infrastructure/portfolioRepoPrisma";

const portfolioRepo = new PortfolioRepository();

export const createStockHandler = async (req: any, res: Response) => {
  try {
    const parsed = CreateStockSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        status: "fail",
        message: "Invalid input",
        errors: parsed.error.flatten(),
      });
    }

    if (!req.userInfo?.id) {
      return res.status(401).json({
        status: "fail",
        message: "Unauthorized: User information missing",
      });
    }

    console.log(req.userInfo);

    const stock = await createUserStock(
      parsed.data,
      req.userInfo.id,
      req.userInfo.email
    );

    return res.status(201).json({
      status: "success",
      data: stock,
    });
  } catch (error: any) {
    console.error("Error creating stock:", error);
    if (error.message.includes("Stock with symbol")) {
      return res.status(404).json({ status: "fail", message: error.message });
    }
    if (error.message.includes("portfolio")) {
      return res.status(404).json({ status: "fail", message: error.message });
    }
    return res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};

export const getStocksHandler = async (req: any, res: Response) => {
  try {
    const userId = req.userInfo?.id;
    const { portfolioId } = req.body;

    if (!portfolioId || isNaN(portfolioId)) {
      return res.status(400).json({
        status: "fail",
        message: "Please provide a valid portfolio ID",
      });
    }

    const portfolio = await portfolioRepo.findPortfolioById(
      Number(portfolioId),
      userId
    );

    if (!portfolio) {
      return res.status(403).json({
        status: "fail",
        message: "You do not have access to this portfolio",
      });
    }

    const stocks = await getUserStocks(portfolio.id);

    return res.status(200).json({
      status: "success",
      data: stocks.map((stock) => ({
        id: stock.id,
        symbol: stock.symbol,
        companyName: stock.companyName,
        purchasePrice: stock.purchasePrice,
        shares: stock.shares,
        imageUrl: stock.imageUrl,
        portfolioId: stock.portfolioId,
        currentPrice: stock.currentPrice,
      })),
    });
  } catch (error: any) {
    console.error("Error fetching stocks:", error);
    return res.status(500).json({
      status: "fail",
      message: error.message || "Failed to fetch stocks",
    });
  }
};

export const getStockHandler = async (req: any, res: Response) => {
  try {
    const stockId = Number(req.params.stockId);
    const userId = req.userInfo?.id;

    const stock = await getUserStock(userId, stockId);

    return res.status(200).json({
      status: "success",
      data: stock,
    });
  } catch (error: any) {
    const code = error.message.includes("Unauthorized") ? 403 : 404;
    return res.status(code).json({ status: "fail", message: error.message });
  }
};

export const updateStockHandler = async (req: any, res: Response) => {
  try {
    const stockId = Number(req.params.stockId);
    const userId = req.userInfo?.id;

    const updateFields = req.body;

    const updated = await updateUserStock(userId, stockId, updateFields);

    return res.status(200).json({
      status: "success",
      data: updated,
    });
  } catch (error: any) {
    const code = error.message.includes("Unauthorized") ? 403 : 404;
    return res.status(code).json({ status: "fail", message: error.message });
  }
};

export const deleteStockHandler = async (req: any, res: Response) => {
  try {
    const stockId = Number(req.params.stockId);
    const userId = req.userInfo?.id;

    if (!stockId || isNaN(stockId)) {
      return res
        .status(400)
        .json({ status: "fail", message: "Invalid stock ID" });
    }

    await deleteUserStock(userId, stockId);

    return res.status(204).send(); // No Content
  } catch (error: any) {
    if (error.message.includes("permission")) {
      return res.status(403).json({ status: "fail", message: error.message });
    }

    if (error.message.includes("not found")) {
      return res.status(404).json({ status: "fail", message: error.message });
    }

    return res.status(500).json({ status: "fail", message: error.message });
  }
};
