"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAdmin = exports.requireStreamer = exports.optionalAuth = exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// Authentication middleware
const authenticate = async (req, res, next) => {
    try {
        // Get token from header
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            res.status(401).json({ message: 'No token provided, authorization denied' });
            return;
        }
        const token = authHeader.split(' ')[1];
        // Verify token
        const secret = process.env.JWT_SECRET || 'fieldhouse_secret_key_change_in_production';
        const decoded = jsonwebtoken_1.default.verify(token, secret);
        // Add user to request
        req.user = {
            id: decoded.id,
            username: decoded.username,
            email: decoded.email,
            isStreamer: decoded.isStreamer,
            isAdmin: decoded.isAdmin
        };
        next();
    }
    catch (error) {
        res.status(401).json({ message: 'Token is invalid or expired' });
    }
};
exports.authenticate = authenticate;
// Optional authentication middleware (won't reject if no token)
const optionalAuth = async (req, res, next) => {
    try {
        // Get token from header
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            // Continue without authentication if no token
            next();
            return;
        }
        const token = authHeader.split(' ')[1];
        // Verify token
        const secret = process.env.JWT_SECRET || 'fieldhouse_secret_key_change_in_production';
        const decoded = jsonwebtoken_1.default.verify(token, secret);
        // Add user to request
        req.user = {
            id: decoded.id,
            username: decoded.username,
            email: decoded.email,
            isStreamer: decoded.isStreamer,
            isAdmin: decoded.isAdmin
        };
        next();
    }
    catch (error) {
        // Continue without authentication if token is invalid
        next();
    }
};
exports.optionalAuth = optionalAuth;
// Streamer required middleware
const requireStreamer = async (req, res, next) => {
    if (!req.user) {
        res.status(401).json({ message: 'Authentication required' });
        return;
    }
    if (!req.user.isStreamer) {
        res.status(403).json({ message: 'Streamer privileges required' });
        return;
    }
    next();
};
exports.requireStreamer = requireStreamer;
// Admin required middleware
const requireAdmin = async (req, res, next) => {
    // First, ensure the user is authenticated
    if (!req.user) {
        res.status(401).json({ message: 'Authentication required' });
        return;
    }
    // Then, check if the authenticated user is an admin
    if (!req.user.isAdmin) {
        res.status(403).json({ message: 'Admin privileges required' });
        return;
    }
    // If authenticated and admin, proceed
    next();
};
exports.requireAdmin = requireAdmin;
//# sourceMappingURL=auth.js.map