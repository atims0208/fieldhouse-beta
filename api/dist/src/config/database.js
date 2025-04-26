"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeDatabase = exports.AppDataSource = void 0;
const typeorm_1 = require("typeorm");
const User_1 = require("../models/User");
const Stream_1 = require("../models/Stream");
const Product_1 = require("../models/Product");
const Follow_1 = require("../models/Follow");
const Gift_1 = require("../models/Gift");
const GiftTransaction_1 = require("../models/GiftTransaction");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.AppDataSource = new typeorm_1.DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: process.env.NODE_ENV !== 'production',
    logging: process.env.NODE_ENV !== 'production',
    entities: [User_1.User, Stream_1.Stream, Product_1.Product, Follow_1.Follow, Gift_1.Gift, GiftTransaction_1.GiftTransaction],
    migrations: [],
    subscribers: [],
    ssl: process.env.DB_SSL === 'true' ? {
        rejectUnauthorized: false
    } : false,
    extra: {
        connectionTimeoutMillis: parseInt(process.env.DB_CONNECT_TIMEOUT || '30000'),
        max: parseInt(process.env.DB_POOL_MAX || '5'),
        min: parseInt(process.env.DB_POOL_MIN || '0'),
        acquireTimeoutMillis: parseInt(process.env.DB_POOL_ACQUIRE || '30000'),
        idleTimeoutMillis: parseInt(process.env.DB_POOL_IDLE || '10000')
    }
});
const initializeDatabase = async () => {
    try {
        await exports.AppDataSource.initialize();
        console.log('Database connection established successfully');
    }
    catch (error) {
        console.error('Error connecting to database:', error);
        throw error;
    }
};
exports.initializeDatabase = initializeDatabase;
exports.default = exports.AppDataSource;
//# sourceMappingURL=database.js.map