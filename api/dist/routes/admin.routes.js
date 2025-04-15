"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const admin_controller_1 = require("../controllers/admin.controller");
const auth_1 = require("../middleware/auth");
const User_1 = require("../models/User");
const router = (0, express_1.Router)();
// Middleware to check if user is admin
const isAdmin = async (req, res, next) => {
    try {
        const user = await User_1.User.findByPk(req.user.id);
        if (!(user === null || user === void 0 ? void 0 : user.isAdmin)) {
            return res.status(403).json({ error: 'Access denied. Admin privileges required.' });
        }
        next();
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to verify admin status' });
    }
};
// Apply authentication and admin check middleware to all routes
router.use(auth_1.authenticate, auth_1.requireAdmin);
// User management routes
router.get('/users', admin_controller_1.AdminController.getAllUsers);
router.patch('/users/:userId/status', admin_controller_1.AdminController.updateUserStatus);
// Stream management routes
router.get('/streams/active', admin_controller_1.AdminController.getActiveStreams);
router.post('/streams/:streamId/end', admin_controller_1.AdminController.endStream);
// Streamer request management routes
router.get('/streamer-requests', admin_controller_1.AdminController.getStreamerRequests);
router.post('/streamer-requests/:userId', admin_controller_1.AdminController.handleStreamerRequest);
// Statistics route
router.get('/statistics', admin_controller_1.AdminController.getStatistics);
exports.default = router;
//# sourceMappingURL=admin.routes.js.map