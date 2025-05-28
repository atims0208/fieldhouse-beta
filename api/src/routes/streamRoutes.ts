import express from 'express';
import { 
  getActiveStreams, 
  startStream, 
  endStream, 
  getStreamById, 
  updateViewerCount 
} from '../controllers/streamController';
import { protect, streamer } from '../middleware/authMiddleware';

const router = express.Router();

// Public routes
router.get('/', getActiveStreams);
router.get('/:streamId', getStreamById);

// Protected routes
router.post('/', protect, streamer, startStream);
router.put('/:streamId/end', protect, endStream);
router.put('/:streamId/viewers', protect, updateViewerCount);

export { router as streamRoutes };
