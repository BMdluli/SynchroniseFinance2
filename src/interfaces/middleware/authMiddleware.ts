import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface JwtPayload {
  userId: number;
}

export const authMiddleware = (
  req: Request & { userInfo?: JwtPayload },
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies?.access_token;

  if (!token) {
    return res.status(401).json({
      status: "fail",
      message: "Please login and try again",
    });
  }

  try {
    const verifiedToken = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as JwtPayload;
    req.userInfo = verifiedToken;
    next();
  } catch (err) {
    console.error("JWT verification failed:", err);
    return res
      .status(401)
      .json({ status: "fail", message: "Invalid or expired token" });
  }
};
