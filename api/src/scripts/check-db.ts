import { sequelize } from '../models';
import { QueryTypes } from 'sequelize';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../../.env') });

async function checkDatabase() {
  try {
    // Test connection
    await sequelize.authenticate();
    console.log('Connected to database successfully.');

    // Check if Users table exists
    const tables = await sequelize.query(
      `SELECT table_name 
       FROM information_schema.tables 
       WHERE table_schema = 'public'`,
      { type: QueryTypes.SELECT }
    );
    
    console.log('\nExisting tables:', tables);

    // Get Users table structure
    const tableInfo = await sequelize.query(
      `SELECT column_name, data_type, is_nullable, column_default
       FROM information_schema.columns
       WHERE table_name = 'Users'`,
      { type: QueryTypes.SELECT }
    );
    
    console.log('\nUsers table structure:', tableInfo);

    // List all users
    const users = await sequelize.query(
      'SELECT id, username, email, "isAdmin", "isStreamer" FROM "Users"',
      { type: QueryTypes.SELECT }
    );
    
    console.log('\nCurrent users:', users);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await sequelize.close();
  }
}

// Run the script
checkDatabase(); 