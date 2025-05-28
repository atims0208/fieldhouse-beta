'use client';

import React, { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import axios from 'axios';

interface LovenseDonationTriggerProps {
  streamId: string;
  donationAmount: number;
  onTriggerSelect: (trigger: LovenseTrigger | null) => void;
}

interface LovenseTrigger {
  command: string;
  intensity: number;
  duration: number;
  pattern?: string;
}

interface StreamLovenseSettings {
  enabled: boolean;
  toyId: string;
  minDonationAmount: number;
  maxIntensity: number;
  allowPatterns: boolean;
  allowedCommands: string[];
  customPatterns: Record<string, string>;
}

export function LovenseDonationTrigger({ 
  streamId, 
  donationAmount, 
  onTriggerSelect 
}: LovenseDonationTriggerProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState<StreamLovenseSettings | null>(null);
  const [selectedCommand, setSelectedCommand] = useState<string>('');
  const [intensity, setIntensity] = useState<number>(10);
  const [duration, setDuration] = useState<number>(5);
  const [selectedPattern, setSelectedPattern] = useState<string>('');
  const [showTrigger, setShowTrigger] = useState(false);

  // Fetch stream Lovense settings
  useEffect(() => {
    const fetchSettings = async () => {
      if (!streamId) return;
      
      try {
        setLoading(true);
        const response = await axios.get(`/api/streams/${streamId}/lovense`);
        
        if (response.data && response.data.enabled) {
          setSettings(response.data);
          
          // Set default command if available
          if (response.data.allowedCommands && response.data.allowedCommands.length > 0) {
            setSelectedCommand(response.data.allowedCommands[0]);
          }
          
          // Check if donation amount meets minimum requirement
          setShowTrigger(donationAmount >= response.data.minDonationAmount);
        } else {
          setShowTrigger(false);
        }
      } catch (error) {
        console.error('Error fetching Lovense settings:', error);
        setShowTrigger(false);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, [streamId, donationAmount]);

  // Update trigger when selections change
  useEffect(() => {
    if (!showTrigger || !selectedCommand) {
      onTriggerSelect(null);
      return;
    }
    
    const trigger: LovenseTrigger = {
      command: selectedCommand,
      intensity,
      duration,
    };
    
    if (selectedPattern) {
      trigger.pattern = selectedPattern;
    }
    
    onTriggerSelect(trigger);
  }, [selectedCommand, intensity, duration, selectedPattern, showTrigger, onTriggerSelect]);

  // Calculate max intensity based on donation amount and settings
  const calculateMaxIntensity = () => {
    if (!settings) return 20;
    
    const { minDonationAmount, maxIntensity } = settings;
    
    // Scale intensity based on donation amount
    // At minimum donation, intensity is 5
    // At 2x minimum donation, intensity is at max
    const scaleFactor = Math.min(
      (donationAmount - minDonationAmount) / minDonationAmount + 0.5, 
      1
    );
    
    return Math.round(Math.max(5, scaleFactor * maxIntensity));
  };

  if (loading || !showTrigger || !settings) {
    return null;
  }

  return (
    <Card className="mt-4">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Add Toy Control</CardTitle>
        <CardDescription>
          Control the streamer's Lovense toy with your donation
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="command-select">Action</Label>
          <Select value={selectedCommand} onValueChange={setSelectedCommand}>
            <SelectTrigger id="command-select">
              <SelectValue placeholder="Select an action" />
            </SelectTrigger>
            <SelectContent>
              {settings.allowedCommands.map((command) => (
                <SelectItem key={command} value={command}>
                  {command}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="intensity-slider">Intensity</Label>
            <span className="text-sm text-muted-foreground">{intensity}</span>
          </div>
          <Slider
            id="intensity-slider"
            min={1}
            max={calculateMaxIntensity()}
            step={1}
            value={[intensity]}
            onValueChange={(values) => setIntensity(values[0])}
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="duration-slider">Duration (seconds)</Label>
            <span className="text-sm text-muted-foreground">{duration}s</span>
          </div>
          <Slider
            id="duration-slider"
            min={1}
            max={30}
            step={1}
            value={[duration]}
            onValueChange={(values) => setDuration(values[0])}
          />
        </div>
        
        {settings.allowPatterns && Object.keys(settings.customPatterns).length > 0 && (
          <div className="space-y-2">
            <Label htmlFor="pattern-select">Pattern (Optional)</Label>
            <Select value={selectedPattern} onValueChange={setSelectedPattern}>
              <SelectTrigger id="pattern-select">
                <SelectValue placeholder="Select a pattern" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">None</SelectItem>
                {Object.entries(settings.customPatterns).map(([name]) => (
                  <SelectItem key={name} value={name}>
                    {name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
        
        <div className="pt-2">
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => onTriggerSelect(null)}
          >
            Remove Toy Control
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
