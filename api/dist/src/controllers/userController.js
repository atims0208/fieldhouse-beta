"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("../models");
const UserModel = models_1.User;
const FollowModel = models_1.Follow;
const StreamModel = models_1.Stream;
exports.default = {
    getUserProfile: async (req, res) => {
        try {
            const { username } = req.params;
            const user = await UserModel.findOne({
                where: { username },
                attributes: ['id', 'username', 'avatarUrl', 'bio', 'isStreamer', 'createdAt']
            });
            if (!user) {
                res.status(404).json({ message: 'User not found' });
                return;
            }
            const followerCount = await FollowModel.count({
                where: { followingId: user.id }
            });
            const followingCount = await FollowModel.count({
                where: { followerId: user.id }
            });
            let isFollowing = false;
            if (req.user) {
                const followRecord = await FollowModel.findOne({
                    where: {
                        followerId: req.user.id,
                        followingId: user.id
                    }
                });
                isFollowing = !!followRecord;
            }
            const activeStream = await StreamModel.findOne({
                where: {
                    userId: user.id,
                    isLive: true
                },
                attributes: ['id', 'title', 'viewerCount', 'startedAt']
            });
            res.status(200).json({
                id: user.id,
                username: user.username,
                avatarUrl: user.avatarUrl,
                bio: user.bio,
                isStreamer: user.isStreamer,
                createdAt: user.createdAt,
                followerCount,
                followingCount,
                isFollowing,
                activeStream: activeStream || null
            });
        }
        catch (error) {
            console.error('Get user profile error:', error);
            res.status(500).json({ message: 'Failed to fetch user profile' });
        }
    },
    updateProfile: async (req, res) => {
        try {
            if (!req.user) {
                res.status(401).json({ message: 'Authentication required' });
                return;
            }
            const { bio, avatarUrl } = req.body;
            const user = await UserModel.findByPk(req.user.id);
            if (!user) {
                res.status(404).json({ message: 'User not found' });
                return;
            }
            if (bio !== undefined)
                user.bio = bio;
            if (avatarUrl !== undefined)
                user.avatarUrl = avatarUrl;
            await user.save();
            res.status(200).json({
                id: user.id,
                username: user.username,
                email: user.email,
                avatarUrl: user.avatarUrl,
                bio: user.bio,
                isStreamer: user.isStreamer
            });
        }
        catch (error) {
            console.error('Update profile error:', error);
            res.status(500).json({ message: 'Failed to update profile' });
        }
    },
    upgradeToStreamer: async (req, res) => {
        try {
            if (!req.user) {
                res.status(401).json({ message: 'Authentication required' });
                return;
            }
            const user = await UserModel.findByPk(req.user.id);
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
            await user.save();
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
    },
    followUser: async (req, res) => {
        try {
            if (!req.user) {
                res.status(401).json({ message: 'Authentication required' });
                return;
            }
            const { username } = req.params;
            const userToFollow = await UserModel.findOne({
                where: { username }
            });
            if (!userToFollow) {
                res.status(404).json({ message: 'User not found' });
                return;
            }
            const existingFollow = await FollowModel.findOne({
                where: {
                    followerId: req.user.id,
                    followingId: userToFollow.id
                }
            });
            if (existingFollow) {
                res.status(400).json({ message: 'Already following this user' });
                return;
            }
            await FollowModel.create({
                followerId: req.user.id,
                followingId: userToFollow.id
            });
            res.status(200).json({
                message: `Now following ${userToFollow.username}`,
                following: true
            });
        }
        catch (error) {
            console.error('Follow user error:', error);
            res.status(500).json({ message: 'Failed to follow user' });
        }
    },
    unfollowUser: async (req, res) => {
        try {
            if (!req.user) {
                res.status(401).json({ message: 'Authentication required' });
                return;
            }
            const { username } = req.params;
            const userToUnfollow = await UserModel.findOne({
                where: { username }
            });
            if (!userToUnfollow) {
                res.status(404).json({ message: 'User not found' });
                return;
            }
            const deleted = await FollowModel.destroy({
                where: {
                    followerId: req.user.id,
                    followingId: userToUnfollow.id
                }
            });
            if (deleted === 0) {
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
    },
    getFollowing: async (req, res) => {
        try {
            if (!req.user) {
                res.status(401).json({ message: 'Authentication required' });
                return;
            }
            const follows = await FollowModel.findAll({
                where: { followerId: req.user.id },
                include: [{
                        model: models_1.User,
                        as: 'following',
                        attributes: ['id', 'username', 'avatarUrl', 'isStreamer']
                    }]
            });
            const following = follows.map((follow) => follow.get({ plain: true }).following);
            res.status(200).json(following);
        }
        catch (error) {
            console.error('Get following error:', error);
            res.status(500).json({ message: 'Failed to fetch following users' });
        }
    }
};
//# sourceMappingURL=userController.js.map