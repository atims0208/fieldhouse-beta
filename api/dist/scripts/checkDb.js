"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("../models");
async function checkDatabase() {
    try {
        // Test connection
        await models_1.sequelize.authenticate();
        console.log('Database connection successful.');
        // Check table structure
        const tables = await Promise.all([
            models_1.User.describe(),
            models_1.Stream.describe(),
            models_1.Follow.describe(),
            models_1.Product.describe()
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
    }
    catch (error) {
        console.error('Database check failed:', error);
    }
    finally {
        await models_1.sequelize.close();
    }
}
checkDatabase();
//# sourceMappingURL=checkDb.js.map