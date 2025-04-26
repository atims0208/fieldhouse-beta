import { AppDataSource } from '../config/database';
import { User } from '../models/User';
import { Stream, StreamStatus } from '../models/Stream';
import { ILike } from 'typeorm';

/**
 * Fetches all users (excluding admins themselves perhaps, based on requirements).
 * Includes pagination and potential filtering.
 */
export const getAllUsers = async (page: number = 1, limit: number = 20) => {
  const userRepository = AppDataSource.getRepository(User);
  const skip = (page - 1) * limit;

  const [users, total] = await userRepository.findAndCount({
    // Exclude sensitive info like password, streamKey
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
    where: {
      // Optional: Exclude admins from the list
      // isAdmin: false
    },
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

/**
 * Bans or unbans a user.
 * @param userId ID of the user to update.
 * @param ban `true` to ban, `false` to unban.
 * @param durationHours Optional duration in hours for temporary bans.
 */
export const setUserBanStatus = async (userId: string, ban: boolean, durationHours?: number) => {
  const userRepository = AppDataSource.getRepository(User);
  const user = await userRepository.findOneBy({ id: userId });

  if (!user) {
    throw new Error('User not found');
  }

  // Prevent banning admins?
  if (user.isAdmin) {
    throw new Error('Cannot ban an admin user.');
  }

  const bannedUntil = ban && durationHours && durationHours > 0 ? new Date(Date.now() + durationHours * 24 * 60 * 60 * 1000) : undefined;
  
  user.isBanned = ban;
  user.bannedUntil = bannedUntil;
  await userRepository.save(user);

  return user;
};

/**
 * Fetches all streams (live and past) for admin overview.
 */
export const getAllStreams = async (page: number = 1, limit: number = 20) => {
  const streamRepository = AppDataSource.getRepository(Stream);
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

/**
 * Stops a live stream (marks it as not live in the database).
 * @param streamId ID of the stream to stop.
 */
export const stopLiveStream = async (streamId: string) => {
  const streamRepository = AppDataSource.getRepository(Stream);
  const stream = await streamRepository.findOne({
    where: { id: streamId, status: StreamStatus.LIVE }
  });

  if (!stream) {
    throw new Error('Active stream not found');
  }

  stream.status = StreamStatus.ENDED;
  stream.endedAt = new Date();
  await streamRepository.save(stream);
  // NOTE: This does NOT necessarily stop the ingest to Bunny.net
  // True stream termination would require Bunny API interaction if possible,
  // or rely on the streamer stopping their software.

  return stream;
};

/**
 * TODO: Implement ban/unban logic
 * This would likely involve adding an `isBanned` flag to the User model
 * and updating it here.
 */
// export const updateUserBanStatus = async (userId: string, isBanned: boolean) => { ... }; 

export class AdminService {
  async getUsers(page: number, limit: number, search?: string) {
    const userRepository = AppDataSource.getRepository(User);
    const skip = (page - 1) * limit;

    const [users, total] = await userRepository.findAndCount({
      where: search ? [
        { username: ILike(`%${search}%`) },
        { email: ILike(`%${search}%`) }
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

  async banUser(userId: string, duration?: number) {
    const userRepository = AppDataSource.getRepository(User);
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

  async unbanUser(userId: string) {
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOneBy({ id: userId });

    if (!user) {
      throw new Error('User not found');
    }

    user.isBanned = false;
    user.bannedUntil = null;
    await userRepository.save(user);

    return user;
  }

  async getStreams(page: number, limit: number, search?: string) {
    const streamRepository = AppDataSource.getRepository(Stream);
    const skip = (page - 1) * limit;

    const [streams, total] = await streamRepository.findAndCount({
      where: search ? [
        { title: ILike(`%${search}%`) },
        { description: ILike(`%${search}%`) }
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

  async stopStream(streamId: string) {
    const streamRepository = AppDataSource.getRepository(Stream);
    const stream = await streamRepository.findOne({
      where: { id: streamId, status: StreamStatus.LIVE }
    });

    if (!stream) {
      throw new Error('Active stream not found');
    }

    stream.status = StreamStatus.ENDED;
    stream.endedAt = new Date();
    await streamRepository.save(stream);

    return stream;
  }
} 