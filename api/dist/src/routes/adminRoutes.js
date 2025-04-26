"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const adminController_1 = __importDefault(require("../controllers/adminController"));
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.use(auth_1.authenticate);
router.use(auth_1.requireAdmin);
router.get('/users', adminController_1.default.getUsers.bind(adminController_1.default));
router.post('/users/:userId/ban', adminController_1.default.banUser.bind(adminController_1.default));
router.post('/users/:userId/unban', adminController_1.default.unbanUser.bind(adminController_1.default));
router.get('/streams', adminController_1.default.getStreams.bind(adminController_1.default));
router.post('/streams/:streamId/stop', adminController_1.default.stopStream.bind(adminController_1.default));
router.patch('/streams/:streamId/status', adminController_1.default.updateStreamStatus.bind(adminController_1.default));
router.delete('/streams/:streamId', adminController_1.default.deleteStream.bind(adminController_1.default));
router.patch('/users/admin-status', adminController_1.default.updateUserAdminStatus.bind(adminController_1.default));
exports.default = router;
//# sourceMappingURL=adminRoutes.js.map