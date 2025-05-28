/**
 * Lovense API integration service for the Fieldhouse application
 * Documentation: https://developer.lovense.com/
 */

import axios from 'axios';
import crypto from 'crypto';
import { logger } from '../config/logger';

// Lovense API configuration
const LOVENSE_API_BASE_URL = 'https://api.lovense.com';

// Lovense API credentials from environment variables
const LOVENSE_TOKEN = process.env.LOVENSE_TOKEN || '';
const LOVENSE_KEY = process.env.LOVENSE_KEY || '';
const LOVENSE_IV = process.env.LOVENSE_IV || '';

// Store user toy connections
interface ToyConnection {
  userId: string;
  toyId: string;
  toyType: string;
  nickname: string;
  connectedAt: Date;
  lastActive: Date;
}

// In-memory store for toy connections (would be replaced with database in production)
const toyConnections = new Map<string, ToyConnection[]>();

/**
 * Encrypt data for Lovense API
 * @param data Data to encrypt
 * @returns Encrypted data in hex format
 */
function encryptData(data: string): string {
  try {
    // Convert key and IV from hex to Buffer
    const key = Buffer.from(LOVENSE_KEY, 'hex');
    const iv = Buffer.from(LOVENSE_IV, 'hex');
    
    // Create cipher
    const cipher = crypto.createCipheriv('aes-128-cbc', key, iv);
    
    // Encrypt data
    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    return encrypted;
  } catch (error) {
    logger.error('Error encrypting data for Lovense API', error);
    throw new Error('Failed to encrypt data');
  }
}

/**
 * Decrypt data from Lovense API
 * @param encryptedData Encrypted data in hex format
 * @returns Decrypted data
 */
function decryptData(encryptedData: string): string {
  try {
    // Convert key and IV from hex to Buffer
    const key = Buffer.from(LOVENSE_KEY, 'hex');
    const iv = Buffer.from(LOVENSE_IV, 'hex');
    
    // Create decipher
    const decipher = crypto.createDecipheriv('aes-128-cbc', key, iv);
    
    // Decrypt data
    let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  } catch (error) {
    logger.error('Error decrypting data from Lovense API', error);
    throw new Error('Failed to decrypt data');
  }
}

/**
 * Initialize the Lovense service
 * @returns Boolean indicating if initialization was successful
 */
export async function initLovenseService(): Promise<boolean> {
  if (!LOVENSE_TOKEN || !LOVENSE_KEY || !LOVENSE_IV) {
    logger.warn('Lovense API credentials not configured. Lovense integration disabled.');
    return false;
  }

  try {
    logger.info('Lovense API integration initialized successfully');
    return true;
  } catch (error) {
    logger.error('Failed to initialize Lovense API integration', error);
    return false;
  }
}

/**
 * Get a QR code for toy connection
 * @param userId User ID to associate with the toy
 * @returns URL to the QR code image
 */
export async function getToyConnectionQRCode(userId: string): Promise<string | null> {
  try {
    // Prepare data for QR code request
    const qrCodeData = JSON.stringify({
      uid: userId,
      command: 'getQrCode',
      appType: 'remote'
    });
    
    // Encrypt data
    const encryptedData = encryptData(qrCodeData);
    
    // Send request to Lovense API
    const response = await axios.post(`${LOVENSE_API_BASE_URL}/api/lan/v2/qrcode`, {
      token: LOVENSE_TOKEN,
      data: encryptedData
    });
    
    if (response.data && response.data.code === 200 && response.data.data) {
      // Decrypt response data
      const decryptedData = decryptData(response.data.data);
      const qrCodeInfo = JSON.parse(decryptedData);
      
      return qrCodeInfo.message;
    } else {
      logger.error(`Failed to get Lovense QR code: ${response.data?.message || 'Unknown error'}`);
      return null;
    }
  } catch (error) {
    logger.error('Error getting Lovense QR code', error);
    return null;
  }
}

/**
 * Register a toy connection callback
 * @param userId User ID
 * @param toyId Toy ID
 * @param toyType Toy type
 * @param nickname Toy nickname
 * @returns Boolean indicating if registration was successful
 */
