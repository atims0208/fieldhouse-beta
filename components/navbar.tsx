"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/auth-context';
import { UserNav } from '@/components/user-nav';
import { ThemeToggle } from '@/components/theme-toggle';
import { Search } from 'lucide-react';

export function Navbar() {
  const pathname = usePathname();
  const { user, loading } = useAuth();

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 flex">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-brand">Fieldhouse</span>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <nav className="flex items-center space-x-4">
            <Link
              href="/browse"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive('/browse')
                  ? 'text-foreground'
                  : 'text-foreground/60'
              }`}
            >
              Browse
            </Link>
            {user?.isStreamer && (
              <>
                <Link
                  href="/dashboard"
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    pathname.startsWith('/dashboard') && !pathname.includes('/lovense')
                      ? 'text-foreground'
                      : 'text-foreground/60'
                  }`}
                >
                  Dashboard
                </Link>
                <Link
                  href="/dashboard/lovense"
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    pathname.includes('/lovense')
                      ? 'text-foreground'
                      : 'text-foreground/60'
                  }`}
                >
                  Lovense
                </Link>
              </>
            )}
            <Link
              href="/categories"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive('/categories')
                  ? 'text-foreground'
                  : 'text-foreground/60'
              }`}
            >
              Categories
            </Link>
          </nav>
          <div className="flex items-center space-x-2">
            <Link href="/search">
              <Button variant="ghost" size="icon" aria-label="Search">
                <Search className="h-5 w-5" />
              </Button>
            </Link>
            <ThemeToggle />
            {!loading && (
              <>
                {user ? (
                  <UserNav user={user} />
                ) : (
                  <div className="flex items-center space-x-2">
                    <Link href="/auth/login">
                      <Button variant="ghost" size="sm">
                        Log in
                      </Button>
                    </Link>
                    <Link href="/auth/register">
                      <Button size="sm">Sign up</Button>
                    </Link>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
