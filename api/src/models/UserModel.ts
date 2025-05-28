import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, BeforeInsert, BeforeUpdate } from 'typeorm';
import bcrypt from 'bcrypt';
import { StreamModel } from './StreamModel';
import { DonationModel } from './DonationModel';

@Entity('users')
export class UserModel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  displayName: string;

  @Column({ nullable: true })
  bio: string;

  @Column({ nullable: true })
  avatarUrl: string;

  @Column({ default: false })
  isStreamer: boolean;

  @Column({ default: false })
  isAdmin: boolean;

  @Column({ default: 0 })
  coins: number;

  @Column({ default: 0 })
  followers: number;

  @Column({ default: 0 })
  following: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => StreamModel, stream => stream.user)
  streams: StreamModel[];

  @OneToMany(() => DonationModel, donation => donation.sender)
  sentDonations: DonationModel[];

  @OneToMany(() => DonationModel, donation => donation.receiver)
  receivedDonations: DonationModel[];

  // Hash password before inserting or updating
  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    // Only hash the password if it has been modified
    if (this.password && this.password.length < 60) {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    }
  }

  // Method to compare password
  async comparePassword(enteredPassword: string): Promise<boolean> {
    return await bcrypt.compare(enteredPassword, this.password);
  }

  // Method to return user data without sensitive information
  toJSON() {
    const { password, ...user } = this;
    return user;
  }
}

// Static methods
export const findByEmail = async (email: string): Promise<UserModel | null> => {
  return await UserModel.findOne({ where: { email } });
};

export const findByUsername = async (username: string): Promise<UserModel | null> => {
  return await UserModel.findOne({ where: { username } });
};
