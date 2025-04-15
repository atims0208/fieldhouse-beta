import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models';
import { Op } from 'sequelize';

// Generate JWT token
const generateToken = (user: any): string => {
  const jwtSecret = process.env.JWT_SECRET || 'fieldhouse_secret_key_change_in_production';
  
  return jwt.sign(
    {
      id: user.id,
      username: user.username,
      email: user.email,
      isStreamer: user.isStreamer,
      isAdmin: user.isAdmin
    },
    jwtSecret,
    { expiresIn: '7d' }
  );
};

export default {
  // Register a new user
  register: async (req: Request, res: Response): Promise<void> => {
    try {
      const { username, email, password, isStreamer = false, dateOfBirth, idDocumentUrl } = req.body;
      
      // Basic validation for dateOfBirth if provided
      if (dateOfBirth && isNaN(Date.parse(dateOfBirth))) {
        res.status(400).json({ message: 'Invalid Date of Birth format' });
        return;
      }

      // Basic validation for idDocumentUrl if provided
      if (idDocumentUrl && typeof idDocumentUrl !== 'string') {
          res.status(400).json({ message: 'Invalid ID Document URL format' });
          return;
      }

      // Check if user already exists
      const existingUser = await User.findOne({
        where: {
          [Op.or]: [
            { username },
            { email }
          ]
        }
      });
      
      if (existingUser) {
        res.status(400).json({ message: 'Username or email already in use' });
        return;
      }
      
      // Create new user
      const user = await User.create({
        username,
        email,
        password,
        isStreamer,
        dateOfBirth: dateOfBirth || null,
        idDocumentUrl: idDocumentUrl || null
      });
      
      // Generate JWT token
      const token = generateToken(user);
      
      // Return user data and token
      res.status(201).json({
        id: user.id,
        username: user.username,
        email: user.email,
        isStreamer: user.isStreamer,
        isAdmin: user.isAdmin,
        dateOfBirth: user.dateOfBirth,
        idDocumentUrl: user.idDocumentUrl,
        token
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ message: 'Server error during registration' });
    }
  },
  
  // Log in user
  login: async (req: Request, res: Response): Promise<void> => {
    console.log('>>> DEBUG: Entered login controller for email:', req.body?.email);
    try {
      const { email, password } = req.body;
      
      // Find user by email
      const user = await User.findOne({ where: { email } });
      
      if (!user) {
        res.status(401).json({ message: 'Invalid credentials' });
        return;
      }
      
      // Validate password
      const isPasswordValid = await user.validPassword(password);
      
      if (!isPasswordValid) {
        res.status(401).json({ message: 'Invalid credentials' });
        return;
      }
      
      // Generate JWT token
      const token = generateToken(user);
      
      // Return user data and token
      res.status(200).json({
        id: user.id,
        username: user.username,
        email: user.email,
        isStreamer: user.isStreamer,
        isAdmin: user.isAdmin,
        token
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'Server error during login' });
    }
  },
  
  // Get current user
  getCurrentUser: async (req: Request, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({ message: 'Not authenticated' });
        return;
      }
      
      const user = await User.findByPk(req.user.id, {
        attributes: ['id', 'username', 'email', 'isStreamer', 'avatarUrl', 'bio', 'isAdmin', 'createdAt']
      });
      
      if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
      }
      
      res.status(200).json(user);
    } catch (error) {
      console.error('Get current user error:', error);
      res.status(500).json({ message: 'Server error fetching user data' });
    }
  }
}; 