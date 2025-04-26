"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("../config/database");
const User_1 = require("../models/User");
async function promoteToAdmin(username) {
    try {
        await database_1.AppDataSource.initialize();
        const userRepository = database_1.AppDataSource.getRepository(User_1.User);
        const user = await userRepository.findOne({ where: { username } });
        if (!user) {
            console.error('User not found');
            process.exit(1);
        }
        user.isAdmin = true;
        await userRepository.save(user);
        console.log(`User ${username} has been promoted to admin`);
        process.exit(0);
    }
    catch (error) {
        console.error('Error promoting user:', error);
        process.exit(1);
    }
}
const username = process.argv[2];
if (!username) {
    console.error('Please provide a username');
    process.exit(1);
}
promoteToAdmin(username);
//# sourceMappingURL=promote-to-admin.js.map