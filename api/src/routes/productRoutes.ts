import express from 'express';
import productController from '../controllers/productController';
import { authenticate, optionalAuth } from '../middleware/auth';

const router = express.Router();

// Public routes - accessible to everyone
router.get('/', productController.getAllProducts);
router.get('/:productId', productController.getProductById);
router.get('/user/:username', productController.getProductsByUser);

// Protected routes - require authentication
router.post('/', authenticate, productController.createProduct);
router.put('/:productId', authenticate, productController.updateProduct);
router.delete('/:productId', authenticate, productController.deleteProduct);
router.get('/dashboard/my-products', authenticate, productController.getMyProducts);

export default router; 