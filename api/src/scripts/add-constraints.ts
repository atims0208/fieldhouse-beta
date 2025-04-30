import { AppDataSource } from '../config/database';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../../.env') });

async function addConstraints() {
  try {
    // Initialize database connection
    await AppDataSource.initialize();
    console.log('Connected to database successfully.');

    // Add unique constraint for username
    await AppDataSource.query(
      'ALTER TABLE "user" ADD CONSTRAINT "user_username_key" UNIQUE ("username");'
    );
    console.log('Added unique constraint for username');

    // Add unique constraint for email
    await AppDataSource.query(
      'ALTER TABLE "user" ADD CONSTRAINT "user_email_key" UNIQUE ("email");'
    );
    console.log('Added unique constraint for email');

    console.log('Successfully added constraints');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await AppDataSource.destroy();
  }
}

// Run the script
addConstraints(); 