import { Router } from 'express';
import authRoutes from './authRoutes';
import userRoutes from './userRoutes';
import streamRoutes from './streamRoutes';
import productRoutes from './productRoutes';
import adminRoutes from './adminRoutes';

const router = Router();

// API health check
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'API is running' });
});

// Auth routes
router.use('/auth', authRoutes);

// User routes
router.use('/users', userRoutes);

// Stream routes
router.use('/streams', streamRoutes);

// Product routes
router.use('/products', productRoutes);

// Admin routes
router.use('/admin', adminRoutes);

export default router; 