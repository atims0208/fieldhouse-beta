import { Router } from 'express';
import { PrintfulController } from '../controllers/printful.controller';
import { authenticate } from '../middleware/auth';

const router = Router();
const printfulController = new PrintfulController();

// Connect Printful store to shop
router.post(
  '/connect',
  authenticate,
  (req, res) => printfulController.connectStore(req, res)
);

// Sync products from Printful
router.post(
  '/:shopId/sync',
  authenticate,
  (req, res) => printfulController.syncProducts(req, res)
);

// Disconnect Printful store
router.post(
  '/:shopId/disconnect',
  authenticate,
  (req, res) => printfulController.disconnectStore(req, res)
);

export default router; 