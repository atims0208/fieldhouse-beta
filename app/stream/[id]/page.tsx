"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Share2, Flag } from "lucide-react"
import ChatInterface from "@/components/chat-interface"
import StreamCard from "@/components/stream-card"
import { useAuth } from "@/components/auth-provider"
import { useStreamWebSocket } from "@/hooks/use-stream-websocket"

export default function StreamPage() {
  const params = useParams()
  const streamId = Array.isArray(params.id) ? params.id[0] : params.id
  const { user } = useAuth()
  const [isFollowing, setIsFollowing] = useState(false)
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [viewerCount, setViewerCount] = useState(0)

  const { isConnected } = useStreamWebSocket(streamId)

  // Mock stream data
  const stream = {
    id: streamId,
    title: "Championship Finals - Team Alpha vs Team Omega",
    description:
      "Watch the exciting championship finals between Team Alpha and Team Omega. This is the culmination of months of competition, and both teams have shown incredible skill throughout the tournament. Don't miss this epic showdown!",
    thumbnail: "/placeholder.svg?height=720&width=1280",
    streamer: {
      username: "OfficialFHSB",
      displayName: "Official FHSB",
      avatar: "/placeholder.svg?height=200&width=200",
      followers: 125000,
    },
    category: "Basketball",
    tags: ["Championship", "Finals", "Basketball", "Tournament"],
    isLive: true,
    startedAt: new Date(Date.now() - 1000 * 60 * 45), // Started 45 minutes ago
  }

  // Mock recommended streams
  const recommendedStreams = [
    {
      id: "rec-1",
      title: "Regional Qualifiers - East Division",
      thumbnail: "/placeholder.svg?height=720&width=1280",
      streamer: {
        username: "SportsCenter",
        avatar: "/placeholder.svg?height=200&width=200",
      },
      category: "Basketball",
      viewerCount: 8754,
      isLive: true,
    },
    {
      id: "rec-2",
      title: "Weekly Tournament Series - Round 4",
      thumbnail: "/placeholder.svg?height=720&width=1280",
      streamer: {
        username: "GameDay",
        avatar: "/placeholder.svg?height=200&width=200",
      },
      category: "Football",
      viewerCount: 6231,
      isLive: true,
    },
    {
      id: "rec-3",
      title: "College Showcase - Top Prospects",
      thumbnail: "/placeholder.svg?height=720&width=1280",
      streamer: {
        username: "RecruitingLive",
        avatar: "/placeholder.svg?height=200&width=200",
      },
      category: "Baseball",
      viewerCount: 4102,
      isLive: true,
    },
  ]

  // Simulate changing viewer count
  useEffect(() => {
    // Set initial viewer count
    setViewerCount(Math.floor(Math.random() * 10000) + 5000)

    // Update viewer count periodically
    const interval = setInterval(() => {
      setViewerCount((prev) => Math.max(5000, prev + Math.floor(Math.random() * 100) - 50))
    }, 10000)

    return () => clearInterval(interval)
  }, [])

  const toggleFollow = () => {
    setIsFollowing((prev) => !prev)
  }

  const toggleSubscribe = () => {
    setIsSubscribed((prev) => !prev)
  }

  const formatViewerCount = (count: number) => {
    return count.toLocaleString()
  }

  const formatStreamTime = (date: Date) => {
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)

    if (diffMins < 60) {
      return `${diffMins} min`
    } else {
      const hours = Math.floor(diffMins / 60)
      const mins = diffMins % 60
      return `${hours}h ${mins}m`
    }
  }

  return (
    <div className="container px-4 py-6 md:px-6 space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-6">
        <div className="space-y-4 relative">
          {/* Video Player */}
          <div className="video-player-container rounded-lg border border-fhsb-green/20 overflow-hidden">
            <div className="w-full h-full flex items-center justify-center bg-black">
              <Image
                src={stream.thumbnail || "/placeholder.svg"}
                alt={stream.title}
                width={1280}
                height={720}
                className="w-full h-full object-contain"
              />
            </div>
          </div>

          {/* Stream Info */}
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Badge className="bg-red-600 hover:bg-red-700">LIVE</Badge>
                  <span className="text-sm text-muted-foreground">
                    {formatViewerCount(viewerCount)} viewers • Started {formatStreamTime(stream.startedAt)} ago
                  </span>
                </div>
                <h1 className="text-xl font-bold text-fhsb-cream">{stream.title}</h1>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Link href={`/categories/${stream.category.toLowerCase()}`} className="hover:text-fhsb-green">
                    {stream.category}
                  </Link>
                  {stream.tags.map((tag) => (
                    <Link key={tag} href={`/tags/${tag.toLowerCase()}`} className="hover:text-fhsb-green">
                      #{tag}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="border-fhsb-green/30 text-fhsb-cream hover:bg-transparent"
                >
                  <Share2 className="h-4 w-4" />
                  <span className="sr-only">Share</span>
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="border-fhsb-green/30 text-fhsb-cream hover:bg-transparent"
                >
                  <Flag className="h-4 w-4" />
                  <span className="sr-only">Report</span>
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-fhsb-green/20">
              <div className="flex items-center gap-4">
                <Link href={`/channel/${stream.streamer.username}`}>
                  <Avatar className="h-12 w-12 border border-fhsb-green/30">
                    <AvatarImage src={stream.streamer.avatar || "/placeholder.svg"} alt={stream.streamer.displayName} />
                    <AvatarFallback className="bg-muted text-fhsb-cream">
                      {stream.streamer.displayName.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Link>
                <div>
                  <Link
                    href={`/channel/${stream.streamer.username}`}
                    className="font-medium text-fhsb-cream hover:text-fhsb-green"
                  >
                    {stream.streamer.displayName}
                  </Link>
                  <p className="text-sm text-muted-foreground">
                    {stream.streamer.followers.toLocaleString()} followers
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant={isFollowing ? "default" : "outline"}
                  className={
                    isFollowing
                      ? "bg-fhsb-green text-black hover:bg-fhsb-green/90"
                      : "border-fhsb-green/30 text-fhsb-cream hover:bg-fhsb-green hover:text-black"
                  }
                  onClick={toggleFollow}
                >
                  {isFollowing ? "Following" : "Follow"}
                </Button>
                <Button
                  variant={isSubscribed ? "default" : "outline"}
                  className={
                    isSubscribed
                      ? "bg-fhsb-green text-black hover:bg-fhsb-green/90"
                      : "border-fhsb-green/30 text-fhsb-cream hover:bg-fhsb-green hover:text-black"
                  }
                  onClick={toggleSubscribe}
                >
                  {isSubscribed ? "Subscribed" : "Subscribe"}
                </Button>
              </div>
            </div>

            <Tabs defaultValue="about">
              <TabsList className="bg-muted/10 border border-fhsb-green/20">
                <TabsTrigger value="about" className="data-[state=active]:bg-fhsb-green data-[state=active]:text-black">
                  About
                </TabsTrigger>
                <TabsTrigger
                  value="schedule"
                  className="data-[state=active]:bg-fhsb-green data-[state=active]:text-black"
                >
                  Schedule
                </TabsTrigger>
                <TabsTrigger
                  value="videos"
                  className="data-[state=active]:bg-fhsb-green data-[state=active]:text-black"
                >
                  Videos
                </TabsTrigger>
              </TabsList>

              <TabsContent value="about" className="mt-4">
                <p className="text-fhsb-cream">{stream.description}</p>
              </TabsContent>

              <TabsContent value="schedule" className="mt-4">
                <div className="space-y-4">
                  <div className="p-4 rounded-lg border border-fhsb-green/20 bg-card/50">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-fhsb-cream">Upcoming: Semifinals Recap</h3>
                        <p className="text-sm text-muted-foreground">Tomorrow at 7:00 PM</p>
                      </div>
                      <Button
                        variant="outline"
                        className="border-fhsb-green/30 text-fhsb-cream hover:bg-fhsb-green hover:text-black"
                      >
                        Set Reminder
                      </Button>
                    </div>
                  </div>

                  <div className="p-4 rounded-lg border border-fhsb-green/20 bg-card/50">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-fhsb-cream">Upcoming: Coach Interview</h3>
                        <p className="text-sm text-muted-foreground">Friday at 6:30 PM</p>
                      </div>
                      <Button
                        variant="outline"
                        className="border-fhsb-green/30 text-fhsb-cream hover:bg-fhsb-green hover:text-black"
                      >
                        Set Reminder
                      </Button>
                    </div>
                  </div>

                  <div className="p-4 rounded-lg border border-fhsb-green/20 bg-card/50">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-fhsb-cream">Upcoming: Season Preview</h3>
                        <p className="text-sm text-muted-foreground">Next Monday at 8:00 PM</p>
                      </div>
                      <Button
                        variant="outline"
                        className="border-fhsb-green/30 text-fhsb-cream hover:bg-fhsb-green hover:text-black"
                      >
                        Set Reminder
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="videos" className="mt-4">
                <div className="space-y-4">
                  <div className="p-4 rounded-lg border border-fhsb-green/20 bg-card/50">
                    <div className="flex gap-4">
                      <div className="relative aspect-video w-40 flex-shrink-0 overflow-hidden rounded">
                        <Image
                          src="/placeholder.svg?height=720&width=1280"
                          alt="Video thumbnail"
                          fill
                          className="object-cover"
                        />
                        <div className="absolute bottom-1 right-1 bg-black/80 text-white text-xs px-1 py-0.5 rounded">
                          2:15:30
                        </div>
                      </div>
                      <div>
                        <h3 className="font-medium text-fhsb-cream">Semifinals - Team Alpha vs Team Beta</h3>
                        <p className="text-sm text-muted-foreground">2 days ago • 12.5K views</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-lg border border-fhsb-green/20 bg-card/50">
                    <div className="flex gap-4">
                      <div className="relative aspect-video w-40 flex-shrink-0 overflow-hidden rounded">
                        <Image
                          src="/placeholder.svg?height=720&width=1280"
                          alt="Video thumbnail"
                          fill
                          className="object-cover"
                        />
                        <div className="absolute bottom-1 right-1 bg-black/80 text-white text-xs px-1 py-0.5 rounded">
                          1:45:12
                        </div>
                      </div>
                      <div>
                        <h3 className="font-medium text-fhsb-cream">Quarterfinals - Team Alpha vs Team Gamma</h3>
                        <p className="text-sm text-muted-foreground">1 week ago • 8.3K views</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-lg border border-fhsb-green/20 bg-card/50">
                    <div className="flex gap-4">
                      <div className="relative aspect-video w-40 flex-shrink-0 overflow-hidden rounded">
                        <Image
                          src="/placeholder.svg?height=720&width=1280"
                          alt="Video thumbnail"
                          fill
                          className="object-cover"
                        />
                        <div className="absolute bottom-1 right-1 bg-black/80 text-white text-xs px-1 py-0.5 rounded">
                          2:05:45
                        </div>
                      </div>
                      <div>
                        <h3 className="font-medium text-fhsb-cream">Round of 16 - Team Alpha vs Team Delta</h3>
                        <p className="text-sm text-muted-foreground">2 weeks ago • 6.7K views</p>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Chat */}
        <div className="h-full">
          <ChatInterface streamId={streamId} />
        </div>
      </div>

      {/* Recommended Streams */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-fhsb-cream">Recommended Streams</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {recommendedStreams.map((stream) => (
            <StreamCard key={stream.id} {...stream} />
          ))}
        </div>
      </div>
    </div>
  )
}
