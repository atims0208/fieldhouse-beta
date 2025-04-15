import {
  Table,
  Column,
  Model,
  DataType,
  BeforeCreate,
  BeforeUpdate,
  HasMany,
  BelongsToMany
} from 'sequelize-typescript';
import * as bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { Stream } from './Stream';
import { Follow } from './Follow';
import { Product } from './Product';

@Table
export class User extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  declare id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  declare username: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  })
  declare email: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare password: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare avatarUrl: string | null;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  declare bio: string | null;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  declare dateOfBirth: Date | null;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare idDocumentUrl: string | null;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
    allowNull: false,
  })
  declare isStreamer: boolean;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
    allowNull: false,
  })
  declare isAdmin: boolean;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    unique: true,
  })
  declare streamKey: string | null;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
    allowNull: false,
  })
  declare isBanned: boolean;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  declare bannedUntil: Date | null;

  @HasMany(() => Stream)
  declare streams?: Stream[];

  @HasMany(() => Product)
  declare products?: Product[];

  @BelongsToMany(() => User, {
    through: () => Follow,
    foreignKey: 'followerId',
    otherKey: 'followingId'
  })
  declare following?: User[];

  @BelongsToMany(() => User, {
    through: () => Follow,
    foreignKey: 'followingId',
    otherKey: 'followerId'
  })
  declare followers?: User[];

  validPassword(password: string): boolean {
    return bcrypt.compareSync(password, this.password);
  }

  generateStreamKey(): string | null {
    if (!this.streamKey && this.isStreamer) {
      this.streamKey = `${this.id}-${uuidv4()}`;
    }
    return this.streamKey;
  }

  @BeforeCreate
  static async hashPasswordCreate(instance: User) {
    if (instance.password) {
      const salt = await bcrypt.genSalt(10);
      instance.password = await bcrypt.hash(instance.password, salt);
    }
    if (instance.isStreamer && !instance.streamKey) {
      instance.streamKey = `${instance.id}-${uuidv4()}`;
    }
  }

  @BeforeUpdate
  static async hashPasswordUpdate(instance: User) {
    if (instance.changed('password')) {
      const salt = await bcrypt.genSalt(10);
      instance.password = await bcrypt.hash(instance.password, salt);
    }
    if (instance.isStreamer && !instance.streamKey) {
      instance.streamKey = `${instance.id}-${uuidv4()}`;
    }
  }
} 