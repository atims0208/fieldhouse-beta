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
const User_1 = require("./models/User");
const Stream_1 = require("./models/Stream");
const Product_1 = require("./models/Product");
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const streamRoutes_1 = __importDefault(require("./routes/streamRoutes"));
const productRoutes_1 = __importDefault(require("./routes/productRoutes"));
const adminRoutes_1 = __importDefault(require("./routes/adminRoutes"));
const typeorm_2 = require("typeorm");
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
expressApp.use('/api/auth', authRoutes_1.default);
expressApp.use('/api/streams', streamRoutes_1.default);
expressApp.use('/api/products', productRoutes_1.default);
expressApp.use('/api/admin', adminRoutes_1.default);
expressApp.get('/api/health', async (_req, res) => {
    try {
        const dataSource = new typeorm_1.DataSource(ormconfig_1.default);
        await dataSource.initialize();
        await dataSource.destroy();
        const requiredEnvVars = [
            'JWT_SECRET',
            'BUNNY_API_KEY',
            'BUNNY_LIBRARY_ID',
            'DB_HOST',
            'DB_PORT',
            'DB_USERNAME',
            'DB_PASSWORD',
            'DB_NAME'
        ];
        const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);
        if (missingEnvVars.length > 0) {
            throw new Error(`Missing required environment variables: ${missingEnvVars.join(', ')}`);
        }
        return res.json({ status: 'healthy' });
    }
    catch (error) {
        console.error('Health check failed:', error);
        return res.status(503).json({
            status: 'unhealthy',
            error: error instanceof Error ? error.message : 'Unknown error occurred'
        });
    }
});
expressApp.get('/api/search', async (req, res) => {
    try {
        const { query } = req.query;
        if (!query || typeof query !== 'string') {
            return res.status(400).json({ error: 'Search query is required' });
        }
        const dataSource = new typeorm_1.DataSource(ormconfig_1.default);
        await dataSource.initialize();
        const userRepository = dataSource.getRepository(User_1.User);
        const streamRepository = dataSource.getRepository(Stream_1.Stream);
        const productRepository = dataSource.getRepository(Product_1.Product);
        const [users, streams, products] = await Promise.all([
            userRepository.find({
                where: [
                    { username: (0, typeorm_2.ILike)(`%${query}%`) },
                    { email: (0, typeorm_2.ILike)(`%${query}%`) }
                ],
                take: 5
            }),
            streamRepository.find({
                where: { title: (0, typeorm_2.ILike)(`%${query}%`) },
                relations: ['user'],
                take: 5
            }),
            productRepository.find({
                where: { name: (0, typeorm_2.ILike)(`%${query}%`) },
                relations: ['seller'],
                take: 5
            })
        ]);
        await dataSource.destroy();
        return res.json({
            users: users.map(user => ({
                id: user.id,
                username: user.username,
                email: user.email,
                isStreamer: user.isStreamer
            })),
            streams: streams.map(stream => {
                var _a;
                return ({
                    id: stream.id,
                    title: stream.title,
                    description: stream.description,
                    userId: stream.userId,
                    username: ((_a = stream.user) === null || _a === void 0 ? void 0 : _a.username) || 'Unknown'
                });
            }),
            products: products.map(product => {
                var _a;
                return ({
                    id: product.id,
                    name: product.name,
                    description: product.description,
                    price: product.price,
                    sellerId: product.sellerId,
                    username: ((_a = product.seller) === null || _a === void 0 ? void 0 : _a.username) || 'Unknown'
                });
            })
        });
    }
    catch (error) {
        console.error('Search failed:', error);
        return res.status(500).json({
            error: error instanceof Error ? error.message : 'Unknown error occurred'
        });
    }
});
expressApp.use((err, _req, res, _next) => {
    console.error('Global error handler:', err);
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    return res.status(statusCode).json({
        error: {
            message,
            status: statusCode
        }
    });
});
const initializeApp = async () => {
    try {
        const dataSource = new typeorm_1.DataSource(ormconfig_1.default);
        await dataSource.initialize();
        if (process.env.NODE_ENV === 'development') {
            const targetEmail = 'itsthealvin@gmail.com';
            const userRepository = dataSource.getRepository(User_1.User);
            try {
                const userToUpdate = await userRepository.findOne({ where: { email: targetEmail } });
                if (userToUpdate && (!userToUpdate.isAdmin || !userToUpdate.isStreamer)) {
                    console.log(`>>> TEMPORARY: Updating user ${targetEmail} to admin/streamer...`);
                    userToUpdate.isAdmin = true;
                    userToUpdate.isStreamer = true;
                    await userRepository.save(userToUpdate);
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
        server.listen(port, () => {
            console.log(`Server running on port ${port}`);
            console.log(`API available at http://localhost:${port}/api`);
        });
    }
    catch (error) {
        console.error('Error during application initialization:', error);
        process.exit(1);
    }
};
initializeApp();
//# sourceMappingURL=index.js.map