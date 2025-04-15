"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const streamController_1 = __importDefault(require("../controllers/streamController"));
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
// Get active streams (public)
router.get('/active', streamController_1.default.getActiveStreams);
// Get stream by ID (public with optional auth for follow data)
router.get('/:streamId', auth_1.optionalAuth, streamController_1.default.getStreamById);
// Start a new stream (requires streamer privileges)
router.post('/start', auth_1.authenticate, auth_1.requireStreamer, streamController_1.default.startStream);
// End a stream (requires streamer privileges)
router.post('/:streamId/end', auth_1.authenticate, auth_1.requireStreamer, streamController_1.default.endStream);
// Update viewer count
router.put('/:streamId/viewers', streamController_1.default.updateViewerCount);
exports.default = router;
//# sourceMappingURL=streamRoutes.js.map