import WebSocket, { WebSocketServer } from 'ws';
import http from 'http';
import url from 'url';

// Define a type for our extended WebSocket connection
interface WebSocketWithId extends WebSocket {
  id: string; // Unique identifier for the WebSocket connection
  streamId?: string; // ID of the stream the client is watching
  isAlive?: boolean; // For heartbeat checks
}

// Map to store clients connected to each stream
const streamClients = new Map<string, Set<WebSocketWithId>>();

// Function to initialize the WebSocket server
export const initializeWebSocket = (server: http.Server) => {
  const wss = new WebSocketServer({ server }); // Attach WebSocket server to the HTTP server

  console.log('WebSocket server initialized');

  wss.on('connection', (ws: WebSocketWithId, req: http.IncomingMessage) => {
    // Assign a unique ID to the connection
    ws.id = Math.random().toString(36).substring(2, 15);
    ws.isAlive = true;
    console.log(`WebSocket client connected: ${ws.id}`);

    // Extract streamId from the connection URL (e.g., ws://localhost:4000?streamId=xyz)
    const parameters = url.parse(req.url || '', true).query;
    const streamId = parameters.streamId as string;

    if (streamId) {
      ws.streamId = streamId;
      // Add client to the set for this stream
      if (!streamClients.has(streamId)) {
        streamClients.set(streamId, new Set());
      }
      streamClients.get(streamId)?.add(ws);
      console.log(`Client ${ws.id} joined stream ${streamId}`);
    } else {
      console.log(`Client ${ws.id} connected without a streamId`);
      // Handle clients not associated with a specific stream if necessary
    }

    // Handle messages from clients (e.g., chat messages, commands)
    ws.on('message', (message: Buffer) => {
      console.log(`Received message from ${ws.id}: ${message.toString()}`);
      // For now, we just log messages. We could handle chat or other interactions here.
      // Example: Broadcast chat message to the same stream
      // if (ws.streamId) {
      //   broadcastToStream(ws.streamId, { type: 'chat', message: message.toString() }, ws); 
      // }
    });

    // Handle pong messages for heartbeat
    ws.on('pong', () => {
      ws.isAlive = true;
    });

    // Handle client disconnection
    ws.on('close', () => {
      console.log(`WebSocket client disconnected: ${ws.id}`);
      // Remove client from the stream set
      if (ws.streamId && streamClients.has(ws.streamId)) {
        streamClients.get(ws.streamId)?.delete(ws);
        // Optional: Delete the set if it becomes empty
        if (streamClients.get(ws.streamId)?.size === 0) {
          streamClients.delete(ws.streamId);
        }
      }
    });

    // Handle errors
    ws.on('error', (error) => {
      console.error(`WebSocket error for client ${ws.id}:`, error);
      // Ensure client is removed on error too
      if (ws.streamId && streamClients.has(ws.streamId)) {
        streamClients.get(ws.streamId)?.delete(ws);
        if (streamClients.get(ws.streamId)?.size === 0) {
          streamClients.delete(ws.streamId);
        }
      }
    });
  });

  // Heartbeat mechanism to detect and remove dead connections
  const interval = setInterval(() => {
    wss.clients.forEach((client) => {
      const ws = client as WebSocketWithId;
      if (!ws.isAlive) {
        console.log(`Terminating dead connection: ${ws.id}`);
        return ws.terminate();
      }
      ws.isAlive = false;
      ws.ping();
    });
  }, 30000); // Check every 30 seconds

  wss.on('close', () => {
    clearInterval(interval); // Clean up interval on server close
    console.log('WebSocket server closed');
  });

  return wss; // Return the server instance if needed elsewhere
};

/**
 * Broadcasts a message to all clients connected to a specific stream.
 * @param {string} streamId - The ID of the stream.
 * @param {any} data - The data to send (will be JSON.stringify'd).
 * @param {WebSocketWithId} [sender] - Optional: The client who sent the message (to exclude them from broadcast).
 */
export const broadcastToStream = (streamId: string, data: any, sender?: WebSocketWithId) => {
  const clients = streamClients.get(streamId);
  if (!clients) {
    console.log(`No clients found for stream ${streamId} to broadcast to.`);
    return;
  }

  const message = JSON.stringify(data);

  clients.forEach((client) => {
    // Send to clients that are open and not the sender (if specified)
    if (client !== sender && client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
  console.log(`Broadcasted to stream ${streamId}: ${message}`);
}; 