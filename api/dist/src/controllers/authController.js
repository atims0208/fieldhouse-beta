"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const database_1 = require("../config/database");
const User_1 = require("../models/User");
const typeorm_1 = require("typeorm");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const generateToken = (user) => {
    return jsonwebtoken_1.default.sign({
        id: user.id,
        username: user.username,
        email: user.email,
        isStreamer: user.isStreamer,
        isAdmin: user.isAdmin
    }, JWT_SECRET, { expiresIn: '24h' });
};
class AuthController {
    async register(req, res) {
        try {
            const { username, email, password } = req.body;
            const userRepository = database_1.AppDataSource.getRepository(User_1.User);
            const existingUser = await userRepository.findOne({
                where: [
                    { email: (0, typeorm_1.ILike)(email) },
                    { username: (0, typeorm_1.ILike)(username) }
                ]
            });
            if (existingUser) {
                res.status(400).json({ error: 'User already exists' });
                return;
            }
            const salt = await bcryptjs_1.default.genSalt(10);
            const hashedPassword = await bcryptjs_1.default.hash(password, salt);
            const user = userRepository.create({
                username,
                email,
                password: hashedPassword,
                isStreamer: false,
                isAdmin: false
            });
            await userRepository.save(user);
            const token = generateToken(user);
            res.status(201).json({
                token,
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    isStreamer: user.isStreamer,
                    isAdmin: user.isAdmin
                }
            });
        }
        catch (error) {
            console.error('Error registering user:', error);
            res.status(500).json({ error: 'Failed to register user' });
        }
    }
    async login(req, res) {
        try {
            const { email, password } = req.body;
            const userRepository = database_1.AppDataSource.getRepository(User_1.User);
            const user = await userRepository.findOne({ where: { email: (0, typeorm_1.ILike)(email) } });
            if (!user) {
                res.status(401).json({ error: 'Invalid credentials' });
                return;
            }
            const isMatch = await bcryptjs_1.default.compare(password, user.password);
            if (!isMatch) {
                res.status(401).json({ error: 'Invalid credentials' });
                return;
            }
            if (user.isBanned) {
                res.status(403).json({ error: 'User is banned' });
                return;
            }
            const token = generateToken(user);
            res.json({
                token,
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    isStreamer: user.isStreamer,
                    isAdmin: user.isAdmin
                }
            });
        }
        catch (error) {
            console.error('Error logging in:', error);
            res.status(500).json({ error: 'Failed to login' });
        }
    }
    async getCurrentUser(req, res) {
        var _a;
        try {
            if (!((_a = req.user) === null || _a === void 0 ? void 0 : _a.id)) {
                res.status(401).json({ error: 'Not authenticated' });
                return;
            }
            const userRepository = database_1.AppDataSource.getRepository(User_1.User);
            const user = await userRepository.findOne({ where: { id: req.user.id } });
            if (!user) {
                res.status(404).json({ error: 'User not found' });
                return;
            }
            res.json({
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    isStreamer: user.isStreamer,
                    isAdmin: user.isAdmin
                }
            });
        }
        catch (error) {
            console.error('Error getting current user:', error);
            res.status(500).json({ error: 'Failed to get current user' });
        }
    }
    async updateProfile(req, res) {
        var _a;
        try {
            if (!((_a = req.user) === null || _a === void 0 ? void 0 : _a.id)) {
                res.status(401).json({ error: 'Not authenticated' });
                return;
            }
            const { username, email, currentPassword, newPassword } = req.body;
            const userRepository = database_1.AppDataSource.getRepository(User_1.User);
            const user = await userRepository.findOne({ where: { id: req.user.id } });
            if (!user) {
                res.status(404).json({ error: 'User not found' });
                return;
            }
            if (email && email !== user.email) {
                const existingUser = await userRepository.findOne({ where: { email: (0, typeorm_1.ILike)(email) } });
                if (existingUser) {
                    res.status(400).json({ error: 'Email already in use' });
                    return;
                }
            }
            if (username && username !== user.username) {
                const existingUser = await userRepository.findOne({ where: { username: (0, typeorm_1.ILike)(username) } });
                if (existingUser) {
                    res.status(400).json({ error: 'Username already in use' });
                    return;
                }
            }
            if (currentPassword && newPassword) {
                const isMatch = await bcryptjs_1.default.compare(currentPassword, user.password);
                if (!isMatch) {
                    res.status(401).json({ error: 'Current password is incorrect' });
                    return;
                }
                const salt = await bcryptjs_1.default.genSalt(10);
                user.password = await bcryptjs_1.default.hash(newPassword, salt);
            }
            if (username)
                user.username = username;
            if (email)
                user.email = email;
            await userRepository.save(user);
            res.json({
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    isStreamer: user.isStreamer,
                    isAdmin: user.isAdmin
                }
            });
        }
        catch (error) {
            console.error('Error updating profile:', error);
            res.status(500).json({ error: 'Failed to update profile' });
        }
    }
}
exports.AuthController = AuthController;
exports.default = new AuthController();
//# sourceMappingURL=authController.js.map