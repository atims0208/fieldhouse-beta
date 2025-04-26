"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const admin_controller_1 = __importDefault(require("../controllers/admin.controller"));
const database_1 = require("../config/database");
const User_1 = require("../models/User");
const router = (0, express_1.Router)();
const isAdmin = async (req, res, next) => {
    try {
        const userRepository = database_1.AppDataSource.getRepository(User_1.User);
        const user = await userRepository.findOne({ where: { id: req.user.id } });
        if (!user || !user.isAdmin) {
            return res.status(403).json({ error: 'Access denied' });
        }
        next();
    }
    catch (error) {
        res.status(500).json({ error: 'Error checking admin status' });
    }
};
router.use(auth_1.authenticate, isAdmin);
router.get('/users', admin_controller_1.default.getUsers);
router.post('/users/:userId/ban', admin_controller_1.default.banUser);
router.post('/users/:userId/unban', admin_controller_1.default.unbanUser);
router.post('/users/make-admin', admin_controller_1.default.updateUserAdminStatus);
router.get('/streams', admin_controller_1.default.getStreams);
router.delete('/streams/:streamId', admin_controller_1.default.deleteStream);
exports.default = router;
//# sourceMappingURL=admin.routes.js.map