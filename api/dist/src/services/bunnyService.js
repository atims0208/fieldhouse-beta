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
const BUNNY_STREAM_PULL_ZONE = process.env.BUNNY_STREAM_PULL_ZONE || BUNNY_CDN_HOSTNAME;
const BUNNY_WHIP_ENDPOINT = process.env.BUNNY_WHIP_ENDPOINT || "https://whip.bunnycdn.com";
const BUNNY_RTMP_ENDPOINT = process.env.BUNNY_RTMP_ENDPOINT || "rtmp://ingest.b-cdn.net:1935";
const API_BASE_URL = 'https://video.bunnycdn.com/library';
const bunnyApi = axios_1.default.create({
    baseURL: `${API_BASE_URL}/${BUNNY_VIDEO_LIBRARY_ID}`,
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'AccessKey': BUNNY_API_KEY
    }
});
exports.default = {
    createStream: async (userId, title) => {
        try {
            const response = await bunnyApi.post('/streams', {
                title: title,
                collectionId: userId
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
    getPlaybackUrl: (streamId) => {
        return `https://${BUNNY_STREAM_PULL_ZONE}/${streamId}/playlist.m3u8`;
    },
    getRtmpUrl: (streamKey) => {
        const rtmpBase = BUNNY_RTMP_ENDPOINT.split(':')[0];
        return `${rtmpBase}/live/${streamKey}`;
    },
    getWhipUrl: (streamKey) => {
        return `${BUNNY_WHIP_ENDPOINT}/live/${streamKey}`;
    }
};
//# sourceMappingURL=bunnyService.js.map