"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authRoutes_1 = __importDefault(require("./authRoutes"));
const userRoutes_1 = __importDefault(require("./userRoutes"));
const streamRoutes_1 = __importDefault(require("./streamRoutes"));
const productRoutes_1 = __importDefault(require("./productRoutes"));
const adminRoutes_1 = __importDefault(require("./adminRoutes"));
const router = (0, express_1.Router)();
// API health check
router.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', message: 'API is running' });
});
// Auth routes
router.use('/auth', authRoutes_1.default);
// User routes
router.use('/users', userRoutes_1.default);
// Stream routes
router.use('/streams', streamRoutes_1.default);
// Product routes
router.use('/products', productRoutes_1.default);
// Admin routes
router.use('/admin', adminRoutes_1.default);
exports.default = router;
//# sourceMappingURL=index.js.map