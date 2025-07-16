import { Request, Response } from "express";
import jwt from "jsonwebtoken";

import {
  createUser,
  getAllUsers,
  signInUser,
} from "../../usecases/userUseCases";

const generateToken = (userId: number, email: string) => {
  // 🔐 Create JWT
  const jwtExpiresIn = "15m";

  return jwt.sign(
    { id: userId, email: email },
    process.env.JWT_SECRET as string,
    { expiresIn: jwtExpiresIn }
  );
};

export const createUserHandler = async (req: Request, res: Response) => {
  try {
    const { email, password, username } = req.body;

    if (!email || !password || !username) {
      return res.status(400).json({
        status: "fail",
        message: "All fields are required.",
      });
    }

    const newUser = await createUser({ username, email, password });

    res.cookie("access_token", generateToken(newUser.id, newUser.email), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60 * 1000,
    });

    res.status(201).json({
      status: "success",
      message: "User created successfully",
      user: newUser,
    });
  } catch (err: any) {
    if (err.message === "Email is already in use") {
      return res.status(409).json({
        status: "fail",
        message: "Email is already registered",
      });
    }

    console.error(err);
    res.status(500).json({ error: "Failed to create user" });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(401).json({
        status: "fail",
        message: "Please ensure that your details are correct and try again",
      });
      return;
    }

    const userFromDb = await signInUser(email, password);

    if (!userFromDb) {
      res.status(401).json({
        status: "fail",
        message: "Please ensure that your details are correct and try again",
      });
      return;
    }

    // 🍪 Set token in cookie
    res.cookie("access_token", generateToken(userFromDb.id, userFromDb.email), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // true on HTTPS
      sameSite: "strict",
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    res.status(200).json({
      status: "success",
      message: "logged in successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create user" });
  }
};

export const getUsersHandler = async (_: Request, res: Response) => {
  const users = await getAllUsers();
  res.json(users);
};
