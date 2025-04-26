import { DataSource } from 'typeorm';
import { User } from './user.model';
import { Shop } from './shop.model';
import { Product } from './product.model';
import { PrintfulStore } from './printful-store.model';
import { Stream } from './Stream';
import { Follow } from './Follow';
import { Gift } from './Gift';
import { GiftTransaction } from './GiftTransaction';
import config from '../../ormconfig';

// Create a new data source
export const AppDataSource = new DataSource(config);

// Initialize database connection
export const initializeDatabase = async () => {
  try {
    await AppDataSource.initialize();
    console.log('Database connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    throw error;
  }
};

// Function to sync database schema
export const syncDatabase = async (force: boolean = false) => {
  try {
    await AppDataSource.synchronize(force);
    console.log('Database synced successfully');
  } catch (error) {
    console.error('Error syncing database:', error);
    throw error;
  }
};

export {
  User,
  Shop,
  Product,
  PrintfulStore,
  Stream,
  Follow,
  Gift,
  GiftTransaction
}; 