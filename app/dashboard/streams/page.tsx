"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { formatDate, formatNumber } from '@/lib/utils';
import { PlusCircle, Edit, Trash2, Play, StopCircle, Users, Eye } from 'lucide-react';
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
  startedAt: string;
  endedAt: string | null;
}

export default function StreamsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { toast } = useToast();
  const [streams, setStreams] = useState<StreamData[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [stopping, setStopping] = useState<string | null>(null);

  // Redirect if not a streamer
  useEffect(() => {
    if (user && !user.isStreamer) {
      router.push('/dashboard');
    }
  }, [user, router]);

  // Fetch streams
  useEffect(() => {
    const fetchStreams = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/streams/me');
        setStreams(response.data);
      } catch (error) {
        console.error('Error fetching streams:', error);
        toast({
          title: "Error",
          description: "Failed to load your streams.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchStreams();
    }
  }, [user, toast]);

  // Delete stream
  const handleDelete = async (streamId: string) => {
    try {
      setDeleting(streamId);
      
      await axios.delete(`/api/streams/${streamId}`);
      
      setStreams((prev) => prev.filter((stream) => stream.id !== streamId));
      
      toast({
        title: "Stream deleted",
        description: "Your stream has been deleted successfully.",
      });
    } catch (error) {
      console.error('Error deleting stream:', error);
      toast({
        title: "Error",
        description: "Failed to delete stream. Please try again.",
        variant: "destructive",
      });
    } finally {
      setDeleting(null);
    }
  };

  // End stream
  const handleEndStream = async (streamId: string) => {
    try {
      setStopping(streamId);
      
      await axios.post(`/api/streams/${streamId}/end`);
      
      setStreams((prev) =>
        prev.map((stream) =>
          stream.id === streamId ? { ...stream, isLive: false, endedAt: new Date().toISOString() } : stream
        )
      );
      
      toast({
        title: "Stream ended",
        description: "Your live stream has been ended.",
      });
    } catch (error) {
      console.error('Error ending stream:', error);
      toast({
        title: "Error",
        description: "Failed to end stream. Please try again.",
        variant: "destructive",
      });
    } finally {
      setStopping(null);
    }
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>
              Please sign in to access your streams.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Your Streams</h1>
          <Skeleton className="h-10 w-32" />
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="mt-2 h-4 w-2/3" />
              </CardContent>
              <CardFooter>
                <Skeleton className="h-10 w-full" />
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Your Streams</h1>
        <Button asChild>
          <Link href="/dashboard/streams/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Create New Stream
          </Link>
        </Button>
      </div>
      
      {streams.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No Streams Yet</CardTitle>
            <CardDescription>
              You haven't created any streams yet. Get started by creating your first stream.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button asChild>
              <Link href="/dashboard/streams/new">
                <PlusCircle className="mr-2 h-4 w-4" />
                Create Your First Stream
              </Link>
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {streams.map((stream) => (
            <Card key={stream.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="truncate">{stream.title}</CardTitle>
                  <Badge variant={stream.isLive ? "default" : "outline"}>
                    {stream.isLive ? "LIVE" : "Offline"}
                  </Badge>
                </div>
                <CardDescription>
                  {stream.category || "No category"} • Created {formatDate(stream.startedAt)}
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-2">
                  {stream.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {stream.description}
                    </p>
                  )}
                  
                  <div className="flex flex-wrap gap-2">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Eye className="mr-1 h-4 w-4" />
                      {formatNumber(stream.totalViewers)} total views
                    </div>
                    
                    {stream.isLive && (
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Users className="mr-1 h-4 w-4" />
                        {formatNumber(stream.viewerCount)} watching
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
              
              <CardFooter className="flex justify-between gap-2">
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                  >
                    <Link href={`/dashboard/streams/${stream.id}`}>
                      <Edit className="mr-1 h-4 w-4" />
                      Edit
                    </Link>
                  </Button>
                  
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(stream.id)}
                    disabled={!!deleting || stream.isLive}
                  >
                    <Trash2 className="mr-1 h-4 w-4" />
                    {deleting === stream.id ? "Deleting..." : "Delete"}
                  </Button>
                </div>
                
                {stream.isLive ? (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleEndStream(stream.id)}
                    disabled={!!stopping}
                  >
                    <StopCircle className="mr-1 h-4 w-4" />
                    {stopping === stream.id ? "Ending..." : "End Stream"}
                  </Button>
                ) : (
                  <Button
                    variant="default"
                    size="sm"
                    asChild
                  >
                    <Link href={`/streams/${stream.id}`}>
                      <Play className="mr-1 h-4 w-4" />
                      View
                    </Link>
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
