"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("../models");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
async function createTestUser() {
    try {
        const [user, created] = await models_1.User.findOrCreate({
            where: { email: 'itsthealvin@gmail.com' },
            defaults: {
                username: 'itsthealvin',
                email: 'itsthealvin@gmail.com',
                password: 'test123',
                isAdmin: true,
                isStreamer: true
            }
        });
        if (!created) {
            user.isAdmin = true;
            user.isStreamer = true;
            user.password = 'test123';
            await user.save();
            console.log('Test user updated:', user.toJSON());
        }
        else {
            console.log('Test user created:', user.toJSON());
        }
    }
    catch (error) {
        console.error('Failed to create test user:', error);
    }
}
createTestUser();
//# sourceMappingURL=createTestUser.js.map