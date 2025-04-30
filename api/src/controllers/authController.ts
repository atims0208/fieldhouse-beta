import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { AppDataSource } from '../config/database';
import { User } from '../models/User';
import { ILike } from 'typeorm';
import bcrypt from 'bcryptjs';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Generate JWT token
const generateToken = (user: User): string => {
  return jwt.sign(
    { 
      id: user.id,
      username: user.username,
      email: user.email,
      isStreamer: user.isStreamer,
      isAdmin: user.isAdmin
    },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
};

export class AuthController {
  // Register a new user
  async register(req: Request, res: Response): Promise<void> {
    try {
      console.log('Registration attempt:', { ...req.body, password: '[REDACTED]' });
      
      const { username, email, password, dateOfBirth, idDocumentUrl, isStreamer = false } = req.body;

      if (!username || !email || !password) {
        console.error('Missing required fields:', { username: !!username, email: !!email, password: !!password });
        res.status(400).json({ error: 'Missing required fields' });
        return;
      }

      // Check if user already exists
      console.log('Checking for existing user...');
      const userRepository = AppDataSource.getRepository(User);
      const existingUser = await userRepository.findOne({
        where: [
          { email: ILike(email) },
          { username: ILike(username) }
        ]
      });

      if (existingUser) {
        console.log('User already exists:', { email, username });
        res.status(400).json({ error: 'User already exists' });
        return;
      }

      // Hash password
      console.log('Hashing password...');
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Create new user
      console.log('Creating new user...');
      const user = userRepository.create({
        username,
        email,
        password: hashedPassword,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
        idDocumentUrl,
        isStreamer,
        isAdmin: false,
        coins: 0,
        tickets: 0
      });

      console.log('Saving user to database...');
      await userRepository.save(user);
      console.log('User saved successfully:', { id: user.id, username: user.username });

      // Generate token
      const token = generateToken(user);

      res.status(201).json({
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          isStreamer: user.isStreamer,
          isAdmin: user.isAdmin,
          dateOfBirth: user.dateOfBirth,
          coins: user.coins,
          tickets: user.tickets
        }
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ error: 'Failed to register user' });
    }
  }

  // Login user
  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;

      // Find user with password included
      const userRepository = AppDataSource.getRepository(User);
      const user = await userRepository
        .createQueryBuilder('user')
        .addSelect('user.password')
        .where('LOWER(user.email) = LOWER(:email)', { email })
        .getOne();

      if (!user) {
        res.status(401).json({ error: 'Invalid credentials' });
        return;
      }

      // Check password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        res.status(401).json({ error: 'Invalid credentials' });
        return;
      }

      // Check if user is banned
      if (user.isBanned) {
        if (user.bannedUntil && user.bannedUntil > new Date()) {
          res.status(403).json({ 
            error: 'Account is temporarily banned',
            bannedUntil: user.bannedUntil
          });
        } else {
          res.status(403).json({ error: 'Account is permanently banned' });
        }
        return;
      }

      // Generate token
      const token = generateToken(user);

      res.json({
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          isStreamer: user.isStreamer,
          isAdmin: user.isAdmin,
          dateOfBirth: user.dateOfBirth,
          coins: user.coins,
          tickets: user.tickets
        }
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ error: 'Failed to login' });
    }
  }

  // Get current user
  async getCurrentUser(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user?.id) {
        res.status(401).json({ error: 'Not authenticated' });
        return;
      }

      const userRepository = AppDataSource.getRepository(User);
      const user = await userRepository.findOne({ where: { id: req.user.id } });

      if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
      }

      res.json({
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          isStreamer: user.isStreamer,
          isAdmin: user.isAdmin
        }
      });
    } catch (error) {
      console.error('Error getting current user:', error);
      res.status(500).json({ error: 'Failed to get current user' });
    }
  }

  // Update user profile
  async updateProfile(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user?.id) {
        res.status(401).json({ error: 'Not authenticated' });
        return;
      }

      const { username, email, currentPassword, newPassword } = req.body;
      const userRepository = AppDataSource.getRepository(User);
      const user = await userRepository.findOne({ where: { id: req.user.id } });

      if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
      }

      // Check if email is already taken
      if (email && email !== user.email) {
        const existingUser = await userRepository.findOne({ where: { email: ILike(email) } });
        if (existingUser) {
          res.status(400).json({ error: 'Email already in use' });
          return;
        }
      }

      // Check if username is already taken
      if (username && username !== user.username) {
        const existingUser = await userRepository.findOne({ where: { username: ILike(username) } });
        if (existingUser) {
          res.status(400).json({ error: 'Username already in use' });
          return;
        }
      }

      // Update password if provided
      if (currentPassword && newPassword) {
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
          res.status(401).json({ error: 'Current password is incorrect' });
          return;
        }
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
      }

      // Update other fields
      if (username) user.username = username;
      if (email) user.email = email;

      await userRepository.save(user);

      res.json({
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          isStreamer: user.isStreamer,
          isAdmin: user.isAdmin
        }
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      res.status(500).json({ error: 'Failed to update profile' });
    }
  }
}

export default new AuthController(); 