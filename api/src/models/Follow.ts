import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn
} from 'typeorm';
import { User } from './User';

@Entity()
export class Follow {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  followerId!: string;

  @Column()
  followingId!: string;

  @ManyToOne(() => User, user => user.following)
  @JoinColumn({ name: 'followerId' })
  follower!: User;

  @ManyToOne(() => User, user => user.followers)
  @JoinColumn({ name: 'followingId' })
  following!: User;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}

export default Follow; 