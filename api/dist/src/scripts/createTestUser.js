"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("../config/database");
const User_1 = require("../models/User");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
async function createTestUser() {
    try {
        await database_1.AppDataSource.initialize();
        const userRepository = database_1.AppDataSource.getRepository(User_1.User);
        const existingUser = await userRepository.findOne({
            where: { email: 'test@example.com' }
        });
        if (existingUser) {
            console.log('Test user already exists');
            return existingUser;
        }
        const salt = await bcryptjs_1.default.genSalt(10);
        const hashedPassword = await bcryptjs_1.default.hash('password123', salt);
        const user = userRepository.create({
            username: 'testuser',
            email: 'test@example.com',
            password: hashedPassword,
            isAdmin: true,
            isStreamer: true
        });
        await userRepository.save(user);
        console.log('Test user created successfully');
        return user;
    }
    catch (error) {
        console.error('Error creating test user:', error);
        throw error;
    }
}
createTestUser()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
//# sourceMappingURL=createTestUser.js.map