export function registerToyConnection(
  userId: string,
  toyId: string,
  toyType: string,
  nickname: string = 'My Toy'
): boolean {
  try {
    // Create toy connection record
    const toyConnection: ToyConnection = {
      userId,
      toyId,
      toyType,
      nickname,
      connectedAt: new Date(),
      lastActive: new Date()
    };

    // Get existing connections for user or create new array
    const userConnections = toyConnections.get(userId) || [];
    
    // Add new connection
    userConnections.push(toyConnection);
    
    // Update connections map
    toyConnections.set(userId, userConnections);
    
    logger.info(`Toy ${toyId} (${toyType}) connected for user ${userId}`);
    return true;
  } catch (error) {
    logger.error('Error registering toy connection', error);
    return false;
  }
}

/**
 * Get all toy connections for a user
 * @param userId User ID
 * @returns Array of toy connections
 */
export function getUserToyConnections(userId: string): ToyConnection[] {
  return toyConnections.get(userId) || [];
}

/**
 * Send a command to a toy
 * @param userId User ID
 * @param toyId Toy ID
 * @param command Command to send (e.g., "Vibrate", "Rotate", "Pump", etc.)
 * @param intensity Intensity level (0-20)
 * @param duration Duration in seconds (0 for continuous until stopped)
 * @returns Boolean indicating if command was sent successfully
 */
export async function sendToyCommand(
  userId: string,
  toyId: string,
  command: string,
  intensity: number,
  duration: number = 0
): Promise<boolean> {
  try {
    // Validate intensity
    const validatedIntensity = Math.max(0, Math.min(20, intensity));
    
    // Get user's toy connections
    const userConnections = toyConnections.get(userId) || [];
    
    // Find the specific toy
    const toyConnection = userConnections.find(conn => conn.toyId === toyId);
    
    if (!toyConnection) {
      logger.error(`Toy ${toyId} not found for user ${userId}`);
      return false;
    }
    
    // Update last active timestamp
    toyConnection.lastActive = new Date();
    
    // Prepare command data
    const commandData = JSON.stringify({
      uid: userId,
      command: "toy",
      toyId,
      apiVer: 2,
      params: {
        toy: toyId,
        command,
        action: validatedIntensity > 0 ? 'Start' : 'Stop',
        timeSec: duration,
        strength: validatedIntensity
      }
    });
    
    // Encrypt command data
    const encryptedData = encryptData(commandData);
    
    // Send command to Lovense API
    const response = await axios.post(`${LOVENSE_API_BASE_URL}/api/lan/v2/command`, {
      token: LOVENSE_TOKEN,
      data: encryptedData
    });
    
    if (response.data && response.data.code === 200) {
      logger.info(`Command ${command} sent to toy ${toyId} for user ${userId}`);
      return true;
    } else {
      logger.error(`Failed to send command to toy: ${response.data?.message || 'Unknown error'}`);
      return false;
    }
  } catch (error) {
    logger.error('Error sending command to toy', error);
    return false;
  }
}

/**
 * Stop all toy actions
 * @param userId User ID
 * @param toyId Toy ID (optional, if not provided stops all toys for user)
 * @returns Boolean indicating if stop command was sent successfully
 */
export async function stopToy(userId: string, toyId?: string): Promise<boolean> {
  try {
    // Get user's toy connections
    const userConnections = toyConnections.get(userId) || [];
    
    if (userConnections.length === 0) {
      logger.warn(`No toys found for user ${userId}`);
      return false;
    }
    
    // If toyId is provided, stop only that toy
    if (toyId) {
      return await sendToyCommand(userId, toyId, 'Function', 0, 0);
    }
    
    // Stop all toys for user
    const results = await Promise.all(
      userConnections.map(conn => 
        sendToyCommand(userId, conn.toyId, 'Function', 0, 0)
      )
    );
    
    // Return true if all commands were successful
    return results.every(result => result === true);
  } catch (error) {
    logger.error('Error stopping toy', error);
    return false;
  }
}

/**
 * Disconnect a toy
 * @param userId User ID
 * @param toyId Toy ID
 * @returns Boolean indicating if disconnection was successful
 */
