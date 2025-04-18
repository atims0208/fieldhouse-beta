"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stopLiveStream = exports.getAllStreams = exports.setUserBanStatus = exports.getAllUsers = void 0;
const models_1 = require("../models");
const getAllUsers = async (page = 1, limit = 20) => {
    const offset = (page - 1) * limit;
    try {
        const { count, rows } = await models_1.User.findAndCountAll({
            attributes: {
                exclude: ['password', 'streamKey']
            },
            limit,
            offset,
            order: [['createdAt', 'DESC']]
        });
        return { users: rows, totalUsers: count, currentPage: page, totalPages: Math.ceil(count / limit) };
    }
    catch (error) {
        console.error('Error fetching users:', error);
        throw new Error('Could not fetch users');
    }
};
exports.getAllUsers = getAllUsers;
const setUserBanStatus = async (userId, ban, durationHours) => {
    try {
        const user = await models_1.User.findByPk(userId);
        if (!user) {
            throw new Error('User not found');
        }
        if (user.isAdmin) {
            throw new Error('Cannot ban an admin user.');
        }
        user.isBanned = ban;
        if (ban && durationHours && durationHours > 0) {
            const banEndDate = new Date();
            banEndDate.setHours(banEndDate.getHours() + durationHours);
            user.bannedUntil = banEndDate;
        }
        else {
            user.bannedUntil = null;
        }
        await user.save();
        return user;
    }
    catch (error) {
        console.error('Error updating user ban status:', error);
        if (error instanceof Error)
            throw error;
        throw new Error('Could not update user ban status');
    }
};
exports.setUserBanStatus = setUserBanStatus;
const getAllStreams = async (page = 1, limit = 20) => {
    const offset = (page - 1) * limit;
    try {
        const { count, rows } = await models_1.Stream.findAndCountAll({
            include: [{
                    model: models_1.User,
                    as: 'user',
                    attributes: ['id', 'username', 'avatarUrl']
                }],
            limit,
            offset,
            order: [['createdAt', 'DESC']]
        });
        return { streams: rows, totalStreams: count, currentPage: page, totalPages: Math.ceil(count / limit) };
    }
    catch (error) {
        console.error('Error fetching streams:', error);
        throw new Error('Could not fetch streams');
    }
};
exports.getAllStreams = getAllStreams;
const stopLiveStream = async (streamId) => {
    try {
        const stream = await models_1.Stream.findOne({ where: { id: streamId, isLive: true } });
        if (!stream) {
            throw new Error('Live stream not found');
        }
        stream.isLive = false;
        stream.endedAt = new Date();
        await stream.save();
        return stream;
    }
    catch (error) {
        console.error('Error stopping stream:', error);
        if (error instanceof Error)
            throw error;
        throw new Error('Could not stop stream');
    }
};
exports.stopLiveStream = stopLiveStream;
//# sourceMappingURL=adminService.js.map