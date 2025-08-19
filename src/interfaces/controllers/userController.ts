import { Request, Response } from "express";
import jwt from "jsonwebtoken";

import { createUser, signInUser } from "../../usecases/userUseCases";

const generateToken = (userId: number, email: string, username: string) => {
  const jwtExpiresIn = "60m";

  return jwt.sign(
    { id: userId, email: email, username: username },
    process.env.JWT_SECRET as string,
    { expiresIn: jwtExpiresIn }
  );
};

export const checkAuth = async (req: Request, res: Response) => {
  try {
    console.log(req.cookies.access_token);
    const token = req.cookies.access_token;

    if (!token) {
      return res
        .status(401)
        .json({ authenticated: false, message: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      id: number;
      email: string;
    };

    res.status(200).json({
      authenticated: true,
      user: { id: decoded.id, email: decoded.email },
    });
  } catch (err) {
    return res
      .status(401)
      .json({ authenticated: false, message: "Invalid or expired token" });
  }
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

    const newUser = await createUser({ email, password, username });

    res.cookie(
      "access_token",
      generateToken(newUser.id, newUser.email, newUser.username),
      {
        httpOnly: true,
        // secure: process.env.NODE_ENV === "production",
        secure: true,
        sameSite: "none",
        maxAge: 60 * 60 * 1000,
      }
    );

    res.status(201).json({
      status: "success",
      message: "User created successfully",
      user: newUser,
    });
  } catch (err: any) {
    console.error(err);
    res.status(400).json({ error: "Failed to create user" });
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

    // Set token in cookie
    res.cookie(
      "access_token",
      generateToken(userFromDb.id, userFromDb.email, userFromDb.username),
      {
        httpOnly: true,
        secure: true,
        // secure: process.env.NODE_ENV === "production", // true on HTTPS
        sameSite: "none",
        maxAge: 60 * 60 * 1000, // 15 minutes
      }
    );

    res.status(200).json({
      status: "success",
      message: "logged in successfully",
    });
  } catch (err: any) {
    console.error(err);
    res.status(400).json({ error: "Failed to login user" });
  }
};