export function disconnectToy(userId: string, toyId: string): boolean {
  try {
    // Get user's toy connections
    const userConnections = toyConnections.get(userId) || [];
    
    // Filter out the toy to disconnect
    const updatedConnections = userConnections.filter(conn => conn.toyId !== toyId);
    
    // Update connections map
    toyConnections.set(userId, updatedConnections);
    
    logger.info(`Toy ${toyId} disconnected for user ${userId}`);
    return true;
  } catch (error) {
    logger.error('Error disconnecting toy', error);
    return false;
  }
}

/**
 * Create a pattern for toy vibration
 * @param pattern Array of [intensity, durationMs] pairs
 * @returns Formatted pattern string for Lovense API
 */
export function createVibrationPattern(pattern: [number, number][]): string {
  return pattern
    .map(([intensity, duration]) => {
      // Validate intensity (0-20)
      const validIntensity = Math.max(0, Math.min(20, intensity));
      // Validate duration (100ms minimum, 10000ms maximum)
      const validDuration = Math.max(100, Math.min(10000, duration));
      return `${validIntensity}:${validDuration}`;
    })
    .join(',');
}

/**
 * Send a vibration pattern to a toy
 * @param userId User ID
 * @param toyId Toy ID
 * @param pattern Vibration pattern string or pattern array
 * @param loopCount Number of times to loop the pattern (0 for infinite)
 * @returns Boolean indicating if pattern was sent successfully
 */
export async function sendVibrationPattern(
  userId: string,
  toyId: string,
  pattern: string | [number, number][],
  loopCount: number = 0
): Promise<boolean> {
  try {
    // Convert pattern array to string if needed
    const patternString = Array.isArray(pattern) ? createVibrationPattern(pattern) : pattern;
    
    // Get user's toy connections
    const userConnections = toyConnections.get(userId) || [];
    
    // Find the specific toy
    const toyConnection = userConnections.find(conn => conn.toyId === toyId);
    
    if (!toyConnection) {
      logger.error(`Toy ${toyId} not found for user ${userId}`);
      return false;
    }
    
    // Update last active timestamp
    toyConnection.lastActive = new Date();
    
    // Prepare pattern command data
    const commandData = JSON.stringify({
      uid: userId,
      command: "toy",
      toyId,
      apiVer: 2,
      params: {
        toy: toyId,
        command: "Pattern",
        action: "Start",
        loopCount,
        strength: patternString
      }
    });
    
    // Encrypt command data
    const encryptedData = encryptData(commandData);
    
    // Send pattern command to Lovense API
    const response = await axios.post(`${LOVENSE_API_BASE_URL}/api/lan/v2/command`, {
      token: LOVENSE_TOKEN,
      data: encryptedData
    });
    
    if (response.data && response.data.code === 200) {
      logger.info(`Pattern sent to toy ${toyId} for user ${userId}`);
      return true;
    } else {
      logger.error(`Failed to send pattern to toy: ${response.data?.message || 'Unknown error'}`);
      return false;
    }
  } catch (error) {
    logger.error('Error sending pattern to toy', error);
    return false;
  }
}

/**
 * Create a donation-triggered toy action
 * @param userId User ID receiving the donation
 * @param amount Donation amount
 * @returns Boolean indicating if action was triggered successfully
 */
export async function triggerDonationAction(userId: string, amount: number): Promise<boolean> {
  try {
    // Get user's toy connections
    const userConnections = toyConnections.get(userId) || [];
    
    if (userConnections.length === 0) {
      logger.warn(`No toys found for user ${userId}`);
      return false;
    }
    
    // Calculate intensity based on donation amount (1-20)
    // Example: $1 = intensity 1, $20+ = intensity 20
    const intensity = Math.min(20, Math.max(1, Math.floor(amount)));
    
    // Calculate duration based on donation amount (3-30 seconds)
    const duration = Math.min(30, Math.max(3, Math.floor(amount * 1.5)));
    
    // Send command to all user's toys
    const results = await Promise.all(
      userConnections.map(conn => 
        sendToyCommand(userId, conn.toyId, 'Vibrate', intensity, duration)
      )
    );
    
    // Return true if at least one command was successful
    return results.some(result => result === true);
  } catch (error) {
    logger.error('Error triggering donation action', error);
    return false;
  }
}
