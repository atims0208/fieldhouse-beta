import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { User } from './User';

@Table({
  tableName: 'follows',
  timestamps: true,
})
export class Follow extends Model<Follow> {
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
  followerId!: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  followingId!: string;

  @BelongsTo(() => User, 'followerId')
  follower!: User;

  @BelongsTo(() => User, 'followingId')
  following!: User;
} 