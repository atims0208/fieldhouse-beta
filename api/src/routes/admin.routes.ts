import { Router } from 'express';
import { AdminController } from '../controllers/admin.controller';
import { authenticate, requireAdmin } from '../middleware/auth';
import { User } from '../models/User';

const router = Router();

// Middleware to check if user is admin
const isAdmin = async (req: any, res: any, next: any) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user?.isAdmin) {
      return res.status(403).json({ error: 'Access denied. Admin privileges required.' });
    }
    next();
  } catch (error) {
    res.status(500).json({ error: 'Failed to verify admin status' });
  }
};

// Apply authentication and admin check middleware to all routes
router.use(authenticate, requireAdmin);

// User management routes
router.get('/users', AdminController.getAllUsers);
router.patch('/users/:userId/status', AdminController.updateUserStatus);

// Stream management routes
router.get('/streams/active', AdminController.getActiveStreams);
router.post('/streams/:streamId/end', AdminController.endStream);

// Streamer request management routes
router.get('/streamer-requests', AdminController.getStreamerRequests);
router.post('/streamer-requests/:userId', AdminController.handleStreamerRequest);

// Statistics route
router.get('/statistics', AdminController.getStatistics);

export default router; 