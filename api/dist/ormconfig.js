"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config = {
    type: 'postgres',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: process.env.NODE_ENV !== 'production',
    logging: process.env.NODE_ENV !== 'production',
    entities: ['src/models/**/*.ts'],
    migrations: ['src/migrations/**/*.ts'],
    subscribers: ['src/subscribers/**/*.ts'],
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
};
exports.default = config;
//# sourceMappingURL=ormconfig.js.map