"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { StreamSettings } from '@/components/stream-settings';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/use-toast';
import axios from 'axios';

export default function EditStreamPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const streamId = params.id as string;

  // Check authorization and stream existence
  useEffect(() => {
    const checkStream = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        const response = await axios.get(`/api/streams/${streamId}`);
        
        // Check if the stream belongs to the current user
        if (response.data.userId === user.id) {
          setAuthorized(true);
        } else {
          toast({
            title: "Access denied",
            description: "You don't have permission to edit this stream.",
            variant: "destructive",
          });
          router.push('/dashboard/streams');
        }
      } catch (error) {
        console.error('Error fetching stream:', error);
        toast({
          title: "Stream not found",
          description: "The stream you're trying to edit doesn't exist.",
          variant: "destructive",
        });
        router.push('/dashboard/streams');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      checkStream();
    }
  }, [streamId, user, router, toast]);

  // Redirect if not a streamer
  useEffect(() => {
    if (user && !user.isStreamer) {
      router.push('/dashboard');
    }
  }, [user, router]);

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>
              Please sign in to edit your stream.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Skeleton className="h-8 w-64" />
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-72" />
          </CardHeader>
          <div className="p-6">
            <Skeleton className="h-32 w-full" />
          </div>
        </Card>
      </div>
    );
  }

  if (!authorized) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>
              You don't have permission to edit this stream.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">Edit Stream</h1>
      <StreamSettings streamId={streamId} />
    </div>
  );
}
