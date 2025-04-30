import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const BUNNY_VIDEO_LIBRARY_ID = process.env.BUNNY_VIDEO_LIBRARY_ID || '409856';
const BUNNY_API_KEY = process.env.BUNNY_API_KEY || 'a6f8f102-c79a-424c-bd103d4fa602-cc11-42d9';
const BUNNY_CDN_HOSTNAME = process.env.BUNNY_CDN_HOSTNAME || 'vz-4f8c314d-49b.b-cdn.net';
const BUNNY_STREAM_PULL_ZONE = process.env.BUNNY_STREAM_PULL_ZONE || BUNNY_CDN_HOSTNAME;
const BUNNY_WHIP_ENDPOINT = process.env.BUNNY_WHIP_ENDPOINT || "https://whip.bunnycdn.com";
const BUNNY_RTMP_ENDPOINT = process.env.BUNNY_RTMP_ENDPOINT || "rtmp://ingest.b-cdn.net:1935";

// Base URL for Bunny Stream API
const API_BASE_URL = 'https://video.bunnycdn.com/library';

// Create axios instance with auth headers
const bunnyApi = axios.create({
  baseURL: `${API_BASE_URL}/${BUNNY_VIDEO_LIBRARY_ID}`,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'AccessKey': BUNNY_API_KEY
  }
});

// Interfaces for stream data
interface CreateStreamResponse {
  id: string;
  streamKey: string;
  pullZone: string;
  rtmpUrl: string;
  playbackUrl: string;
  createdAt: string;
}

// Service functions
export default {
  /**
   * Create a new streaming channel
   * @param userId User ID to associate with the stream
   * @param title Stream title
   */
  createStream: async (userId: string, title: string): Promise<CreateStreamResponse> => {
    try {
      const response = await bunnyApi.post('/streams', {
        title: title,
        collectionId: userId // Using userId as collection
      });
      
      return {
        id: response.data.id,
        streamKey: response.data.streamKey,
        pullZone: BUNNY_CDN_HOSTNAME,
        rtmpUrl: `rtmp://ingest.b-cdn.net/stream/${response.data.id}`,
        playbackUrl: `https://${BUNNY_CDN_HOSTNAME}/${response.data.id}/playlist.m3u8`,
        createdAt: response.data.dateCreated
      };
    } catch (error) {
      console.error('Error creating Bunny.net stream:', error);
      throw new Error('Failed to create streaming channel');
    }
  },

  /**
   * Get stream details by ID
   * @param streamId Bunny.net stream ID
   */
  getStream: async (streamId: string) => {
    try {
      const response = await bunnyApi.get(`/streams/${streamId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching Bunny.net stream:', error);
      throw new Error('Failed to fetch stream data');
    }
  },

  /**
   * Delete a stream
   * @param streamId Bunny.net stream ID
   */
  deleteStream: async (streamId: string) => {
    try {
      await bunnyApi.delete(`/streams/${streamId}`);
      return true;
    } catch (error) {
      console.error('Error deleting Bunny.net stream:', error);
      throw new Error('Failed to delete stream');
    }
  },

  /**
   * Check if a stream is currently live
   * @param streamId Bunny.net stream ID
   */
  isStreamLive: async (streamId: string): Promise<boolean> => {
    try {
      const response = await bunnyApi.get(`/streams/${streamId}`);
      return response.data.status === 'live';
    } catch (error) {
      console.error('Error checking stream status:', error);
      return false;
    }
  },

  /**
   * Get HLS playback URL for a stream
   * @param streamId Bunny.net stream ID
   */
  getPlaybackUrl: (streamId: string): string => {
    return `https://${BUNNY_STREAM_PULL_ZONE}/${streamId}/playlist.m3u8`;
  },

  /**
   * Get RTMP ingest URL with stream key
   * @param streamKey Stream key
   */
  getRtmpUrl: (streamKey: string): string => {
    const rtmpBase = BUNNY_RTMP_ENDPOINT.split(':')[0];
    return `${rtmpBase}/live/${streamKey}`;
  },

  /**
   * Get WHIP ingest URL for a stream
   * @param streamKey Stream key
   */
  getWhipUrl: (streamKey: string): string => {
    return `${BUNNY_WHIP_ENDPOINT}/live/${streamKey}`;
  }
}; 