import { User, Stream } from '../models';
import { Op } from 'sequelize';

/**
 * Fetches all users (excluding admins themselves perhaps, based on requirements).
 * Includes pagination and potential filtering.
 */
export const getAllUsers = async (page: number = 1, limit: number = 20) => {
  const offset = (page - 1) * limit;
  try {
    const { count, rows } = await User.findAndCountAll({
      // Exclude sensitive info like password, streamKey
      attributes: {
         exclude: ['password', 'streamKey'] 
      },
      // Optional: Exclude admins from the list
      // where: {
      //   isAdmin: false
      // },
      limit,
      offset,
      order: [['createdAt', 'DESC']]
    });
    return { users: rows, totalUsers: count, currentPage: page, totalPages: Math.ceil(count / limit) };
  } catch (error) {
    console.error('Error fetching users:', error);
    throw new Error('Could not fetch users');
  }
};

/**
 * Bans or unbans a user.
 * @param userId ID of the user to update.
 * @param ban `true` to ban, `false` to unban.
 * @param durationHours Optional duration in hours for temporary bans.
 */
export const setUserBanStatus = async (userId: string, ban: boolean, durationHours?: number) => {
  try {
    const user = await User.findByPk(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Prevent banning admins?
    if (user.isAdmin) {
        throw new Error('Cannot ban an admin user.');
    }

    user.isBanned = ban;
    if (ban && durationHours && durationHours > 0) {
      const banEndDate = new Date();
      banEndDate.setHours(banEndDate.getHours() + durationHours);
      user.bannedUntil = banEndDate;
    } else {
      user.bannedUntil = null; // Clear duration for unban or permanent ban
    }
    await user.save();
    return user;
  } catch (error) {
    console.error('Error updating user ban status:', error);
    if (error instanceof Error) throw error;
    throw new Error('Could not update user ban status');
  }
};

/**
 * Fetches all streams (live and past) for admin overview.
 */
export const getAllStreams = async (page: number = 1, limit: number = 20) => {
  const offset = (page - 1) * limit;
  try {
    const { count, rows } = await Stream.findAndCountAll({
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'username', 'avatarUrl'] // Include user info
      }],
      limit,
      offset,
      order: [['createdAt', 'DESC']] // Order by creation date
    });
    return { streams: rows, totalStreams: count, currentPage: page, totalPages: Math.ceil(count / limit) };
  } catch (error) {
    console.error('Error fetching streams:', error);
    throw new Error('Could not fetch streams');
  }
};

/**
 * Stops a live stream (marks it as not live in the database).
 * @param streamId ID of the stream to stop.
 */
export const stopLiveStream = async (streamId: string) => {
  try {
    const stream = await Stream.findOne({ where: { id: streamId, isLive: true } });
    if (!stream) {
      throw new Error('Live stream not found');
    }
    stream.isLive = false;
    stream.endedAt = new Date();
    await stream.save();
    // NOTE: This does NOT necessarily stop the ingest to Bunny.net
    // True stream termination would require Bunny API interaction if possible,
    // or rely on the streamer stopping their software.
    return stream;
  } catch (error) {
    console.error('Error stopping stream:', error);
     if (error instanceof Error) throw error;
    throw new Error('Could not stop stream');
  }
};

/**
 * TODO: Implement ban/unban logic
 * This would likely involve adding an `isBanned` flag to the User model
 * and updating it here.
 */
// export const updateUserBanStatus = async (userId: string, isBanned: boolean) => { ... }; 