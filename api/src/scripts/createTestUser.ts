import { User } from '../models';
import dotenv from 'dotenv';

dotenv.config();

async function createTestUser() {
  try {
    // Create or update test user
    const [user, created] = await User.findOrCreate({
      where: { email: 'itsthealvin@gmail.com' },
      defaults: {
        username: 'itsthealvin',
        email: 'itsthealvin@gmail.com',
        password: 'test123',
        isAdmin: true,
        isStreamer: true
      }
    });

    if (!created) {
      // Update existing user
      user.isAdmin = true;
      user.isStreamer = true;
      user.password = 'test123';
      await user.save();
      console.log('Test user updated:', user.toJSON());
    } else {
      console.log('Test user created:', user.toJSON());
    }

  } catch (error) {
    console.error('Failed to create test user:', error);
  }
}

createTestUser(); 