"use client"

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/components/auth-provider';
import { ShieldCheck, Users, Radio } from 'lucide-react'; // Icons

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    console.log('Admin layout auth state:', {
      loading,
      user: user ? {
        id: user.id,
        username: user.username,
        isAdmin: user.isAdmin,
        isStreamer: user.isStreamer
      } : null
    });

    if (!loading) {
      if (!user) {
        console.log('No user found, redirecting to login...');
        router.replace('/login');
      } else if (!user.isAdmin) {
        console.log('User is not admin, redirecting to home...', {
          username: user.username,
          isAdmin: user.isAdmin
        });
        router.replace('/');
      } else {
        console.log('Admin access granted for user:', user.username);
      }
    }
  }, [user, loading, router]);

  if (loading) {
    console.log('Admin layout is loading...');
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-muted-foreground">Loading Admin Area...</p>
      </div>
    );
  }

  if (!user || !user.isAdmin) {
    console.log('Admin layout access denied:', {
      user: user ? {
        username: user.username,
        isAdmin: user.isAdmin
      } : null
    });
    return null;
  }

  // Render layout for authenticated admins
  return (
    <div className="flex min-h-screen">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-card p-4 border-r border-fhsb-green/20 flex flex-col">
        <h2 className="text-xl font-semibold mb-6 text-fhsb-cream flex items-center">
          <ShieldCheck className="mr-2 h-5 w-5 text-fhsb-green" /> Admin Portal
        </h2>
        <nav className="flex flex-col space-y-2">
          <Link href="/admin/users" className="flex items-center p-2 rounded hover:bg-muted/20 text-fhsb-cream">
            <Users className="mr-2 h-4 w-4" /> Manage Users
          </Link>
          <Link href="/admin/streams" className="flex items-center p-2 rounded hover:bg-muted/20 text-fhsb-cream">
            <Radio className="mr-2 h-4 w-4" /> Manage Streams
          </Link>
          {/* Add more admin links here */}
        </nav>
        <div className="mt-auto">
            <Link href="/" className="text-sm text-muted-foreground hover:text-fhsb-green">
                Back to Site
            </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 bg-background">
        {children}
      </main>
    </div>
  );
} 