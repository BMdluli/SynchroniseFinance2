import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import {
  addPortfolioHandler,
  deletePortfolio,
  getAIStockAnalysisHandler,
  getPortfolio,
  getPortfolios,
  updatePortfolio,
} from "../controllers/portfolioController";

const router = Router();

router.post("/portfolios", authMiddleware, addPortfolioHandler);
router.get("/portfolios", authMiddleware, getPortfolios);
router.post(
  "/portfolios/ai-analysis",
  authMiddleware,
  getAIStockAnalysisHandler
);
router.get("/portfolios/:portfolioId", authMiddleware, getPortfolio);
router.delete("/portfolios/:portfolioId", authMiddleware, deletePortfolio);
router.patch("/portfolios/:portfolioId", authMiddleware, updatePortfolio);

export default router;
