"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("../models");
async function checkDatabase() {
    try {
        await models_1.sequelize.authenticate();
        console.log('Database connection has been established successfully.');
        const [tables] = await models_1.sequelize.query('SELECT table_name FROM information_schema.tables WHERE table_schema = current_schema()');
        console.log('\nAvailable tables:');
        console.log(tables);
        const pool = await models_1.sequelize.connectionManager.getConnection({ type: 'read' });
        console.log('\nConnection pool status:');
        console.log('Connection acquired successfully');
        await models_1.sequelize.connectionManager.releaseConnection(pool);
    }
    catch (error) {
        console.error('Unable to connect to the database:', error);
    }
    finally {
        await models_1.sequelize.close();
    }
}
checkDatabase();
//# sourceMappingURL=database-check.js.map