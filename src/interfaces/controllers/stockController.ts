import { Response } from "express";
import { CreateStockSchema } from "../../validators/CreateStockSchema";
import { createUserStock, getUserStocks } from "../../usecases/stockUseCases";

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
    const { portfolioId } = req.body;

    if (!portfolioId || isNaN(portfolioId)) {
      return res.status(400).json({
        status: "fail",
        message: "Please provide a valid portfolio ID",
      });
    }

    const stocks = await getUserStocks(portfolioId);

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
        // priceChange: stock.priceChange,
        // priceChangePercentage: stock.priceChangePercentage,
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
