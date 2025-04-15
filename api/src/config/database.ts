import { Sequelize, SequelizeOptions } from 'sequelize-typescript';
import dotenv from 'dotenv';

dotenv.config();

const dbName = process.env.DB_NAME || 'defaultdb';
const dbUser = process.env.DB_USERNAME || 'doadmin';
const dbPassword = process.env.DB_PASSWORD || 'AVNS_ztB98aKQBeoa20XEcma';
const dbHost = process.env.DB_HOST || 'db-postgresql-nyc1-23413-do-user-13790243-0.g.db.ondigitalocean.com';
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
    ssl: dbSSL ? {
      require: true,
      rejectUnauthorized: false
    } : false
  },
  logging: process.env.NODE_ENV === 'development',
  models: [] // Models will be added in models/index.ts
};

export default config; 