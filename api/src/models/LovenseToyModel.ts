/**
 * Lovense Toy Model for the Fieldhouse application
 */

import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { UserModel } from './UserModel';

@Entity('lovense_toys')
export class LovenseToyModel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id' })
  userId: string;

  @ManyToOne(() => UserModel, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: UserModel;

  @Column({ name: 'toy_id', unique: true })
  toyId: string;

  @Column({ name: 'toy_type' })
  toyType: string;

  @Column({ nullable: true })
  nickname: string;

  @Column({ name: 'is_connected', default: false })
  isConnected: boolean;

  @Column({ name: 'last_connected_at', type: 'timestamp', nullable: true })
  lastConnectedAt: Date;

  @Column({ name: 'last_disconnected_at', type: 'timestamp', nullable: true })
  lastDisconnectedAt: Date;

  @Column({ name: 'connection_token', nullable: true })
  connectionToken: string;

  @Column({ type: 'jsonb', nullable: true })
  settings: any;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
