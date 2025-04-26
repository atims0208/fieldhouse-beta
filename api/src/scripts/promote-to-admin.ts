import { AppDataSource } from '../config/database';
import { User } from '../models/User';

async function promoteToAdmin(username: string) {
  try {
    await AppDataSource.initialize();
    const userRepository = AppDataSource.getRepository(User);
    
    const user = await userRepository.findOne({ where: { username } });
    if (!user) {
      console.error('User not found');
      process.exit(1);
    }

    user.isAdmin = true;
    await userRepository.save(user);
    
    console.log(`User ${username} has been promoted to admin`);
    process.exit(0);
  } catch (error) {
    console.error('Error promoting user:', error);
    process.exit(1);
  }
}

const username = process.argv[2];
if (!username) {
  console.error('Please provide a username');
  process.exit(1);
}

promoteToAdmin(username); 