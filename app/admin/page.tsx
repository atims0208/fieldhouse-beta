"use client"

import React, { useEffect, useCallback, useState } from 'react';
import { useAuth } from '@/components/auth-provider';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

interface User {
  id: string;
  username: string;
  email: string;
  isStreamer: boolean;
  isBanned: boolean;
  bannedUntil: string | null;
  isAdmin: boolean;
}

interface Stream {
  id: string;
  title: string;
  isLive: boolean;
  viewerCount: number;
  userId: string;
}

interface StreamerRequest {
  id: string;
  username: string;
  email: string;
  idDocumentUrl: string;
  createdAt: string;
}

interface Statistics {
  totalUsers: number;
  totalStreamers: number;
  activeStreams: number;
  bannedUsers: number;
}

export default function AdminDashboard() {
  const { user, api } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [streams, setStreams] = useState<Stream[]>([]);
  const [streamerRequests, setStreamerRequests] = useState<StreamerRequest[]>([]);
  const [stats, setStats] = useState<Statistics | null>(null);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    try {
      const [usersRes, streamsRes, requestsRes, statsRes] = await Promise.all([
        api.get<{ users: User[] }>('/admin/users'),
        api.get<Stream[]>('/admin/streams'),
        api.get<StreamerRequest[]>('/admin/streamer-requests'),
        api.get<Statistics>('/admin/statistics')
      ]);

      setUsers(usersRes.data.users);
      setStreams(streamsRes.data);
      setStreamerRequests(requestsRes.data);
      setStats(statsRes.data);
    } catch (error) {
      toast.error('Failed to load admin data: ' + (error as Error).message);
    } finally {
      setLoading(false);
    }
  }, [api]);

  useEffect(() => {
    if (!user?.isAdmin) {
      toast.error('Access denied. Admin privileges required.');
      return;
    }

    loadData();
  }, [user, loadData]);

  const handleUserStatusUpdate = async (userId: string, updates: Partial<User>) => {
    try {
      await api.patch(`/admin/users/${userId}/status`, updates);
      toast.success('User status updated successfully');
      loadData();
    } catch (error) {
      toast.error('Failed to update user status: ' + (error as Error).message);
    }
  };

  const handleStreamEnd = async (streamId: string) => {
    try {
      await api.post(`/admin/streams/${streamId}/end`);
      toast.success('Stream ended successfully');
      loadData();
    } catch (error) {
      toast.error('Failed to end stream: ' + (error as Error).message);
    }
  };

  const handleStreamerRequest = async (userId: string, approved: boolean) => {
    try {
      await api.post(`/admin/streamer-requests/${userId}`, { approved });
      toast.success(approved ? 'Streamer request approved' : 'Streamer request rejected');
      loadData();
    } catch (error) {
      toast.error('Failed to handle streamer request: ' + (error as Error).message);
    }
  };

  if (!user?.isAdmin) {
    return <div className="p-4">Access denied. Admin privileges required.</div>;
  }

  if (loading) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="text-lg font-semibold">Total Users</CardHeader>
          <CardContent className="text-2xl">{stats?.totalUsers}</CardContent>
        </Card>
        <Card>
          <CardHeader className="text-lg font-semibold">Total Streamers</CardHeader>
          <CardContent className="text-2xl">{stats?.totalStreamers}</CardContent>
        </Card>
        <Card>
          <CardHeader className="text-lg font-semibold">Active Streams</CardHeader>
          <CardContent className="text-2xl">{stats?.activeStreams}</CardContent>
        </Card>
        <Card>
          <CardHeader className="text-lg font-semibold">Banned Users</CardHeader>
          <CardContent className="text-2xl">{stats?.bannedUsers}</CardContent>
        </Card>
      </div>

      <Tabs defaultValue="users">
        <TabsList>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="streams">Active Streams</TabsTrigger>
          <TabsTrigger value="requests">Streamer Requests</TabsTrigger>
        </TabsList>

        {/* Users Tab */}
        <TabsContent value="users">
          <Card>
            <CardHeader>
              <h2 className="text-2xl font-bold">User Management</h2>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Username</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>{user.username}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <div className="space-x-2">
                          {user.isStreamer && <Badge>Streamer</Badge>}
                          {user.isBanned && <Badge variant="destructive">Banned</Badge>}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-x-2">
                          <Button
                            variant="outline"
                            onClick={() => handleUserStatusUpdate(user.id, { isStreamer: !user.isStreamer })}
                          >
                            {user.isStreamer ? 'Remove Streamer' : 'Make Streamer'}
                          </Button>
                          <Button
                            variant="destructive"
                            onClick={() => handleUserStatusUpdate(user.id, { isBanned: !user.isBanned })}
                          >
                            {user.isBanned ? 'Unban' : 'Ban'}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Active Streams Tab */}
        <TabsContent value="streams">
          <Card>
            <CardHeader>
              <h2 className="text-2xl font-bold">Active Streams</h2>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Streamer</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Viewers</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {streams.map((stream) => (
                    <TableRow key={stream.id}>
                      <TableCell>{stream.user.username}</TableCell>
                      <TableCell>{stream.title}</TableCell>
                      <TableCell>{stream.viewerCount}</TableCell>
                      <TableCell>
                        <Button
                          variant="destructive"
                          onClick={() => handleStreamEnd(stream.id)}
                        >
                          End Stream
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Streamer Requests Tab */}
        <TabsContent value="requests">
          <Card>
            <CardHeader>
              <h2 className="text-2xl font-bold">Streamer Requests</h2>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Username</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Requested</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {streamerRequests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell>{request.username}</TableCell>
                      <TableCell>{request.email}</TableCell>
                      <TableCell>{new Date(request.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <div className="space-x-2">
                          <Button
                            variant="default"
                            onClick={() => handleStreamerRequest(request.id, true)}
                          >
                            Approve
                          </Button>
                          <Button
                            variant="destructive"
                            onClick={() => handleStreamerRequest(request.id, false)}
                          >
                            Reject
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 