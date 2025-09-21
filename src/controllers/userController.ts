import { CookieOptions, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { createUser, signInUser } from "../usecases/userUseCases";

const generateToken = (userId: number, email: string, username: string) => {
  const jwtExpiresIn = "60m"; // 1 hour
  return jwt.sign(
    { id: userId, email, username },
    process.env.JWT_SECRET as string,
    { expiresIn: jwtExpiresIn }
  );
};

const getCookieOptions = (): CookieOptions => {
  const isProduction = process.env.NODE_ENV === "production";
  const cookieOptions: CookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 3600000, // 1 hour
    // domain: ".synchronisefinance.com",
    // ...(isProduction && { domain: ".synchronisefinance.com" }),
  };

  // Only set the domain explicitly in production
  if (isProduction) {
    cookieOptions.domain = ".synchronisefinance.com";
  }

  return cookieOptions;
};

export const checkAuth = async (req: Request, res: Response) => {
  try {
    const token = req.cookies.access_token;

    if (!token) {
      return res
        .status(401)
        .json({ authenticated: false, message: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      id: number;
      email: string;
      username: string;
    };

    res.status(200).json({
      authenticated: true,
      user: {
        id: decoded.id,
        email: decoded.email,
        username: decoded.username,
      },
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
      getCookieOptions()
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
      return res.status(401).json({
        status: "fail",
        message: "Please ensure that your details are correct and try again",
      });
    }

    const userFromDb = await signInUser(email, password);

    if (!userFromDb) {
      return res.status(401).json({
        status: "fail",
        message: "Please ensure that your details are correct and try again",
      });
    }

    res
      .cookie(
        "access_token",
        generateToken(userFromDb.id, userFromDb.email, userFromDb.username),
        getCookieOptions()
      )
      .status(200)
      .json({
        status: "success",
        message: "Logged in successfully",
      });
  } catch (err: any) {
    console.error(err);
    res.status(400).json({ error: "Failed to login user" });
  }
};

export const logoutUserHandler = async (req: Request, res: Response) => {
  try {
    // clear cookie
    res.clearCookie("access_token", getCookieOptions());
    return res
      .status(200)
      .json({ status: "success", message: "Logged out successfully" });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ status: "error", message: "Failed to log out" });
  }
};
