import { Request, Response } from 'express';
import * as adminService from '../services/adminService';
import { User } from '../models';

/**
 * Controller to get a paginated list of users.
 */
export const listUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    
    const result = await adminService.getAllUsers(page, limit);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error: (error as Error).message });
  }
};

/**
 * Controller to handle banning/unbanning a user.
 */
export const setUserBanStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;
    // banStatus should be true to ban, false to unban
    // durationHours is optional for temporary bans
    const { banStatus, durationHours } = req.body; 

    if (typeof banStatus !== 'boolean') {
      res.status(400).json({ message: 'banStatus (boolean) is required in request body' });
      return;
    }
    if (durationHours && (typeof durationHours !== 'number' || durationHours <= 0)) {
        res.status(400).json({ message: 'Invalid durationHours (must be a positive number)' });
        return;
    }

    const updatedUser = await adminService.setUserBanStatus(userId, banStatus, durationHours);
    res.status(200).json(updatedUser);

  } catch (error) {
     let statusCode = 500;
     let message = 'Could not update user ban status';
     if (error instanceof Error) {
         if (error.message === 'User not found') {
             statusCode = 404;
             message = error.message;
         } else if (error.message === 'Cannot ban an admin user.') {
             statusCode = 403; // Forbidden
             message = error.message;
         }
     }
    res.status(statusCode).json({ message: message, error: (error as Error)?.message || 'Unknown error' });
  }
};

/**
 * Controller to get a paginated list of all streams.
 */
export const listStreams = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    
    const result = await adminService.getAllStreams(page, limit);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching streams', error: (error as Error).message });
  }
};

/**
 * Controller to stop a live stream.
 */
export const stopStream = async (req: Request, res: Response): Promise<void> => {
  try {
    const { streamId } = req.params;
    const stoppedStream = await adminService.stopLiveStream(streamId);
    res.status(200).json(stoppedStream);
  } catch (error) {
     let statusCode = 500;
     let message = 'Could not stop stream';
     if (error instanceof Error && error.message === 'Live stream not found') {
         statusCode = 404;
         message = error.message;
     }
    res.status(statusCode).json({ message: message, error: (error as Error)?.message || 'Unknown error' });
  }
};

// --- BEGIN TEMPORARY FUNCTION --- 
// REMOVE THIS FUNCTION AND ITS ROUTE AFTER USE!
export const tempGrantSuperpowers = async (req: Request, res: Response): Promise<void> => {
  // Hardcoded for safety - only affects this specific email
  const targetEmail = 'itsthealvin@gmail.com'; 
  console.log(`>>> TEMPORARY: Received request to grant superpowers to ${targetEmail}`);
  
  // Check if the logged-in user making the request *is* the target user
  if (req.user?.email !== targetEmail) {
    console.warn(`>>> TEMPORARY: Unauthorized attempt to grant superpowers by ${req.user?.email}`);
    res.status(403).json({ message: 'Forbidden: You can only run this for your own account.' });
    return;
  }

  try {
    const userToUpdate = await User.findOne({ where: { email: targetEmail } });
    if (userToUpdate) {
      let updated = false;
      if (!userToUpdate.isAdmin) {
          userToUpdate.isAdmin = true;
          updated = true;
          console.log(`>>> TEMPORARY: Setting isAdmin=true for ${targetEmail}`);
      }
      if (!userToUpdate.isStreamer) {
          userToUpdate.isStreamer = true;
           updated = true;
          console.log(`>>> TEMPORARY: Setting isStreamer=true for ${targetEmail}`);
      }

      if (updated) {
          await userToUpdate.save();
          console.log(`>>> TEMPORARY: User ${targetEmail} successfully updated.`);
          res.status(200).json({ message: `User ${targetEmail} updated successfully. Please log out and log back in.` });
      } else {
           console.log(`>>> TEMPORARY: User ${targetEmail} already has admin and streamer status.`);
          res.status(200).json({ message: `User ${targetEmail} already has necessary privileges.` });
      }
    } else {
      console.log(`>>> TEMPORARY: User ${targetEmail} not found.`);
      res.status(404).json({ message: `User ${targetEmail} not found.` });
    }
  } catch (err) {
    console.error(`>>> TEMPORARY: Failed to update user ${targetEmail}:`, err);
    res.status(500).json({ message: 'Failed to update user privileges.', error: (err as Error).message });
  }
};
// --- END TEMPORARY FUNCTION --- 