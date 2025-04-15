import { Table, Column, Model, DataType, ForeignKey, BeforeCreate, BeforeUpdate } from 'sequelize-typescript';
import { User } from './User';

@Table({
  tableName: 'products',
})
export class Product extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id!: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  userId!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  title!: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  description!: string;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false,
  })
  price!: number;

  @Column({
    type: DataType.ARRAY(DataType.STRING),
    allowNull: false,
    validate: {
      maxImages(value: string[]) {
        if (value && value.length > 5) {
          throw new Error('Maximum 5 images allowed');
        }
      }
    }
  })
  images!: string[];

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: true,
  })
  isAvailable!: boolean;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  category!: string;

  @BeforeCreate({
    name: 'beforeProductCreate'
  })
  static async beforeProductCreate(instance: Product) {
    // Any transformations or validations before product creation
  }

  @BeforeUpdate({
    name: 'beforeProductUpdate'
  })
  static async beforeProductUpdate(instance: Product) {
    // Any transformations or validations before product update
  }
} 