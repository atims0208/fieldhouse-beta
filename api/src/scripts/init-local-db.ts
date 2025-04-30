import { Client } from 'pg';
import dotenv from 'dotenv';
import path from 'path';

// Load .env.development file
dotenv.config({ path: path.resolve(__dirname, '../../.env.development') });

console.log('Attempting to connect with:');
console.log('Username:', process.env.DB_USERNAME);
console.log('Host:', process.env.DB_HOST);
console.log('Port:', process.env.DB_PORT);
console.log('Database:', 'postgres');

async function initializeLocalDB() {
  // First, try to connect to the default postgres database
  const client = new Client({
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432'),
    database: 'postgres'
  });

  try {
    await client.connect();
    console.log('Connected to PostgreSQL');

    // Check if database exists
    const dbExistsResult = await client.query(
      "SELECT 1 FROM pg_database WHERE datname = $1",
      [process.env.DB_NAME]
    );

    if (dbExistsResult.rows.length === 0) {
      // Create database if it doesn't exist
      await client.query(`CREATE DATABASE "${process.env.DB_NAME}"`);
      console.log(`Database ${process.env.DB_NAME} created successfully`);
    } else {
      console.log(`Database ${process.env.DB_NAME} already exists`);
    }

    // Close connection to postgres database
    await client.end();

    // Connect to our new database
    const appClient = new Client({
      user: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '5432'),
      database: process.env.DB_NAME
    });

    await appClient.connect();
    console.log(`Connected to ${process.env.DB_NAME} database`);

    // Create UUID extension if it doesn't exist
    await appClient.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');

    console.log('Database initialization completed successfully');
    await appClient.end();
  } catch (error) {
    console.error('Error initializing database:', error);
    console.error('Please ensure PostgreSQL is running and the credentials in .env.development are correct');
    console.error('You may need to:');
    console.error('1. Start PostgreSQL service');
    console.error('2. Create a user with: CREATE USER postgres WITH PASSWORD \'postgres\';');
    console.error('3. Grant privileges with: ALTER USER postgres WITH SUPERUSER;');
    process.exit(1);
  }
}

initializeLocalDB(); 