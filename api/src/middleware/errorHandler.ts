import { Request, Response, NextFunction } from 'express';
import { logger } from '../config/logger';

// Custom error class for API errors
export class ApiError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(statusCode: number, message: string, isOperational = true, stack = '') {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

// Error handler middleware
export const errorHandler = (
  err: Error | ApiError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Default error values
  let statusCode = 500;
  let message = 'Internal Server Error';
  let isOperational = false;

  // If it's our ApiError, use its values
  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
    isOperational = err.isOperational;
  } else if (err.name === 'ValidationError') {
    // Handle validation errors (e.g., from Zod or class-validator)
    statusCode = 400;
    message = err.message;
    isOperational = true;
  } else if (err.name === 'UnauthorizedError') {
    // Handle JWT authentication errors
    statusCode = 401;
    message = 'Unauthorized';
    isOperational = true;
  }

  // Log the error
  if (isOperational) {
    logger.warn(`Operational error: ${message}`);
  } else {
    logger.error(`Unhandled error: ${err.message}`, { error: err });
  }

  // Send response
  res.status(statusCode).json({
    status: 'error',
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

// Catch 404 errors
export const notFoundHandler = (req: Request, res: Response, next: NextFunction) => {
  const err = new ApiError(404, `Resource not found - ${req.originalUrl}`);
  next(err);
};

// Async error handler wrapper
export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
