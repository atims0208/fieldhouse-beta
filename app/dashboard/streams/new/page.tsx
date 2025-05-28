"use client";

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { StreamSettings } from '@/components/stream-settings';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function NewStreamPage() {
  const router = useRouter();
  const { user } = useAuth();

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
              Please sign in to create a stream.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">Create New Stream</h1>
      <StreamSettings />
    </div>
  );
}
