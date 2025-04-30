import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToOne, JoinColumn, OneToMany } from 'typeorm';
import { User } from './user.model';
import { Shop } from './shop.model';
import { Product } from './product.model';

@Entity()
export class PrintfulStore {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  userId!: string;

  @Column({ type: 'uuid' })
  shopId!: string;

  @Column({ type: 'integer' })
  storeId!: number;

  @Column({ type: 'varchar' })
  accessToken!: string;

  @ManyToOne(() => User, user => user.printfulStores)
  user!: User;

  @OneToOne(() => Shop, shop => shop.printfulStore)
  @JoinColumn({ name: 'shopId' })
  shop!: Shop;

  @OneToMany(() => Product, product => product.printfulStore)
  products!: Product[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
} 