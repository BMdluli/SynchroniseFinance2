import axios from "axios";
import { PortfolioRepository } from "../infrastructure/portfolioRepoPrisma";
import { AppError } from "../utils/AppError";
import { StockRepository } from "../infrastructure/stockRepoPrisma";

const portfolioRepo = new PortfolioRepository();
const stockRepo = new StockRepository();

export const addPortfolio = async ({
  name,
  userId,
}: {
  name: string;
  userId: number;
}) => {
  const portfolio = await portfolioRepo.createPortfolio({ name, userId });
  if (!portfolio) throw new AppError("Failed to create portfolio", 500);
  return portfolio;
};

export const getUserPortfolios = async (userId: number) => {
  return await portfolioRepo.getUserPortfolios(userId);
};

export const getUserPortfolio = async (userId: number, portfolioId: number) => {
  const portfolio = await portfolioRepo.findPortfolioById(portfolioId, userId);
  if (!portfolio) throw new AppError("Portfolio not found", 404);
  return portfolio;
};

export const deleteUserPortfolio = async (
  userId: number,
  portfolioId: number
) => {
  const portfolio = await portfolioRepo.findPortfolioById(portfolioId, userId);
  if (!portfolio) throw new AppError("Portfolio not found", 404);

  await portfolioRepo.deletePortfolio(portfolioId);
};

export const updateUserPortfolio = async (
  userId: number,
  portfolioId: number,
  name: string
) => {
  const updated = await portfolioRepo.updatePortfolio(
    userId,
    portfolioId,
    name
  );
  if (!updated) throw new AppError("Portfolio not found or unauthorized", 404);
  return updated;
};

export const getAIStockAnalysis = async (
  userId: number,
  portfolioId: number
) => {
  const userStocks = await stockRepo.getAllStocks(portfolioId);

  if (userStocks.length < 1) {
    throw new Error("No stocks found for analysis.");
  }

  console.log(userStocks.length);

  const symbols = userStocks.map((stock) => stock.symbol);

  const message = await getAiOverview(symbols);

  console.log(message);

  if (!message) {
    throw new Error("Failed to get AI analysis");
  }

  await portfolioRepo.updatePortfolio(userId, portfolioId, {
    aiOverview: message,
  });

  return true;
};

async function getAiOverview(stockData: string[]) {
  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-5-nano-2025-08-07",
        messages: [
          {
            role: "system",
            content:
              "You are a financial analyst. Provide concise, clear overviews of stock portfolios.",
          },
          {
            role: "user",
            content: `Here is my portfolio data:\n\n${JSON.stringify(
              stockData,
              null,
              2
            )}\n\nPlease provide a high-level analysis (trends, risks, opportunities).`,
          },
        ],
        max_completion_tokens: 500,
        reasoning_effort: "minimal",
        verbosity: "low",
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPEN_AI_KEY}`,
        },
      }
    );

    return response.data.choices[0].message.content;
  } catch (error: any) {
    console.error(
      "❌ Error calling GPT-5 Nano:",
      error.response?.data || error
    );
    return null;
  }
}
