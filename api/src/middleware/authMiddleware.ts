import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { ApiError } from './errorHandler';
import { asyncHandler } from './errorHandler';
import { UserModel } from '../models/UserModel';

// Extend Express Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

// Middleware to protect routes that require authentication
export const protect = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  let token;

  // Check if token exists in headers
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  // Check if token exists
  if (!token) {
    return next(new ApiError(401, 'Not authorized, no token provided'));
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string };

    // Find user by id
    const user = await UserModel.findOne({ where: { id: decoded.id } });

    if (!user) {
      return next(new ApiError(401, 'Not authorized, user not found'));
    }

    // Add user to request object
    req.user = user;
    next();
  } catch (error) {
    return next(new ApiError(401, 'Not authorized, token failed'));
  }
});

// Middleware to check if user is an admin
export const admin = (req: Request, res: Response, next: NextFunction) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    return next(new ApiError(403, 'Not authorized as an admin'));
  }
};

// Middleware to check if user is a streamer
export const streamer = (req: Request, res: Response, next: NextFunction) => {
  if (req.user && req.user.isStreamer) {
    next();
  } else {
    return next(new ApiError(403, 'Not authorized as a streamer'));
  }
};

// Middleware to check if user owns the resource or is an admin
export const ownerOrAdmin = (resourceField: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const resourceId = req.params[resourceField];
    
    if (
      (req.user && req.user.id === resourceId) || 
      (req.user && req.user.isAdmin)
    ) {
      next();
    } else {
      return next(new ApiError(403, 'Not authorized to access this resource'));
    }
  };
};
