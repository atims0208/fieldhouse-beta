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
import { TicketPackage } from './TicketPackage';

export enum TransactionType {
  PURCHASE = 'purchase',
  GIFT = 'gift',
  REFUND = 'refund'
}

export enum TransactionStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
  REFUNDED = 'refunded'
}

@Entity()
export class TicketTransaction {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  userId!: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user!: User;

  @Column({ nullable: true })
  packageId?: string;

  @ManyToOne(() => TicketPackage, { nullable: true })
  @JoinColumn({ name: 'packageId' })
  package?: TicketPackage;

  @Column({ type: 'int' })
  ticketAmount!: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amountUSD!: number;

  @Column({
    type: 'enum',
    enum: TransactionType
  })
  type!: TransactionType;

  @Column({
    type: 'enum',
    enum: TransactionStatus,
    default: TransactionStatus.PENDING
  })
  status!: TransactionStatus;

  @Column({ nullable: true })
  paymentProcessorId?: string;

  @Column({ type: 'json', nullable: true })
  paymentDetails?: any;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
} 