import { CreateStockDto } from "../models/dtos/CreateStockDto";
import { Quote } from "../models/Quote";
import { PortfolioRepository } from "../infrastructure/portfolioRepoPrisma";
import { StockRepository } from "../infrastructure/stockRepoPrisma";
import axios from "axios";
import { stockCache } from "../utils/cache";
import { CompanyPortfolio } from "../models/CompanyPortfolio";
import { Stock } from "../models/Stock";
import { SearchResult } from "../models/SearchResult";
import yahooFinance from "yahoo-finance2";

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

export const getDividendYield = async (symbol: string): Promise<number> => {
  try {
    const today = new Date();
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(today.getFullYear() - 1);

    // 1. Get dividend history for the past year
    const history = await yahooFinance.historical(symbol, {
      period1: oneYearAgo,
      period2: today,
      events: "dividends",
    });

    if (!history || history.length === 0) {
      console.warn(`No dividends found for ${symbol} in the past year`);
      return 0;
    }

    // 2. Sum up dividends
    const totalDividends = history.reduce(
      (sum, d) => sum + (d.dividends || 0),
      0
    );

    // 3. Get current price
    const quote = await yahooFinance.quote(symbol);
    const currentPrice = quote?.regularMarketPrice ?? 0;

    if (!currentPrice || totalDividends === 0) return 0;

    // 4. Calculate dividend yield as percentage
    const yieldPercent = (totalDividends / currentPrice) * 100;
    return Number(yieldPercent.toFixed(2));
  } catch (err: any) {
    console.error(`Error fetching dividend yield for ${symbol}:`, err.message);
    return 0;
  }
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

  if (!portfolio) throw new Error("Portfolio not found or no access");

  const isPremiumUser = (process.env.WHITELIST_EMAIL || "")
    .split(",")
    .includes(email);
  if (!isPremiumUser && portfolio.stocks.length >= 3)
    throw new Error("Only premium users can have more than 3 stocks");

  // Fetch profile and dividend yield in parallel
  const [profile, dividendYield] = await Promise.all([
    getCompanyProfile(stockData),
    getDividendYield(stockData.symbol),
  ]);

  const stockToCreate = {
    ...stockData,
    companyName: profile.companyName,
    imageUrl: profile.image,
    industry: profile.industry || "",
    dividendYield: dividendYield || 0,
  };

  return stockRepo.createStock(stockToCreate);
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

  return await stockRepo.updateStock(stockId, updateData);
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

export const bulkDeleteUserStocks = async (
  userId: number,
  stockIds: number[],
  portfolioId: number
) => {
  const portfolio = await portfolioRepo.findPortfolioById(portfolioId, userId);
  if (!portfolio) {
    throw new Error("Unauthorized access to this portfolio");
  }

  const result = await stockRepo.deleteManyStocks(stockIds, portfolioId);
  console.log(result);
  return result.count; // number of deleted stocks
};

// export const bulkUpdateUserStocks = async (
//   userId: number,
//   stockIds: number[],
//   portfolioId: number,
//   updateData: Partial<Stock>
// ) => {
//   const portfolio = await portfolioRepo.findPortfolioById(portfolioId, userId);
//   if (!portfolio) {
//     throw new Error("Unauthorized access to this portfolio");
//   }

//   const result = await stockRepo.updateManyStocks(
//     stockIds,
//     portfolioId,
//     updateData
//   );
//   return result.count; // number of updated stocks
// };

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
