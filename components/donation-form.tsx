"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { Coins } from 'lucide-react';
import { LovenseDonationTrigger } from '@/components/lovense-donation-trigger';
import axios from 'axios';

interface DonationFormProps {
  streamId: string;
  streamerId: string;
  streamerName: string;
  onSuccess?: () => void;
}

interface LovenseTrigger {
  command: string;
  intensity: number;
  duration: number;
  pattern?: string;
}

export function DonationForm({ streamId, streamerId, streamerName, onSuccess }: DonationFormProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [amount, setAmount] = useState(5);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [lovenseTrigger, setLovenseTrigger] = useState<LovenseTrigger | null>(null);
  const [showLovenseOptions, setShowLovenseOptions] = useState(false);
  
  // Check if the stream has Lovense integration enabled
  useEffect(() => {
    const checkLovenseEnabled = async () => {
      try {
        const response = await axios.get(`/api/streams/${streamId}/lovense`);
        setShowLovenseOptions(response.data && response.data.enabled);
      } catch (error) {
        console.error('Error checking Lovense status:', error);
        setShowLovenseOptions(false);
      }
    };
    
    checkLovenseEnabled();
  }, [streamId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to donate.",
        variant: "destructive",
      });
      return;
    }
    
    if (amount < 1) {
      toast({
        title: "Invalid amount",
        description: "Donation amount must be at least 1 coin.",
        variant: "destructive",
      });
      return;
    }
    
    if (user.coins < amount) {
      toast({
        title: "Insufficient coins",
        description: "You don't have enough coins for this donation.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setLoading(true);
      
      await axios.post('/api/donations', {
        amount,
        message: message.trim(),
        streamId,
        receiverId: streamerId,
        lovenseTrigger: lovenseTrigger,
      });
      
      toast({
        title: "Donation sent!",
        description: `You donated ${amount} coins to ${streamerName}.`,
      });
      
      setAmount(5);
      setMessage('');
      setLovenseTrigger(null);
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error sending donation:', error);
      toast({
        title: "Donation failed",
        description: "There was an error processing your donation. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAmount = (value: number) => {
    setAmount(value);
  };

  return (
    <div className="rounded-md border bg-card p-4">
      <h3 className="mb-4 text-lg font-semibold">Support {streamerName}</h3>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium">
            Donation Amount
          </label>
          <div className="flex flex-wrap gap-2">
            {[5, 10, 20, 50, 100].map((value) => (
              <Button
                key={value}
                type="button"
                variant={amount === value ? "default" : "outline"}
                size="sm"
                onClick={() => handleQuickAmount(value)}
              >
                {value}
              </Button>
            ))}
          </div>
          <div className="mt-2 flex items-center gap-2">
            <Input
              type="number"
              min={1}
              value={amount}
              onChange={(e) => setAmount(parseInt(e.target.value) || 0)}
              className="w-24"
            />
            <span className="flex items-center text-sm text-muted-foreground">
              <Coins className="mr-1 h-4 w-4" /> coins
            </span>
          </div>
        </div>
        
        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium">
            Message (optional)
          </label>
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Add a message to your donation..."
            maxLength={200}
          />
          <p className="mt-1 text-xs text-muted-foreground">
            {message.length}/200 characters
          </p>
        </div>
        
        {showLovenseOptions && (
          <LovenseDonationTrigger
            streamId={streamId}
            donationAmount={amount}
            onTriggerSelect={setLovenseTrigger}
          />
        )}
        
        <div className="flex items-center justify-between mt-4">
          <p className="text-sm text-muted-foreground">
            Your balance: <span className="font-medium">{user?.coins || 0}</span> coins
          </p>
          <Button type="submit" disabled={loading || !user || user.coins < amount}>
            {loading ? "Processing..." : "Send Donation"}
          </Button>
        </div>
      </form>
    </div>
  );
}
