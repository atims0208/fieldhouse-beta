"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Compass, Users, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useAuth } from "@/components/auth-provider"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

export function Navigation() {
  const pathname = usePathname()
  const { user } = useAuth()
  
  const isActive = (path: string) => {
    return pathname === path
  }
  
  const routes = [
    {
      name: "Home",
      path: "/",
      icon: <Home className="w-5 h-5" />,
    },
    {
      name: "Browse",
      path: "/browse",
      icon: <Compass className="w-5 h-5" />,
    },
    {
      name: "Following",
      path: "/following",
      icon: <Users className="w-5 h-5" />,
    },
    {
      name: "Categories",
      path: "/categories",
      icon: <Menu className="w-5 h-5" />,
    },
    {
      name: "Shop",
      path: "/shop",
      icon: <Menu className="w-5 h-5" />,
    },
  ]

  return (
    <nav className="bg-background border-b sticky top-0 z-40">
      <div className="container px-4 mx-auto">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-xl font-bold">Fieldhouse</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            {routes.map((route) => (
              <Link
                key={route.path}
                href={route.path}
                className={`flex items-center space-x-2 px-4 py-2 ${
                  isActive(route.path)
                    ? "text-foreground font-medium"
                    : "text-muted-foreground hover:text-foreground transition-colors"
                }`}
              >
                {route.icon}
                <span>{route.name}</span>
              </Link>
            ))}
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <Button asChild variant="ghost">
                  <Link href="/dashboard">Dashboard</Link>
                </Button>
                <Button asChild>
                  <Link href="/channel">My Channel</Link>
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Button asChild variant="ghost">
                  <Link href="/login">Login</Link>
                </Button>
                <Button asChild>
                  <Link href="/register">Sign up</Link>
                </Button>
              </div>
            )}

            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="flex flex-col">
                <div className="px-4 space-y-4 pt-8">
                  {routes.map((route) => (
                    <Link
                      key={route.path}
                      href={route.path}
                      className={`flex items-center space-x-2 py-2 ${
                        isActive(route.path)
                          ? "text-foreground font-medium"
                          : "text-muted-foreground hover:text-foreground transition-colors"
                      }`}
                    >
                      {route.icon}
                      <span>{route.name}</span>
                    </Link>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  )
} 