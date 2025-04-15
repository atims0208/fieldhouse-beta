"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = __importDefault(require("../controllers/userController"));
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
// Get user profile by username (public)
router.get('/profile/:username', auth_1.optionalAuth, userController_1.default.getUserProfile);
// Update user profile (authenticated)
router.put('/profile', auth_1.authenticate, userController_1.default.updateProfile);
// Upgrade to streamer (authenticated)
router.post('/upgrade-to-streamer', auth_1.authenticate, userController_1.default.upgradeToStreamer);
// Follow a user (authenticated)
router.post('/follow/:username', auth_1.authenticate, userController_1.default.followUser);
// Unfollow a user (authenticated)
router.delete('/follow/:username', auth_1.authenticate, userController_1.default.unfollowUser);
// Get following list (authenticated)
router.get('/following', auth_1.authenticate, userController_1.default.getFollowing);
exports.default = router;
//# sourceMappingURL=userRoutes.js.map