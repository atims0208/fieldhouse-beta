"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const typeorm_1 = require("typeorm");
const health_1 = __importDefault(require("./routes/health"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
}));
app.use(express_1.default.json());
app.use('/api/health', health_1.default);
(0, typeorm_1.createConnection)()
    .then(() => {
    console.log('Database connected successfully');
})
    .catch((error) => {
    console.error('Database connection failed:', error);
});
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        status: 'error',
        message: 'Internal server error',
    });
});
exports.default = app;
//# sourceMappingURL=app.js.map