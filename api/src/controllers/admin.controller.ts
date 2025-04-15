import { Request, Response } from 'express';
import { User } from '../models/User';
import { Stream } from '../models/Stream';
import { Op } from 'sequelize';

export class AdminController {
  // Get all users with pagination
  static async getAllUsers(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const offset = (page - 1) * limit;

      const users = await User.findAndCountAll({
        limit,
        offset,
        order: [['createdAt', 'DESC']],
        attributes: { exclude: ['password'] }
      });

      res.json({
        users: users.rows,
        total: users.count,
        currentPage: page,
        totalPages: Math.ceil(users.count / limit)
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch users' });
    }
  }

  // Update user status (ban/unban, streamer privileges)
  static async updateUserStatus(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const { isStreamer, isBanned, bannedUntil } = req.body;

      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      await user.update({
        isStreamer: isStreamer !== undefined ? isStreamer : user.isStreamer,
        isBanned: isBanned !== undefined ? isBanned : user.isBanned,
        bannedUntil: bannedUntil || null,
        streamKey: isStreamer ? user.generateStreamKey() : null
      });

      res.json({ message: 'User status updated successfully', user });
    } catch (error) {
      res.status(500).json({ error: 'Failed to update user status' });
    }
  }

  // Get all active streams
  static async getActiveStreams(req: Request, res: Response) {
    try {
      const streams = await Stream.findAll({
        where: { isLive: true },
        include: [{
          model: User,
          attributes: ['id', 'username', 'avatarUrl']
        }]
      });

      res.json(streams);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch active streams' });
    }
  }

  // End a stream
  static async endStream(req: Request, res: Response) {
    try {
      const { streamId } = req.params;
      
      const stream = await Stream.findByPk(streamId);
      if (!stream) {
        return res.status(404).json({ error: 'Stream not found' });
      }

      await stream.update({
        isLive: false,
        endedAt: new Date()
      });

      res.json({ message: 'Stream ended successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to end stream' });
    }
  }

  // Get streaming requests
  static async getStreamerRequests(req: Request, res: Response) {
    try {
      const requests = await User.findAll({
        where: {
          isStreamer: false,
          idDocumentUrl: { [Op.not]: null }
        },
        attributes: ['id', 'username', 'email', 'idDocumentUrl', 'createdAt']
      });

      res.json(requests);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch streamer requests' });
    }
  }

  // Approve/reject streamer request
  static async handleStreamerRequest(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const { approved } = req.body;

      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      if (approved) {
        await user.update({
          isStreamer: true,
          streamKey: user.generateStreamKey()
        });
      }

      res.json({
        message: approved ? 'Streamer request approved' : 'Streamer request rejected',
        user
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to handle streamer request' });
    }
  }

  // Get system statistics
  static async getStatistics(req: Request, res: Response) {
    try {
      const totalUsers = await User.count();
      const totalStreamers = await User.count({ where: { isStreamer: true } });
      const activeStreams = await Stream.count({ where: { isLive: true } });
      const bannedUsers = await User.count({ where: { isBanned: true } });

      res.json({
        totalUsers,
        totalStreamers,
        activeStreams,
        bannedUsers
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch statistics' });
    }
  }
} 