import express from 'express';
import { register, login, refreshToken, logout, getCurrentUser } from '../controllers/authController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/refresh-token', refreshToken);
router.post('/logout', logout);

// Protected routes
router.get('/me', protect, getCurrentUser);

export { router as authRoutes };
