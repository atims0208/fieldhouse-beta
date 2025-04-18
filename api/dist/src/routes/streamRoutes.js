"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const streamController_1 = __importDefault(require("../controllers/streamController"));
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.get('/active', streamController_1.default.getActiveStreams);
router.get('/:streamId', auth_1.optionalAuth, streamController_1.default.getStreamById);
router.post('/start', auth_1.authenticate, auth_1.requireStreamer, streamController_1.default.startStream);
router.post('/:streamId/end', auth_1.authenticate, auth_1.requireStreamer, streamController_1.default.endStream);
router.put('/:streamId/viewers', streamController_1.default.updateViewerCount);
exports.default = router;
//# sourceMappingURL=streamRoutes.js.map