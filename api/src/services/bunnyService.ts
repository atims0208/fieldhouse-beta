import axios from 'axios';
import { logger } from '../config/logger';

interface BunnyStreamResponse {
  guid: string;
  title: string;
  dateUploaded: string;
  views: number;
  isPublic: boolean;
  length: number;
  status: number;
  framerate: number;
  width: number;
  height: number;
  availableResolutions: string;
  thumbnailCount: number;
  encodeProgress: number;
  storageSize: number;
  captions: any[];
  hasMP4Fallback: boolean;
  collectionId: string;
  thumbnailFileName: string;
  averageWatchTime: number;
  totalWatchTime: number;
  category: string;
  chapters: any[];
  moments: any[];
  metaTags: any[];
  transcodingMessages: any[];
}

interface CreateStreamOptions {
  title: string;
  collectionId?: string;
}

class BunnyService {
  private apiKey: string;
  private libraryId: string;
  private pullZoneUrl: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = process.env.BUNNY_API_KEY || '';
    this.libraryId = process.env.BUNNY_STREAM_LIBRARY_ID || '';
    this.pullZoneUrl = process.env.BUNNY_PULL_ZONE_URL || '';
    this.baseUrl = `https://video.bunnycdn.com/library/${this.libraryId}`;
  }

  /**
   * Create a new stream
   */
  async createStream(options: CreateStreamOptions): Promise<string> {
    try {
      const response = await axios.post<BunnyStreamResponse>(
        `${this.baseUrl}/videos`,
        {
          title: options.title,
          collectionId: options.collectionId || '0'
        },
        {
          headers: {
            'AccessKey': this.apiKey,
            'Content-Type': 'application/json'
          }
        }
      );

      logger.info(`Created stream with ID: ${response.data.guid}`);
      return response.data.guid;
    } catch (error: any) {
      logger.error('Error creating stream:', error.response?.data || error.message);
      throw new Error('Failed to create stream');
    }
  }

  /**
   * Delete a stream
   */
  async deleteStream(streamId: string): Promise<boolean> {
    try {
      await axios.delete(
        `${this.baseUrl}/videos/${streamId}`,
        {
          headers: {
            'AccessKey': this.apiKey
          }
        }
      );

      logger.info(`Deleted stream with ID: ${streamId}`);
      return true;
    } catch (error: any) {
      logger.error('Error deleting stream:', error.response?.data || error.message);
      throw new Error('Failed to delete stream');
    }
  }

  /**
   * Check if a stream is live
   */
  async isStreamLive(streamId: string): Promise<boolean> {
    try {
      const response = await axios.get<BunnyStreamResponse>(
        `${this.baseUrl}/videos/${streamId}`,
        {
          headers: {
            'AccessKey': this.apiKey
          }
        }
      );

      // Status 4 means the stream is live
      return response.data.status === 4;
    } catch (error: any) {
      logger.error('Error checking stream status:', error.response?.data || error.message);
      return false;
    }
  }

  /**
   * Get the RTMP URL for streaming
   */
  getRtmpUrl(streamId: string): string {
    return `rtmp://${this.libraryId}.b-cdn.net/stream/${streamId}`;
  }

  /**
   * Get the playback URL for a stream
   */
  getPlaybackUrl(streamId: string): string {
    return `${this.pullZoneUrl}/${streamId}/playlist.m3u8`;
  }

  /**
   * Get the stream key for a stream
   */
  getStreamKey(streamId: string): string {
    return `${this.apiKey}?vid=${streamId}`;
  }
}

export const bunnyService = new BunnyService();
