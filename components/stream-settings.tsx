"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { Copy, Info } from 'lucide-react';
import axios from 'axios';

interface StreamSettingsProps {
  streamId?: string;
}

interface StreamData {
  id: string;
  title: string;
  description: string;
  category: string;
  tags: string;
  streamKey: string;
  rtmpUrl: string;
  playbackUrl: string;
}

const CATEGORIES = [
  "Gaming",
  "Just Chatting",
  "Music",
  "Sports",
  "Art",
  "Education",
  "Travel",
  "Food & Drink",
  "Fitness",
  "Technology",
  "Other"
];

export function StreamSettings({ streamId }: StreamSettingsProps) {
  const router = useRouter();
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [streamData, setStreamData] = useState<StreamData | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState('');

  // Fetch stream data if streamId is provided
  useEffect(() => {
    const fetchStreamData = async () => {
      if (!streamId) return;
      
      try {
        setLoading(true);
        const response = await axios.get(`/api/streams/${streamId}`);
        setStreamData(response.data);
        setTitle(response.data.title);
        setDescription(response.data.description || '');
        setCategory(response.data.category || '');
        setTags(response.data.tags || '');
      } catch (error) {
        console.error('Error fetching stream data:', error);
        toast({
          title: "Error",
          description: "Failed to load stream settings.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStreamData();
  }, [streamId, toast]);

  // Create a new stream
  const createStream = async () => {
    if (!user?.isStreamer) {
      toast({
        title: "Permission denied",
        description: "You need to be a streamer to create a stream.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setSaving(true);
      
      const response = await axios.post('/api/streams', {
        title: title.trim(),
        description: description.trim(),
        category,
        tags: tags.trim(),
      });
      
      toast({
        title: "Stream created",
        description: "Your stream has been created successfully.",
      });
      
      // Redirect to the new stream's settings page
      router.push(`/dashboard/streams/${response.data.id}`);
    } catch (error) {
      console.error('Error creating stream:', error);
      toast({
        title: "Error",
        description: "Failed to create stream. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  // Update an existing stream
  const updateStream = async () => {
    if (!streamId) return;
    
    try {
      setSaving(true);
      
      await axios.put(`/api/streams/${streamId}`, {
        title: title.trim(),
        description: description.trim(),
        category,
        tags: tags.trim(),
      });
      
      toast({
        title: "Settings saved",
        description: "Your stream settings have been updated.",
      });
    } catch (error) {
      console.error('Error updating stream:', error);
      toast({
        title: "Error",
        description: "Failed to update stream settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast({
        title: "Validation error",
        description: "Stream title is required.",
        variant: "destructive",
      });
      return;
    }
    
    if (streamId) {
      await updateStream();
    } else {
      await createStream();
    }
  };

  // Copy text to clipboard
  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text).then(
      () => {
        toast({
          title: "Copied!",
          description: `${label} copied to clipboard.`,
        });
      },
      (err) => {
        console.error('Could not copy text: ', err);
      }
    );
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Stream Settings</CardTitle>
          <CardDescription>Loading stream settings...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{streamId ? 'Stream Settings' : 'Create New Stream'}</CardTitle>
        <CardDescription>
          {streamId 
            ? 'Configure your stream settings and get your streaming credentials.' 
            : 'Set up a new stream on Fieldhouse.'}
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Stream Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter a title for your stream"
              maxLength={100}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your stream (optional)"
              maxLength={500}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="tags">Tags</Label>
            <Input
              id="tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="Add tags separated by commas (optional)"
              maxLength={100}
            />
          </div>
          
          {streamData && (
            <div className="space-y-4 rounded-md border p-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Stream Key</Label>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(streamData.streamKey, 'Stream key')}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <Input value={streamData.streamKey} readOnly type="password" />
                <p className="text-xs text-muted-foreground">
                  Keep this private! Never share your stream key with anyone.
                </p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>RTMP URL</Label>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(streamData.rtmpUrl, 'RTMP URL')}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <Input value={streamData.rtmpUrl} readOnly />
              </div>
              
              <div className="flex items-center rounded-md bg-muted p-3">
                <Info className="mr-2 h-4 w-4 text-muted-foreground" />
                <p className="text-xs text-muted-foreground">
                  Use these credentials in your streaming software (like OBS Studio) to go live.
                </p>
              </div>
            </div>
          )}
        </CardContent>
        
        <CardFooter>
          <Button type="submit" disabled={saving}>
            {saving ? 'Saving...' : streamId ? 'Save Changes' : 'Create Stream'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
