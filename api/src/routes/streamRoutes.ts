import express, { Response } from 'express';
import streamController from '../controllers/streamController';
import { authenticate, requireStreamer, optionalAuth } from '../middleware/auth';
import { BunnyStreamService } from '../services/bunnyStreamService';
import { Stream, StreamStatus, StreamType } from '../models/Stream';
import { AppDataSource } from '../config/database';
import { AuthenticatedRequest } from '../types/express';

const router = express.Router();
const bunnyStreamService = new BunnyStreamService();

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

// Create a new stream (works for both RTMP and WebRTC)
router.post('/', authenticate, async (req: AuthenticatedRequest, res: Response): Promise<Response | void> => {
  try {
    const { title, description, streamType = StreamType.RTMP } = req.body;
    const streamRepo = AppDataSource.getRepository(Stream);

    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    let streamData;
    if (streamType === StreamType.WEBRTC) {
      streamData = await bunnyStreamService.createWebRTCStream(title);
    } else {
      streamData = await bunnyStreamService.createStream(title);
    }

    const stream = streamRepo.create({
      title,
      description,
      streamType,
      status: StreamStatus.OFFLINE,
      userId: req.user.id,
      rtmpUrl: 'rtmpUrl' in streamData ? streamData.rtmpUrl : undefined,
      playbackUrl: streamData.playbackUrl,
      streamKey: 'streamKey' in streamData ? streamData.streamKey : undefined,
      webrtcSessionId: 'sessionId' in streamData ? streamData.sessionId : undefined,
      webrtcConfiguration: 'iceServers' in streamData ? { iceServers: streamData.iceServers } : undefined
    });

    await streamRepo.save(stream);
    return res.json(stream);
  } catch (error) {
    console.error('Error creating stream:', error);
    return res.status(500).json({ error: 'Failed to create stream' });
  }
});

// WebRTC signaling - handle offer
router.post('/:streamId/webrtc/offer', authenticate, async (req, res) => {
  try {
    const { streamId } = req.params;
    const { sessionId, offer } = req.body;

    const response = await fetch(
      `https://api.bunny.net/stream/${process.env.BUNNY_LIBRARY_ID}/${streamId}/webrtc/offer`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'AccessKey': process.env.BUNNY_STREAM_API_KEY || ''
        },
        body: JSON.stringify({ sessionId, offer })
      }
    );

    if (!response.ok) throw new Error('Failed to send offer to Bunny.net');
    
    const answer = await response.json();
    res.json(answer);
  } catch (error) {
    console.error('Error handling WebRTC offer:', error);
    res.status(500).json({ error: 'Failed to handle WebRTC offer' });
  }
});

// WebRTC signaling - handle ICE candidate
router.post('/:streamId/webrtc/candidate', authenticate, async (req, res) => {
  try {
    const { streamId } = req.params;
    const { sessionId, candidate } = req.body;

    const response = await fetch(
      `https://api.bunny.net/stream/${process.env.BUNNY_LIBRARY_ID}/${streamId}/webrtc/candidate`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'AccessKey': process.env.BUNNY_STREAM_API_KEY || ''
        },
        body: JSON.stringify({ sessionId, candidate })
      }
    );

    if (!response.ok) throw new Error('Failed to send ICE candidate to Bunny.net');
    res.json({ success: true });
  } catch (error) {
    console.error('Error handling ICE candidate:', error);
    res.status(500).json({ error: 'Failed to handle ICE candidate' });
  }
});

// Get stream details
router.get('/:streamId', async (req, res): Promise<Response | void> => {
  try {
    const { streamId } = req.params;
    const streamRepo = AppDataSource.getRepository(Stream);
    const stream = await streamRepo.findOne({ where: { id: streamId } });

    if (!stream) {
      return res.status(404).json({ error: 'Stream not found' });
    }

    // Check if stream is live
    const isLive = await bunnyStreamService.getStreamStatus(streamId);
    if (isLive && stream.status !== StreamStatus.LIVE) {
      stream.status = StreamStatus.LIVE;
      await streamRepo.save(stream);
    } else if (!isLive && stream.status === StreamStatus.LIVE) {
      stream.status = StreamStatus.ENDED;
      stream.endedAt = new Date();
      await streamRepo.save(stream);
    }

    return res.json(stream);
  } catch (error) {
    console.error('Error getting stream:', error);
    return res.status(500).json({ error: 'Failed to get stream' });
  }
});

export default router; 