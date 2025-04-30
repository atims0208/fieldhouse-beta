import { DataSource } from 'typeorm';
import { User } from '../models/User';
import { Stream } from '../models/Stream';
import { Product } from '../models/Product';
import { Follow } from '../models/Follow';
import { Gift } from '../models/Gift';
import { GiftTransaction } from '../models/GiftTransaction';
import dotenv from 'dotenv';
import path from 'path';

// Load environment-specific .env file
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// Validate required environment variables
const requiredEnvVars = ['DB_HOST', 'DB_PORT', 'DB_USERNAME', 'DB_PASSWORD', 'DB_NAME'];
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  console.error('Missing required environment variables:', missingEnvVars);
  process.exit(1);
}

console.log('Database Configuration:');
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_PORT:', process.env.DB_PORT);
console.log('DB_NAME:', process.env.DB_NAME);
console.log('DB_SSL:', process.env.DB_SSL);

const config = {
  type: 'postgres' as const,
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: process.env.NODE_ENV === 'development',
  logging: process.env.NODE_ENV === 'development',
  entities: [User, Stream, Product, Follow, Gift, GiftTransaction],
  migrations: [],
  subscribers: [],
  ssl: process.env.DB_SSL === 'require' ? {
    rejectUnauthorized: false
  } : false,
  connectTimeoutMS: parseInt(process.env.DB_CONNECT_TIMEOUT || '60000'),
  maxQueryExecutionTime: 10000,
  retryAttempts: 5,
  retryDelay: 2000,
  extra: {
    ssl: {
      rejectUnauthorized: false
    }
  }
};

console.log('Database Configuration:', {
  ...config,
  password: '[REDACTED]',
  ssl: config.ssl ? 'enabled' : 'disabled',
  synchronize: config.synchronize ? 'enabled' : 'disabled',
  logging: config.logging ? 'enabled' : 'disabled'
});

export const AppDataSource = new DataSource(config);

let isInitializing = false;
let initializationError: Error | null = null;

export const initializeDatabase = async () => {
  if (AppDataSource.isInitialized) {
    return;
  }

  if (isInitializing) {
    if (initializationError) {
      throw initializationError;
    }
    // Wait for initialization to complete
    while (isInitializing) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    return;
  }

  try {
    isInitializing = true;
    console.log('Initializing database connection...');
    
    await AppDataSource.initialize();
    console.log('Database connection established successfully');
    
    // Verify connection by running a test query
    await AppDataSource.query('SELECT NOW()');
    console.log('Database query test successful');

    // If in development mode and synchronize is enabled, verify schema
    if (process.env.NODE_ENV === 'development' && config.synchronize) {
      console.log('Verifying database schema...');
      await AppDataSource.synchronize();
      console.log('Database schema verified and synchronized');
    }

  } catch (error) {
    console.error('Error connecting to database:', error);
    initializationError = error instanceof Error ? error : new Error('Unknown database error');
    throw initializationError;
  } finally {
    isInitializing = false;
  }
};

export default AppDataSource; 
