"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Product = exports.Follow = exports.Stream = exports.User = exports.sequelize = exports.initializeAssociations = exports.syncDatabase = exports.testConnection = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const sequelize_typescript_1 = require("sequelize-typescript");
const User_1 = require("./User");
Object.defineProperty(exports, "User", { enumerable: true, get: function () { return User_1.User; } });
const Stream_1 = require("./Stream");
Object.defineProperty(exports, "Stream", { enumerable: true, get: function () { return Stream_1.Stream; } });
const Follow_1 = require("./Follow");
Object.defineProperty(exports, "Follow", { enumerable: true, get: function () { return Follow_1.Follow; } });
const Product_1 = require("./Product");
Object.defineProperty(exports, "Product", { enumerable: true, get: function () { return Product_1.Product; } });
// Load environment variables
dotenv_1.default.config();
// Log database configuration for debugging (without sensitive info)
const dbConfig = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    username: process.env.DB_USERNAME,
    database: process.env.DB_NAME,
    ssl: process.env.DB_SSL
};
console.log('Database Configuration:', dbConfig);
console.log('Attempting to connect to database...');
const sequelize = new sequelize_typescript_1.Sequelize({
    dialect: 'postgres',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '25060'),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    models: [User_1.User, Stream_1.Stream, Follow_1.Follow, Product_1.Product],
    logging: console.log,
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false
        },
        keepAlive: true,
        connectTimeout: parseInt(process.env.DB_CONNECT_TIMEOUT || '60000')
    },
    pool: {
        max: parseInt(process.env.DB_POOL_MAX || '5'),
        min: parseInt(process.env.DB_POOL_MIN || '0'),
        acquire: parseInt(process.env.DB_POOL_ACQUIRE || '30000'),
        idle: parseInt(process.env.DB_POOL_IDLE || '10000')
    },
    retry: {
        max: 3,
        match: [
            /SequelizeConnectionError/,
            /SequelizeConnectionRefusedError/,
            /SequelizeHostNotFoundError/,
            /SequelizeConnectionTimedOutError/,
            /TimeoutError/,
            /SequelizeConnectionAcquireTimeoutError/,
            /EAI_AGAIN/,
            /ENOTFOUND/
        ]
    }
});
exports.sequelize = sequelize;
// Function to test database connection with retries
const testConnection = async () => {
    const maxRetries = 3;
    let lastError;
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            console.log(`Connection attempt ${attempt}/${maxRetries}...`);
            await sequelize.authenticate();
            console.log('Database connection has been established successfully.');
            return;
        }
        catch (error) {
            lastError = error;
            console.error(`Connection attempt ${attempt} failed:`, error.message);
            if (error.original) {
                console.error('Original error:', error.original);
            }
            if (attempt < maxRetries) {
                const delay = attempt * 2000; // Exponential backoff
                console.log(`Waiting ${delay}ms before next attempt...`);
                await new Promise(resolve => setTimeout(resolve, delay));
            }
        }
    }
    throw new Error(`Failed to connect after ${maxRetries} attempts. Last error: ${lastError === null || lastError === void 0 ? void 0 : lastError.message}`);
};
exports.testConnection = testConnection;
// Function to sync models with database
const syncDatabase = async (force = false) => {
    try {
        await sequelize.sync({ force });
        console.log('Database synced successfully');
    }
    catch (error) {
        console.error('Error syncing database:', error);
        throw error;
    }
};
exports.syncDatabase = syncDatabase;
// Initialize associations between models
const initializeAssociations = () => {
    // User-Stream associations
    User_1.User.hasMany(Stream_1.Stream, { foreignKey: 'userId', as: 'userStreams' });
    Stream_1.Stream.belongsTo(User_1.User, { foreignKey: 'userId', as: 'streamer' });
    // User-Follow associations (User can follow many users)
    User_1.User.belongsToMany(User_1.User, {
        through: Follow_1.Follow,
        as: 'followedUsers',
        foreignKey: 'followerId',
        otherKey: 'followingId'
    });
    // User-Follow associations (User can be followed by many users)
    User_1.User.belongsToMany(User_1.User, {
        through: Follow_1.Follow,
        as: 'followerUsers',
        foreignKey: 'followingId',
        otherKey: 'followerId'
    });
    // User-Product associations
    User_1.User.hasMany(Product_1.Product, { foreignKey: 'userId', as: 'userProducts' });
    Product_1.Product.belongsTo(User_1.User, { foreignKey: 'userId', as: 'seller' });
};
exports.initializeAssociations = initializeAssociations;
//# sourceMappingURL=index.js.map