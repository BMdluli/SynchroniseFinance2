import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import {
  createStockHandler,
  deleteStockHandler,
  getStockHandler,
  getStocksHandler,
  searchStockHandler,
  updateStockHandler,
} from "../controllers/stockController";

const router = Router();

router.get("/stocks", authMiddleware, getStocksHandler);
router.post("/stocks", authMiddleware, createStockHandler);
router.get("/stocks/search", authMiddleware, searchStockHandler);
router.get("/stocks/:stockId", authMiddleware, getStockHandler);
router.patch("/stocks/:stockId", authMiddleware, updateStockHandler);
router.delete("/stocks/:stockId", authMiddleware, deleteStockHandler);

export default router;
