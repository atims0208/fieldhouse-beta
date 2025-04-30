import { AppDataSource } from '../config/database';

async function checkDatabaseConnection() {
  try {
    await AppDataSource.initialize();
    console.log('Database connection successful!');
    process.exit(0);
  } catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1);
  }
}

checkDatabaseConnection(); 