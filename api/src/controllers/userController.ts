import { Request, Response } from 'express';
import { User, Follow, Stream } from '../models';
import sequelize from '../config/database';

// Type assertions for models
const UserModel = User as any;
const FollowModel = Follow as any;
const StreamModel = Stream as any;

export default {
  // Get user profile by username
  getUserProfile: async (req: Request, res: Response): Promise<void> => {
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
      
      // Get follower count
      const followerCount = await FollowModel.count({
        where: { followingId: user.id }
      });
      
      // Get following count
      const followingCount = await FollowModel.count({
        where: { followerId: user.id }
      });
      
      // Check if authenticated user follows this profile
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
      
      // Get active stream if exists
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
    } catch (error) {
      console.error('Get user profile error:', error);
      res.status(500).json({ message: 'Failed to fetch user profile' });
    }
  },
  
  // Update user profile
  updateProfile: async (req: Request, res: Response): Promise<void> => {
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
      
      // Update fields if provided
      if (bio !== undefined) user.bio = bio;
      if (avatarUrl !== undefined) user.avatarUrl = avatarUrl;
      
      await user.save();
      
      res.status(200).json({
        id: user.id,
        username: user.username,
        email: user.email,
        avatarUrl: user.avatarUrl,
        bio: user.bio,
        isStreamer: user.isStreamer
      });
    } catch (error) {
      console.error('Update profile error:', error);
      res.status(500).json({ message: 'Failed to update profile' });
    }
  },
  
  // Upgrade to streamer
  upgradeToStreamer: async (req: Request, res: Response): Promise<void> => {
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
      
      // Upgrade to streamer
      user.isStreamer = true;
      user.streamKey = user.generateStreamKey();
      await user.save();
      
      res.status(200).json({
        id: user.id,
        username: user.username,
        isStreamer: user.isStreamer,
        streamKey: user.streamKey
      });
    } catch (error) {
      console.error('Upgrade to streamer error:', error);
      res.status(500).json({ message: 'Failed to upgrade to streamer' });
    }
  },
  
  // Follow a user
  followUser: async (req: Request, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({ message: 'Authentication required' });
        return;
      }
      
      const { username } = req.params;
      
      // Get the user to follow
      const userToFollow = await UserModel.findOne({
        where: { username }
      });
      
      if (!userToFollow) {
        res.status(404).json({ message: 'User not found' });
        return;
      }
      
      // Check if already following
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
      
      // Create follow relationship
      await FollowModel.create({
        followerId: req.user.id,
        followingId: userToFollow.id
      });
      
      res.status(200).json({
        message: `Now following ${userToFollow.username}`,
        following: true
      });
    } catch (error) {
      console.error('Follow user error:', error);
      res.status(500).json({ message: 'Failed to follow user' });
    }
  },
  
  // Unfollow a user
  unfollowUser: async (req: Request, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({ message: 'Authentication required' });
        return;
      }
      
      const { username } = req.params;
      
      // Get the user to unfollow
      const userToUnfollow = await UserModel.findOne({
        where: { username }
      });
      
      if (!userToUnfollow) {
        res.status(404).json({ message: 'User not found' });
        return;
      }
      
      // Delete follow relationship
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
    } catch (error) {
      console.error('Unfollow user error:', error);
      res.status(500).json({ message: 'Failed to unfollow user' });
    }
  },
  
  // Get users the current user is following
  getFollowing: async (req: Request, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({ message: 'Authentication required' });
        return;
      }
      
      const follows = await FollowModel.findAll({
        where: { followerId: req.user.id },
        include: [{
          model: User,
          as: 'following',
          attributes: ['id', 'username', 'avatarUrl', 'isStreamer']
        }]
      });
      
      // Extract the user objects from follows
      const following = follows.map((follow: any) => follow.get({ plain: true }).following);
      
      res.status(200).json(following);
    } catch (error) {
      console.error('Get following error:', error);
      res.status(500).json({ message: 'Failed to fetch following users' });
    }
  }
}; 