import { PortfolioRepository } from "../infrastructure/portfolioRepoPrisma";

const portfolioRepo = new PortfolioRepository();

export const addPortfolio = async (portfolioData: {
  name: string;
  userId: number;
}) => {
  const portfolio = await portfolioRepo.createPortfolio(portfolioData);

  if (!portfolio) return null;

  return portfolio;
};

export const getUserPortfolios = async (userId: number) => {
  const portfolios = await portfolioRepo.getUserPortfolios(userId);

  return portfolios;
};

export const getUserPortfolio = async (userId: number, portfolioId: number) => {
  const portfolio = await portfolioRepo.findPortfolioById(portfolioId, userId);
  console.log(portfolio);
  if (!portfolio) return null;

  return portfolio;
};

export const deleteUserPortfolio = async (
  userId: number,
  portfolioId: number
) => {
  const portfolio = await portfolioRepo.findPortfolioById(portfolioId, userId);

  if (!portfolio) return false;

  await portfolioRepo.deletePortfolio(portfolioId);

  return true;
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

  return updated;
};
