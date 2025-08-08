import { PortfolioRepository } from "../infrastructure/portfolioRepoPrisma";
import { AppError } from "../utils/AppError";

const portfolioRepo = new PortfolioRepository();

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
