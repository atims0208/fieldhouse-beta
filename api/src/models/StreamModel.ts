import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { UserModel } from './UserModel';
import { DonationModel } from './DonationModel';

@Entity('streams')
export class StreamModel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  thumbnailUrl: string;

  @Column({ default: 0 })
  viewerCount: number;

  @Column({ default: 0 })
  totalViewers: number;

  @Column({ default: true })
  isLive: boolean;

  @Column({ nullable: true })
  category: string;

  @Column({ nullable: true })
  tags: string;

  @Column({ nullable: true })
  streamKey: string;

  @Column({ nullable: true })
  playbackId: string;

  @CreateDateColumn()
  startedAt: Date;

  @Column({ nullable: true })
  endedAt: Date;

  @Column()
  userId: string;

  @ManyToOne(() => UserModel, user => user.streams)
  @JoinColumn({ name: 'userId' })
  user: UserModel;

  @OneToMany(() => DonationModel, donation => donation.stream)
  donations: DonationModel[];

  // Method to return stream data
  toJSON() {
    const stream = { ...this };
    // Remove sensitive information
    delete stream.streamKey;
    return stream;
  }
}

// Static methods
export const findAllLive = async (): Promise<StreamModel[]> => {
  return await StreamModel.find({ 
    where: { isLive: true },
    relations: ['user'],
    order: { viewerCount: 'DESC' }
  });
};

export const findByUser = async (userId: string): Promise<StreamModel[]> => {
  return await StreamModel.find({ 
    where: { userId },
    order: { startedAt: 'DESC' }
  });
};

export const findLiveByUser = async (userId: string): Promise<StreamModel | null> => {
  return await StreamModel.findOne({ 
    where: { userId, isLive: true }
  });
};
