import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import {
  addBudgetHandler,
  copyBudgetHandler,
  deleteBudgetHandler,
  getBudgetHandler,
  getBudgetsHandler,
  updateBudgetHandler,
} from "../controllers/budgetController";

const router = Router();

router.get("/budgets", authMiddleware, getBudgetsHandler);
router.post("/budgets", authMiddleware, addBudgetHandler);
router.get("/budgets/:budgetId", authMiddleware, getBudgetHandler);
router.delete("/budgets/:budgetId", authMiddleware, deleteBudgetHandler);
router.patch("/budgets/:budgetId", authMiddleware, updateBudgetHandler);
router.post("/budgets/:budgetId/copy", authMiddleware, copyBudgetHandler);

export default router;
