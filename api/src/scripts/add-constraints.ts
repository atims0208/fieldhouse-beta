import { sequelize } from '../models';
import { QueryTypes } from 'sequelize';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../../.env') });

async function addConstraints() {
  try {
    // Test connection
    await sequelize.authenticate();
    console.log('Connected to database successfully.');

    // Add unique constraint for username
    await sequelize.query(
      'ALTER TABLE "Users" ADD CONSTRAINT "Users_username_key" UNIQUE ("username");',
      { type: QueryTypes.RAW }
    );
    console.log('Added unique constraint for username');

    // Add unique constraint for email
    await sequelize.query(
      'ALTER TABLE "Users" ADD CONSTRAINT "Users_email_key" UNIQUE ("email");',
      { type: QueryTypes.RAW }
    );
    console.log('Added unique constraint for email');

    console.log('Successfully added constraints');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await sequelize.close();
  }
}

// Run the script
addConstraints(); 