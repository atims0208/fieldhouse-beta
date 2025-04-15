"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminController = void 0;
const User_1 = require("../models/User");
const Stream_1 = require("../models/Stream");
const sequelize_1 = require("sequelize");
class AdminController {
    // Get all users with pagination
    static async getAllUsers(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const offset = (page - 1) * limit;
            const users = await User_1.User.findAndCountAll({
                limit,
                offset,
                order: [['createdAt', 'DESC']],
                attributes: { exclude: ['password'] }
            });
            res.json({
                users: users.rows,
                total: users.count,
                currentPage: page,
                totalPages: Math.ceil(users.count / limit)
            });
        }
        catch (error) {
            res.status(500).json({ error: 'Failed to fetch users' });
        }
    }
    // Update user status (ban/unban, streamer privileges)
    static async updateUserStatus(req, res) {
        try {
            const { userId } = req.params;
            const { isStreamer, isBanned, bannedUntil } = req.body;
            const user = await User_1.User.findByPk(userId);
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
            await user.update({
                isStreamer: isStreamer !== undefined ? isStreamer : user.isStreamer,
                isBanned: isBanned !== undefined ? isBanned : user.isBanned,
                bannedUntil: bannedUntil || null,
                streamKey: isStreamer ? user.generateStreamKey() : null
            });
            res.json({ message: 'User status updated successfully', user });
        }
        catch (error) {
            res.status(500).json({ error: 'Failed to update user status' });
        }
    }
    // Get all active streams
    static async getActiveStreams(req, res) {
        try {
            const streams = await Stream_1.Stream.findAll({
                where: { isLive: true },
                include: [{
                        model: User_1.User,
                        attributes: ['id', 'username', 'avatarUrl']
                    }]
            });
            res.json(streams);
        }
        catch (error) {
            res.status(500).json({ error: 'Failed to fetch active streams' });
        }
    }
    // End a stream
    static async endStream(req, res) {
        try {
            const { streamId } = req.params;
            const stream = await Stream_1.Stream.findByPk(streamId);
            if (!stream) {
                return res.status(404).json({ error: 'Stream not found' });
            }
            await stream.update({
                isLive: false,
                endedAt: new Date()
            });
            res.json({ message: 'Stream ended successfully' });
        }
        catch (error) {
            res.status(500).json({ error: 'Failed to end stream' });
        }
    }
    // Get streaming requests
    static async getStreamerRequests(req, res) {
        try {
            const requests = await User_1.User.findAll({
                where: {
                    isStreamer: false,
                    idDocumentUrl: { [sequelize_1.Op.not]: null }
                },
                attributes: ['id', 'username', 'email', 'idDocumentUrl', 'createdAt']
            });
            res.json(requests);
        }
        catch (error) {
            res.status(500).json({ error: 'Failed to fetch streamer requests' });
        }
    }
    // Approve/reject streamer request
    static async handleStreamerRequest(req, res) {
        try {
            const { userId } = req.params;
            const { approved } = req.body;
            const user = await User_1.User.findByPk(userId);
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
            if (approved) {
                await user.update({
                    isStreamer: true,
                    streamKey: user.generateStreamKey()
                });
            }
            res.json({
                message: approved ? 'Streamer request approved' : 'Streamer request rejected',
                user
            });
        }
        catch (error) {
            res.status(500).json({ error: 'Failed to handle streamer request' });
        }
    }
    // Get system statistics
    static async getStatistics(req, res) {
        try {
            const totalUsers = await User_1.User.count();
            const totalStreamers = await User_1.User.count({ where: { isStreamer: true } });
            const activeStreams = await Stream_1.Stream.count({ where: { isLive: true } });
            const bannedUsers = await User_1.User.count({ where: { isBanned: true } });
            res.json({
                totalUsers,
                totalStreamers,
                activeStreams,
                bannedUsers
            });
        }
        catch (error) {
            res.status(500).json({ error: 'Failed to fetch statistics' });
        }
    }
}
exports.AdminController = AdminController;
//# sourceMappingURL=admin.controller.js.map