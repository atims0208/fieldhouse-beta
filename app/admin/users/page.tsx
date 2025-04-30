"use client"

import React, { useState, useEffect, useCallback } from 'react';
import { adminAPI } from '@/lib/api'; // Import the admin API client
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { MoreHorizontal, Ban } from 'lucide-react';
import { format } from 'date-fns'; // For date formatting
import { Card } from "@/components/ui/card";

// Define user type matching backend structure (including new fields)
interface AdminUserView {
  id: string;
  username: string;
  email: string;
  isStreamer: boolean;
  isAdmin: boolean;
  isBanned: boolean;
  bannedUntil: string | null; // Date comes as string from JSON
  balance: number;
  createdAt: string;
  // Add other fields if needed: avatarUrl, bio, dateOfBirth
}

interface ApiResponse {
  users: AdminUserView[];
  totalUsers: number;
  currentPage: number;
  totalPages: number;
}

export default function ManageUsersPage() {
  const [users, setUsers] = useState<AdminUserView[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    limit: 15, // Items per page
  });
  const { toast } = useToast();

  // Fetch users function
  const fetchUsers = useCallback(async (page: number, limit: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const data: ApiResponse = await adminAPI.listUsers(page, limit);
      setUsers(data.users || []);
      setPagination({
        currentPage: data.currentPage,
        totalPages: data.totalPages,
        limit: limit,
      });
    } catch (err) {
      console.error("Failed to fetch users:", err);
      setError("Failed to load users. Please try again.");
      toast({ title: "Error", description: "Could not fetch users", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  // Initial fetch
  useEffect(() => {
    fetchUsers(pagination.currentPage, pagination.limit);
  }, [fetchUsers, pagination.currentPage, pagination.limit]);

  // TODO: Implement Ban/Unban Action Handlers
  const handleBanUser = (userId: string, currentStatus: boolean) => {
    console.log(`Action: ${currentStatus ? 'Unban' : 'Ban'} user ${userId}`);
    // Call adminAPI.setUserBanStatus(userId, !currentStatus, duration?);
    // Refresh user list: fetchUsers(pagination.currentPage, pagination.limit);
    toast({ title: "Action Required", description: "Ban/Unban functionality not yet implemented." });
  };

  const handleTempBanUser = (userId: string) => {
      console.log(`Action: Temp Ban user ${userId}`);
      // Prompt for duration, then call API
      toast({ title: "Action Required", description: "Temporary Ban functionality not yet implemented." });
  }

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      fetchUsers(newPage, pagination.limit);
    }
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-fhsb-cream">Manage Users</h1>

      {error && <p className="text-red-500">{error}</p>}

      <Card className="bg-card border-fhsb-green/20">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-fhsb-green/20">
              <TableHead>Username</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Roles</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={6} className="text-center text-muted-foreground">
                  Loading users...
                </TableCell>
              </TableRow>
            ) : users.length === 0 ? (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={6} className="text-center text-muted-foreground">
                  No users found.
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id} className="hover:bg-muted/10 border-fhsb-green/20">
                  <TableCell className="font-medium text-fhsb-cream">{user.username}</TableCell>
                  <TableCell className="text-muted-foreground">{user.email}</TableCell>
                  <TableCell>
                    {user.isBanned ? (
                      <Badge variant="destructive">Banned {user.bannedUntil ? `until ${format(new Date(user.bannedUntil), 'Ppp')}`: '(Permanent)'}</Badge>
                    ) : (
                      <Badge variant="secondary">Active</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                        {user.isAdmin && <Badge className='bg-purple-600'>Admin</Badge>}
                        {user.isStreamer && <Badge className='bg-blue-600'>Streamer</Badge>}
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {format(new Date(user.createdAt), 'PPp')}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-card border-fhsb-green/30 text-fhsb-cream">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => alert(`View profile for ${user.username}`)}>
                          View Profile
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-fhsb-green/20"/>
                        <DropdownMenuItem 
                           className={`text-red-500 focus:bg-red-900/50 focus:text-red-400 ${user.isAdmin ? 'opacity-50 cursor-not-allowed' : ''}`}
                           onClick={() => !user.isAdmin && handleBanUser(user.id, user.isBanned)}
                           disabled={user.isAdmin}
                         >
                          <Ban className="mr-2 h-4 w-4" />
                          {user.isBanned ? 'Unban User' : 'Ban User (Permanent)'}
                        </DropdownMenuItem>
                         <DropdownMenuItem 
                           className={`text-orange-500 focus:bg-orange-900/50 focus:text-orange-400 ${user.isAdmin || user.isBanned ? 'opacity-50 cursor-not-allowed' : ''}`}
                           onClick={() => !user.isAdmin && !user.isBanned && handleTempBanUser(user.id)}
                           disabled={user.isAdmin || user.isBanned}
                         >
                          <Ban className="mr-2 h-4 w-4" />
                           Ban User (Temporary)
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      {/* Pagination Controls */}
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(pagination.currentPage - 1)}
          disabled={pagination.currentPage <= 1 || isLoading}
          className="border-fhsb-green/30 text-fhsb-cream hover:bg-muted/20"
        >
          Previous
        </Button>
        <span className="text-sm text-muted-foreground">
          Page {pagination.currentPage} of {pagination.totalPages}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(pagination.currentPage + 1)}
          disabled={pagination.currentPage >= pagination.totalPages || isLoading}
          className="border-fhsb-green/30 text-fhsb-cream hover:bg-muted/20"
        >
          Next
        </Button>
      </div>
    </div>
  );
} 