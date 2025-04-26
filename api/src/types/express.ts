import { Request } from 'express';
import { User } from '../models/user.model';

export interface AuthenticatedUser {
  id: string;
  username: string;
  email: string;
  isStreamer: boolean;
  isAdmin: boolean;
}

export interface AuthenticatedRequest extends Request {
  user?: User;
} 