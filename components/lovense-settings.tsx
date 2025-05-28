'use client';

import React, { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import axios from 'axios';

interface LovenseSettingsProps {
  streamId: string;
}

interface ToySettings {
  enabled: boolean;
  toyId: string;
  minDonationAmount: number;
  maxIntensity: number;
  allowPatterns: boolean;
  allowedCommands: string[];
  customPatterns: Record<string, string>;
}

export function LovenseSettings({ streamId }: LovenseSettingsProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<ToySettings | null>(null);
  const [toys, setToys] = useState<any[]>([]);
  const [enabled, setEnabled] = useState(false);
  const [selectedToyId, setSelectedToyId] = useState('');
  const [minDonationAmount, setMinDonationAmount] = useState(5);
  const [maxIntensity, setMaxIntensity] = useState(20);
  const [allowPatterns, setAllowPatterns] = useState(true);
  const [allowedCommands, setAllowedCommands] = useState<string[]>(['Vibrate']);
  const [customPatterns, setCustomPatterns] = useState<Record<string, string>>({});
  const [newPatternName, setNewPatternName] = useState('');
  const [newPatternValue, setNewPatternValue] = useState('');

  // Available commands for Lovense toys
  const availableCommands = [
    { id: 'Vibrate', name: 'Vibrate' },
    { id: 'Rotate', name: 'Rotate' },
    { id: 'Pump', name: 'Pump' },
    { id: 'Thrust', name: 'Thrust' },
    { id: 'Fingering', name: 'Fingering' },
    { id: 'Suction', name: 'Suction' },
  ];

  // Fetch stream Lovense settings
  useEffect(() => {
    const fetchSettings = async () => {
      if (!streamId) return;
      
      try {
        setLoading(true);
        const response = await axios.get(`/api/streams/${streamId}/lovense`);
        
        if (response.data) {
          setSettings(response.data);
          setEnabled(response.data.enabled || false);
          setSelectedToyId(response.data.toyId || '');
          setMinDonationAmount(response.data.minDonationAmount || 5);
          setMaxIntensity(response.data.maxIntensity || 20);
          setAllowPatterns(response.data.allowPatterns || true);
          setAllowedCommands(response.data.allowedCommands || ['Vibrate']);
          setCustomPatterns(response.data.customPatterns || {});
        }
        
        // Fetch available toys
        const toysResponse = await axios.get('/api/lovense/toys');
        if (toysResponse.data.success) {
          setToys(toysResponse.data.data.toys || []);
        }
      } catch (error) {
        console.error('Error fetching Lovense settings:', error);
        toast({
          title: "Error",
          description: "Failed to load Lovense settings.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, [streamId, toast]);

  // Save settings
  const saveSettings = async () => {
    if (!streamId) return;
    
    try {
      setSaving(true);
      
      const updatedSettings = {
        enabled,
        toyId: selectedToyId,
        minDonationAmount,
        maxIntensity,
        allowPatterns,
        allowedCommands,
        customPatterns,
      };
      
      await axios.put(`/api/streams/${streamId}/lovense`, updatedSettings);
      
      toast({
        title: "Settings saved",
        description: "Your Lovense settings have been updated.",
      });
    } catch (error) {
      console.error('Error saving Lovense settings:', error);
      toast({
        title: "Error",
        description: "Failed to save Lovense settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  // Add a new custom pattern
  const addCustomPattern = () => {
    if (!newPatternName.trim() || !newPatternValue.trim()) {
      toast({
        title: "Validation error",
        description: "Pattern name and value are required.",
        variant: "destructive",
      });
      return;
    }
    
    setCustomPatterns({
      ...customPatterns,
      [newPatternName.trim()]: newPatternValue.trim(),
    });
    
    setNewPatternName('');
    setNewPatternValue('');
  };

  // Remove a custom pattern
  const removeCustomPattern = (patternName: string) => {
    const updatedPatterns = { ...customPatterns };
    delete updatedPatterns[patternName];
    setCustomPatterns(updatedPatterns);
  };

  // Toggle a command in the allowed commands list
  const toggleCommand = (commandId: string) => {
    if (allowedCommands.includes(commandId)) {
      setAllowedCommands(allowedCommands.filter(id => id !== commandId));
    } else {
      setAllowedCommands([...allowedCommands, commandId]);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Lovense Integration</CardTitle>
          <CardDescription>Loading settings...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lovense Integration</CardTitle>
        <CardDescription>
          Configure interactive toy settings for your stream.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="enable-lovense"
            checked={enabled}
            onChange={(e) => setEnabled(e.target.checked)}
            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
          />
          <Label htmlFor="enable-lovense">Enable Lovense integration for this stream</Label>
        </div>

        {enabled && (
          <>
            <div className="space-y-2">
              <Label htmlFor="toy-select">Select Toy</Label>
              {toys.length > 0 ? (
                <Select value={selectedToyId} onValueChange={setSelectedToyId}>
                  <SelectTrigger id="toy-select">
                    <SelectValue placeholder="Select a toy" />
                  </SelectTrigger>
                  <SelectContent>
                    {toys.map((toy) => (
                      <SelectItem key={toy.toyId} value={toy.toyId}>
                        {toy.nickname} ({toy.toyType})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <div className="text-sm text-muted-foreground">
                  No toys connected. Go to your profile to connect a Lovense toy.
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="min-donation">Minimum Donation Amount ($)</Label>
              <Input
                id="min-donation"
                type="number"
                min="1"
                value={minDonationAmount}
                onChange={(e) => setMinDonationAmount(Number(e.target.value))}
              />
              <p className="text-xs text-muted-foreground">
                Minimum donation amount required to trigger toy actions.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="max-intensity">Maximum Intensity (1-20)</Label>
              <Input
                id="max-intensity"
                type="number"
                min="1"
                max="20"
                value={maxIntensity}
                onChange={(e) => setMaxIntensity(Number(e.target.value))}
              />
              <p className="text-xs text-muted-foreground">
                Maximum intensity level that can be triggered by donations.
              </p>
            </div>

            <div className="space-y-2">
              <Label>Allowed Commands</Label>
              <div className="grid grid-cols-2 gap-2">
                {availableCommands.map((command) => (
                  <div key={command.id} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`command-${command.id}`}
                      checked={allowedCommands.includes(command.id)}
                      onChange={() => toggleCommand(command.id)}
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <Label htmlFor={`command-${command.id}`}>{command.name}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="allow-patterns"
                  checked={allowPatterns}
                  onChange={(e) => setAllowPatterns(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <Label htmlFor="allow-patterns">Allow custom vibration patterns</Label>
              </div>
            </div>

            {allowPatterns && (
              <div className="space-y-4 border p-4 rounded-md">
                <h4 className="font-medium">Custom Patterns</h4>
                
                {Object.entries(customPatterns).length > 0 ? (
                  <div className="space-y-2">
                    {Object.entries(customPatterns).map(([name, pattern]) => (
                      <div key={name} className="flex items-center justify-between p-2 border rounded-md">
                        <div>
                          <span className="font-medium">{name}</span>
                          <p className="text-xs text-muted-foreground">{pattern}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeCustomPattern(name)}
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No custom patterns defined.</p>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="pattern-name">Pattern Name</Label>
                  <Input
                    id="pattern-name"
                    value={newPatternName}
                    onChange={(e) => setNewPatternName(e.target.value)}
                    placeholder="e.g., Wave, Pulse, etc."
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="pattern-value">Pattern Value</Label>
                  <Textarea
                    id="pattern-value"
                    value={newPatternValue}
                    onChange={(e) => setNewPatternValue(e.target.value)}
                    placeholder="e.g., V:1;F:v,a,v,a,v,a;S:1000"
                  />
                  <p className="text-xs text-muted-foreground">
                    Format: V:1 (vibration), F:v,a,v,a (function), S:1000 (speed in ms)
                  </p>
                </div>
                
                <Button
                  variant="outline"
                  onClick={addCustomPattern}
                >
                  Add Pattern
                </Button>
              </div>
            )}
          </>
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={saveSettings} disabled={saving}>
          {saving ? 'Saving...' : 'Save Settings'}
        </Button>
      </CardFooter>
    </Card>
  );
}
