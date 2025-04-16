import { sequelize } from '../models';

async function checkDatabase() {
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');
    
    // Get all table names
    const tables = await sequelize.showAllSchemas();
    console.log('\nAvailable tables:');
    console.log(tables);
    
    // Check connection pool status
    const pool = sequelize.connectionManager;
    console.log('\nConnection pool status:');
    console.log('Total connections:', pool.pool.size);
    console.log('Used connections:', pool.pool.used);
    console.log('Available connections:', pool.pool.available);
    
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  } finally {
    await sequelize.close();
  }
}

checkDatabase(); 