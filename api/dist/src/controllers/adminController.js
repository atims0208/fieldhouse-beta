"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.tempGrantSuperpowers = exports.stopStream = exports.listStreams = exports.setUserBanStatus = exports.listUsers = void 0;
const adminService = __importStar(require("../services/adminService"));
const models_1 = require("../models");
const listUsers = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const result = await adminService.getAllUsers(page, limit);
        res.status(200).json(result);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching users', error: error.message });
    }
};
exports.listUsers = listUsers;
const setUserBanStatus = async (req, res) => {
    try {
        const { userId } = req.params;
        const { banStatus, durationHours } = req.body;
        if (typeof banStatus !== 'boolean') {
            res.status(400).json({ message: 'banStatus (boolean) is required in request body' });
            return;
        }
        if (durationHours && (typeof durationHours !== 'number' || durationHours <= 0)) {
            res.status(400).json({ message: 'Invalid durationHours (must be a positive number)' });
            return;
        }
        const updatedUser = await adminService.setUserBanStatus(userId, banStatus, durationHours);
        res.status(200).json(updatedUser);
    }
    catch (error) {
        let statusCode = 500;
        let message = 'Could not update user ban status';
        if (error instanceof Error) {
            if (error.message === 'User not found') {
                statusCode = 404;
                message = error.message;
            }
            else if (error.message === 'Cannot ban an admin user.') {
                statusCode = 403;
                message = error.message;
            }
        }
        res.status(statusCode).json({ message: message, error: (error === null || error === void 0 ? void 0 : error.message) || 'Unknown error' });
    }
};
exports.setUserBanStatus = setUserBanStatus;
const listStreams = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const result = await adminService.getAllStreams(page, limit);
        res.status(200).json(result);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching streams', error: error.message });
    }
};
exports.listStreams = listStreams;
const stopStream = async (req, res) => {
    try {
        const { streamId } = req.params;
        const stoppedStream = await adminService.stopLiveStream(streamId);
        res.status(200).json(stoppedStream);
    }
    catch (error) {
        let statusCode = 500;
        let message = 'Could not stop stream';
        if (error instanceof Error && error.message === 'Live stream not found') {
            statusCode = 404;
            message = error.message;
        }
        res.status(statusCode).json({ message: message, error: (error === null || error === void 0 ? void 0 : error.message) || 'Unknown error' });
    }
};
exports.stopStream = stopStream;
const tempGrantSuperpowers = async (req, res) => {
    var _a, _b;
    const targetEmail = 'itsthealvin@gmail.com';
    console.log(`>>> TEMPORARY: Received request to grant superpowers to ${targetEmail}`);
    if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.email) !== targetEmail) {
        console.warn(`>>> TEMPORARY: Unauthorized attempt to grant superpowers by ${(_b = req.user) === null || _b === void 0 ? void 0 : _b.email}`);
        res.status(403).json({ message: 'Forbidden: You can only run this for your own account.' });
        return;
    }
    try {
        const userToUpdate = await models_1.User.findOne({ where: { email: targetEmail } });
        if (userToUpdate) {
            let updated = false;
            if (!userToUpdate.isAdmin) {
                userToUpdate.isAdmin = true;
                updated = true;
                console.log(`>>> TEMPORARY: Setting isAdmin=true for ${targetEmail}`);
            }
            if (!userToUpdate.isStreamer) {
                userToUpdate.isStreamer = true;
                updated = true;
                console.log(`>>> TEMPORARY: Setting isStreamer=true for ${targetEmail}`);
            }
            if (updated) {
                await userToUpdate.save();
                console.log(`>>> TEMPORARY: User ${targetEmail} successfully updated.`);
                res.status(200).json({ message: `User ${targetEmail} updated successfully. Please log out and log back in.` });
            }
            else {
                console.log(`>>> TEMPORARY: User ${targetEmail} already has admin and streamer status.`);
                res.status(200).json({ message: `User ${targetEmail} already has necessary privileges.` });
            }
        }
        else {
            console.log(`>>> TEMPORARY: User ${targetEmail} not found.`);
            res.status(404).json({ message: `User ${targetEmail} not found.` });
        }
    }
    catch (err) {
        console.error(`>>> TEMPORARY: Failed to update user ${targetEmail}:`, err);
        res.status(500).json({ message: 'Failed to update user privileges.', error: err.message });
    }
};
exports.tempGrantSuperpowers = tempGrantSuperpowers;
//# sourceMappingURL=adminController.js.map