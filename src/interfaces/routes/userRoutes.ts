import { Router } from "express";
import {
  createUserHandler,
  getUsersHandler,
  loginUser,
} from "../controllers/userController";

const router = Router();

router.get("/users", getUsersHandler);
router.post("/users/register", createUserHandler);
router.post("/users/login", loginUser);

export default router;
