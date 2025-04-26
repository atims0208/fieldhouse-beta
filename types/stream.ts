export enum StreamType {
  RTMP = 'rtmp',
  WEBRTC = 'webrtc'
}

export enum StreamStatus {
  OFFLINE = 'offline',
  LIVE = 'live',
  ENDED = 'ended'
}

export interface Stream {
  id: string;
  title: string;
  description?: string;
  streamType: StreamType;
  status: StreamStatus;
  userId: string;
  rtmpUrl?: string;
  playbackUrl: string;
  streamKey?: string;
  webrtcSessionId?: string;
  webrtcConfiguration?: {
    iceServers: RTCIceServer[];
  };
  viewerCount: number;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  endedAt?: Date;
} 