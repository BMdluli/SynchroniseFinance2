export class CustomError extends Error {
  statusCode: number;
  constructor(message: string, statusCode = 400) {
    super(message);
    this.statusCode = statusCode;
  }
}

export class ConflictError extends CustomError {
  constructor(message = "Conflict") {
    super(message, 409);
  }
}

export class UnauthorizedError extends CustomError {
  constructor(message = "Unauthorized") {
    super(message, 401);
  }
}

export class NotFoundError extends CustomError {
  constructor(message = "Resource not found") {
    super(message, 404);
  }
}

export class ValidationError extends CustomError {
  constructor(message = "Validation failed") {
    super(message, 400);
  }
}
