import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Shop } from './shop.model';
import { PrintfulStore } from './printful-store.model';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 255 })
  email!: string;

  @Column({ type: 'varchar', length: 255 })
  name!: string;

  @Column({ type: 'varchar', length: 255, select: false })
  password!: string;

  @Column({ type: 'boolean', default: false })
  isStreamer!: boolean;

  @Column({ type: 'boolean', default: false })
  isAdmin!: boolean;

  @OneToMany(() => Shop, shop => shop.user)
  shops!: Shop[];

  @OneToMany(() => PrintfulStore, printfulStore => printfulStore.user)
  printfulStores!: PrintfulStore[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
} 