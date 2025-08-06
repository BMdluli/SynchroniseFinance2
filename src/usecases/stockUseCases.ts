import { CreateStockDto } from "../domain/dtos/CreateStockDto";
import { Quote } from "../domain/Quote";
import { PortfolioRepository } from "../infrastructure/portfolioRepoPrisma";
import { StockRepository } from "../infrastructure/stockRepoPrisma";
import axios from "axios";
import { stockCache } from "../utils/cache";
import { CompanyPortfolio } from "../domain/CompanyPortfolio";
import { Stock } from "../domain/Stock";
import { SearchResult } from "../domain/SearchResult";

const stockRepo = new StockRepository();
const portfolioRepo = new PortfolioRepository();

const getCompanyProfile = async (inputData: Partial<CreateStockDto>) => {
  const profileURL = `https://financialmodelingprep.com/stable/profile?symbol=${inputData.symbol}&apikey=${process.env.FMP_API_KEY}`;
  const profileRes = await axios.get<CompanyPortfolio[]>(profileURL);

  if (!profileRes.data || profileRes.data.length === 0) {
    throw new Error(`Stock with symbol '${inputData.symbol}' not found`);
  }

  const profile = profileRes.data[0];

  return profile;
};

export const createUserStock = async (
  stockData: CreateStockDto,
  userId: number,
  email: string
) => {
  const portfolio = await portfolioRepo.findPortfolioById(
    stockData.portfolioId,
    userId
  );

  if (!portfolio) {
    throw new Error(
      "The portfolio you are trying to add to does not exist or you do not have access"
    );
  }

  const whitelistedEmails = (process.env.WHITELIST_EMAIL || "").split(",");

  const isPremiumUser = whitelistedEmails.includes(email);

  if (!isPremiumUser && portfolio.stocks.length >= 3) {
    throw new Error("Only premium users can have more than 3 stocks");
  }

  const profile = await getCompanyProfile(stockData);

  const stockToCreate = {
    ...stockData,
    companyName: profile.companyName,
    imageUrl: profile.image,
    industry: profile.industry || "",
  };

  const stock = await stockRepo.createStock(stockToCreate);
  return stock;
};

export const getUserStocks = async (portfolioId: number) => {
  const stocks = await stockRepo.getAllStocks(portfolioId);

  if (stocks.length === 0) return [];

  const quotes: Quote[] = [];
  const symbolsToFetch: string[] = [];

  for (const stock of stocks) {
    const cachedQuote = stockCache.get<Quote>(stock.symbol.toUpperCase());
    if (cachedQuote) {
      quotes.push(cachedQuote);
    } else {
      symbolsToFetch.push(stock.symbol.toUpperCase());
    }
  }

  if (symbolsToFetch.length > 0) {
    const quoteURL = `https://financialmodelingprep.com/api/v3/quote/${symbolsToFetch.join(
      ","
    )}?apikey=${process.env.FMP_API_KEY}`;

    try {
      const response = await axios.get<Quote[]>(quoteURL);
      response.data.forEach((quote) => {
        stockCache.set(quote.symbol.toUpperCase(), quote); // Cache it
        quotes.push(quote);
      });
    } catch (error) {
      console.error("Failed to fetch some stock prices:", error);
    }
  }

  return stocks.map((stock) => {
    const quote = quotes.find(
      (q) => q.symbol.toUpperCase() === stock.symbol.toUpperCase()
    );
    return {
      ...stock,
      currentPrice: quote?.price ?? null,
      priceChange: quote?.change ?? null,
      priceChangePercentage: quote?.changesPercentage ?? null,
    };
  });
};

export const getUserStock = async (userId: number, stockId: number) => {
  const stock = await stockRepo.getStockById(stockId);

  if (!stock) {
    throw new Error("Stock not found");
  }

  if (stock.portfolio.userId !== userId) {
    throw new Error("Unauthorized access to stock");
  }

  return stock;
};

export const updateUserStock = async (
  userId: number,
  stockId: number,
  updateData: Partial<CreateStockDto>
) => {
  const stock = await stockRepo.getStockById(stockId);

  if (!stock) {
    throw new Error("Stock not found");
  }

  if (stock.portfolio.userId !== userId) {
    throw new Error("Unauthorized access to stock");
  }

  let stockToUpdate = {};

  // TODO: -> refactor
  if (updateData.symbol) {
    const profile = await getCompanyProfile(updateData);

    stockToUpdate = {
      ...updateData,
      companyName: profile.companyName,
      imageUrl: profile.image,
    };
  }

  return await stockRepo.updateStock(stockId, stockToUpdate);
};

export const deleteUserStock = async (
  userId: number,
  stockId: number
): Promise<boolean> => {
  const stock = await stockRepo.getStockById(stockId);

  if (!stock) {
    throw new Error("Stock not found");
  }

  if (stock.portfolio.userId !== userId) {
    throw new Error("You do not have permission to delete this stock");
  }

  await stockRepo.deleteStock(stockId);
  return true;
};

export const searchForStock = async (
  companyName: string
): Promise<SearchResult[]> => {
  try {
    const apiUrl = `https://financialmodelingprep.com/api/v3/search?query=${encodeURIComponent(
      companyName
    )}&limit=10&exchange=NASDAQ&apikey=${process.env.FMP_API_KEY}`;

    const response = await axios.get<SearchResult[]>(apiUrl);

    return response.data;
  } catch (error: any) {
    console.error("Search stock error:", error);
    throw new Error("Failed to search for stocks");
  }
};
