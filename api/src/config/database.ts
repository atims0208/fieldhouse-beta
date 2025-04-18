import { Sequelize, SequelizeOptions } from 'sequelize-typescript';
import dotenv from 'dotenv';

dotenv.config();

const dbName = process.env.DB_NAME || 'defaultdb';
const dbUser = process.env.DB_USERNAME || 'doadmin';
const dbPassword = process.env.DB_PASSWORD || 'AVNS_ztB98aKQBeoa20XEcma';
const dbHost = process.env.DB_HOST || 'fieldhouse-db-do-user-13790243-0.k.db.ondigitalocean.com';
const dbPort = parseInt(process.env.DB_PORT || '25060', 10);
const dbSSL = process.env.DB_SSL === 'true';

const config: SequelizeOptions = {
  database: dbName,
  username: dbUser,
  password: dbPassword,
  host: dbHost,
  port: dbPort,
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: dbSSL,
      rejectUnauthorized: false
    },
    keepAlive: true,
    connectTimeout: parseInt(process.env.DB_CONNECT_TIMEOUT || '60000')
  },
  pool: {
    max: parseInt(process.env.DB_POOL_MAX || '5'),
    min: parseInt(process.env.DB_POOL_MIN || '0'),
    acquire: parseInt(process.env.DB_POOL_ACQUIRE || '30000'),
    idle: parseInt(process.env.DB_POOL_IDLE || '10000')
  },
  logging: process.env.NODE_ENV === 'development',
  models: [] // Models will be added in models/index.ts
};

export default config; 