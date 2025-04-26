"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authRoutes_1 = __importDefault(require("./authRoutes"));
const adminRoutes_1 = __importDefault(require("./adminRoutes"));
const streamRoutes_1 = __importDefault(require("./streamRoutes"));
const userRoutes_1 = __importDefault(require("./userRoutes"));
const productRoutes_1 = __importDefault(require("./productRoutes"));
const router = (0, express_1.Router)();
router.get('/health', (_req, res) => {
    res.json({ status: 'ok' });
});
router.use('/auth', authRoutes_1.default);
router.use('/admin', adminRoutes_1.default);
router.use('/streams', streamRoutes_1.default);
router.use('/users', userRoutes_1.default);
router.use('/products', productRoutes_1.default);
exports.default = router;
//# sourceMappingURL=index.js.map