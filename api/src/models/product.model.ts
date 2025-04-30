import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { Shop } from './shop.model';
import { PrintfulStore } from './printful-store.model';

interface ProductVariant {
  externalId: string;
  name: string;
  price: number;
  sku: string;
}

@Entity()
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 255 })
  name!: string;

  @Column({ type: 'text', nullable: true })
  description!: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price!: number;

  @Column({ type: 'jsonb', nullable: true })
  images!: string[];

  @Column({ type: 'varchar', length: 255, nullable: true })
  externalId?: string;

  @Column({ type: 'jsonb', nullable: true })
  variants?: ProductVariant[];

  @Column({ type: 'jsonb', nullable: true })
  printfulData?: Record<string, any>;

  @Column({ type: 'boolean', default: true })
  isActive!: boolean;

  @ManyToOne(() => Shop, (shop: Shop) => shop.products)
  shop!: Shop;

  @ManyToOne(() => PrintfulStore, (printfulStore: PrintfulStore) => printfulStore.products)
  printfulStore?: PrintfulStore;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
} 