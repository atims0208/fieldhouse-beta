"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const database_1 = require("../config/database");
const User_1 = require("../models/User");
class UserController {
    async getProfile(req, res) {
        var _a;
        try {
            if (!((_a = req.user) === null || _a === void 0 ? void 0 : _a.id)) {
                res.status(401).json({ error: 'Not authenticated' });
                return;
            }
            const userRepository = database_1.AppDataSource.getRepository(User_1.User);
            const user = await userRepository.findOne({ where: { id: req.user.id } });
            if (!user) {
                res.status(404).json({ error: 'User not found' });
                return;
            }
            res.json({
                id: user.id,
                username: user.username,
                email: user.email,
                isStreamer: user.isStreamer,
                isAdmin: user.isAdmin,
                avatarUrl: user.avatarUrl
            });
        }
        catch (error) {
            console.error('Error getting user profile:', error);
            res.status(500).json({ error: 'Failed to get user profile' });
        }
    }
    async updateProfile(req, res) {
        var _a;
        try {
            if (!((_a = req.user) === null || _a === void 0 ? void 0 : _a.id)) {
                res.status(401).json({ error: 'Not authenticated' });
                return;
            }
            const { username, email, avatarUrl } = req.body;
            const userRepository = database_1.AppDataSource.getRepository(User_1.User);
            const user = await userRepository.findOne({ where: { id: req.user.id } });
            if (!user) {
                res.status(404).json({ error: 'User not found' });
                return;
            }
            if (username)
                user.username = username;
            if (email)
                user.email = email;
            if (avatarUrl)
                user.avatarUrl = avatarUrl;
            await userRepository.save(user);
            res.json({
                id: user.id,
                username: user.username,
                email: user.email,
                isStreamer: user.isStreamer,
                isAdmin: user.isAdmin,
                avatarUrl: user.avatarUrl
            });
        }
        catch (error) {
            console.error('Error updating user profile:', error);
            res.status(500).json({ error: 'Failed to update user profile' });
        }
    }
    async upgradeToStreamer(req, res) {
        try {
            if (!req.user) {
                res.status(401).json({ message: 'Authentication required' });
                return;
            }
            const userRepository = database_1.AppDataSource.getRepository(User_1.User);
            const user = await userRepository.findOne({ where: { id: req.user.id } });
            if (!user) {
                res.status(404).json({ message: 'User not found' });
                return;
            }
            if (user.isStreamer) {
                res.status(400).json({ message: 'User is already a streamer' });
                return;
            }
            user.isStreamer = true;
            user.streamKey = user.generateStreamKey();
            await userRepository.save(user);
            res.status(200).json({
                id: user.id,
                username: user.username,
                isStreamer: user.isStreamer,
                streamKey: user.streamKey
            });
        }
        catch (error) {
            console.error('Upgrade to streamer error:', error);
            res.status(500).json({ message: 'Failed to upgrade to streamer' });
        }
    }
    async followUser(req, res) {
        try {
            if (!req.user) {
                res.status(401).json({ message: 'Authentication required' });
                return;
            }
            const { username } = req.params;
            const userRepository = database_1.AppDataSource.getRepository(User_1.User);
            const userToFollow = await userRepository.findOne({ where: { username } });
            if (!userToFollow) {
                res.status(404).json({ message: 'User not found' });
                return;
            }
            const followRepository = database_1.AppDataSource.getRepository(Follow);
            const existingFollow = await followRepository.findOne({
                where: {
                    followerId: req.user.id,
                    followingId: userToFollow.id
                }
            });
            if (existingFollow) {
                res.status(400).json({ message: 'Already following this user' });
                return;
            }
            await followRepository.save(new Follow({
                followerId: req.user.id,
                followingId: userToFollow.id
            }));
            res.status(200).json({
                message: `Now following ${userToFollow.username}`,
                following: true
            });
        }
        catch (error) {
            console.error('Follow user error:', error);
            res.status(500).json({ message: 'Failed to follow user' });
        }
    }
    async unfollowUser(req, res) {
        try {
            if (!req.user) {
                res.status(401).json({ message: 'Authentication required' });
                return;
            }
            const { username } = req.params;
            const userRepository = database_1.AppDataSource.getRepository(User_1.User);
            const userToUnfollow = await userRepository.findOne({ where: { username } });
            if (!userToUnfollow) {
                res.status(404).json({ message: 'User not found' });
                return;
            }
            const followRepository = database_1.AppDataSource.getRepository(Follow);
            const deleted = await followRepository.delete({
                followerId: req.user.id,
                followingId: userToUnfollow.id
            });
            if (deleted.affected === 0) {
                res.status(400).json({ message: 'Not following this user' });
                return;
            }
            res.status(200).json({
                message: `Unfollowed ${userToUnfollow.username}`,
                following: false
            });
        }
        catch (error) {
            console.error('Unfollow user error:', error);
            res.status(500).json({ message: 'Failed to unfollow user' });
        }
    }
    async getFollowing(req, res) {
        try {
            if (!req.user) {
                res.status(401).json({ message: 'Authentication required' });
                return;
            }
            const userRepository = database_1.AppDataSource.getRepository(User_1.User);
            const follows = await database_1.AppDataSource.getRepository(Follow).find({
                where: { followerId: req.user.id },
                relations: ['following']
            });
            const following = follows.map((follow) => follow.following);
            res.status(200).json(following);
        }
        catch (error) {
            console.error('Get following error:', error);
            res.status(500).json({ message: 'Failed to fetch following users' });
        }
    }
}
exports.UserController = UserController;
//# sourceMappingURL=userController.js.map