import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models';

// Extend Express Request interface to include user property
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        username: string;
        email: string;
        isStreamer: boolean;
        isAdmin: boolean;
      };
    }
  }
}

// JWT token interface
interface JwtPayload {
  id: string;
  username: string;
  email: string;
  isStreamer: boolean;
  isAdmin: boolean;
}

// Authentication middleware
export const authenticate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ message: 'No token provided, authorization denied' });
      return;
    }
    
    const token = authHeader.split(' ')[1];
    
    // Verify token
    const secret = process.env.JWT_SECRET || 'fieldhouse_secret_key_change_in_production';
    const decoded = jwt.verify(token, secret) as JwtPayload;
    
    // Add user to request
    req.user = {
      id: decoded.id,
      username: decoded.username,
      email: decoded.email,
      isStreamer: decoded.isStreamer,
      isAdmin: decoded.isAdmin
    };
    
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is invalid or expired' });
  }
};

// Optional authentication middleware (won't reject if no token)
export const optionalAuth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      // Continue without authentication if no token
      next();
      return;
    }
    
    const token = authHeader.split(' ')[1];
    
    // Verify token
    const secret = process.env.JWT_SECRET || 'fieldhouse_secret_key_change_in_production';
    const decoded = jwt.verify(token, secret) as JwtPayload;
    
    // Add user to request
    req.user = {
      id: decoded.id,
      username: decoded.username,
      email: decoded.email,
      isStreamer: decoded.isStreamer,
      isAdmin: decoded.isAdmin
    };
    
    next();
  } catch (error) {
    // Continue without authentication if token is invalid
    next();
  }
};

// Streamer required middleware
export const requireStreamer = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ message: 'Authentication required' });
    return;
  }
  
  if (!req.user.isStreamer) {
    res.status(403).json({ message: 'Streamer privileges required' });
    return;
  }
  
  next();
};

// Admin required middleware
export const requireAdmin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  // First, ensure the user is authenticated
  if (!req.user) {
    res.status(401).json({ message: 'Authentication required' });
    return;
  }
  
  // Then, check if the authenticated user is an admin
  if (!req.user.isAdmin) {
    res.status(403).json({ message: 'Admin privileges required' });
    return;
  }
  
  // If authenticated and admin, proceed
  next();
}; 