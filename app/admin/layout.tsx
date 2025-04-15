"use client"

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/components/auth-provider';
import { ShieldCheck, Users, Radio } from 'lucide-react'; // Icons

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && (!user || !user.isAdmin)) {
      // Redirect non-admins away from the admin section
      console.log('Redirecting non-admin user...');
      router.replace('/'); // Redirect to home page or login
    }
  }, [user, isLoading, router]);

  if (isLoading || !user || !user.isAdmin) {
    // Show loading state or null while checking auth/redirecting
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-muted-foreground">Loading Admin Area...</p>
        {/* Or a spinner component */}
      </div>
    ); 
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