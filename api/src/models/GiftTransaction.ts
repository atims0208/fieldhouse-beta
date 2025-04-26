import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn
} from 'typeorm';
import { User } from './User';
import { Gift } from './Gift';
import { Stream } from './Stream';

@Entity()
export class GiftTransaction {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  senderId!: string;

  @Column()
  receiverId!: string;

  @Column()
  giftId!: string;

  @Column()
  streamId!: string;

  @Column()
  quantity: number = 1;

  @Column()
  totalCoins!: number;

  @Column({ nullable: true })
  message?: string;

  @ManyToOne(() => User, user => user.sentGifts)
  sender!: User;

  @ManyToOne(() => User, user => user.receivedGifts)
  receiver!: User;

  @ManyToOne(() => Gift)
  gift!: Gift;

  @ManyToOne(() => Stream)
  stream!: Stream;

  @Column({ default: false })
  isRefunded: boolean = false;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
} 