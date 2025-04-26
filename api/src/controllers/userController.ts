import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { User } from '../models/User';
import { Follow } from '../models/Follow';
import { v4 as uuidv4 } from 'uuid';

export class UserController {
  // Get user profile
  async getProfile(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user?.id) {
        res.status(401).json({ error: 'Not authenticated' });
        return;
      }

      const userRepository = AppDataSource.getRepository(User);
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
    } catch (error) {
      console.error('Error getting user profile:', error);
      res.status(500).json({ error: 'Failed to get user profile' });
    }
  }

  // Update user profile
  async updateProfile(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user?.id) {
        res.status(401).json({ error: 'Not authenticated' });
        return;
      }

      const { username, email, avatarUrl } = req.body;
      const userRepository = AppDataSource.getRepository(User);
      const user = await userRepository.findOne({ where: { id: req.user.id } });

      if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
      }

      // Update fields if provided
      if (username) user.username = username;
      if (email) user.email = email;
      if (avatarUrl) user.avatarUrl = avatarUrl;

      await userRepository.save(user);

      res.json({
        id: user.id,
        username: user.username,
        email: user.email,
        isStreamer: user.isStreamer,
        isAdmin: user.isAdmin,
        avatarUrl: user.avatarUrl
      });
    } catch (error) {
      console.error('Error updating user profile:', error);
      res.status(500).json({ error: 'Failed to update user profile' });
    }
  }

  // Upgrade to streamer
  async upgradeToStreamer(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user?.id) {
        res.status(401).json({ error: 'Not authenticated' });
        return;
      }

      const userRepository = AppDataSource.getRepository(User);
      const user = await userRepository.findOne({ where: { id: req.user.id } });

      if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
      }

      if (user.isStreamer) {
        res.status(400).json({ error: 'User is already a streamer' });
        return;
      }

      user.isStreamer = true;
      user.streamKey = uuidv4();
      await userRepository.save(user);

      res.json({
        id: user.id,
        username: user.username,
        isStreamer: user.isStreamer,
        streamKey: user.streamKey
      });
    } catch (error) {
      console.error('Error upgrading to streamer:', error);
      res.status(500).json({ error: 'Failed to upgrade to streamer' });
    }
  }

  // Follow a user
  async followUser(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user?.id) {
        res.status(401).json({ error: 'Not authenticated' });
        return;
      }

      const { username } = req.params;
      const userRepository = AppDataSource.getRepository(User);
      const followRepository = AppDataSource.getRepository(Follow);

      const userToFollow = await userRepository.findOne({ where: { username } });

      if (!userToFollow) {
        res.status(404).json({ error: 'User not found' });
        return;
      }

      if (userToFollow.id === req.user.id) {
        res.status(400).json({ error: 'Cannot follow yourself' });
        return;
      }

      const existingFollow = await followRepository.findOne({
        where: {
          followerId: req.user.id,
          followingId: userToFollow.id
        }
      });

      if (existingFollow) {
        res.status(400).json({ error: 'Already following this user' });
        return;
      }

      const follow = followRepository.create({
        followerId: req.user.id,
        followingId: userToFollow.id
      });

      await followRepository.save(follow);

      res.json({
        message: `Now following ${username}`,
        following: {
          id: userToFollow.id,
          username: userToFollow.username
        }
      });
    } catch (error) {
      console.error('Error following user:', error);
      res.status(500).json({ error: 'Failed to follow user' });
    }
  }

  // Unfollow a user
  async unfollowUser(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user?.id) {
        res.status(401).json({ error: 'Not authenticated' });
        return;
      }

      const { username } = req.params;
      const userRepository = AppDataSource.getRepository(User);
      const followRepository = AppDataSource.getRepository(Follow);

      const userToUnfollow = await userRepository.findOne({ where: { username } });

      if (!userToUnfollow) {
        res.status(404).json({ error: 'User not found' });
        return;
      }

      const result = await followRepository.delete({
        followerId: req.user.id,
        followingId: userToUnfollow.id
      });

      if (result.affected === 0) {
        res.status(400).json({ error: 'Not following this user' });
        return;
      }

      res.json({
        message: `Unfollowed ${username}`
      });
    } catch (error) {
      console.error('Error unfollowing user:', error);
      res.status(500).json({ error: 'Failed to unfollow user' });
    }
  }

  // Get users the current user is following
  async getFollowing(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ message: 'Authentication required' });
        return;
      }
      
      const userRepository = AppDataSource.getRepository(User);
      const follows = await AppDataSource.getRepository(Follow).find({
        where: { followerId: req.user.id },
        relations: ['following']
      });
      
      // Extract the user objects from follows
      const following = follows.map((follow: any) => follow.following);
      
      res.status(200).json(following);
    } catch (error) {
      console.error('Get following error:', error);
      res.status(500).json({ message: 'Failed to fetch following users' });
    }
  }
} 