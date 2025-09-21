import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError";

export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Known Error, return clean message
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: "fail",
      message: err.message,
    });
  }

  // Otherwise, log and return generic message
  console.error("Unexpected Error:", err);

  return res.status(500).json({
    status: "error",
    message: "Something went wrong!",
  });
};
