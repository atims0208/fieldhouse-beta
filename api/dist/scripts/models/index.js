"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Product = exports.Follow = exports.Stream = exports.User = exports.sequelize = exports.initializeAssociations = exports.syncDatabase = exports.testConnection = void 0;
var dotenv_1 = __importDefault(require("dotenv"));
var sequelize_typescript_1 = require("sequelize-typescript");
var User_1 = require("./User");
Object.defineProperty(exports, "User", { enumerable: true, get: function () { return User_1.User; } });
var Stream_1 = require("./Stream");
Object.defineProperty(exports, "Stream", { enumerable: true, get: function () { return Stream_1.Stream; } });
var Follow_1 = require("./Follow");
Object.defineProperty(exports, "Follow", { enumerable: true, get: function () { return Follow_1.Follow; } });
var Product_1 = require("./Product");
Object.defineProperty(exports, "Product", { enumerable: true, get: function () { return Product_1.Product; } });
// Load environment variables
dotenv_1.default.config();
// Log database configuration for debugging (without sensitive info)
var dbConfig = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    username: process.env.DB_USERNAME,
    database: process.env.DB_NAME,
    ssl: process.env.DB_SSL
};
console.log('Database Configuration:', dbConfig);
console.log('Attempting to connect to database...');
var sequelize = new sequelize_typescript_1.Sequelize({
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
var testConnection = function () { return __awaiter(void 0, void 0, void 0, function () {
    var maxRetries, lastError, _loop_1, attempt, state_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                maxRetries = 3;
                _loop_1 = function (attempt) {
                    var error_1, delay_1;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                _b.trys.push([0, 2, , 5]);
                                console.log("Connection attempt ".concat(attempt, "/").concat(maxRetries, "..."));
                                return [4 /*yield*/, sequelize.authenticate()];
                            case 1:
                                _b.sent();
                                console.log('Database connection has been established successfully.');
                                return [2 /*return*/, { value: void 0 }];
                            case 2:
                                error_1 = _b.sent();
                                lastError = error_1;
                                console.error("Connection attempt ".concat(attempt, " failed:"), error_1.message);
                                if (error_1.original) {
                                    console.error('Original error:', error_1.original);
                                }
                                if (!(attempt < maxRetries)) return [3 /*break*/, 4];
                                delay_1 = attempt * 2000;
                                console.log("Waiting ".concat(delay_1, "ms before next attempt..."));
                                return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, delay_1); })];
                            case 3:
                                _b.sent();
                                _b.label = 4;
                            case 4: return [3 /*break*/, 5];
                            case 5: return [2 /*return*/];
                        }
                    });
                };
                attempt = 1;
                _a.label = 1;
            case 1:
                if (!(attempt <= maxRetries)) return [3 /*break*/, 4];
                return [5 /*yield**/, _loop_1(attempt)];
            case 2:
                state_1 = _a.sent();
                if (typeof state_1 === "object")
                    return [2 /*return*/, state_1.value];
                _a.label = 3;
            case 3:
                attempt++;
                return [3 /*break*/, 1];
            case 4: throw new Error("Failed to connect after ".concat(maxRetries, " attempts. Last error: ").concat(lastError === null || lastError === void 0 ? void 0 : lastError.message));
        }
    });
}); };
exports.testConnection = testConnection;
// Function to sync models with database
var syncDatabase = function () {
    var args_1 = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args_1[_i] = arguments[_i];
    }
    return __awaiter(void 0, __spreadArray([], args_1, true), void 0, function (force) {
        var error_2;
        if (force === void 0) { force = false; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, sequelize.sync({ force: force })];
                case 1:
                    _a.sent();
                    console.log('Database synced successfully');
                    return [3 /*break*/, 3];
                case 2:
                    error_2 = _a.sent();
                    console.error('Error syncing database:', error_2);
                    throw error_2;
                case 3: return [2 /*return*/];
            }
        });
    });
};
exports.syncDatabase = syncDatabase;
// Initialize associations between models
var initializeAssociations = function () {
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
