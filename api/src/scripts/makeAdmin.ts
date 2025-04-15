import { sequelize, User } from '../models';
import { Op } from 'sequelize';

async function makeUserAdmin(identifier: string) {
  try {
    await sequelize.authenticate();
    console.log('Connected to database successfully.');

    const user = await User.findOne({
      where: {
        [Op.or]: [
          { email: identifier },
          { username: identifier }
        ]
      }
    });

    if (!user) {
      console.error('User not found');
      process.exit(1);
    }

    user.isAdmin = true;
    await user.save();
    console.log(`Successfully made user ${user.username} an admin`);
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await sequelize.close();
  }
}

// Get the identifier from command line argument
const identifier = process.argv[2];
if (!identifier) {
  console.error('Please provide an email or username as an argument');
  process.exit(1);
}

makeUserAdmin(identifier); 