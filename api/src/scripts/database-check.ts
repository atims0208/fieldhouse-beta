import { sequelize } from '../models';

async function checkDatabase() {
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');
    
    // Get all table names
    const [tables] = await sequelize.query('SELECT table_name FROM information_schema.tables WHERE table_schema = current_schema()');
    console.log('\nAvailable tables:');
    console.log(tables);
    
    // Check connection pool status
    const pool = await sequelize.connectionManager.getConnection({ type: 'read' });
    console.log('\nConnection pool status:');
    console.log('Connection acquired successfully');
    await sequelize.connectionManager.releaseConnection(pool);
    
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  } finally {
    await sequelize.close();
  }
}

checkDatabase(); 