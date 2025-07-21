import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import { addContributionHandler } from "../controllers/contributionController";

const router = Router();

router.post("/contributions", authMiddleware, addContributionHandler);

export default router;
