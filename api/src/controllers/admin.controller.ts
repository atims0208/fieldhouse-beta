import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { User } from '../models/User';
import { Stream } from '../models/Stream';
import { ILike } from 'typeorm';

export class AdminController {
  // Get all users with pagination
  async getUsers(req: Request, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const search = req.query.search as string || '';
      const skip = (page - 1) * limit;

      const userRepository = AppDataSource.getRepository(User);
      const [users, total] = await userRepository.findAndCount({
        where: [
          { username: ILike(`%${search}%`) },
          { email: ILike(`%${search}%`) }
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
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ error: 'Failed to fetch users' });
    }
  }

  // Get all streams with pagination
  async getStreams(req: Request, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const search = req.query.search as string || '';
      const skip = (page - 1) * limit;

      const streamRepository = AppDataSource.getRepository(Stream);
      const [streams, total] = await streamRepository.findAndCount({
        where: [
          { title: ILike(`%${search}%`) },
          { description: ILike(`%${search}%`) }
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
    } catch (error) {
      console.error('Error fetching streams:', error);
      res.status(500).json({ error: 'Failed to fetch streams' });
    }
  }

  // Ban a user
  async banUser(req: Request, res: Response): Promise<void> {
    try {
      const { userId, duration } = req.body;
      const userRepository = AppDataSource.getRepository(User);
      
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
    } catch (error) {
      console.error('Error banning user:', error);
      res.status(500).json({ error: 'Failed to ban user' });
    }
  }

  // Unban a user
  async unbanUser(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;
      const userRepository = AppDataSource.getRepository(User);
      
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
    } catch (error) {
      console.error('Error unbanning user:', error);
      res.status(500).json({ error: 'Failed to unban user' });
    }
  }

  // Delete a stream
  async deleteStream(req: Request, res: Response): Promise<void> {
    try {
      const { streamId } = req.params;
      const streamRepository = AppDataSource.getRepository(Stream);
      
      const stream = await streamRepository.findOne({ where: { id: streamId } });
      if (!stream) {
        res.status(404).json({ error: 'Stream not found' });
        return;
      }

      await streamRepository.remove(stream);
      res.json({ message: 'Stream deleted successfully' });
    } catch (error) {
      console.error('Error deleting stream:', error);
      res.status(500).json({ error: 'Failed to delete stream' });
    }
  }

  // Update user admin status
  async updateUserAdminStatus(req: Request, res: Response): Promise<void> {
    try {
      const { targetEmail } = req.body;
      const userRepository = AppDataSource.getRepository(User);
      
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
    } catch (error) {
      console.error('Error updating user admin status:', error);
      res.status(500).json({ error: 'Failed to update user admin status' });
    }
  }
}

export default new AdminController(); 