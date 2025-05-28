import { Request, Response } from 'express';
import { StreamModel, findAllLive, findLiveByUser } from '../models/StreamModel';
import { bunnyService } from '../services/bunnyService';
import { asyncHandler } from '../middleware/errorHandler';
import { ApiError } from '../middleware/errorHandler';
import { v4 as uuidv4 } from 'uuid';

// Get all active streams
export const getActiveStreams = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  try {
    const streams = await findAllLive();
    
    res.status(200).json(streams);
  } catch (error) {
    console.error('Get active streams error:', error);
    res.status(500).json({ message: 'Failed to fetch active streams' });
  }
});

// Start a new stream
export const startStream = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, description, category, tags } = req.body;
    const userId = req.user.id;

    // Check if user already has an active stream
    const existingStream = await findLiveByUser(userId);
    if (existingStream) {
      throw new ApiError(400, 'You already have an active stream');
    }

    // Create stream in Bunny.net
    const streamId = await bunnyService.createStream({ title });
    
    // Create stream in database
    const stream = new StreamModel();
    stream.id = streamId;
    stream.title = title;
    stream.description = description || '';
    stream.category = category || '';
    stream.tags = tags || '';
    stream.userId = userId;
    stream.streamKey = bunnyService.getStreamKey(streamId);
    stream.playbackId = streamId;
    
    await stream.save();

    res.status(201).json({
      ...stream.toJSON(),
      rtmpUrl: bunnyService.getRtmpUrl(streamId),
      streamKey: stream.streamKey
    });
  } catch (error) {
    console.error('Start stream error:', error);
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(500, 'Failed to start stream');
  }
});

// End a stream
export const endStream = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  try {
    const { streamId } = req.params;
    const userId = req.user.id;

    // Find the stream
    const stream = await StreamModel.findOne({
      where: {
        id: streamId,
        userId,
        isLive: true
      }
    });

    if (!stream) {
      throw new ApiError(404, 'Active stream not found');
    }

    // Update stream status
    stream.isLive = false;
    stream.endedAt = new Date();
    await stream.save();

    res.status(200).json({
      id: stream.id,
      title: stream.title,
      endedAt: stream.endedAt
    });
  } catch (error) {
    console.error('End stream error:', error);
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(500, 'Failed to end stream');
  }
});

// Get stream by ID
export const getStreamById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  try {
    const { streamId } = req.params;
    
    const stream = await StreamModel.findOne({
      where: { id: streamId },
      relations: ['user']
    });

    if (!stream) {
      throw new ApiError(404, 'Stream not found');
    }

    // Check if stream is actually live via Bunny.net
    // const isActuallyLive = await bunnyService.isStreamLive(bunnyStreamId);
    // if (!isActuallyLive) {
    //   stream.isLive = false;
    //   stream.endedAt = new Date();
    //   await stream.save();
    // }

    res.status(200).json({
      ...stream.toJSON(),
      playbackUrl: bunnyService.getPlaybackUrl(stream.id)
    });
  } catch (error) {
    console.error('Get stream error:', error);
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(500, 'Failed to fetch stream');
  }
});

// Update viewer count for a stream
export const updateViewerCount = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  try {
    const { streamId } = req.params;
    const { count } = req.body;
    
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
});
