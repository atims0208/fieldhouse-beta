import axios from 'axios';

export class BunnyStreamService {
  private readonly apiKey: string;
  private readonly baseUrl: string;
  private readonly libraryId: string;

  constructor() {
    this.apiKey = process.env.BUNNY_STREAM_API_KEY || '';
    this.baseUrl = 'https://api.bunny.net/stream';
    this.libraryId = process.env.BUNNY_LIBRARY_ID || '';
  }

  private get headers() {
    return {
      'AccessKey': this.apiKey,
      'Content-Type': 'application/json'
    };
  }

  async createStream(title: string): Promise<{
    id: string;
    rtmpUrl: string;
    playbackUrl: string;
    streamKey: string;
  }> {
    try {
      const response = await axios.post(`${this.baseUrl}/${this.libraryId}`, {
        title,
        collectionId: this.libraryId
      }, { headers: this.headers });

      return {
        id: response.data.guid,
        rtmpUrl: `rtmp://ingest.bunny.net/live/${response.data.guid}`,
        playbackUrl: `https://iframe.mediadelivery.net/embed/${this.libraryId}/${response.data.guid}`,
        streamKey: response.data.guid // The GUID serves as both the stream ID and key
      };
    } catch (error) {
      console.error('Error creating Bunny.net stream:', error);
      throw new Error('Failed to create stream');
    }
  }

  async deleteStream(streamId: string): Promise<void> {
    try {
      await axios.delete(
        `${this.baseUrl}/${this.libraryId}/${streamId}`,
        { headers: this.headers }
      );
    } catch (error) {
      console.error('Error deleting Bunny.net stream:', error);
      throw new Error('Failed to delete stream');
    }
  }

  async getStreamStatus(streamId: string): Promise<boolean> {
    try {
      const response = await axios.get(
        `${this.baseUrl}/${this.libraryId}/${streamId}`,
        { headers: this.headers }
      );
      return response.data.isLive || false;
    } catch (error) {
      console.error('Error checking stream status:', error);
      return false;
    }
  }

  // WebRTC specific methods
  async createWebRTCStream(title: string): Promise<{
    id: string;
    sessionId: string;
    playbackUrl: string;
    iceServers: any[];
  }> {
    try {
      // Create a regular stream first
      const stream = await this.createStream(title);
      
      // Initialize WebRTC session
      const webrtcResponse = await axios.post(
        `${this.baseUrl}/${this.libraryId}/${stream.id}/webrtc`,
        {},
        { headers: this.headers }
      );

      return {
        id: stream.id,
        sessionId: webrtcResponse.data.sessionId,
        playbackUrl: stream.playbackUrl,
        iceServers: webrtcResponse.data.iceServers || []
      };
    } catch (error) {
      console.error('Error creating WebRTC stream:', error);
      throw new Error('Failed to create WebRTC stream');
    }
  }
} 