import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn
} from 'typeorm';
import { User } from './User';

export enum StreamType {
  RTMP = 'rtmp',
  WEBRTC = 'webrtc'
}

export enum StreamStatus {
  OFFLINE = 'offline',
  LIVE = 'live',
  ENDED = 'ended'
}

@Entity()
export class Stream {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  title!: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'text', nullable: true })
  category?: string;

  @Column({
    type: 'enum',
    enum: StreamType,
    default: StreamType.RTMP
  })
  streamType!: StreamType;

  @Column({
    type: 'enum',
    enum: StreamStatus,
    default: StreamStatus.OFFLINE
  })
  status!: StreamStatus;

  @Column({ nullable: true })
  thumbnailUrl?: string;

  @Column({ nullable: true })
  rtmpUrl?: string;

  @Column({ nullable: true })
  playbackUrl?: string;

  @Column({ nullable: true })
  streamKey?: string;

  // WebRTC specific fields
  @Column({ nullable: true })
  webrtcSessionId?: string;

  @Column({ type: 'json', nullable: true })
  webrtcConfiguration?: {
    iceServers: { urls: string; username?: string; credential?: string }[];
  };

  @ManyToOne(() => User, user => user.streams)
  @JoinColumn({ name: 'userId' })
  user!: User;

  @Column()
  userId!: string;

  @Column({ type: 'int', default: 0 })
  viewerCount: number = 0;

  @Column({ type: 'json', default: [] })
  tags: string[] = [];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @Column({ nullable: true })
  endedAt?: Date;

  @Column({ nullable: true })
  startedAt?: Date;
} 