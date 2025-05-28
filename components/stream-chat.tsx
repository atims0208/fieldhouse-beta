"use client";

import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { getInitials } from '@/lib/utils';
import { Send } from 'lucide-react';
import axios from 'axios';

interface ChatMessage {
  id: string;
  content: string;
  createdAt: string;
  user: {
    id: string;
    username: string;
    displayName?: string;
    avatarUrl?: string;
    isStreamer: boolean;
  };
}

interface StreamChatProps {
  streamId: string;
  className?: string;
}

export function StreamChat({ streamId, className }: StreamChatProps) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [socket, setSocket] = useState<WebSocket | null>(null);

  // Connect to WebSocket
  useEffect(() => {
    const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsHost = process.env.NEXT_PUBLIC_WS_HOST || window.location.host;
    const wsUrl = `${wsProtocol}//${wsHost}/ws/chat/${streamId}`;
    
    const ws = new WebSocket(wsUrl);
    
    ws.onopen = () => {
      console.log('WebSocket connected');
    };
    
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'chat') {
          setMessages((prev) => [...prev, data.message]);
          scrollToBottom();
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };
    
    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
    
    ws.onclose = () => {
      console.log('WebSocket disconnected');
    };
    
    setSocket(ws);
    
    return () => {
      ws.close();
    };
  }, [streamId]);

  // Fetch initial messages
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get(`/api/streams/${streamId}/chat`);
        setMessages(response.data);
        scrollToBottom();
      } catch (error) {
        console.error('Error fetching chat messages:', error);
      }
    };

    fetchMessages();
  }, [streamId]);

  // Scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  };

  // Send message
  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !message.trim()) return;
    
    try {
      setLoading(true);
      
      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({
          type: 'chat',
          content: message.trim(),
          streamId,
        }));
      } else {
        // Fallback to REST API if WebSocket is not available
        await axios.post(`/api/streams/${streamId}/chat`, {
          content: message.trim(),
        });
      }
      
      setMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`flex h-full flex-col rounded-md border bg-background ${className}`}>
      <div className="border-b p-3">
        <h3 className="font-semibold">Stream Chat</h3>
      </div>
      
      <ScrollArea ref={scrollAreaRef} className="flex-1 p-3">
        <div className="flex flex-col gap-3">
          {messages.length === 0 ? (
            <p className="text-center text-sm text-muted-foreground">
              No messages yet. Be the first to chat!
            </p>
          ) : (
            messages.map((msg) => (
              <div key={msg.id} className="flex items-start gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={msg.user.avatarUrl} alt={msg.user.displayName || msg.user.username} />
                  <AvatarFallback>{getInitials(msg.user.displayName || msg.user.username)}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-medium ${msg.user.isStreamer ? 'text-primary' : ''}`}>
                      {msg.user.displayName || msg.user.username}
                    </span>
                    {msg.user.isStreamer && (
                      <span className="rounded bg-primary px-1 py-0.5 text-xs text-primary-foreground">
                        Streamer
                      </span>
                    )}
                  </div>
                  <p className="text-sm">{msg.content}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
      
      {user ? (
        <form onSubmit={sendMessage} className="border-t p-3">
          <div className="flex gap-2">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type a message..."
              disabled={loading}
              maxLength={200}
            />
            <Button type="submit" size="icon" disabled={loading || !message.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </form>
      ) : (
        <div className="border-t p-3 text-center text-sm text-muted-foreground">
          Sign in to join the conversation
        </div>
      )}
    </div>
  );
}
