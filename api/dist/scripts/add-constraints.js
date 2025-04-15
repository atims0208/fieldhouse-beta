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
async function addConstraints() {
    try {
        // Test connection
        await models_1.sequelize.authenticate();
        console.log('Connected to database successfully.');
        // Add unique constraint for username
        await models_1.sequelize.query('ALTER TABLE "Users" ADD CONSTRAINT "Users_username_key" UNIQUE ("username");', { type: sequelize_1.QueryTypes.RAW });
        console.log('Added unique constraint for username');
        // Add unique constraint for email
        await models_1.sequelize.query('ALTER TABLE "Users" ADD CONSTRAINT "Users_email_key" UNIQUE ("email");', { type: sequelize_1.QueryTypes.RAW });
        console.log('Added unique constraint for email');
        console.log('Successfully added constraints');
    }
    catch (error) {
        console.error('Error:', error);
    }
    finally {
        await models_1.sequelize.close();
    }
}
// Run the script
addConstraints();
//# sourceMappingURL=add-constraints.js.map