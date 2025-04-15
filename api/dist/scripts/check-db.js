"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("../models");
const sequelize_1 = require("sequelize");
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
// Load environment variables
dotenv_1.default.config({ path: path_1.default.join(__dirname, '../../.env') });
async function checkDatabase() {
    try {
        // Test connection
        await models_1.sequelize.authenticate();
        console.log('Connected to database successfully.');
        // Check if Users table exists
        const tables = await models_1.sequelize.query(`SELECT table_name 
       FROM information_schema.tables 
       WHERE table_schema = 'public'`, { type: sequelize_1.QueryTypes.SELECT });
        console.log('\nExisting tables:', tables);
        // Get Users table structure
        const tableInfo = await models_1.sequelize.query(`SELECT column_name, data_type, is_nullable, column_default
       FROM information_schema.columns
       WHERE table_name = 'Users'`, { type: sequelize_1.QueryTypes.SELECT });
        console.log('\nUsers table structure:', tableInfo);
        // List all users
        const users = await models_1.sequelize.query('SELECT id, username, email, "isAdmin", "isStreamer" FROM "Users"', { type: sequelize_1.QueryTypes.SELECT });
        console.log('\nCurrent users:', users);
    }
    catch (error) {
        console.error('Error:', error);
    }
    finally {
        await models_1.sequelize.close();
    }
}
// Run the script
checkDatabase();
//# sourceMappingURL=check-db.js.map