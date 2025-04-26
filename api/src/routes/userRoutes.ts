import express from 'express';
import { UserController } from '../controllers/userController';
import { authenticate, optionalAuth } from '../middleware/auth';

const router = express.Router();
const userController = new UserController();

// Get user profile by username (public)
router.get('/profile/:username', optionalAuth, userController.getProfile);

// Update user profile (authenticated)
router.put('/profile', authenticate, userController.updateProfile);

// Upgrade to streamer (authenticated)
router.post('/upgrade-to-streamer', authenticate, userController.upgradeToStreamer);

// Follow a user (authenticated)
router.post('/follow/:username', authenticate, userController.followUser);

// Unfollow a user (authenticated)
router.delete('/follow/:username', authenticate, userController.unfollowUser);

// Get following list (authenticated)
router.get('/following', authenticate, userController.getFollowing);

export default router; 