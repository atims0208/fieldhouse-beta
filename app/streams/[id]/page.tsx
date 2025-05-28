"use client";

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { StreamPlayer } from '@/components/stream-player';
import { StreamChat } from '@/components/stream-chat';
import { DonationForm } from '@/components/donation-form';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDate, formatNumber, getInitials } from '@/lib/utils';
import { useToast } from '@/components/ui/use-toast';
import { Users, Heart } from 'lucide-react';
import axios from 'axios';

interface StreamData {
  id: string;
  title: string;
  description: string;
  category: string;
  tags: string;
  isLive: boolean;
  viewerCount: number;
  totalViewers: number;
  playbackId: string;
  startedAt: string;
  user: {
    id: string;
    username: string;
    displayName: string;
    avatarUrl: string;
    followers: number;
  };
}

export default function StreamPage() {
  const params = useParams();
  const { user } = useAuth();
  const { toast } = useToast();
  const [stream, setStream] = useState<StreamData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  const streamId = params.id as string;

  // Fetch stream data
  useEffect(() => {
    const fetchStream = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/streams/${streamId}`);
        setStream(response.data);
        setFollowersCount(response.data.user.followers);
        
        // Check if user is following the streamer
        if (user) {
          const followResponse = await axios.get(`/api/users/following/${response.data.user.id}`);
          setIsFollowing(followResponse.data.isFollowing);
        }
        
        // Update view count
        await axios.post(`/api/streams/${streamId}/view`);
      } catch (error) {
        console.error('Error fetching stream:', error);
        toast({
          title: "Error",
          description: "Failed to load stream data.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStream();
    
    // Set up interval to update viewer count
    const interval = setInterval(async () => {
      try {
        const response = await axios.get(`/api/streams/${streamId}/stats`);
        if (response.data) {
          setStream(prev => prev ? { ...prev, viewerCount: response.data.viewerCount } : null);
        }
      } catch (error) {
        console.error('Error updating viewer count:', error);
      }
    }, 30000); // Update every 30 seconds
    
    return () => clearInterval(interval);
  }, [streamId, user, toast]);

  // Toggle follow status
  const handleFollowToggle = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to follow streamers.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      if (isFollowing) {
        await axios.delete(`/api/users/following/${stream?.user.id}`);
        setIsFollowing(false);
        setFollowersCount(prev => prev - 1);
        
        toast({
          title: "Unfollowed",
          description: `You are no longer following ${stream?.user.displayName || stream?.user.username}.`,
        });
      } else {
        await axios.post(`/api/users/following/${stream?.user.id}`);
        setIsFollowing(true);
        setFollowersCount(prev => prev + 1);
        
        toast({
          title: "Following",
          description: `You are now following ${stream?.user.displayName || stream?.user.username}.`,
        });
      }
    } catch (error) {
      console.error('Error toggling follow status:', error);
      toast({
        title: "Error",
        description: "Failed to update follow status.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Skeleton className="aspect-video w-full rounded-lg" />
            <div className="mt-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="mt-2 h-4 w-1/2" />
            </div>
          </div>
          <div>
            <Skeleton className="h-[400px] w-full rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  if (!stream) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Stream Not Found</CardTitle>
            <CardDescription>
              The stream you're looking for doesn't exist or has ended.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {/* Stream Player */}
          <StreamPlayer
            src={`${stream.playbackId}/playlist.m3u8`}
            poster={`${stream.playbackId}/thumbnail.jpg`}
            autoPlay
            muted
          />
          
          {/* Stream Info */}
          <div className="mt-4">
            <h1 className="text-2xl font-bold">{stream.title}</h1>
            
            <div className="mt-2 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {formatNumber(stream.viewerCount)} watching now
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Heart className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {formatNumber(followersCount)} followers
                  </span>
                </div>
                
                {stream.category && (
                  <span className="rounded-full bg-secondary px-2 py-1 text-xs">
                    {stream.category}
                  </span>
                )}
              </div>
              
              <span className="text-sm text-muted-foreground">
                Started {formatDate(stream.startedAt)}
              </span>
            </div>
            
            {/* Streamer Info */}
            <div className="mt-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={stream.user.avatarUrl} alt={stream.user.displayName || stream.user.username} />
                  <AvatarFallback>{getInitials(stream.user.displayName || stream.user.username)}</AvatarFallback>
                </Avatar>
                
                <div>
                  <h3 className="font-semibold">{stream.user.displayName || stream.user.username}</h3>
                  <p className="text-sm text-muted-foreground">@{stream.user.username}</p>
                </div>
              </div>
              
              <Button
                variant={isFollowing ? "outline" : "default"}
                onClick={handleFollowToggle}
                disabled={stream.user.id === user?.id}
              >
                {isFollowing ? "Unfollow" : "Follow"}
              </Button>
            </div>
            
            {/* Stream Description */}
            {stream.description && (
              <div className="mt-6">
                <h3 className="mb-2 font-semibold">About this stream</h3>
                <p className="text-sm text-muted-foreground">{stream.description}</p>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex flex-col gap-4">
          {/* Chat */}
          <div className="h-[500px]">
            <StreamChat streamId={stream.id} className="h-full" />
          </div>
          
          {/* Donation Form */}
          {user && user.id !== stream.user.id && (
            <DonationForm
              streamId={stream.id}
              streamerId={stream.user.id}
              streamerName={stream.user.displayName || stream.user.username}
            />
          )}
        </div>
      </div>
    </div>
  );
}
