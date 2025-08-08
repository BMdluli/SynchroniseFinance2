import { Response } from "express";
import {
  addPortfolio,
  deleteUserPortfolio,
  getUserPortfolio,
  getUserPortfolios,
  updateUserPortfolio,
} from "../../usecases/portfolioUseCases";
import { CreatePortfolioSchema } from "../../validators/CreatePortfolioSchema";
import { catchAsync } from "../../utils/catchAsync";
import { AppError } from "../../utils/AppError";

export const addPortfolioHandler = catchAsync(
  async (req: any, res: Response) => {
    const parsed = CreatePortfolioSchema.safeParse(req.body);
    if (!parsed.success) {
      throw new AppError("Invalid input", 400);
    }

    const portfolio = await addPortfolio({
      name: req.body.name,
      userId: req.userInfo.id,
    });

    res.status(201).json({
      status: "success",
      data: portfolio,
    });
  }
);

export const getPortfolios = catchAsync(async (req: any, res: Response) => {
  const portfolios = await getUserPortfolios(req.userInfo.id);
  res.status(200).json({
    status: "success",
    data: portfolios,
  });
});

export const getPortfolio = catchAsync(async (req: any, res: Response) => {
  const userId = req.userInfo.id;
  const portfolioId = Number(req.params.portfolioId);

  if (!portfolioId || isNaN(portfolioId)) {
    throw new AppError("Invalid portfolio ID", 400);
  }

  const portfolio = await getUserPortfolio(userId, portfolioId);

  res.status(200).json({
    status: "success",
    data: portfolio,
  });
});

export const deletePortfolio = catchAsync(async (req: any, res: Response) => {
  const portfolioId = Number(req.params.portfolioId);

  if (!portfolioId || isNaN(portfolioId)) {
    throw new AppError("Invalid portfolio ID", 400);
  }

  await deleteUserPortfolio(req.userInfo.id, portfolioId);

  res.status(204).json();
});

export const updatePortfolio = catchAsync(async (req: any, res: Response) => {
  const portfolioId = Number(req.params.portfolioId);
  const userId = req.userInfo?.id;
  const name = req.body.name;

  if (!portfolioId || isNaN(portfolioId)) {
    throw new AppError("Invalid portfolio ID", 400);
  }

  if (!name) {
    throw new AppError("Portfolio name is required", 400);
  }

  const updated = await updateUserPortfolio(userId, portfolioId, name);

  res.status(200).json({
    status: "success",
    data: updated,
  });
});
