import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn
} from 'typeorm';

@Entity()
export class Gift {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column()
  description!: string;

  @Column()
  price!: number;

  @Column()
  coins!: number;

  @Column()
  imageUrl!: string;

  @Column()
  animationUrl!: string;

  @Column({
    type: 'enum',
    enum: ['gif', 'lottie', 'dotlottie'],
    default: 'gif'
  })
  animationType: 'gif' | 'lottie' | 'dotlottie' = 'gif';

  @Column({ default: true })
  isActive: boolean = true;

  @Column({ type: 'simple-array', nullable: true })
  tags?: string[];

  @Column({ default: 0 })
  timesGifted: number = 0;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
} 