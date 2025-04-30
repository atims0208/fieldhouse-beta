import express from 'express';
import { AuthController } from '../controllers/authController';
import { authenticate } from '../middleware/auth';
import { AppDataSource } from '../config/database';

const router = express.Router();
const authController = new AuthController();

// Test database connection
router.get('/test-db', async (_req, res) => {
  try {
    const result = await AppDataSource.query('SELECT NOW()');
    res.json({ success: true, timestamp: result[0].now });
  } catch (error) {
    console.error('Database test failed:', error);
    res.status(500).json({ error: 'Database connection failed', details: error instanceof Error ? error.message : 'Unknown error' });
  }
});

// Register new user
router.post('/register', authController.register.bind(authController));

// Login user
router.post('/login', authController.login.bind(authController));

// Get current user
router.get('/me', authenticate, authController.getCurrentUser.bind(authController));

export default router; 