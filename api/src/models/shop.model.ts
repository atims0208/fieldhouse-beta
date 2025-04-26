import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, OneToOne } from 'typeorm';
import { User } from './user.model';
import { Product } from './product.model';
import { PrintfulStore } from './printful-store.model';

@Entity()
export class Shop {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 255 })
  name!: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'uuid' })
  userId!: string;

  @ManyToOne(() => User, user => user.shops)
  user!: User;

  @OneToMany(() => Product, product => product.shop)
  products!: Product[];

  @OneToOne(() => PrintfulStore, printfulStore => printfulStore.shop)
  printfulStore?: PrintfulStore;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
} 