/**
 * Lovense Command Model for the Fieldhouse application
 */

import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { UserModel } from './UserModel';
import { LovenseToyModel } from './LovenseToyModel';
import { DonationModel } from './DonationModel';

@Entity('lovense_commands')
export class LovenseCommandModel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id' })
  userId: string;

  @ManyToOne(() => UserModel, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: UserModel;

  @Column({ name: 'toy_id' })
  toyId: string;

  @ManyToOne(() => LovenseToyModel, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'toy_id', referencedColumnName: 'toyId' })
  toy: LovenseToyModel;

  @Column()
  command: string;

  @Column()
  intensity: number;

  @Column({ nullable: true })
  duration: number;

  @Column({ name: 'is_pattern', default: false })
  isPattern: boolean;

  @Column({ type: 'jsonb', nullable: true })
  pattern: any;

  @Column({ name: 'loop_count', nullable: true })
  loopCount: number;

  @Column({ name: 'donation_id', nullable: true })
  donationId: string;

  @ManyToOne(() => DonationModel, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'donation_id' })
  donation: DonationModel;

  @Column({ name: 'triggered_by_user_id', nullable: true })
  triggeredByUserId: string;

  @ManyToOne(() => UserModel, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'triggered_by_user_id' })
  triggeredByUser: UserModel;

  @Column({ name: 'is_successful', default: false })
  isSuccessful: boolean;

  @Column({ name: 'error_message', nullable: true })
  errorMessage: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
