import { Response } from "express";
import {
  addPortfolio,
  deleteUserPortfolio,
  getUserPortfolio,
  getUserPortfolios,
  updateUserPortfolio,
} from "../../usecases/portfolioUseCases";
import { CreatePortfolioSchema } from "../../validators/CreatePortfolioSchema";

export const addPortfolioHandler = async (req: any, res: Response) => {
  try {
    const parsed = CreatePortfolioSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        status: "fail",
        message: "Invalid Input",
        error: parsed.error.flatten(),
      });
    }

    const { name } = req.body;

    const portfolio = await addPortfolio({
      name,
      userId: req.userInfo.id,
    });

    if (!portfolio) {
      return res.status(400).json({
        status: "fail",
        message: "Something went wrong while trying to create your portfolio",
      });
    }

    res.status(201).json({
      status: "success",
      data: portfolio,
    });
  } catch (e: any) {
    console.log("Create Portfolio Error _> ", e);
    return res.status(400).json({
      status: "fail",
      message: e.message || "Something went wrong",
    });
  }
};

export const getPortfolios = async (req: any, res: Response) => {
  try {
    const portfolios = await getUserPortfolios(req.userInfo.id);

    res.status(200).json({
      status: "success",
      data: portfolios,
    });
  } catch (e: any) {
    console.log("Get Portfolios Error _>", e);
    return res.status(400).json({
      status: "fail",
      message: e.message || "Something went wrong",
    });
  }
};

export const getPortfolio = async (req: any, res: Response) => {
  try {
    const userId = req.userInfo.id;
    const { portfolioId } = req.params;

    console.log(portfolioId);

    if (!portfolioId) {
      return res.status(400).json({
        status: "fail",
        message: "Invalid portfolio id format ",
      });
    }

    const convertedPortfolioId = Number(portfolioId);
    if (!convertedPortfolioId) {
      return res.status(400).json({
        status: "fail",
        message: `Please provide a correct portfolio id`,
      });
    }

    const portfolio = await getUserPortfolio(userId, convertedPortfolioId);

    if (!portfolio) {
      return res.status(404).json({
        status: "fail",
        message: `Portfolio with id ${portfolioId} was not found`,
      });
    }

    res.status(200).json({
      status: "success",
      data: portfolio,
    });
  } catch (e: any) {
    console.log("Get Portfolio Error _>", e);
    return res.status(400).json({
      status: "fail",
      message: e.message || "Something went wrong",
    });
  }
};

export const deletePortfolio = async (req: any, res: Response) => {
  try {
    const { portfolioId } = req.params;

    const convertedPortfolioId = Number(portfolioId);
    if (!convertedPortfolioId) {
      return res.status(400).json({
        status: "fail",
        message: `Please provide a correct portfolio id`,
      });
    }

    const portfolio = await deleteUserPortfolio(
      req.userInfo.id,
      convertedPortfolioId
    );

    if (!portfolio) {
      return res.status(404).json({
        status: "fail",
        message: `Portfollio with the id ${convertedPortfolioId} does not exist`,
      });
    }

    res.status(204).json();
  } catch (e: any) {
    console.log("Delete Portfolio Error _>", e);
    return res.status(400).json({
      status: "fail",
      message: e.message || "Something went wrong",
    });
  }
};

export const updatePortfolio = async (req: any, res: Response) => {
  try {
    const portfolioId = Number(req.params.portfolioId);
    const userId = req.userInfo?.userId;
    const name = req.body.name;

    if (!portfolioId || isNaN(portfolioId)) {
      return res.status(400).json({
        status: "fail",
        message: "Invalid portfolio ID",
      });
    }

    if (!name) {
      return res.status(400).json({
        status: "fail",
        message: "Invalid name",
      });
    }

    const updated = await updateUserPortfolio(userId, portfolioId, name);

    if (!updated) {
      return res.status(404).json({
        status: "fail",
        message: "Portfolio not found or not authorized",
      });
    }

    return res.status(200).json({
      status: "success",
      data: updated,
    });
  } catch (e: any) {
    console.log("Update Portfolio Error _>", e);
    return res.status(400).json({
      status: "fail",
      message: e.message || "Something went wrong",
    });
  }
};
