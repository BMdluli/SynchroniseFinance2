import { CreateStockDto } from "../domain/dtos/CreateStockDto";
import { Quote } from "../domain/Quote";
import { PortfolioRepository } from "../infrastructure/portfolioRepoPrisma";
import { StockRepository } from "../infrastructure/stockRepoPrisma";
import axios from "axios";
import { stockCache } from "../utils/cache";
import { CompanyPortfolio } from "../domain/CompanyPortfolio";

const stockRepo = new StockRepository();
const portfolioRepo = new PortfolioRepository();

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

  const white_listed_emails = [process.env.WHITELIST_EMAIL];

  if (portfolio.stocks.length + 1 > 3 || white_listed_emails.includes(email)) {
    throw new Error("Only premium users can have more that 3 stocks");
  }

  const profileURL = `https://financialmodelingprep.com/stable/profile?symbol=${stockData.symbol}&apikey=${process.env.FMP_API_KEY}`;
  const profileRes = await axios.get<CompanyPortfolio[]>(profileURL);

  if (!profileRes.data || profileRes.data.length === 0) {
    throw new Error(`Stock with symbol '${stockData.symbol}' not found`);
  }

  const profile = profileRes.data[0];

  const stockToCreate = {
    ...stockData,
    companyName: profile.companyName,
    imageUrl: profile.image,
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
