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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.broadcastToStream = exports.initializeWebSocket = void 0;
const ws_1 = __importStar(require("ws"));
const url_1 = __importDefault(require("url"));
const streamClients = new Map();
const initializeWebSocket = (server) => {
    const wss = new ws_1.WebSocketServer({ server });
    console.log('WebSocket server initialized');
    wss.on('connection', (ws, req) => {
        var _a;
        ws.id = Math.random().toString(36).substring(2, 15);
        ws.isAlive = true;
        console.log(`WebSocket client connected: ${ws.id}`);
        const parameters = url_1.default.parse(req.url || '', true).query;
        const streamId = parameters.streamId;
        if (streamId) {
            ws.streamId = streamId;
            if (!streamClients.has(streamId)) {
                streamClients.set(streamId, new Set());
            }
            (_a = streamClients.get(streamId)) === null || _a === void 0 ? void 0 : _a.add(ws);
            console.log(`Client ${ws.id} joined stream ${streamId}`);
        }
        else {
            console.log(`Client ${ws.id} connected without a streamId`);
        }
        ws.on('message', (message) => {
            console.log(`Received message from ${ws.id}: ${message.toString()}`);
        });
        ws.on('pong', () => {
            ws.isAlive = true;
        });
        ws.on('close', () => {
            var _a, _b;
            console.log(`WebSocket client disconnected: ${ws.id}`);
            if (ws.streamId && streamClients.has(ws.streamId)) {
                (_a = streamClients.get(ws.streamId)) === null || _a === void 0 ? void 0 : _a.delete(ws);
                if (((_b = streamClients.get(ws.streamId)) === null || _b === void 0 ? void 0 : _b.size) === 0) {
                    streamClients.delete(ws.streamId);
                }
            }
        });
        ws.on('error', (error) => {
            var _a, _b;
            console.error(`WebSocket error for client ${ws.id}:`, error);
            if (ws.streamId && streamClients.has(ws.streamId)) {
                (_a = streamClients.get(ws.streamId)) === null || _a === void 0 ? void 0 : _a.delete(ws);
                if (((_b = streamClients.get(ws.streamId)) === null || _b === void 0 ? void 0 : _b.size) === 0) {
                    streamClients.delete(ws.streamId);
                }
            }
        });
    });
    const interval = setInterval(() => {
        wss.clients.forEach((client) => {
            const ws = client;
            if (!ws.isAlive) {
                console.log(`Terminating dead connection: ${ws.id}`);
                return ws.terminate();
            }
            ws.isAlive = false;
            ws.ping();
        });
    }, 30000);
    wss.on('close', () => {
        clearInterval(interval);
        console.log('WebSocket server closed');
    });
    return wss;
};
exports.initializeWebSocket = initializeWebSocket;
const broadcastToStream = (streamId, data, sender) => {
    const clients = streamClients.get(streamId);
    if (!clients) {
        console.log(`No clients found for stream ${streamId} to broadcast to.`);
        return;
    }
    const message = JSON.stringify(data);
    clients.forEach((client) => {
        if (client !== sender && client.readyState === ws_1.default.OPEN) {
            client.send(message);
        }
    });
    console.log(`Broadcasted to stream ${streamId}: ${message}`);
};
exports.broadcastToStream = broadcastToStream;
//# sourceMappingURL=websocket.js.map