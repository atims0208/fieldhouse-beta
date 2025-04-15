"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("../models");
const sequelize_1 = require("sequelize");
async function makeUserAdmin(identifier) {
    try {
        await models_1.sequelize.authenticate();
        console.log('Connected to database successfully.');
        const user = await models_1.User.findOne({
            where: {
                [sequelize_1.Op.or]: [
                    { email: identifier },
                    { username: identifier }
                ]
            }
        });
        if (!user) {
            console.error('User not found');
            process.exit(1);
        }
        user.isAdmin = true;
        await user.save();
        console.log(`Successfully made user ${user.username} an admin`);
    }
    catch (error) {
        console.error('Error:', error);
    }
    finally {
        await models_1.sequelize.close();
    }
}
// Get the identifier from command line argument
const identifier = process.argv[2];
if (!identifier) {
    console.error('Please provide an email or username as an argument');
    process.exit(1);
}
makeUserAdmin(identifier);
//# sourceMappingURL=makeAdmin.js.map