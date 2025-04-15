"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("../models");
const bunnyService_1 = __importDefault(require("../services/bunnyService"));
// Type assertions for models
const StreamModel = models_1.Stream;
const UserModel = models_1.User;
exports.default = {
    // Start a new stream
    startStream: async (req, res) => {
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
                    isLive: true
                }
            });
            if (existingStream) {
                res.status(400).json({ message: 'You already have an active stream' });
                return;
            }
            // Assume createStream logic is handled or not needed if just using existing key
            // If Bunny requires an API call even for WHIP, keep the bunnyService call
            // For now, let's assume we just need the stream key
            const streamKey = user.streamKey;
            const bunnyLibraryId = process.env.BUNNY_STREAM_LIBRARY_ID; // Get Library ID from env
            if (!bunnyLibraryId) {
                console.error('Missing BUNNY_STREAM_LIBRARY_ID environment variable');
                res.status(500).json({ message: 'Server configuration error for streaming' });
                return;
            }
            // Create stream record in database
            const stream = await StreamModel.create({
                userId: req.user.id,
                title,
                description: description || '',
                category: category || '',
                tags: tags || [],
                isLive: true
            });
            // Return stream info with RTMP URL and WHIP URL
            res.status(201).json({
                id: stream.id,
                title: stream.title,
                isLive: stream.isLive,
                rtmpUrl: bunnyService_1.default.getRtmpUrl(bunnyLibraryId, streamKey),
                whipUrl: bunnyService_1.default.getWhipUrl(bunnyLibraryId, streamKey),
                playbackUrl: bunnyService_1.default.getPlaybackUrl(bunnyLibraryId)
            });
        }
        catch (error) {
            console.error('Start stream error:', error);
            res.status(500).json({ message: 'Failed to start stream' });
        }
    },
    // End a stream
    endStream: async (req, res) => {
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
                    isLive: true
                }
            });
            if (!stream) {
                res.status(404).json({ message: 'Active stream not found' });
                return;
            }
            // Update stream record
            stream.isLive = false;
            stream.endedAt = new Date();
            await stream.save();
            // If bunnyStreamId is stored, you can add logic to end it in Bunny.net
            // This may require storing the Bunny.net stream ID in your Stream model
            res.status(200).json({
                id: stream.id,
                title: stream.title,
                isLive: stream.isLive,
                endedAt: stream.endedAt
            });
        }
        catch (error) {
            console.error('End stream error:', error);
            res.status(500).json({ message: 'Failed to end stream' });
        }
    },
    // Get all active streams
    getActiveStreams: async (req, res) => {
        try {
            const activeStreams = await StreamModel.findAll({
                where: { isLive: true },
                include: [{
                        model: models_1.User,
                        as: 'user',
                        attributes: ['id', 'username', 'avatarUrl']
                    }],
                order: [['viewerCount', 'DESC']]
            });
            const streamsWithPlaybackUrls = activeStreams.map((stream) => {
                // In a real implementation, you'd store and retrieve the Bunny.net stream ID
                // For now, using a placeholder
                const bunnyStreamId = 'placeholder'; // This should come from your database in a real implementation
                return {
                    id: stream.id,
                    title: stream.title,
                    description: stream.description,
                    thumbnailUrl: stream.thumbnailUrl,
                    viewerCount: stream.viewerCount,
                    category: stream.category,
                    tags: stream.tags,
                    startedAt: stream.startedAt,
                    user: stream.user,
                    playbackUrl: bunnyService_1.default.getPlaybackUrl(bunnyStreamId)
                };
            });
            res.status(200).json(streamsWithPlaybackUrls);
        }
        catch (error) {
            console.error('Get active streams error:', error);
            res.status(500).json({ message: 'Failed to fetch active streams' });
        }
    },
    // Get a single stream by ID
    getStreamById: async (req, res) => {
        try {
            const { streamId } = req.params;
            const stream = await StreamModel.findByPk(streamId, {
                include: [{
                        model: models_1.User,
                        as: 'user',
                        attributes: ['id', 'username', 'avatarUrl', 'bio']
                    }]
            });
            if (!stream) {
                res.status(404).json({ message: 'Stream not found' });
                return;
            }
            // In a real implementation, you'd store and retrieve the Bunny.net stream ID
            const bunnyStreamId = 'placeholder'; // This should come from your database
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
                id: stream.id,
                title: stream.title,
                description: stream.description,
                thumbnailUrl: stream.thumbnailUrl,
                isLive: stream.isLive,
                viewerCount: stream.viewerCount,
                category: stream.category,
                tags: stream.tags,
                startedAt: stream.startedAt,
                endedAt: stream.endedAt,
                user: stream.user,
                playbackUrl: stream.isLive ? bunnyService_1.default.getPlaybackUrl(bunnyStreamId) : null
            });
        }
        catch (error) {
            console.error('Get stream by ID error:', error);
            res.status(500).json({ message: 'Failed to fetch stream' });
        }
    },
    // Update viewer count for a stream
    updateViewerCount: async (req, res) => {
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
        }
        catch (error) {
            console.error('Update viewer count error:', error);
            res.status(500).json({ message: 'Failed to update viewer count' });
        }
    }
};
//# sourceMappingURL=streamController.js.map