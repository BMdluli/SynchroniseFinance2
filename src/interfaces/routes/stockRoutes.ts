import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import {
  createStockHandler,
  deleteStockHandler,
  getStocksHandler,
} from "../controllers/stockController";

const router = Router();

router.get("/stocks", authMiddleware, getStocksHandler);
router.post("/stocks", authMiddleware, createStockHandler);
router.post("/stocks", authMiddleware, createStockHandler);
router.delete("/stocks/:stockId", authMiddleware, deleteStockHandler);

export default router;
