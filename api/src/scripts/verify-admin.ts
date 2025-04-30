import { Sequelize, QueryTypes } from 'sequelize';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../../.env') });

interface UserRecord {
  id: string;
  username: string;
  email: string;
  isAdmin: boolean;
  isStreamer: boolean;
}

const sequelize = new Sequelize({
  dialect: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: process.env.DB_SSL === 'true',
  dialectOptions: {
    ssl: process.env.DB_SSL === 'true' ? {
      require: true,
      rejectUnauthorized: false
    } : false
  },
  logging: console.log
});

async function listAndUpdateAdmin() {
  try {
    // Test connection
    await sequelize.authenticate();
    console.log('Connected to database successfully.');

    // First list all users
    const users = await sequelize.query<UserRecord>(
      'SELECT id, username, email, "isAdmin", "isStreamer" FROM "Users"',
      {
        type: QueryTypes.SELECT
      }
    );

    console.log('\nCurrent users in database:');
    users.forEach(user => {
      console.log({
        id: user.id,
        username: user.username,
        email: user.email,
        isAdmin: user.isAdmin,
        isStreamer: user.isStreamer
      });
    });

    // Update admin status for user 'god'
    const result = await sequelize.query(
      'UPDATE "Users" SET "isAdmin" = true WHERE username = :username RETURNING id, username, email, "isAdmin", "isStreamer"',
      {
        replacements: { username: 'god' },
        type: QueryTypes.UPDATE
      }
    );

    console.log('\nUpdate result:', result);
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

// Run the script
listAndUpdateAdmin(); 