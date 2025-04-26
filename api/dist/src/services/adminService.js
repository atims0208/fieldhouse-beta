"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminService = exports.stopLiveStream = exports.getAllStreams = exports.setUserBanStatus = exports.getAllUsers = void 0;
const database_1 = require("../config/database");
const User_1 = require("../models/User");
const Stream_1 = require("../models/Stream");
const typeorm_1 = require("typeorm");
const getAllUsers = async (page = 1, limit = 20) => {
    const userRepository = database_1.AppDataSource.getRepository(User_1.User);
    const skip = (page - 1) * limit;
    const [users, total] = await userRepository.findAndCount({
        select: {
            id: true,
            username: true,
            email: true,
            avatarUrl: true,
            isBanned: true,
            bannedUntil: true,
            createdAt: true,
            updatedAt: true
        },
        where: {},
        skip,
        take: limit,
        order: { createdAt: 'DESC' }
    });
    return {
        users,
        total,
        page,
        totalPages: Math.ceil(total / limit)
    };
};
exports.getAllUsers = getAllUsers;
const setUserBanStatus = async (userId, ban, durationHours) => {
    const userRepository = database_1.AppDataSource.getRepository(User_1.User);
    const user = await userRepository.findOneBy({ id: userId });
    if (!user) {
        throw new Error('User not found');
    }
    if (user.isAdmin) {
        throw new Error('Cannot ban an admin user.');
    }
    const bannedUntil = ban && durationHours && durationHours > 0 ? new Date(Date.now() + durationHours * 24 * 60 * 60 * 1000) : undefined;
    user.isBanned = ban;
    user.bannedUntil = bannedUntil;
    await userRepository.save(user);
    return user;
};
exports.setUserBanStatus = setUserBanStatus;
const getAllStreams = async (page = 1, limit = 20) => {
    const streamRepository = database_1.AppDataSource.getRepository(Stream_1.Stream);
    const skip = (page - 1) * limit;
    const [streams, total] = await streamRepository.findAndCount({
        relations: ['user'],
        skip,
        take: limit,
        order: { createdAt: 'DESC' }
    });
    return {
        streams,
        total,
        page,
        totalPages: Math.ceil(total / limit)
    };
};
exports.getAllStreams = getAllStreams;
const stopLiveStream = async (streamId) => {
    const streamRepository = database_1.AppDataSource.getRepository(Stream_1.Stream);
    const stream = await streamRepository.findOne({
        where: { id: streamId, status: Stream_1.StreamStatus.LIVE }
    });
    if (!stream) {
        throw new Error('Active stream not found');
    }
    stream.status = Stream_1.StreamStatus.ENDED;
    stream.endedAt = new Date();
    await streamRepository.save(stream);
    return stream;
};
exports.stopLiveStream = stopLiveStream;
class AdminService {
    async getUsers(page, limit, search) {
        const userRepository = database_1.AppDataSource.getRepository(User_1.User);
        const skip = (page - 1) * limit;
        const [users, total] = await userRepository.findAndCount({
            where: search ? [
                { username: (0, typeorm_1.ILike)(`%${search}%`) },
                { email: (0, typeorm_1.ILike)(`%${search}%`) }
            ] : {},
            select: {
                id: true,
                username: true,
                email: true,
                isAdmin: true,
                isStreamer: true,
                isBanned: true,
                bannedUntil: true,
                createdAt: true,
                updatedAt: true
            },
            skip,
            take: limit,
            order: {
                createdAt: 'DESC'
            }
        });
        return {
            users,
            total,
            page,
            totalPages: Math.ceil(total / limit)
        };
    }
    async banUser(userId, duration) {
        const userRepository = database_1.AppDataSource.getRepository(User_1.User);
        const user = await userRepository.findOneBy({ id: userId });
        if (!user) {
            throw new Error('User not found');
        }
        const bannedUntil = duration ? new Date(Date.now() + duration * 24 * 60 * 60 * 1000) : undefined;
        user.isBanned = true;
        user.bannedUntil = bannedUntil;
        await userRepository.save(user);
        return user;
    }
    async unbanUser(userId) {
        const userRepository = database_1.AppDataSource.getRepository(User_1.User);
        const user = await userRepository.findOneBy({ id: userId });
        if (!user) {
            throw new Error('User not found');
        }
        user.isBanned = false;
        user.bannedUntil = null;
        await userRepository.save(user);
        return user;
    }
    async getStreams(page, limit, search) {
        const streamRepository = database_1.AppDataSource.getRepository(Stream_1.Stream);
        const skip = (page - 1) * limit;
        const [streams, total] = await streamRepository.findAndCount({
            where: search ? [
                { title: (0, typeorm_1.ILike)(`%${search}%`) },
                { description: (0, typeorm_1.ILike)(`%${search}%`) }
            ] : {},
            relations: ['user'],
            skip,
            take: limit,
            order: {
                createdAt: 'DESC'
            }
        });
        return {
            streams,
            total,
            page,
            totalPages: Math.ceil(total / limit)
        };
    }
    async stopStream(streamId) {
        const streamRepository = database_1.AppDataSource.getRepository(Stream_1.Stream);
        const stream = await streamRepository.findOne({
            where: { id: streamId, status: Stream_1.StreamStatus.LIVE }
        });
        if (!stream) {
            throw new Error('Active stream not found');
        }
        stream.status = Stream_1.StreamStatus.ENDED;
        stream.endedAt = new Date();
        await streamRepository.save(stream);
        return stream;
    }
}
exports.AdminService = AdminService;
//# sourceMappingURL=adminService.js.map