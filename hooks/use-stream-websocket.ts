import { useState, useEffect } from 'react';

interface UseStreamWebSocketResult {
  isConnected: boolean;
}

/**
 * Custom hook for managing WebSocket connection to a stream.
 * @param streamId - The ID of the stream to connect to
 * @returns {UseStreamWebSocketResult} - An object containing connection status.
 */
export const useStreamWebSocket = (streamId: string): UseStreamWebSocketResult => {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const ws = new WebSocket(`ws://localhost:4000/ws/stream/${streamId}`);

    ws.onopen = () => {
      console.log('WebSocket connected');
      setIsConnected(true);
    };

    ws.onclose = () => {
      console.log('WebSocket disconnected');
      setIsConnected(false);
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      setIsConnected(false);
    };

    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        console.log('WebSocket message:', message);
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    // Cleanup on unmount
    return () => {
      ws.close();
    };
  }, [streamId]);

  return { isConnected };
}; 