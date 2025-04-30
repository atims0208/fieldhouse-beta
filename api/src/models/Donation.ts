import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './User';

@Entity()
export class Donation {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('decimal', { precision: 10, scale: 2 })
    amount: number;

    @Column({ nullable: true })
    message?: string;

    @Column()
    donorId: string;

    @Column()
    recipientId: string;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'donorId' })
    donor: User;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'recipientId' })
    recipient: User;

    @CreateDateColumn()
    createdAt: Date;
} 