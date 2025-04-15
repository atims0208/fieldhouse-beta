"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stopLiveStream = exports.getAllStreams = exports.setUserBanStatus = exports.getAllUsers = void 0;
const models_1 = require("../models");
/**
 * Fetches all users (excluding admins themselves perhaps, based on requirements).
 * Includes pagination and potential filtering.
 */
const getAllUsers = async (page = 1, limit = 20) => {
    const offset = (page - 1) * limit;
    try {
        const { count, rows } = await models_1.User.findAndCountAll({
            // Exclude sensitive info like password, streamKey
            attributes: {
                exclude: ['password', 'streamKey']
            },
            // Optional: Exclude admins from the list
            // where: {
            //   isAdmin: false
            // },
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
/**
 * Bans or unbans a user.
 * @param userId ID of the user to update.
 * @param ban `true` to ban, `false` to unban.
 * @param durationHours Optional duration in hours for temporary bans.
 */
const setUserBanStatus = async (userId, ban, durationHours) => {
    try {
        const user = await models_1.User.findByPk(userId);
        if (!user) {
            throw new Error('User not found');
        }
        // Prevent banning admins?
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
            user.bannedUntil = null; // Clear duration for unban or permanent ban
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
/**
 * Fetches all streams (live and past) for admin overview.
 */
const getAllStreams = async (page = 1, limit = 20) => {
    const offset = (page - 1) * limit;
    try {
        const { count, rows } = await models_1.Stream.findAndCountAll({
            include: [{
                    model: models_1.User,
                    as: 'user',
                    attributes: ['id', 'username', 'avatarUrl'] // Include user info
                }],
            limit,
            offset,
            order: [['createdAt', 'DESC']] // Order by creation date
        });
        return { streams: rows, totalStreams: count, currentPage: page, totalPages: Math.ceil(count / limit) };
    }
    catch (error) {
        console.error('Error fetching streams:', error);
        throw new Error('Could not fetch streams');
    }
};
exports.getAllStreams = getAllStreams;
/**
 * Stops a live stream (marks it as not live in the database).
 * @param streamId ID of the stream to stop.
 */
const stopLiveStream = async (streamId) => {
    try {
        const stream = await models_1.Stream.findOne({ where: { id: streamId, isLive: true } });
        if (!stream) {
            throw new Error('Live stream not found');
        }
        stream.isLive = false;
        stream.endedAt = new Date();
        await stream.save();
        // NOTE: This does NOT necessarily stop the ingest to Bunny.net
        // True stream termination would require Bunny API interaction if possible,
        // or rely on the streamer stopping their software.
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
/**
 * TODO: Implement ban/unban logic
 * This would likely involve adding an `isBanned` flag to the User model
 * and updating it here.
 */
// export const updateUserBanStatus = async (userId: string, isBanned: boolean) => { ... }; 
//# sourceMappingURL=adminService.js.map