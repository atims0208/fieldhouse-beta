"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("../models");
const bunnyService_1 = __importDefault(require("../services/bunnyService"));
const StreamModel = models_1.Stream;
const UserModel = models_1.User;
exports.default = {
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
            const user = await UserModel.findByPk(req.user.id);
            if (!user || !user.isStreamer || !user.streamKey) {
                res.status(403).json({ message: 'Streaming privileges and stream key required' });
                return;
            }
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
            const streamKey = user.streamKey;
            const bunnyLibraryId = process.env.BUNNY_STREAM_LIBRARY_ID;
            if (!bunnyLibraryId) {
                console.error('Missing BUNNY_STREAM_LIBRARY_ID environment variable');
                res.status(500).json({ message: 'Server configuration error for streaming' });
                return;
            }
            const stream = await StreamModel.create({
                userId: req.user.id,
                title,
                description: description || '',
                category: category || '',
                tags: tags || [],
                isLive: true
            });
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
    endStream: async (req, res) => {
        try {
            if (!req.user) {
                res.status(401).json({ message: 'Authentication required' });
                return;
            }
            const { streamId } = req.params;
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
            stream.isLive = false;
            stream.endedAt = new Date();
            await stream.save();
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
                const bunnyStreamId = 'placeholder';
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
            const bunnyStreamId = 'placeholder';
            if (stream.isLive) {
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