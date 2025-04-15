"use client"

import { AvatarFallback } from "@/components/ui/avatar"

import { AvatarImage } from "@/components/ui/avatar"

import { Avatar } from "@/components/ui/avatar"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import StreamCard from "@/components/stream-card"
import { useAuth } from "@/components/auth-provider"

export default function FollowingPage() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState("live")

  // Mock followed streams data
  const liveStreams = [
    {
      id: "stream-1",
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
      id: "stream-2",
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
      id: "stream-3",
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

  const offlineChannels = [
    {
      id: "channel-1",
      username: "AnalyticsHub",
      avatar: "/placeholder.svg?height=200&width=200",
      lastStream: "Pro Analysis - Breaking Down the Playoffs",
      lastStreamDate: "Yesterday",
    },
    {
      id: "channel-2",
      username: "InsiderAccess",
      avatar: "/placeholder.svg?height=200&width=200",
      lastStream: "Training Camp Day 3 - Behind the Scenes",
      lastStreamDate: "2 days ago",
    },
    {
      id: "channel-3",
      username: "DraftCentral",
      avatar: "/placeholder.svg?height=200&width=200",
      lastStream: "Draft Day Special - Live Reactions",
      lastStreamDate: "3 days ago",
    },
    {
      id: "channel-4",
      username: "CoachCorner",
      avatar: "/placeholder.svg?height=200&width=200",
      lastStream: "Coaching Clinic - Advanced Strategies",
      lastStreamDate: "1 week ago",
    },
  ]

  const videos = [
    {
      id: "video-1",
      title: "Championship Finals - Team Alpha vs Team Omega",
      thumbnail: "/placeholder.svg?height=720&width=1280",
      streamer: {
        username: "OfficialFHSB",
        avatar: "/placeholder.svg?height=200&width=200",
      },
      category: "Basketball",
      viewerCount: 15420,
      isLive: false,
      duration: "2:45:30",
      date: "2 days ago",
    },
    {
      id: "video-2",
      title: "High School Championship - Final Game",
      thumbnail: "/placeholder.svg?height=720&width=1280",
      streamer: {
        username: "PrepSports",
        avatar: "/placeholder.svg?height=200&width=200",
      },
      category: "Basketball",
      viewerCount: 2567,
      isLive: false,
      duration: "1:58:22",
      date: "3 days ago",
    },
    {
      id: "video-3",
      title: "Sports Medicine - Injury Prevention",
      thumbnail: "/placeholder.svg?height=720&width=1280",
      streamer: {
        username: "MedicalCorner",
        avatar: "/placeholder.svg?height=200&width=200",
      },
      category: "Education",
      viewerCount: 987,
      isLive: false,
      duration: "45:12",
      date: "1 week ago",
    },
  ]

  if (!user) {
    return (
      <div className="container px-4 py-12 md:px-6 flex flex-col items-center justify-center min-h-[calc(100vh-300px)]">
        <h1 className="text-2xl font-bold text-fhsb-cream mb-4">Follow Your Favorite Streamers</h1>
        <p className="text-muted-foreground text-center max-w-md mb-8">
          Sign in to follow channels and get personalized recommendations based on the content you love.
        </p>
        <div className="flex gap-4">
          <Link href="/login">
            <Button className="bg-fhsb-green text-black hover:bg-fhsb-green/90">Sign In</Button>
          </Link>
          <Link href="/register">
            <Button
              variant="outline"
              className="border-fhsb-green/30 text-fhsb-cream hover:bg-fhsb-green hover:text-black"
            >
              Create Account
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container px-4 py-6 md:px-6 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-fhsb-cream">Following</h1>
        <p className="text-muted-foreground mt-1">Channels you follow</p>
      </div>

      <Tabs defaultValue="live" onValueChange={setActiveTab}>
        <TabsList className="bg-muted/10 border border-fhsb-green/20">
          <TabsTrigger value="live" className="data-[state=active]:bg-fhsb-green data-[state=active]:text-black">
            Live
          </TabsTrigger>
          <TabsTrigger value="videos" className="data-[state=active]:bg-fhsb-green data-[state=active]:text-black">
            Videos
          </TabsTrigger>
          <TabsTrigger value="channels" className="data-[state=active]:bg-fhsb-green data-[state=active]:text-black">
            Channels
          </TabsTrigger>
        </TabsList>

        <TabsContent value="live" className="mt-6">
          {liveStreams.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {liveStreams.map((stream) => (
                <StreamCard key={stream.id} {...stream} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">None of your followed channels are currently live</p>
              <Link href="/browse">
                <Button className="bg-fhsb-green text-black hover:bg-fhsb-green/90">Discover Streams</Button>
              </Link>
            </div>
          )}
        </TabsContent>

        <TabsContent value="videos" className="mt-6">
          {videos.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {videos.map((video) => (
                <div
                  key={video.id}
                  className="group overflow-hidden rounded-lg border border-fhsb-green/20 bg-card transition-all duration-300 stream-card"
                >
                  <Link href={`/videos/${video.id}`}>
                    <div className="relative aspect-video overflow-hidden">
                      <Image
                        src={video.thumbnail || "/placeholder.svg"}
                        alt={video.title}
                        fill
                        className="object-cover transition-transform group-hover:scale-105"
                      />
                      <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-1 py-0.5 rounded">
                        {video.duration}
                      </div>
                    </div>
                    <div className="p-3">
                      <div className="flex gap-3">
                        <Avatar className="h-8 w-8 border border-fhsb-green/30">
                          <AvatarImage
                            src={video.streamer.avatar || "/placeholder.svg"}
                            alt={video.streamer.username}
                          />
                          <AvatarFallback className="bg-muted text-fhsb-cream">
                            {video.streamer.username.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 overflow-hidden">
                          <h3 className="truncate font-medium text-sm text-fhsb-cream group-hover:text-fhsb-green">
                            {video.title}
                          </h3>
                          <p className="truncate text-xs text-muted-foreground">{video.streamer.username}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <p className="truncate text-xs text-muted-foreground">{video.category}</p>
                            <span className="text-xs text-muted-foreground">•</span>
                            <p className="truncate text-xs text-muted-foreground">{video.date}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">No videos from your followed channels</p>
              <Link href="/browse">
                <Button className="bg-fhsb-green text-black hover:bg-fhsb-green/90">Discover Channels</Button>
              </Link>
            </div>
          )}
        </TabsContent>

        <TabsContent value="channels" className="mt-6">
          {offlineChannels.length > 0 ? (
            <div className="space-y-4">
              {offlineChannels.map((channel) => (
                <Link key={channel.id} href={`/channel/${channel.username}`}>
                  <div className="flex items-center gap-4 p-4 rounded-lg border border-fhsb-green/20 bg-card hover:bg-card/80 transition-colors">
                    <Avatar className="h-12 w-12 border border-fhsb-green/30">
                      <AvatarImage src={channel.avatar || "/placeholder.svg"} alt={channel.username} />
                      <AvatarFallback className="bg-muted text-fhsb-cream">
                        {channel.username.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-fhsb-cream">{channel.username}</h3>
                      <p className="text-sm text-muted-foreground truncate">Last stream: {channel.lastStream}</p>
                    </div>
                    <div className="text-sm text-muted-foreground">{channel.lastStreamDate}</div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">You are not following any channels yet</p>
              <Link href="/browse">
                <Button className="bg-fhsb-green text-black hover:bg-fhsb-green/90">Discover Channels</Button>
              </Link>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
