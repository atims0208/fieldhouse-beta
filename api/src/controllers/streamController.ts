import { Request, Response } from 'express';
import { Stream, User } from '../models';
import bunnyService from '../services/bunnyService';
import { StreamStatus } from '../models/Stream';

// Type assertions for models
const StreamModel = Stream as any;
const UserModel = User as any;

export default {
  // Start a new stream
  startStream: async (req: Request, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({ message: 'Authentication required' });
        return;
      }
      
      const { title, description, category, tags } = req.body;
      
      if (!title) {
        res.status(400).json({ message: 'Stream title is required' });
        return;
      }
      
      // Find user to ensure they're a streamer
      const user = await UserModel.findByPk(req.user.id);
      
      if (!user || !user.isStreamer || !user.streamKey) {
        res.status(403).json({ message: 'Streaming privileges and stream key required' });
        return;
      }
      
      // Check if user already has an active stream
      const existingStream = await StreamModel.findOne({
        where: {
          userId: req.user.id,
          status: StreamStatus.LIVE
        }
      });
      
      if (existingStream) {
        res.status(400).json({ message: 'You already have an active stream' });
        return;
      }
      
      // Create stream record in database
      const stream = await StreamModel.create({
        userId: req.user.id,
        title,
        description: description || '',
        category: category || '',
        tags: tags || [],
        isLive: true,
        status: StreamStatus.LIVE,
        startedAt: new Date()
      });
      
      // Return stream info with RTMP URL and WHIP URL
      res.status(201).json({
        id: stream.id,
        title: stream.title,
        status: stream.status,
        rtmpUrl: bunnyService.getRtmpUrl(user.streamKey),
        whipUrl: bunnyService.getWhipUrl(user.streamKey),
        playbackUrl: bunnyService.getPlaybackUrl(stream.id)
      });
    } catch (error) {
      console.error('Start stream error:', error);
      res.status(500).json({ message: 'Failed to start stream' });
    }
  },
  
  // End a stream
  endStream: async (req: Request, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({ message: 'Authentication required' });
        return;
      }
      
      const { streamId } = req.params;
      
      // Find the stream
      const stream = await StreamModel.findOne({
        where: {
          id: streamId,
          userId: req.user.id,
          status: StreamStatus.LIVE
        }
      });
      
      if (!stream) {
        res.status(404).json({ message: 'Active stream not found' });
        return;
      }
      
      // Update stream record
      stream.isLive = false;
      stream.status = StreamStatus.ENDED;
      stream.endedAt = new Date();
      await stream.save();
      
      res.status(200).json({
        id: stream.id,
        title: stream.title,
        status: stream.status,
        endedAt: stream.endedAt
      });
    } catch (error) {
      console.error('End stream error:', error);
      res.status(500).json({ message: 'Failed to end stream' });
    }
  },
  
  // Get all active streams
  getActiveStreams: async (_req: Request, res: Response): Promise<void> => {
    try {
      const activeStreams = await StreamModel.findAll({
        where: { status: StreamStatus.LIVE },
        include: [{
          model: User,
          as: 'user',
          attributes: ['id', 'username', 'avatarUrl']
        }],
        order: [['viewerCount', 'DESC']]
      });
      
      const streamsWithPlaybackUrls = activeStreams.map((stream: Stream) => {
        return {
          id: stream.id,
          title: stream.title,
          description: stream.description,
          thumbnailUrl: stream.thumbnailUrl,
          viewerCount: stream.viewerCount,
          category: stream.category,
          tags: stream.tags,
          startedAt: stream.startedAt,
          status: stream.status,
          user: stream.user,
          playbackUrl: bunnyService.getPlaybackUrl(stream.id)
        };
      });
      
      res.status(200).json(streamsWithPlaybackUrls);
    } catch (error) {
      console.error('Get active streams error:', error);
      res.status(500).json({ message: 'Failed to fetch active streams' });
    }
  },
  
  // Get a single stream by ID
  getStreamById: async (req: Request, res: Response): Promise<void> => {
    try {
      const { streamId } = req.params;
      
      const stream = await StreamModel.findByPk(streamId, {
        include: [{
          model: User,
          as: 'user',
          attributes: ['id', 'username', 'avatarUrl', 'bio']
        }]
      });
      
      if (!stream) {
        res.status(404).json({ message: 'Stream not found' });
        return;
      }
      
      // Check if stream is actually live on Bunny.net
      // This would be useful for cases where streams end unexpectedly
      if (stream.isLive) {
        // Optional: Check with Bunny.net if the stream is still live
        // You'd need to store the Bunny.net stream ID in your database
        // const isActuallyLive = await bunnyService.isStreamLive(bunnyStreamId);
        // if (!isActuallyLive) {
        //   stream.isLive = false;
        //   stream.endedAt = new Date();
        //   await stream.save();
        // }
      }
      
      res.status(200).json({
        ...stream.toJSON(),
        playbackUrl: bunnyService.getPlaybackUrl(stream.id)
      });
    } catch (error) {
      console.error('Get stream error:', error);
      res.status(500).json({ message: 'Failed to fetch stream' });
    }
  },
  
  // Update viewer count for a stream
  updateViewerCount: async (req: Request, res: Response): Promise<void> => {
    try {
      const { streamId } = req.params;
      const { count } = req.body;
      
      if (isNaN(count)) {
        res.status(400).json({ message: 'Valid viewer count is required' });
        return;
      }
      
      const stream = await StreamModel.findOne({
        where: {
          id: streamId,
          isLive: true
        }
      });
      
      if (!stream) {
        res.status(404).json({ message: 'Active stream not found' });
        return;
      }
      
      stream.viewerCount = count;
      await stream.save();
      
      res.status(200).json({
        id: stream.id,
        viewerCount: stream.viewerCount
      });
    } catch (error) {
      console.error('Update viewer count error:', error);
      res.status(500).json({ message: 'Failed to update viewer count' });
    }
  }
}; 