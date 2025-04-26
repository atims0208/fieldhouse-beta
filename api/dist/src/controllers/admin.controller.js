"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminController = void 0;
const database_1 = require("../config/database");
const User_1 = require("../models/User");
const Stream_1 = require("../models/Stream");
const typeorm_1 = require("typeorm");
class AdminController {
    async getUsers(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const search = req.query.search || '';
            const skip = (page - 1) * limit;
            const userRepository = database_1.AppDataSource.getRepository(User_1.User);
            const [users, total] = await userRepository.findAndCount({
                where: [
                    { username: (0, typeorm_1.ILike)(`%${search}%`) },
                    { email: (0, typeorm_1.ILike)(`%${search}%`) }
                ],
                skip,
                take: limit,
                order: {
                    id: 'DESC'
                }
            });
            res.json({
                users,
                total,
                page,
                totalPages: Math.ceil(total / limit)
            });
        }
        catch (error) {
            console.error('Error fetching users:', error);
            res.status(500).json({ error: 'Failed to fetch users' });
        }
    }
    async getStreams(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const search = req.query.search || '';
            const skip = (page - 1) * limit;
            const streamRepository = database_1.AppDataSource.getRepository(Stream_1.Stream);
            const [streams, total] = await streamRepository.findAndCount({
                where: [
                    { title: (0, typeorm_1.ILike)(`%${search}%`) },
                    { description: (0, typeorm_1.ILike)(`%${search}%`) }
                ],
                relations: ['user'],
                skip,
                take: limit,
                order: {
                    id: 'DESC'
                }
            });
            res.json({
                streams,
                total,
                page,
                totalPages: Math.ceil(total / limit)
            });
        }
        catch (error) {
            console.error('Error fetching streams:', error);
            res.status(500).json({ error: 'Failed to fetch streams' });
        }
    }
    async banUser(req, res) {
        try {
            const { userId, duration } = req.body;
            const userRepository = database_1.AppDataSource.getRepository(User_1.User);
            const user = await userRepository.findOne({ where: { id: userId } });
            if (!user) {
                res.status(404).json({ error: 'User not found' });
                return;
            }
            const bannedUntil = duration ? new Date(Date.now() + duration * 24 * 60 * 60 * 1000) : undefined;
            await userRepository.update(userId, {
                isBanned: true,
                bannedUntil
            });
            res.json({ message: 'User banned successfully' });
        }
        catch (error) {
            console.error('Error banning user:', error);
            res.status(500).json({ error: 'Failed to ban user' });
        }
    }
    async unbanUser(req, res) {
        try {
            const { userId } = req.params;
            const userRepository = database_1.AppDataSource.getRepository(User_1.User);
            const user = await userRepository.findOne({ where: { id: userId } });
            if (!user) {
                res.status(404).json({ error: 'User not found' });
                return;
            }
            await userRepository.update(userId, {
                isBanned: false,
                bannedUntil: undefined
            });
            res.json({ message: 'User unbanned successfully' });
        }
        catch (error) {
            console.error('Error unbanning user:', error);
            res.status(500).json({ error: 'Failed to unban user' });
        }
    }
    async deleteStream(req, res) {
        try {
            const { streamId } = req.params;
            const streamRepository = database_1.AppDataSource.getRepository(Stream_1.Stream);
            const stream = await streamRepository.findOne({ where: { id: streamId } });
            if (!stream) {
                res.status(404).json({ error: 'Stream not found' });
                return;
            }
            await streamRepository.remove(stream);
            res.json({ message: 'Stream deleted successfully' });
        }
        catch (error) {
            console.error('Error deleting stream:', error);
            res.status(500).json({ error: 'Failed to delete stream' });
        }
    }
    async updateUserAdminStatus(req, res) {
        try {
            const { targetEmail } = req.body;
            const userRepository = database_1.AppDataSource.getRepository(User_1.User);
            const userToUpdate = await userRepository.findOne({ where: { email: targetEmail } });
            if (!userToUpdate) {
                res.status(404).json({ error: 'User not found' });
                return;
            }
            let updated = false;
            if (!userToUpdate.isAdmin) {
                await userRepository.update(userToUpdate.id, { isAdmin: true });
                updated = true;
            }
            res.json({
                message: updated ? 'User is now an admin' : 'User was already an admin',
                user: userToUpdate
            });
        }
        catch (error) {
            console.error('Error updating user admin status:', error);
            res.status(500).json({ error: 'Failed to update user admin status' });
        }
    }
}
exports.AdminController = AdminController;
exports.default = new AdminController();
//# sourceMappingURL=admin.controller.js.map