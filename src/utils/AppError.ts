export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;
  errors?: any; // optional extra details (e.g., validation errors)

  constructor(message: string, statusCode = 500, errors?: any) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    if (errors) this.errors = errors;

    Error.captureStackTrace(this, this.constructor);
  }
}
