import { Router } from "express";
import {
  createSavingHandler,
  deleteSavingHandler,
  getSavingHandler,
  getSavingsHandler,
  updateSavingHandler,
} from "../controllers/savingController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

router.get("/savings", authMiddleware, getSavingsHandler);
router.get("/savings/:savingsId", authMiddleware, getSavingHandler);
router.post("/savings", authMiddleware, createSavingHandler);
router.delete("/savings/:savingsId", authMiddleware, deleteSavingHandler);
router.patch("/savings/:savingsId", authMiddleware, updateSavingHandler);

export default router;
