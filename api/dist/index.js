"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http")); // Import http module
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const dotenv_1 = __importDefault(require("dotenv"));
const models_1 = require("./models");
const routes_1 = __importDefault(require("./routes"));
const websocket_1 = require("./websocket"); // Import WebSocket initializer
// Load environment variables
dotenv_1.default.config();
// Initialize express app
const app = (0, express_1.default)();
const port = process.env.PORT || 4000;
// Create HTTP server from Express app
const server = http_1.default.createServer(app);
// Middleware
app.use((0, helmet_1.default)({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    contentSecurityPolicy: false
})); // Security headers
app.use((0, cors_1.default)({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true
}));
app.use(express_1.default.json()); // Parse JSON request bodies
// --- DEBUG LOGGING: Check parsed body --- 
app.use((req, res, next) => {
    if (req.originalUrl.includes('/api/auth/login') && req.method === 'POST') {
        console.log('>>> DEBUG: Request Body after express.json():', req.body);
    }
    next();
});
// --- END DEBUG LOGGING ---
app.use(express_1.default.urlencoded({ extended: true })); // Parse URL-encoded request bodies
// API routes
app.use('/api', routes_1.default);
// Error handling middleware
app.use((err, req, res, next) => {
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
// Start server
const startServer = async () => {
    try {
        // Test database connection
        await (0, models_1.testConnection)();
        // Initialize model associations
        (0, models_1.initializeAssociations)();
        // Sync database models (without force to preserve data)
        await (0, models_1.syncDatabase)(false);
        // --- BEGIN TEMPORARY CODE TO SET ADMIN/STREAMER --- 
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
        // --- END TEMPORARY CODE --- 
        // Initialize WebSocket server
        (0, websocket_1.initializeWebSocket)(server); // Pass the HTTP server instance
        // Start listening for requests on the HTTP server
        server.listen(port, () => {
            console.log(`Server running on port ${port}`);
            console.log(`API available at http://localhost:${port}/api`);
            console.log(`WebSocket available at ws://localhost:${port}`); // Log WebSocket URL
        });
    }
    catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};
startServer();
//# sourceMappingURL=index.js.map