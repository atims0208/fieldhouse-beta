import { Router } from 'express';
import { DonationController } from '../controllers/donationController';
import { authenticate } from '../middleware/auth';

const router = Router();
const donationController = new DonationController();

// Create a new donation (requires authentication)
router.post('/', authenticate, donationController.createDonation.bind(donationController));

// Get donations received by a user
router.get('/user/:username', donationController.getDonationsReceived.bind(donationController));

export default router; 