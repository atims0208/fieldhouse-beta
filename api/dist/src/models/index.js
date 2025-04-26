"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GiftTransaction = exports.Gift = exports.Product = exports.Follow = exports.Stream = exports.User = exports.syncDatabase = exports.initializeDatabase = void 0;
const User_1 = require("./User");
Object.defineProperty(exports, "User", { enumerable: true, get: function () { return User_1.User; } });
const Stream_1 = require("./Stream");
Object.defineProperty(exports, "Stream", { enumerable: true, get: function () { return Stream_1.Stream; } });
const Follow_1 = require("./Follow");
Object.defineProperty(exports, "Follow", { enumerable: true, get: function () { return Follow_1.Follow; } });
const Product_1 = require("./Product");
Object.defineProperty(exports, "Product", { enumerable: true, get: function () { return Product_1.Product; } });
const Gift_1 = require("./Gift");
Object.defineProperty(exports, "Gift", { enumerable: true, get: function () { return Gift_1.Gift; } });
const GiftTransaction_1 = require("./GiftTransaction");
Object.defineProperty(exports, "GiftTransaction", { enumerable: true, get: function () { return GiftTransaction_1.GiftTransaction; } });
const database_1 = require("../config/database");
const initializeDatabase = async () => {
    try {
        await database_1.AppDataSource.initialize();
        console.log('Database connection has been established successfully.');
    }
    catch (error) {
        console.error('Unable to connect to the database:', error);
        throw error;
    }
};
exports.initializeDatabase = initializeDatabase;
const syncDatabase = async (force = false) => {
    try {
        await database_1.AppDataSource.synchronize(force);
        console.log('Database synced successfully');
    }
    catch (error) {
        console.error('Error syncing database:', error);
        throw error;
    }
};
exports.syncDatabase = syncDatabase;
//# sourceMappingURL=index.js.map