import { sequelize, User } from '../models';

async function makeAdmin(username: string) {
  try {
    await sequelize.authenticate();
    console.log('Connected to database successfully.');

    const user = await User.findOne({ where: { username } });
    
    if (!user) {
      console.error(`User with username "${username}" not found.`);
      process.exit(1);
    }

    await user.update({ isAdmin: true });
    console.log(`Successfully made user "${username}" an admin.`);
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await sequelize.close();
  }
}

// Get username from command line argument
const username = process.argv[2];

if (!username) {
  console.error('Please provide a username as an argument.');
  process.exit(1);
}

makeAdmin(username); 