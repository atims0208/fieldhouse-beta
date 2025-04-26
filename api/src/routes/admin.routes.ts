import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import adminController from '../controllers/admin.controller';
import { AppDataSource } from '../config/database';
import { User } from '../models/User';

const router = Router();

// Admin middleware
const isAdmin = async (req: any, res: any, next: any) => {
  try {
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({ where: { id: req.user.id } });
    
    if (!user || !user.isAdmin) {
      return res.status(403).json({ error: 'Access denied' });
    }
    next();
  } catch (error) {
    res.status(500).json({ error: 'Error checking admin status' });
  }
};

// Apply authentication and admin middleware to all routes
router.use(authenticate, isAdmin);

// User management
router.get('/users', adminController.getUsers);
router.post('/users/:userId/ban', adminController.banUser);
router.post('/users/:userId/unban', adminController.unbanUser);
router.post('/users/make-admin', adminController.updateUserAdminStatus);

// Stream management
router.get('/streams', adminController.getStreams);
router.delete('/streams/:streamId', adminController.deleteStream);

export default router; 