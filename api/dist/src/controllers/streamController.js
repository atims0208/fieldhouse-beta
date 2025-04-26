"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("../models");
const bunnyService_1 = __importDefault(require("../services/bunnyService"));
const Stream_1 = require("../models/Stream");
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
                    status: Stream_1.StreamStatus.LIVE
                }
            });
            if (existingStream) {
                res.status(400).json({ message: 'You already have an active stream' });
                return;
            }
            const stream = await StreamModel.create({
                userId: req.user.id,
                title,
                description: description || '',
                category: category || '',
                tags: tags || [],
                isLive: true,
                status: Stream_1.StreamStatus.LIVE,
                startedAt: new Date()
            });
            res.status(201).json({
                id: stream.id,
                title: stream.title,
                status: stream.status,
                rtmpUrl: bunnyService_1.default.getRtmpUrl(user.streamKey),
                whipUrl: bunnyService_1.default.getWhipUrl(user.streamKey),
                playbackUrl: bunnyService_1.default.getPlaybackUrl(stream.id)
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
                    status: Stream_1.StreamStatus.LIVE
                }
            });
            if (!stream) {
                res.status(404).json({ message: 'Active stream not found' });
                return;
            }
            stream.isLive = false;
            stream.status = Stream_1.StreamStatus.ENDED;
            stream.endedAt = new Date();
            await stream.save();
            res.status(200).json({
                id: stream.id,
                title: stream.title,
                status: stream.status,
                endedAt: stream.endedAt
            });
        }
        catch (error) {
            console.error('End stream error:', error);
            res.status(500).json({ message: 'Failed to end stream' });
        }
    },
    getActiveStreams: async (_req, res) => {
        try {
            const activeStreams = await StreamModel.findAll({
                where: { status: Stream_1.StreamStatus.LIVE },
                include: [{
                        model: models_1.User,
                        as: 'user',
                        attributes: ['id', 'username', 'avatarUrl']
                    }],
                order: [['viewerCount', 'DESC']]
            });
            const streamsWithPlaybackUrls = activeStreams.map((stream) => {
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
                    playbackUrl: bunnyService_1.default.getPlaybackUrl(stream.id)
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
            if (stream.isLive) {
            }
            res.status(200).json(Object.assign(Object.assign({}, stream.toJSON()), { playbackUrl: bunnyService_1.default.getPlaybackUrl(stream.id) }));
        }
        catch (error) {
            console.error('Get stream error:', error);
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