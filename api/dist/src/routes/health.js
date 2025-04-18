"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const data_source_1 = require("../data-source");
const router = (0, express_1.Router)();
router.get('/', async (_req, res) => {
    try {
        const isDbConnected = data_source_1.AppDataSource.isInitialized;
        const memoryUsage = process.memoryUsage();
        const memoryUsageMB = {
            heapUsed: Math.round(memoryUsage.heapUsed / 1024 / 1024),
            heapTotal: Math.round(memoryUsage.heapTotal / 1024 / 1024),
            rss: Math.round(memoryUsage.rss / 1024 / 1024),
        };
        return res.status(200).json({
            status: 'healthy',
            timestamp: new Date().toISOString(),
            database: isDbConnected ? 'connected' : 'disconnected',
            uptime: process.uptime(),
            memoryUsage: memoryUsageMB,
        });
    }
    catch (error) {
        console.error('Health check failed:', error);
        return res.status(503).json({
            status: 'unhealthy',
            timestamp: new Date().toISOString(),
            error: 'Health check failed',
            database: 'disconnected',
        });
    }
});
exports.default = router;
//# sourceMappingURL=health.js.map