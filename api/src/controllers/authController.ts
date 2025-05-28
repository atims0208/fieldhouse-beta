import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { UserModel, findByEmail, findByUsername } from '../models/UserModel';
import { asyncHandler } from '../middleware/errorHandler';
import { ApiError } from '../middleware/errorHandler';
import { logger } from '../config/logger';

// Generate JWT token
const generateToken = (id: string): string => {
  return jwt.sign({ id }, process.env.JWT_SECRET as string, {
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
  });
};

// Generate refresh token
const generateRefreshToken = (id: string): string => {
  return jwt.sign({ id }, process.env.JWT_REFRESH_SECRET as string, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  });
};

// Register a new user
export const register = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { username, email, password, displayName } = req.body;

  // Check if user already exists
  const existingEmail = await findByEmail(email);
  if (existingEmail) {
    throw new ApiError(400, 'Email already in use');
  }

  const existingUsername = await findByUsername(username);
  if (existingUsername) {
    throw new ApiError(400, 'Username already in use');
  }

  // Create new user
  const user = new UserModel();
  user.username = username;
  user.email = email;
  user.password = password;
  user.displayName = displayName || username;
  
  await user.save();

  // Generate tokens
  const token = generateToken(user.id);
  const refreshToken = generateRefreshToken(user.id);

  // Set refresh token in HTTP-only cookie
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  res.status(201).json({
    id: user.id,
    username: user.username,
    email: user.email,
    displayName: user.displayName,
    isStreamer: user.isStreamer,
    isAdmin: user.isAdmin,
    token,
  });
});

// Login user
export const login = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  // Find user by email
  const user = await findByEmail(email);
  if (!user) {
    throw new ApiError(401, 'Invalid email or password');
  }

  // Check if password is correct
  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    throw new ApiError(401, 'Invalid email or password');
  }

  // Generate tokens
  const token = generateToken(user.id);
  const refreshToken = generateRefreshToken(user.id);

  // Set refresh token in HTTP-only cookie
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  logger.info(`User logged in: ${user.id}`);

  res.status(200).json({
    id: user.id,
    username: user.username,
    email: user.email,
    displayName: user.displayName,
    isStreamer: user.isStreamer,
    isAdmin: user.isAdmin,
    token,
  });
});

// Refresh token
export const refreshToken = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    throw new ApiError(401, 'Refresh token not found');
  }

  try {
    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET as string) as { id: string };
    
    // Find user
    const user = await UserModel.findOne({ where: { id: decoded.id } });
    if (!user) {
      throw new ApiError(401, 'User not found');
    }

    // Generate new tokens
    const token = generateToken(user.id);
    const newRefreshToken = generateRefreshToken(user.id);

    // Set new refresh token in HTTP-only cookie
    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(200).json({ token });
  } catch (error) {
    throw new ApiError(401, 'Invalid refresh token');
  }
});

// Logout user
export const logout = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  // Clear refresh token cookie
  res.cookie('refreshToken', '', {
    httpOnly: true,
    expires: new Date(0),
  });

  res.status(200).json({ message: 'Logged out successfully' });
});

// Get current user profile
export const getCurrentUser = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const user = await UserModel.findOne({ 
    where: { id: req.user.id },
    select: ['id', 'username', 'email', 'displayName', 'bio', 'avatarUrl', 'isStreamer', 'isAdmin', 'coins', 'followers', 'following', 'createdAt']
  });

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  res.status(200).json(user);
});
