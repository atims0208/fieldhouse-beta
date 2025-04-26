import { Router } from 'express';
import authRoutes from './authRoutes';
import adminRoutes from './adminRoutes';
import streamRoutes from './streamRoutes';
import userRoutes from './userRoutes';
import productRoutes from './productRoutes';
import printfulRoutes from './printful.routes';

const router = Router();

// Health check
router.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

// Mount routes
router.use('/auth', authRoutes);
router.use('/admin', adminRoutes);
router.use('/streams', streamRoutes);
router.use('/users', userRoutes);
router.use('/products', productRoutes);
router.use('/printful', printfulRoutes);

export default router; 