import { Client } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

async function testConnection() {
  const client = new Client({
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432'),
    database: process.env.DB_NAME,
    ssl: process.env.DB_SSL === 'require' ? {
      rejectUnauthorized: false
    } : false
  });

  try {
    await client.connect();
    console.log('Successfully connected to the database');
    const result = await client.query('SELECT NOW()');
    console.log('Current time from database:', result.rows[0].now);
  } catch (err) {
    console.error('Error connecting to the database:', err);
  } finally {
    await client.end();
  }
}

testConnection(); 