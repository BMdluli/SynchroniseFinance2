import { Router } from "express";
import {
  createCategoryHandler,
  getCategoriesHandler,
  getCategoryHandler,
  updateCategoryHandler,
  deleteCategoryHandler,
} from "../controllers/budgetCategoryController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

router.post("/categories", authMiddleware, createCategoryHandler);
router.get(
  "/budgets/:budgetId/categories",
  authMiddleware,
  getCategoriesHandler
);
router.get("/categories/:categoryId", authMiddleware, getCategoryHandler);
router.patch("/categories/:categoryId", authMiddleware, updateCategoryHandler);
router.delete("/categories/:categoryId", authMiddleware, deleteCategoryHandler);

export default router;
