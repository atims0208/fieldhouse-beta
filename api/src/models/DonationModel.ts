import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { UserModel } from './UserModel';
import { StreamModel } from './StreamModel';

@Entity('donations')
export class DonationModel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  amount: number;

  @Column({ nullable: true })
  message: string;

  @Column()
  senderId: string;

  @Column()
  receiverId: string;

  @Column({ nullable: true })
  streamId: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => UserModel, user => user.sentDonations)
  @JoinColumn({ name: 'senderId' })
  sender: UserModel;

  @ManyToOne(() => UserModel, user => user.receivedDonations)
  @JoinColumn({ name: 'receiverId' })
  receiver: UserModel;

  @ManyToOne(() => StreamModel, stream => stream.donations, { nullable: true })
  @JoinColumn({ name: 'streamId' })
  stream: StreamModel;
}

// Static methods
export const findByStream = async (streamId: string): Promise<DonationModel[]> => {
  return await DonationModel.find({
    where: { streamId },
    relations: ['sender'],
    order: { createdAt: 'DESC' }
  });
};

export const findByReceiver = async (receiverId: string): Promise<DonationModel[]> => {
  return await DonationModel.find({
    where: { receiverId },
    relations: ['sender', 'stream'],
    order: { createdAt: 'DESC' }
  });
};

export const findBySender = async (senderId: string): Promise<DonationModel[]> => {
  return await DonationModel.find({
    where: { senderId },
    relations: ['receiver', 'stream'],
    order: { createdAt: 'DESC' }
  });
};

export const getTotalDonationsForUser = async (userId: string): Promise<number> => {
  const result = await DonationModel
    .createQueryBuilder('donation')
    .select('SUM(donation.amount)', 'total')
    .where('donation.receiverId = :userId', { userId })
    .getRawOne();
  
  return result?.total || 0;
};
