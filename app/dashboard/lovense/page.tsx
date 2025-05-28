'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { LovenseConnection } from '@/components/lovense-connection';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import axios from 'axios';

export default function LovenseDashboardPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [streams, setStreams] = useState<any[]>([]);
  const [selectedStreamId, setSelectedStreamId] = useState<string | null>(null);

  useEffect(() => {
    // Redirect if not logged in or not a streamer
    if (!user) {
      return;
    }

    if (!user.isStreamer) {
      toast({
        title: "Access denied",
        description: "You need to be a streamer to access this page.",
        variant: "destructive",
      });
      router.push('/dashboard');
      return;
    }

    // Fetch user's streams
    const fetchStreams = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/streams/me');
        setStreams(response.data || []);
        
        // Select the first stream by default if available
        if (response.data && response.data.length > 0) {
          setSelectedStreamId(response.data[0].id);
        }
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

    fetchStreams();
  }, [user, router, toast]);

  if (!user) {
    return (
      <div className="container mx-auto py-10">
        <Card>
          <CardHeader>
            <CardTitle>Loading...</CardTitle>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Lovense Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <LovenseConnection />
        </div>
        
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Stream Settings</CardTitle>
              <CardDescription>
                Configure Lovense integration for your streams
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p>Loading your streams...</p>
              ) : streams.length === 0 ? (
                <div>
                  <p className="mb-4">You don't have any streams yet.</p>
                  <p>
                    <a 
                      href="/dashboard/streams/new" 
                      className="text-primary hover:underline"
                    >
                      Create a new stream
                    </a> 
                    {' '}to configure Lovense integration.
                  </p>
                </div>
              ) : (
                <Tabs 
                  defaultValue={selectedStreamId || streams[0].id} 
                  onValueChange={setSelectedStreamId}
                >
                  <TabsList className="mb-4">
                    {streams.map((stream) => (
                      <TabsTrigger key={stream.id} value={stream.id}>
                        {stream.title}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                  
                  {streams.map((stream) => (
                    <TabsContent key={stream.id} value={stream.id}>
                      {selectedStreamId === stream.id && (
                        <div className="mt-4">
                          {/* Import dynamically to avoid TypeScript errors */}
                          {React.createElement(
                            require('@/components/lovense-settings').LovenseSettings,
                            { streamId: stream.id }
                          )}
                        </div>
                      )}
                    </TabsContent>
                  ))}
                </Tabs>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
