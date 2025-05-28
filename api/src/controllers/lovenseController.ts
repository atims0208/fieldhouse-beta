/**
 * Lovense API controller for the Fieldhouse application
 */

import { Request, Response } from 'express';
import { logger } from '../config/logger';
import * as lovenseService from '../services/lovenseService';

/**
 * Get a QR code for toy connection
 * @route GET /api/lovense/qrcode
 */
export const getQRCode = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    
    if (!userId) {
      res.status(401).json({ 
        success: false, 
        message: 'Authentication required' 
      });
      return;
    }
    
    const qrCodeUrl = await lovenseService.getToyConnectionQRCode(userId);
    
    if (!qrCodeUrl) {
      res.status(500).json({ 
        success: false, 
        message: 'Failed to generate QR code' 
      });
      return;
    }
    
    res.status(200).json({
      success: true,
      data: { qrCodeUrl }
    });
    return;
  } catch (error) {
    logger.error('Error generating Lovense QR code', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
    return;
  }
};

/**
 * Register a toy connection
 * @route POST /api/lovense/register
 */
export const registerToy = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    
    if (!userId) {
      res.status(401).json({ 
        success: false, 
        message: 'Authentication required' 
      });
      return;
    }
    
    const { toyId, toyType, nickname } = req.body;
    
    if (!toyId || !toyType) {
      res.status(400).json({ 
        success: false, 
        message: 'Toy ID and type are required' 
      });
      return;
    }
    
    const success = lovenseService.registerToyConnection(
      userId,
      toyId,
      toyType,
      nickname || 'My Toy'
    );
    
    if (!success) {
      res.status(500).json({ 
        success: false, 
        message: 'Failed to register toy' 
      });
      return;
    }
    
    res.status(200).json({
      success: true,
      message: 'Toy registered successfully'
    });
    return;
  } catch (error) {
    logger.error('Error registering Lovense toy', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
    return;
  }
};

/**
 * Get all toy connections for a user
 * @route GET /api/lovense/toys
 */
export const getUserToys = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    
    if (!userId) {
      res.status(401).json({ 
        success: false, 
        message: 'Authentication required' 
      });
      return;
    }
    
    const toys = lovenseService.getUserToyConnections(userId);
    
    res.status(200).json({
      success: true,
      data: { toys }
    });
    return;
  } catch (error) {
    logger.error('Error getting user toy connections', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
    return;
  }
};

/**
 * Send a command to a toy
 * @route POST /api/lovense/command
 */
export const sendCommand = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    
    if (!userId) {
      res.status(401).json({ 
        success: false, 
        message: 'Authentication required' 
      });
      return;
    }
    
    const { toyId, command, intensity, duration } = req.body;
    
    if (!toyId || !command || intensity === undefined) {
      res.status(400).json({ 
        success: false, 
        message: 'Toy ID, command, and intensity are required' 
      });
      return;
    }
    
    const success = await lovenseService.sendToyCommand(
      userId,
      toyId,
      command,
      intensity,
      duration || 0
    );
    
    if (!success) {
      res.status(500).json({ 
        success: false, 
        message: 'Failed to send command to toy' 
      });
      return;
    }
    
    res.status(200).json({
      success: true,
      message: 'Command sent successfully'
    });
    return;
  } catch (error) {
    logger.error('Error sending command to Lovense toy', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
    return;
  }
};

/**
 * Stop all toy actions
 * @route POST /api/lovense/stop
 */
export const stopToy = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    
    if (!userId) {
      res.status(401).json({ 
        success: false, 
        message: 'Authentication required' 
      });
      return;
    }
    
    const { toyId } = req.body;
    
    const success = await lovenseService.stopToy(userId, toyId);
    
    if (!success) {
      res.status(500).json({ 
        success: false, 
        message: 'Failed to stop toy' 
      });
      return;
    }
    
    res.status(200).json({
      success: true,
      message: 'Toy stopped successfully'
    });
    return;
  } catch (error) {
    logger.error('Error stopping Lovense toy', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
    return;
  }
};

/**
 * Disconnect a toy
 * @route DELETE /api/lovense/disconnect
 */
export const disconnectToy = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    
    if (!userId) {
      res.status(401).json({ 
        success: false, 
        message: 'Authentication required' 
      });
      return;
    }
    
    const { toyId } = req.body;
    
    if (!toyId) {
      res.status(400).json({ 
        success: false, 
        message: 'Toy ID is required' 
      });
      return;
    }
    
    const success = lovenseService.disconnectToy(userId, toyId);
    
    if (!success) {
      res.status(500).json({ 
        success: false, 
        message: 'Failed to disconnect toy' 
      });
      return;
    }
    
    res.status(200).json({
      success: true,
      message: 'Toy disconnected successfully'
    });
    return;
  } catch (error) {
    logger.error('Error disconnecting Lovense toy', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
    return;
  }
};

/**
 * Send a vibration pattern to a toy
 * @route POST /api/lovense/pattern
 */
export const sendPattern = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    
    if (!userId) {
      res.status(401).json({ 
        success: false, 
        message: 'Authentication required' 
      });
      return;
    }
    
    const { toyId, pattern, loopCount } = req.body;
    
    if (!toyId || !pattern) {
      res.status(400).json({ 
        success: false, 
        message: 'Toy ID and pattern are required' 
      });
      return;
    }
    
    const success = await lovenseService.sendVibrationPattern(
      userId,
      toyId,
      pattern,
      loopCount || 0
    );
    
    if (!success) {
      res.status(500).json({ 
        success: false, 
        message: 'Failed to send pattern to toy' 
      });
      return;
    }
    
    res.status(200).json({
      success: true,
      message: 'Pattern sent successfully'
    });
    return;
  } catch (error) {
    logger.error('Error sending pattern to Lovense toy', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
    return;
  }
};

/**
 * Webhook for toy connection callback
 * @route POST /api/lovense/webhook
 */
export const toyWebhook = async (req: Request, res: Response) => {
  try {
    // This would handle callbacks from the Lovense API
    // For example, when a toy connects or disconnects
    logger.info('Received Lovense webhook', req.body);
    
    // Process webhook data
    // ...
    
    res.status(200).json({
      success: true,
      message: 'Webhook received'
    });
    return;
  } catch (error) {
    logger.error('Error processing Lovense webhook', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
    return;
  }
};
