import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert, OneToMany, CreateDateColumn, UpdateDateColumn, BeforeUpdate } from 'typeorm';
import bcrypt from 'bcryptjs';
import { Stream } from './Stream';
import { Product } from './Product';
import { Follow } from './Follow';
import { GiftTransaction } from './GiftTransaction';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true, length: 255 })
  username!: string;

  @Column({ unique: true, length: 255 })
  email!: string;

  @Column({ select: false })
  password!: string;

  @Column({ nullable: true })
  avatarUrl?: string;

  @Column({ nullable: true, type: 'text' })
  bio?: string;

  @Column({ default: false })
  isStreamer!: boolean;

  @Column({ default: false })
  isAdmin!: boolean;

  @Column({ nullable: true })
  streamKey?: string;

  @Column({ default: false })
  isBanned!: boolean;

  @Column({ nullable: true, type: 'timestamp' })
  bannedUntil?: Date;

  @Column({ type: 'integer', default: 0 })
  coins: number = 0;

  @Column({ type: 'integer', default: 0 })
  tickets: number = 0;

  @Column({ nullable: true, type: 'date' })
  dateOfBirth?: Date;

  @Column({ nullable: true })
  idDocumentUrl?: string;

  @OneToMany(() => Stream, stream => stream.user)
  streams!: Stream[];

  @OneToMany(() => Product, product => product.seller)
  products!: Product[];

  @OneToMany(() => Follow, follow => follow.follower)
  following!: Follow[];

  @OneToMany(() => Follow, follow => follow.following)
  followers!: Follow[];

  @OneToMany(() => GiftTransaction, transaction => transaction.sender)
  sentGifts?: GiftTransaction[];

  @OneToMany(() => GiftTransaction, transaction => transaction.receiver)
  receivedGifts?: GiftTransaction[];

  @CreateDateColumn({ type: 'timestamp' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt!: Date;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.password) {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    }
  }

  async comparePassword(candidatePassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password);
  }
}

export default User; 