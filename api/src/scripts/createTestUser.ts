import { AppDataSource } from '../config/database';
import { User } from '../models/User';
import bcrypt from 'bcryptjs';

async function createTestUser() {
  try {
    await AppDataSource.initialize();
    const userRepository = AppDataSource.getRepository(User);
    
    // Check if test user exists
    const existingUser = await userRepository.findOne({
      where: { email: 'test@example.com' }
    });

    if (existingUser) {
      console.log('Test user already exists');
      return existingUser;
    }

    // Create test user
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    const user = userRepository.create({
      username: 'testuser',
      email: 'test@example.com',
      password: hashedPassword,
      isAdmin: true,
      isStreamer: true
    });

    await userRepository.save(user);
    console.log('Test user created successfully');
    return user;
  } catch (error) {
    console.error('Error creating test user:', error);
    throw error;
  }
}

createTestUser()
  .then(() => process.exit(0))
  .catch(() => process.exit(1)); 