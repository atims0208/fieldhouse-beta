import { Router } from 'express';
import adminController from '../controllers/adminController';
import { authenticate, requireAdmin } from '../middleware/auth';

const router = Router();

// All admin routes require authentication and admin privileges
router.use(authenticate);
router.use(requireAdmin);

// Route to get all users (paginated)
router.get('/users', adminController.getUsers.bind(adminController));

// Route for banning/unbanning users
router.post('/users/:userId/ban', adminController.banUser.bind(adminController));
router.post('/users/:userId/unban', adminController.unbanUser.bind(adminController));

// Route to get all streams (paginated)
router.get('/streams', adminController.getStreams.bind(adminController));

// Route to stop a live stream
router.post('/streams/:streamId/stop', adminController.stopStream.bind(adminController));

// Route to update stream status
router.patch('/streams/:streamId/status', adminController.updateStreamStatus.bind(adminController));

// Route to delete stream
router.delete('/streams/:streamId', adminController.deleteStream.bind(adminController));

// Route to update user admin status
router.patch('/users/admin-status', adminController.updateUserAdminStatus.bind(adminController));

// TODO: Add routes for managing streams, etc.

export default router; 