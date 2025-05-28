import express from 'express';
import { 
  createDonation, 
  getStreamDonations, 
  getUserReceivedDonations, 
  getUserSentDonations, 
  purchaseCoins 
} from '../controllers/donationController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

// Public routes
router.get('/stream/:streamId', getStreamDonations);
router.get('/user/:userId/received', getUserReceivedDonations);

// Protected routes
router.post('/', protect, createDonation);
router.get('/sent', protect, getUserSentDonations);
router.post('/purchase-coins', protect, purchaseCoins);

export { router as donationRoutes };
