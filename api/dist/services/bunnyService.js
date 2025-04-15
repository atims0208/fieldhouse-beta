"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const BUNNY_VIDEO_LIBRARY_ID = process.env.BUNNY_VIDEO_LIBRARY_ID || '409856';
const BUNNY_API_KEY = process.env.BUNNY_API_KEY || 'a6f8f102-c79a-424c-bd103d4fa602-cc11-42d9';
const BUNNY_CDN_HOSTNAME = process.env.BUNNY_CDN_HOSTNAME || 'vz-4f8c314d-49b.b-cdn.net';
const BUNNY_STREAM_API_KEY = process.env.BUNNY_STREAM_API_KEY;
const BUNNY_STREAM_API_URL = "https://video.bunnycdn.com";
const BUNNY_STREAM_PULL_ZONE = process.env.BUNNY_STREAM_PULL_ZONE;
const BUNNY_WHIP_ENDPOINT = process.env.BUNNY_WHIP_ENDPOINT || "https://whip.bunnycdn.com";
const BUNNY_RTMP_ENDPOINT = process.env.BUNNY_RTMP_ENDPOINT || "rtmp://ingest.b-cdn.net:1935";
// Base URL for Bunny Stream API
const API_BASE_URL = 'https://video.bunnycdn.com/library';
// Create axios instance with auth headers
const bunnyApi = axios_1.default.create({
    baseURL: `${API_BASE_URL}/${BUNNY_VIDEO_LIBRARY_ID}`,
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'AccessKey': BUNNY_API_KEY
    }
});
// Service functions
exports.default = {
    /**
     * Create a new streaming channel
     * @param userId User ID to associate with the stream
     * @param title Stream title
     */
    createStream: async (userId, title) => {
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
        }
        catch (error) {
            console.error('Error creating Bunny.net stream:', error);
            throw new Error('Failed to create streaming channel');
        }
    },
    /**
     * Get stream details by ID
     * @param streamId Bunny.net stream ID
     */
    getStream: async (streamId) => {
        try {
            const response = await bunnyApi.get(`/streams/${streamId}`);
            return response.data;
        }
        catch (error) {
            console.error('Error fetching Bunny.net stream:', error);
            throw new Error('Failed to fetch stream data');
        }
    },
    /**
     * Delete a stream
     * @param streamId Bunny.net stream ID
     */
    deleteStream: async (streamId) => {
        try {
            await bunnyApi.delete(`/streams/${streamId}`);
            return true;
        }
        catch (error) {
            console.error('Error deleting Bunny.net stream:', error);
            throw new Error('Failed to delete stream');
        }
    },
    /**
     * Check if a stream is currently live
     * @param streamId Bunny.net stream ID
     */
    isStreamLive: async (streamId) => {
        try {
            const response = await bunnyApi.get(`/streams/${streamId}`);
            return response.data.status === 'live';
        }
        catch (error) {
            console.error('Error checking stream status:', error);
            return false;
        }
    },
    /**
     * Get HLS playback URL for a stream
     * @param streamId Bunny.net stream ID
     */
    getPlaybackUrl: (libraryId) => {
        if (!BUNNY_STREAM_PULL_ZONE) {
            console.warn('BUNNY_STREAM_PULL_ZONE is not set. Playback URLs may be incorrect.');
            return `/placeholder/stream.m3u8`;
        }
        return `https://${BUNNY_STREAM_PULL_ZONE}/${libraryId}/playlist.m3u8`;
    },
    /**
     * Get RTMP ingest URL with stream key
     * @param streamId Bunny.net stream ID
     * @param streamKey Stream key
     */
    getRtmpUrl: (libraryId, streamKey) => {
        const rtmpBase = BUNNY_RTMP_ENDPOINT.split(':')[0];
        return `${rtmpBase}/live/${streamKey}`;
    },
    /**
     * Get WHIP ingest URL for a stream
     * @param streamId Bunny.net stream ID
     * @param streamKey Stream key
     */
    getWhipUrl: (libraryId, streamKey) => {
        return `${BUNNY_WHIP_ENDPOINT}/live/${libraryId}/${streamKey}`;
    }
};
//# sourceMappingURL=bunnyService.js.map