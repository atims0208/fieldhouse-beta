import dotenv from 'dotenv';
import path from 'path';

// Load environment variables first
dotenv.config({ path: path.resolve(__dirname, '../.env') });

import { DataSource } from 'typeorm';
import config from '../ormconfig';

console.log('Testing database connection...');
console.log('Environment variables:', {
  DB_HOST: process.env.DB_HOST,
  DB_PORT: process.env.DB_PORT,
  DB_NAME: process.env.DB_NAME,
  DB_USERNAME: process.env.DB_USERNAME,
  DB_PASSWORD: process.env.DB_PASSWORD ? '[SET]' : '[NOT SET]',
  DB_SSL: process.env.DB_SSL
});

console.log('Configuration:', {
  type: config.type,
  host: (config as any).host,
  port: (config as any).port,
  username: (config as any).username,
  database: config.database,
  ssl: (config as any).ssl,
  password: '[REDACTED]'
});

const dataSource = new DataSource(config);

dataSource.initialize()
  .then(() => {
    console.log('Database connection successful!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Database connection failed:', error);
    process.exit(1);
  }); 