import { Response } from "express";
import { CreateStockSchema } from "../../validators/CreateStockSchema";
import axios from "axios";
import { Quote } from "../../domain/Quote";
import { createUserStock } from "../../usecases/stockUseCases";

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
    const { symbol, shares, purchacePrice, portfolioId } = parsed.data;

    // get stock associated with symbol
    const quoteURL = `https://financialmodelingprep.com/stable/profile?symbol=${req.body.symbol}&apikey=${process.env.FMP_API_KEY}`;

    const qoute = await axios.get<Quote[]>(quoteURL);

    if (qoute.data.length < 0) {
      return res.status(404).json({
        status: "fail",
        message: `Stock with the symbol of ${symbol} not found`,
      });
    }

    const qouteItem = qoute.data[0];

    const formatedStock = {
      symbol: symbol,
      shares: shares,
      companyName: qouteItem.companyName,
      purchacePrice: purchacePrice,
      imageUrl: qouteItem.image,
      portfolioId: portfolioId,
    };

    const stock = await createUserStock(formatedStock);

    res.status(201).json({
      status: "successs",
      data: stock,
    });
  } catch (e: any) {
    console.log(e);
    res.status(500).json({
      status: "fail",
      message: "Something went wrong",
    });
  }
};
