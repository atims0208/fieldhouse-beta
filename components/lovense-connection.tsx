'use client';

import React, { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import axios from 'axios';

interface Toy {
  userId: string;
  toyId: string;
  toyType: string;
  nickname: string;
  connectedAt: string;
  lastActive: string;
}

export function LovenseConnection() {
  const { data: session } = useSession();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [toys, setToys] = useState<Toy[]>([]);
  const [nickname, setNickname] = useState('My Toy');
  const [showQrCode, setShowQrCode] = useState(false);

  useEffect(() => {
    if (session) {
      fetchToys();
    }
  }, [session]);

  const fetchToys = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/lovense/toys');
      if (response.data.success) {
        setToys(response.data.data.toys);
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch connected toys',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const generateQrCode = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/lovense/qrcode');
      if (response.data.success) {
        setQrCodeUrl(response.data.data.qrCodeUrl);
        setShowQrCode(true);
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to generate QR code',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const disconnectToy = async (toyId: string) => {
    try {
      setLoading(true);
      const response = await axios.delete('/api/lovense/disconnect', {
        data: { toyId },
      });
      if (response.data.success) {
        toast({
          title: 'Success',
          description: 'Toy disconnected successfully',
        });
        fetchToys();
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to disconnect toy',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const testToy = async (toyId: string) => {
    try {
      setLoading(true);
      // Send a test vibration pattern
      const response = await axios.post('/api/lovense/command', {
        toyId,
        command: 'Vibrate',
        intensity: 10, // Medium intensity
        duration: 3, // 3 seconds
      });
      if (response.data.success) {
        toast({
          title: 'Success',
          description: 'Test command sent successfully',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to send test command',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const getToyTypeName = (toyType: string) => {
    const toyTypes: Record<string, string> = {
      'A': 'Nora',
      'B': 'Max',
      'C': 'Ambi',
      'D': 'Domi',
      'E': 'Osci',
      'F': 'Lush',
      'G': 'Hush',
      'H': 'Edge',
      'I': 'Diamo',
      'J': 'Dolce',
      'K': 'Ferri',
      'L': 'Gush',
      'Z': 'Other',
    };
    return toyTypes[toyType] || toyType;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  if (!session) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Lovense Connection</CardTitle>
          <CardDescription>
            You need to be logged in to connect Lovense toys.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Lovense Connection</CardTitle>
        <CardDescription>
          Connect and manage your Lovense toys for interactive streaming.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        ) : (
          <>
            {toys.length > 0 ? (
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Connected Toys</h3>
                {toys.map((toy) => (
                  <div
                    key={toy.toyId}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{toy.nickname}</span>
                        <Badge variant="outline" className="ml-2">{getToyTypeName(toy.toyType)}</Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Connected: {formatDate(toy.connectedAt)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Last active: {formatDate(toy.lastActive)}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => testToy(toy.toyId)}
                      >
                        Test
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => disconnectToy(toy.toyId)}
                      >
                        Disconnect
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">
                  No toys connected. Connect a toy to get started.
                </p>
              </div>
            )}

            {showQrCode && qrCodeUrl && (
              <div className="mt-6 p-4 border rounded-lg">
                <h3 className="text-lg font-medium mb-4">Connect a New Toy</h3>
                <div className="flex flex-col items-center">
                  <div className="relative w-64 h-64 mb-4">
                    <Image
                      src={qrCodeUrl}
                      alt="QR Code for toy connection"
                      fill
                      className="object-contain"
                    />
                  </div>
                  <p className="text-sm text-center text-muted-foreground mb-4">
                    Scan this QR code with the Lovense Remote app to connect your toy.
                  </p>
                  <div className="w-full max-w-xs mb-4">
                    <Label htmlFor="nickname">Toy Nickname</Label>
                    <Input
                      id="nickname"
                      value={nickname}
                      onChange={(e) => setNickname(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => setShowQrCode(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          onClick={fetchToys}
          disabled={loading}
        >
          Refresh
        </Button>
        {!showQrCode && (
          <Button
            onClick={generateQrCode}
            disabled={loading}
          >
            Connect New Toy
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
