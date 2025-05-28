/**
 * Lovense API routes for the Fieldhouse application
 */

import express from 'express';
import * as lovenseController from '../controllers/lovenseController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

// Public webhook route (no authentication required)
router.post('/webhook', lovenseController.toyWebhook);

// Protected routes (require authentication)
router.get('/qrcode', protect, lovenseController.getQRCode);
router.get('/toys', protect, lovenseController.getUserToys);
router.post('/register', protect, lovenseController.registerToy);
router.delete('/disconnect', protect, lovenseController.disconnectToy);
router.post('/command', protect, lovenseController.sendCommand);
router.post('/pattern', protect, lovenseController.sendPattern);
router.post('/stop', protect, lovenseController.stopToy);

export { router as lovenseRoutes };
