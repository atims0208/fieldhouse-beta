import { sequelize, User, Stream, Follow, Product } from '../models';

async function checkDatabase() {
  try {
    // Test connection
    await sequelize.authenticate();
    console.log('Database connection successful.');

    // Check table structure
    const tables = await Promise.all([
      User.describe(),
      Stream.describe(),
      Follow.describe(),
      Product.describe()
    ]);

    console.log('\nTable Structures:');
    
    console.log('\nUser Table:');
    console.log(JSON.stringify(tables[0], null, 2));
    
    console.log('\nStream Table:');
    console.log(JSON.stringify(tables[1], null, 2));
    
    console.log('\nFollow Table:');
    console.log(JSON.stringify(tables[2], null, 2));
    
    console.log('\nProduct Table:');
    console.log(JSON.stringify(tables[3], null, 2));

  } catch (error) {
    console.error('Database check failed:', error);
  } finally {
    await sequelize.close();
  }
}

checkDatabase(); 