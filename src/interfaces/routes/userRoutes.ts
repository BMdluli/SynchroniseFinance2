import { Router } from "express";
import {
  checkAuth,
  createUserHandler,
  getUsersHandler,
  loginUser,
} from "../controllers/userController";

const router = Router();

router.get("/users", getUsersHandler);
router.post("/users/register", createUserHandler);
router.post("/users/login", loginUser);
router.get("/users/check-auth", checkAuth);

export default router;
