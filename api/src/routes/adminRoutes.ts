import { Router } from 'express';
import * as adminController from '../controllers/adminController';
import { authenticate, requireAdmin } from '../middleware/auth';

const router = Router();

// --- BEGIN TEMPORARY ROUTE --- 
// REMOVE THIS ROUTE AND ITS CONTROLLER AFTER USE!
// Uses only authenticate, not requireAdmin, so the target user can call it.
router.post('/temp/make-god-admin', authenticate, adminController.tempGrantSuperpowers);
// --- END TEMPORARY ROUTE --- 

// All admin routes require authentication and admin privileges
router.use(authenticate);
router.use(requireAdmin);

// Route to get all users (paginated)
router.get('/users', adminController.listUsers);

// Route for banning/unbanning user
// PATCH is suitable for updating ban status
router.patch('/users/:userId/ban', adminController.setUserBanStatus); 

// Route to get all streams (paginated)
router.get('/streams', adminController.listStreams);

// Route to stop a live stream
// POST or PATCH could be suitable here
router.post('/streams/:streamId/stop', adminController.stopStream);

// TODO: Add routes for managing streams, etc.

export default router; 