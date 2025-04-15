import { sequelize, User } from '../models';

async function makeGodAdmin() {
  try {
    await sequelize.authenticate();
    console.log('Connected to database successfully.');

    const user = await User.findOne({ where: { username: 'god' } });
    
    if (!user) {
      console.error('User "god" not found. Please create this user first.');
      process.exit(1);
    }

    await user.update({ 
      isAdmin: true,
      isStreamer: true // Also making them a streamer for full access
    });
    
    console.log('Successfully made user "god" an admin and streamer.');
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await sequelize.close();
  }
}

makeGodAdmin(); 