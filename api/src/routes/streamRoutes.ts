import express from 'express';
import streamController from '../controllers/streamController';
import { authenticate, requireStreamer, optionalAuth } from '../middleware/auth';

const router = express.Router();

// Get active streams (public)
router.get('/active', streamController.getActiveStreams);

// Get stream by ID (public with optional auth for follow data)
router.get('/:streamId', optionalAuth, streamController.getStreamById);

// Start a new stream (requires streamer privileges)
router.post('/start', authenticate, requireStreamer, streamController.startStream);

// End a stream (requires streamer privileges)
router.post('/:streamId/end', authenticate, requireStreamer, streamController.endStream);

// Update viewer count
router.put('/:streamId/viewers', streamController.updateViewerCount);

export default router; 