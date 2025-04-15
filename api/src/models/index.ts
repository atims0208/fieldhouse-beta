import dotenv from 'dotenv';
import { Sequelize } from 'sequelize-typescript';
import { User } from './User';
import { Stream } from './Stream';
import { Follow } from './Follow';
import { Product } from './Product';

// Load environment variables
dotenv.config();

// Log database configuration for debugging (without sensitive info)
const dbConfig = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  username: process.env.DB_USERNAME,
  database: process.env.DB_NAME,
  ssl: process.env.DB_SSL
};

console.log('Database Configuration:', dbConfig);
console.log('Attempting to connect to database...');

const sequelize = new Sequelize({
  dialect: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '25060'),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  models: [User, Stream, Follow, Product],
  logging: console.log,
  dialectOptions: {
    ssl: {
      require: true,
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
  retry: {
    max: 3,
    match: [
      /SequelizeConnectionError/,
      /SequelizeConnectionRefusedError/,
      /SequelizeHostNotFoundError/,
      /SequelizeConnectionTimedOutError/,
      /TimeoutError/,
      /SequelizeConnectionAcquireTimeoutError/,
      /EAI_AGAIN/,
      /ENOTFOUND/
    ]
  }
});

// Function to test database connection with retries
export const testConnection = async () => {
  const maxRetries = 3;
  let lastError;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`Connection attempt ${attempt}/${maxRetries}...`);
      await sequelize.authenticate();
      console.log('Database connection has been established successfully.');
      return;
    } catch (error: any) {
      lastError = error;
      console.error(`Connection attempt ${attempt} failed:`, error.message);
      if (error.original) {
        console.error('Original error:', error.original);
      }
      
      if (attempt < maxRetries) {
        const delay = attempt * 2000; // Exponential backoff
        console.log(`Waiting ${delay}ms before next attempt...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  throw new Error(`Failed to connect after ${maxRetries} attempts. Last error: ${lastError?.message}`);
};

// Function to sync models with database
export const syncDatabase = async (force: boolean = false) => {
  try {
    await sequelize.sync({ force });
    console.log('Database synced successfully');
  } catch (error) {
    console.error('Error syncing database:', error);
    throw error;
  }
};

// Initialize associations between models
export const initializeAssociations = () => {
  // User-Stream associations
  User.hasMany(Stream, { foreignKey: 'userId', as: 'userStreams' });
  Stream.belongsTo(User, { foreignKey: 'userId', as: 'streamer' });

  // User-Follow associations (User can follow many users)
  User.belongsToMany(User, {
    through: Follow,
    as: 'followedUsers',
    foreignKey: 'followerId',
    otherKey: 'followingId'
  });

  // User-Follow associations (User can be followed by many users)
  User.belongsToMany(User, {
    through: Follow,
    as: 'followerUsers',
    foreignKey: 'followingId',
    otherKey: 'followerId'
  });

  // User-Product associations
  User.hasMany(Product, { foreignKey: 'userId', as: 'userProducts' });
  Product.belongsTo(User, { foreignKey: 'userId', as: 'seller' });
};

export {
  sequelize,
  User,
  Stream,
  Follow,
  Product,
}; 