import { Request, Response } from 'express';
import { UserModel } from '../models/UserModel';
import { StreamModel, findByUser } from '../models/StreamModel';
import { getTotalDonationsForUser } from '../models/DonationModel';
import { asyncHandler } from '../middleware/errorHandler';
import { ApiError } from '../middleware/errorHandler';
import { logger } from '../config/logger';

// Get user profile by ID
export const getUserProfile = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { userId } = req.params;

  const user = await UserModel.findOne({
    where: { id: userId },
    select: ['id', 'username', 'displayName', 'bio', 'avatarUrl', 'isStreamer', 'followers', 'following', 'createdAt']
  });

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  // Get user's past streams
  const streams = await findByUser(userId);

  // Get total donations received
  const totalDonations = await getTotalDonationsForUser(userId);

  res.status(200).json({
    ...user,
    streams: streams.map(stream => ({
      id: stream.id,
      title: stream.title,
      thumbnailUrl: stream.thumbnailUrl,
      isLive: stream.isLive,
      startedAt: stream.startedAt,
      endedAt: stream.endedAt,
      viewerCount: stream.viewerCount,
      totalViewers: stream.totalViewers
    })),
    totalDonations
  });
});

// Update user profile
export const updateUserProfile = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const userId = req.user.id;
  const { displayName, bio, avatarUrl } = req.body;

  const user = await UserModel.findOne({ where: { id: userId } });

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  // Update fields
  if (displayName) user.displayName = displayName;
  if (bio !== undefined) user.bio = bio;
  if (avatarUrl) user.avatarUrl = avatarUrl;

  await user.save();

  logger.info(`User profile updated: ${userId}`);

  res.status(200).json({
    id: user.id,
    username: user.username,
    displayName: user.displayName,
    bio: user.bio,
    avatarUrl: user.avatarUrl,
    isStreamer: user.isStreamer,
    followers: user.followers,
    following: user.following
  });
});

// Become a streamer
export const becomeStreamer = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const userId = req.user.id;

  const user = await UserModel.findOne({ where: { id: userId } });

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  if (user.isStreamer) {
    throw new ApiError(400, 'User is already a streamer');
  }

  user.isStreamer = true;
  await user.save();

  logger.info(`User became a streamer: ${userId}`);

  res.status(200).json({
    id: user.id,
    username: user.username,
    isStreamer: user.isStreamer
  });
});

// Follow a user
export const followUser = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const followerId = req.user.id;
  const { userId } = req.params;

  // Check if trying to follow self
  if (followerId === userId) {
    throw new ApiError(400, 'Cannot follow yourself');
  }

  // Check if user to follow exists
  const userToFollow = await UserModel.findOne({ where: { id: userId } });
  if (!userToFollow) {
    throw new ApiError(404, 'User to follow not found');
  }

  // Check if already following (would need a separate table for proper implementation)
  // For now, just increment the counters

  // Update follower count for the user being followed
  userToFollow.followers += 1;
  await userToFollow.save();

  // Update following count for the current user
  const follower = await UserModel.findOne({ where: { id: followerId } });
  if (follower) {
    follower.following += 1;
    await follower.save();
  }

  logger.info(`User ${followerId} followed user ${userId}`);

  res.status(200).json({
    message: 'Successfully followed user',
    followingId: userId
  });
});

// Search users
export const searchUsers = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { query } = req.query;
  
  if (!query || typeof query !== 'string') {
    throw new ApiError(400, 'Search query is required');
  }

  const users = await UserModel.createQueryBuilder('user')
    .where('user.username ILIKE :query OR user.displayName ILIKE :query', { query: `%${query}%` })
    .select(['user.id', 'user.username', 'user.displayName', 'user.avatarUrl', 'user.isStreamer', 'user.followers'])
    .limit(20)
    .getMany();

  res.status(200).json(users);
});
