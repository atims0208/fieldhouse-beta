import { DataSource } from 'typeorm';
import { seedGifts } from '../seeders/giftSeeder';
import { Gift } from '../models/Gift';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../../.env') });

async function runSeeder() {
  const dataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [Gift],
    synchronize: true,
    ssl: process.env.DB_SSL === 'true' ? {
      rejectUnauthorized: false
    } : false
  });

  try {
    await dataSource.initialize();
    console.log('Connected to database');

    await seedGifts(dataSource);
    console.log('Gifts seeded successfully');

    await dataSource.destroy();
    console.log('Connection closed');
  } catch (error) {
    console.error('Error seeding gifts:', error);
    process.exit(1);
  }
}

runSeeder(); 