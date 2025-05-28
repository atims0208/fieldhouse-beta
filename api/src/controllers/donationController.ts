import { Request, Response } from 'express';
import { DonationModel, findByStream } from '../models/DonationModel';
import { UserModel } from '../models/UserModel';
import { StreamModel } from '../models/StreamModel';
import { asyncHandler } from '../middleware/errorHandler';
import { ApiError } from '../middleware/errorHandler';
import { logger } from '../config/logger';

// Create a new donation
export const createDonation = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { receiverId, streamId, amount, message } = req.body;
  const senderId = req.user.id;

  // Validate amount
  if (!amount || amount <= 0) {
    throw new ApiError(400, 'Invalid donation amount');
  }

  // Check if sender has enough coins
  const sender = await UserModel.findOne({ where: { id: senderId } });
  if (!sender) {
    throw new ApiError(404, 'Sender not found');
  }

  if (sender.coins < amount) {
    throw new ApiError(400, 'Insufficient coins');
  }

  // Check if receiver exists
  const receiver = await UserModel.findOne({ where: { id: receiverId } });
  if (!receiver) {
    throw new ApiError(404, 'Receiver not found');
  }

  // Check if stream exists if streamId is provided
  if (streamId) {
    const stream = await StreamModel.findOne({ 
      where: { 
        id: streamId,
        isLive: true
      } 
    });
    
    if (!stream) {
      throw new ApiError(404, 'Active stream not found');
    }
  }

  // Create donation
  const donation = new DonationModel();
  donation.senderId = senderId;
  donation.receiverId = receiverId;
  donation.streamId = streamId || null;
  donation.amount = amount;
  donation.message = message || '';

  // Update sender's coins
  sender.coins -= amount;
  await sender.save();

  // Update receiver's coins
  receiver.coins += amount;
  await receiver.save();

  // Save donation
  await donation.save();

  logger.info(`Donation created: ${amount} coins from ${senderId} to ${receiverId}`);

  res.status(201).json({
    id: donation.id,
    amount: donation.amount,
    message: donation.message,
    senderId: donation.senderId,
    receiverId: donation.receiverId,
    streamId: donation.streamId,
    createdAt: donation.createdAt
  });
});

// Get donations for a stream
export const getStreamDonations = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { streamId } = req.params;

  // Check if stream exists
  const stream = await StreamModel.findOne({ where: { id: streamId } });
  if (!stream) {
    throw new ApiError(404, 'Stream not found');
  }

  // Get donations
  const donations = await findByStream(streamId);

  res.status(200).json(donations);
});

// Get user's received donations
export const getUserReceivedDonations = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { userId } = req.params;

  // Check if user exists
  const user = await UserModel.findOne({ where: { id: userId } });
  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  // Get donations
  const donations = await DonationModel.find({
    where: { receiverId: userId },
    relations: ['sender', 'stream'],
    order: { createdAt: 'DESC' }
  });

  res.status(200).json(donations);
});

// Get user's sent donations
export const getUserSentDonations = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const userId = req.user.id;

  // Get donations
  const donations = await DonationModel.find({
    where: { senderId: userId },
    relations: ['receiver', 'stream'],
    order: { createdAt: 'DESC' }
  });

  res.status(200).json(donations);
});

// Purchase coins
export const purchaseCoins = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { amount } = req.body;
  const userId = req.user.id;

  // Validate amount
  if (!amount || amount <= 0) {
    throw new ApiError(400, 'Invalid coin amount');
  }

  // In a real application, this would integrate with a payment processor
  // For now, we'll just add the coins to the user's account

  // Get user
  const user = await UserModel.findOne({ where: { id: userId } });
  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  // Update user's coins
  user.coins += amount;
  await user.save();

  logger.info(`User ${userId} purchased ${amount} coins`);

  res.status(200).json({
    id: user.id,
    coins: user.coins,
    purchased: amount
  });
});
