"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import axios from 'axios';
import { formatNumber } from '@/lib/utils';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getInitials } from '@/lib/utils';

interface Stream {
  id: string;
  title: string;
  thumbnailUrl: string;
  viewerCount: number;
  category: string;
  isLive: boolean;
  createdAt: string;
  user: {
    id: string;
    username: string;
    displayName?: string;
    avatarUrl?: string;
  };
}

interface StreamGridProps {
  featured?: boolean;
  category?: string;
  username?: string;
  limit?: number;
}

export function StreamGrid({ featured = false, category, username, limit = 12 }: StreamGridProps) {
  const [streams, setStreams] = useState<Stream[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStreams = async () => {
      try {
        setLoading(true);
        setError(null);

        let url = '/api/streams';
        const params: Record<string, string | boolean | number> = { limit };

        if (featured) {
          params.featured = true;
        }

        if (category) {
          params.category = category;
        }

        if (username) {
          params.username = username;
        }

        const response = await axios.get(url, { params });
        setStreams(response.data);
      } catch (err) {
        console.error('Error fetching streams:', err);
        setError('Failed to load streams. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchStreams();
  }, [featured, category, username, limit]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: limit }).map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <div className="aspect-video w-full bg-muted">
              <Skeleton className="h-full w-full" />
            </div>
            <CardContent className="p-4">
              <div className="flex items-start space-x-4">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[200px]" />
                  <Skeleton className="h-4 w-[150px]" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-destructive">{error}</div>;
  }

  if (streams.length === 0) {
    return (
      <div className="text-center text-muted-foreground">
        No streams found. Check back later!
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {streams.map((stream) => (
        <Link key={stream.id} href={`/stream/${stream.id}`}>
          <Card className="overflow-hidden transition-all duration-200 hover:shadow-md stream-card">
            <div className="relative aspect-video w-full overflow-hidden bg-muted">
              <Image
                src={stream.thumbnailUrl || '/images/placeholder-thumbnail.jpg'}
                alt={stream.title}
                fill
                className="object-cover"
              />
              {stream.isLive && (
                <div className="absolute left-2 top-2 rounded bg-red-600 px-2 py-1 text-xs font-medium text-white">
                  LIVE
                </div>
              )}
              <div className="absolute bottom-2 right-2 rounded bg-black/70 px-2 py-1 text-xs font-medium text-white">
                {formatNumber(stream.viewerCount)} viewers
              </div>
            </div>
            <CardContent className="p-4">
              <div className="flex items-start space-x-4">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={stream.user.avatarUrl} alt={stream.user.displayName || stream.user.username} />
                  <AvatarFallback>{getInitials(stream.user.displayName || stream.user.username)}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="line-clamp-1 font-medium">{stream.title}</h3>
                  <p className="text-sm text-muted-foreground">{stream.user.displayName || stream.user.username}</p>
                  <p className="text-xs text-muted-foreground">{stream.category}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
