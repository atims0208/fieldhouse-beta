"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("../config/database");
async function checkDatabaseConnection() {
    try {
        await database_1.AppDataSource.initialize();
        console.log('Database connection successful!');
        process.exit(0);
    }
    catch (error) {
        console.error('Database connection failed:', error);
        process.exit(1);
    }
}
checkDatabaseConnection();
//# sourceMappingURL=database-check.js.map