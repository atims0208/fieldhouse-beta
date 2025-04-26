"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupWebSocket = exports.app = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const routes_1 = __importDefault(require("./routes"));
const models_1 = require("./models");
const index_1 = require("./websocket/index");
Object.defineProperty(exports, "setupWebSocket", { enumerable: true, get: function () { return index_1.setupWebSocket; } });
const app = (0, express_1.default)();
exports.app = app;
(0, models_1.initializeDatabase)()
    .then(() => console.log('Database initialized'))
    .catch(err => console.error('Database initialization error:', err));
app.use((0, cors_1.default)());
app.use((0, helmet_1.default)());
app.use(express_1.default.json());
app.use('/api', routes_1.default);
app.use((err, _req, res, _next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something broke!' });
});
//# sourceMappingURL=app.js.map