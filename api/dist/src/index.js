"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const ormconfig_1 = __importDefault(require("../ormconfig"));
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const dotenv_1 = __importDefault(require("dotenv"));
const models_1 = require("./models");
const routes_1 = __importDefault(require("./routes"));
const websocket_1 = require("./websocket");
dotenv_1.default.config();
console.log('--- BEGIN DEBUG LOGGING ---');
console.log('Environment Variables:');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_PORT:', process.env.DB_PORT);
console.log('DB_NAME:', process.env.DB_NAME);
console.log('DB_USERNAME:', process.env.DB_USERNAME);
console.log('DB_SSL:', process.env.DB_SSL);
console.log('--- END DEBUG LOGGING ---');
const expressApp = (0, express_1.default)();
const port = process.env.PORT || 4000;
const server = http_1.default.createServer(expressApp);
expressApp.use((0, helmet_1.default)({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    contentSecurityPolicy: false
}));
expressApp.use((0, cors_1.default)({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true
}));
expressApp.use(express_1.default.json());
expressApp.use((req, _res, next) => {
    if (req.originalUrl.includes('/api/auth/login') && req.method === 'POST') {
        console.log('>>> DEBUG: Request Body after express.json():', req.body);
    }
    next();
});
expressApp.use(express_1.default.urlencoded({ extended: true }));
expressApp.use('/api', routes_1.default);
expressApp.use((err, _req, res, _next) => {
    console.error('Global error handler:', err);
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    res.status(statusCode).json({
        error: {
            message,
            status: statusCode
        }
    });
});
const AppDataSource = new typeorm_1.DataSource(ormconfig_1.default);
const initializeApp = async () => {
    try {
        await AppDataSource.initialize();
        await (0, models_1.testConnection)();
        (0, models_1.initializeAssociations)();
        await (0, models_1.syncDatabase)(false);
        if (process.env.NODE_ENV === 'development') {
            const targetEmail = 'itsthealvin@gmail.com';
            try {
                const userToUpdate = await models_1.User.findOne({ where: { email: targetEmail } });
                if (userToUpdate && (!userToUpdate.isAdmin || !userToUpdate.isStreamer)) {
                    console.log(`>>> TEMPORARY: Updating user ${targetEmail} to admin/streamer...`);
                    userToUpdate.isAdmin = true;
                    userToUpdate.isStreamer = true;
                    await userToUpdate.save();
                    console.log(`>>> TEMPORARY: User ${targetEmail} updated successfully.`);
                }
                else if (userToUpdate) {
                    console.log(`>>> TEMPORARY: User ${targetEmail} already has admin/streamer status.`);
                }
                else {
                    console.log(`>>> TEMPORARY: User ${targetEmail} not found for update.`);
                }
            }
            catch (err) {
                console.error(`>>> TEMPORARY: Failed to update user ${targetEmail}:`, err);
            }
        }
        (0, websocket_1.initializeWebSocket)(server);
        server.listen(port, () => {
            console.log(`Server running on port ${port}`);
            console.log(`API available at http://localhost:${port}/api`);
            console.log(`WebSocket available at ws://localhost:${port}`);
        });
    }
    catch (error) {
        console.error('Error during application initialization:', error);
        process.exit(1);
    }
};
initializeApp();
//# sourceMappingURL=index.js.map