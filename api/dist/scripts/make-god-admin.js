"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("../models");
async function makeGodAdmin() {
    try {
        await models_1.sequelize.authenticate();
        console.log('Connected to database successfully.');
        const user = await models_1.User.findOne({ where: { username: 'god' } });
        if (!user) {
            console.error('User "god" not found. Please create this user first.');
            process.exit(1);
        }
        await user.update({
            isAdmin: true,
            isStreamer: true // Also making them a streamer for full access
        });
        console.log('Successfully made user "god" an admin and streamer.');
    }
    catch (error) {
        console.error('Error:', error);
    }
    finally {
        await models_1.sequelize.close();
    }
}
makeGodAdmin();
//# sourceMappingURL=make-god-admin.js.map