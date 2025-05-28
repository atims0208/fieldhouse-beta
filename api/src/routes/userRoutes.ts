import express from 'express';
import { 
  getUserProfile, 
  updateUserProfile, 
  becomeStreamer, 
  followUser, 
  searchUsers 
} from '../controllers/userController';
import { protect, ownerOrAdmin } from '../middleware/authMiddleware';

const router = express.Router();

// Public routes
router.get('/search', searchUsers);
router.get('/:userId', getUserProfile);

// Protected routes
router.put('/profile', protect, updateUserProfile);
router.post('/become-streamer', protect, becomeStreamer);
router.post('/:userId/follow', protect, followUser);

export { router as userRoutes };
