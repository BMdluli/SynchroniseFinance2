import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import { createStockHandler } from "../controllers/stockController";

const router = Router();

router.post("/stocks", authMiddleware, createStockHandler);

export default router;
