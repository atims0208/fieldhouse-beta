import { Server } from 'http';
import { WebSocketServer } from 'ws';
import { handleGiftMessage } from './giftHandler';

export function setupWebSocket(server: Server) {
  const wss = new WebSocketServer({ server });

  wss.on('connection', (ws) => {
    console.log('New WebSocket connection');

    ws.on('message', async (message) => {
      try {
        const data = JSON.parse(message.toString());
        
        switch (data.type) {
          case 'gift':
            await handleGiftMessage(ws, data);
            break;
          default:
            ws.send(JSON.stringify({ error: 'Unknown message type' }));
        }
      } catch (error) {
        console.error('WebSocket message error:', error);
        ws.send(JSON.stringify({ error: 'Failed to process message' }));
      }
    });

    ws.on('close', () => {
      console.log('Client disconnected');
    });
  });

  return wss;
} 