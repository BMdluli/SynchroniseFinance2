import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import {
  createStockHandler,
  getStocksHandler,
} from "../controllers/stockController";

const router = Router();

router.get("/stocks", authMiddleware, getStocksHandler);
router.post("/stocks", authMiddleware, createStockHandler);

export default router;
