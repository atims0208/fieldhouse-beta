"use client"

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/components/auth-provider";
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { Input } from "@/components/ui/input"

export default function BroadcastPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const [title, setTitle] = useState("")
  const [category, setCategory] = useState("")

  if (!user) {
    return <p>Please log in to access the broadcast page.</p>;
  }

  if (!user.isStreamer) {
    return (
      <div className="container px-4 py-6 md:px-6">
        <Card className="bg-card border-fhsb-green/20">
          <CardHeader>
            <CardTitle className="text-fhsb-cream">Streamer Privileges Required</CardTitle>
            <CardDescription>
              You need to be a streamer to access the broadcast dashboard.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Upgrade your account to streamer status to start broadcasting your sports content.
            </p>
          </CardContent>
          <Button onClick={() => router.push("/dashboard/upgrade")} className="w-full">
            Upgrade to Streamer
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>Start Broadcasting</CardTitle>
          <CardDescription>Configure your stream settings before going live.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Stream Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter your stream title"
              />
            </div>
            <div>
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Choose a category"
              />
            </div>
            <Button>Go Live</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 