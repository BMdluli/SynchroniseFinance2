import { Router } from "express";
import {
  checkAuth,
  createUserHandler,
  loginUser,
  logoutUserHandler,
} from "../controllers/userController";

const router = Router();

router.post("/users/register", createUserHandler);
router.post("/users/login", loginUser);
router.post("/users/logout", logoutUserHandler);
router.get("/users/check-auth", checkAuth);

export default router;
