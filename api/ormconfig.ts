import { DataSourceOptions } from 'typeorm';
import { User } from './src/models/user.model';
import { Shop } from './src/models/shop.model';
import { Product } from './src/models/product.model';
import { PrintfulStore } from './src/models/printful-store.model';
import { Stream } from './src/models/Stream';
import { Follow } from './src/models/Follow';
import { Gift } from './src/models/Gift';
import { GiftTransaction } from './src/models/GiftTransaction';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '.env') });

const config: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '25060'),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: process.env.NODE_ENV === 'development',
  logging: process.env.NODE_ENV === 'development',
  entities: [User, Shop, Product, PrintfulStore, Stream, Follow, Gift, GiftTransaction],
  migrations: [],
  subscribers: [],
  ssl: process.env.DB_SSL === 'require' ? {
    rejectUnauthorized: false
  } : false,
  extra: {
    connectionTimeoutMillis: parseInt(process.env.DB_CONNECT_TIMEOUT || '60000'),
    max: parseInt(process.env.DB_POOL_MAX || '5'),
    min: parseInt(process.env.DB_POOL_MIN || '0'),
    acquireTimeoutMillis: parseInt(process.env.DB_POOL_ACQUIRE || '30000'),
    idleTimeoutMillis: parseInt(process.env.DB_POOL_IDLE || '10000')
  },
  // Additional connection options
  connectTimeoutMS: 60000,
  maxQueryExecutionTime: 10000,
  poolErrorHandler: (err: Error) => {
    console.error('Database pool error:', err);
  }
};

console.log('Database Configuration:');
console.log('DB_HOST:', config.host);
console.log('DB_PORT:', config.port);
console.log('DB_NAME:', config.database);
console.log('DB_SSL:', process.env.DB_SSL);

const configForLog = {
  ...config,
  password: '[REDACTED]',
  entities: [
    'User', 'Shop', 'Product', 'PrintfulStore',
    'Stream', 'Follow', 'Gift', 'GiftTransaction'
  ]
};

console.log('Database Configuration:', configForLog);

export default config; 