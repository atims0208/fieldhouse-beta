"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("../models");
async function makeAdmin(username) {
    try {
        await models_1.sequelize.authenticate();
        console.log('Connected to database successfully.');
        const user = await models_1.User.findOne({ where: { username } });
        if (!user) {
            console.error(`User with username "${username}" not found.`);
            process.exit(1);
        }
        await user.update({ isAdmin: true });
        console.log(`Successfully made user "${username}" an admin.`);
    }
    catch (error) {
        console.error('Error:', error);
    }
    finally {
        await models_1.sequelize.close();
    }
}
const username = process.argv[2];
if (!username) {
    console.error('Please provide a username as an argument.');
    process.exit(1);
}
makeAdmin(username);
//# sourceMappingURL=promote-to-admin.js.map