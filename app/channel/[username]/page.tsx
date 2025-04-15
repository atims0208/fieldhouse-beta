"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Bell, BellOff } from "lucide-react"
import { useAuth } from "@/components/auth-provider"

export default function ChannelPage() {
  const { username } = useParams()
  const { user } = useAuth()
  const [isFollowing, setIsFollowing] = useState(false)
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [isNotificationsOn, setIsNotificationsOn] = useState(false)

  // Mock channel data
  const channel = {
    username: username as string,
    displayName: username as string,
    avatar: "/placeholder.svg?height=200&width=200",
    banner: "/placeholder.svg?height=300&width=1200",
    followers: 125000,
    description:
      "Official channel for Fieldhouse Stadium Beta. We stream live sports events, tournaments, and exclusive content for sports fans around the world.",
    isLive: true,
    currentStream: {
      id: "stream-1",
      title: "Championship Finals - Team Alpha vs Team Omega",
      thumbnail: "/placeholder.svg?height=720&width=1280",
      category: "Basketball",
      viewerCount: 15420,
      startedAt: new Date(Date.now() - 1000 * 60 * 45), // Started 45 minutes ago
    },
  }

  // Mock videos data
  const videos = [
    {
      id: "video-1",
      title: "Semifinals - Team Alpha vs Team Beta",
      thumbnail: "/placeholder.svg?height=720&width=1280",
      duration: "2:15:30",
      views: 12500,
      date: "2 days ago",
    },
    {
      id: "video-2",
      title: "Quarterfinals - Team Alpha vs Team Gamma",
      thumbnail: "/placeholder.svg?height=720&width=1280",
      duration: "1:45:12",
      views: 8300,
      date: "1 week ago",
    },
    {
      id: "video-3",
      title: "Round of 16 - Team Alpha vs Team Delta",
      thumbnail: "/placeholder.svg?height=720&width=1280",
      duration: "2:05:45",
      views: 6700,
      date: "2 weeks ago",
    },
    {
      id: "video-4",
      title: "Group Stage - Team Alpha vs Team Epsilon",
      thumbnail: "/placeholder.svg?height=720&width=1280",
      duration: "1:55:20",
      views: 5200,
      date: "3 weeks ago",
    },
    {
      id: "video-5",
      title: "Pre-Tournament Interview with Coach",
      thumbnail: "/placeholder.svg?height=720&width=1280",
      duration: "45:10",
      views: 3800,
      date: "1 month ago",
    },
    {
      id: "video-6",
      title: "Season Preview - Teams to Watch",
      thumbnail: "/placeholder.svg?height=720&width=1280",
      duration: "1:15:30",
      views: 7200,
      date: "1 month ago",
    },
  ]

  // Mock schedule data
  const schedule = [
    {
      id: "schedule-1",
      title: "Semifinals Recap",
      date: "Tomorrow at 7:00 PM",
      description: "Breaking down the semifinals and looking ahead to the championship.",
    },
    {
      id: "schedule-2",
      title: "Coach Interview",
      date: "Friday at 6:30 PM",
      description: "Exclusive interview with the head coach discussing strategy for the finals.",
    },
    {
      id: "schedule-3",
      title: "Season Preview",
      date: "Next Monday at 8:00 PM",
      description: "Looking ahead to the upcoming season and previewing the top teams.",
    },
  ]

  const toggleFollow = () => {
    setIsFollowing((prev) => !prev)
  }

  const toggleSubscribe = () => {
    setIsSubscribed((prev) => !prev)
  }

  const toggleNotifications = () => {
    setIsNotificationsOn((prev) => !prev)
  }

  return (
    <div>
      {/* Channel Banner */}
      <div className="relative h-40 md:h-60 w-full overflow-hidden">
        <Image
          src={channel.banner || "/placeholder.svg"}
          alt={`${channel.displayName}'s banner`}
          fill
          className="object-cover"
        />
      </div>

      <div className="container px-4 py-6 md:px-6 space-y-6">
        {/* Channel Info */}
        <div className="flex flex-col md:flex-row gap-6 items-start">
          <Avatar className="h-24 w-24 border-4 border-black -mt-12 z-10 bg-black">
            <AvatarImage src={channel.avatar || "/placeholder.svg"} alt={channel.displayName} />
            <AvatarFallback className="bg-muted text-fhsb-cream text-2xl">
              {channel.displayName.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-fhsb-cream">{channel.displayName}</h1>
              {channel.isLive && <Badge className="bg-red-600 hover:bg-red-700">LIVE</Badge>}
            </div>
            <p className="text-muted-foreground">{channel.followers.toLocaleString()} followers</p>
            <p className="text-fhsb-cream">{channel.description}</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
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
            {isFollowing && (
              <Button
                variant="outline"
                size="icon"
                className="border-fhsb-green/30 text-fhsb-cream hover:bg-transparent"
                onClick={toggleNotifications}
              >
                {isNotificationsOn ? <Bell className="h-4 w-4" /> : <BellOff className="h-4 w-4" />}
                <span className="sr-only">
                  {isNotificationsOn ? "Turn off notifications" : "Turn on notifications"}
                </span>
              </Button>
            )}
          </div>
        </div>

        {/* Current Stream (if live) */}
        {channel.isLive && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-fhsb-cream">Live Now</h2>
            <Link href={`/stream/${channel.currentStream.id}`}>
              <div className="group overflow-hidden rounded-lg border border-fhsb-green/20 bg-card hover:bg-card/80 transition-colors">
                <div className="relative aspect-video overflow-hidden">
                  <Image
                    src={channel.currentStream.thumbnail || "/placeholder.svg"}
                    alt={channel.currentStream.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-2 left-2 flex items-center gap-1.5">
                    <Badge className="bg-red-600 hover:bg-red-700">LIVE</Badge>
                    <Badge className="bg-black/70 backdrop-blur-sm hover:bg-black/80">
                      {channel.currentStream.viewerCount.toLocaleString()} viewers
                    </Badge>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-medium text-fhsb-cream group-hover:text-fhsb-green">
                    {channel.currentStream.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">{channel.currentStream.category}</p>
                </div>
              </div>
            </Link>
          </div>
        )}

        {/* Channel Content Tabs */}
        <Tabs defaultValue="videos">
          <TabsList className="bg-muted/10 border border-fhsb-green/20">
            <TabsTrigger value="videos" className="data-[state=active]:bg-fhsb-green data-[state=active]:text-black">
              Videos
            </TabsTrigger>
            <TabsTrigger value="schedule" className="data-[state=active]:bg-fhsb-green data-[state=active]:text-black">
              Schedule
            </TabsTrigger>
            <TabsTrigger value="about" className="data-[state=active]:bg-fhsb-green data-[state=active]:text-black">
              About
            </TabsTrigger>
          </TabsList>

          <TabsContent value="videos" className="mt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {videos.map((video) => (
                <Link key={video.id} href={`/videos/${video.id}`}>
                  <div className="group overflow-hidden rounded-lg border border-fhsb-green/20 bg-card transition-all duration-300 stream-card">
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
                      <h3 className="truncate font-medium text-sm text-fhsb-cream group-hover:text-fhsb-green">
                        {video.title}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <p className="truncate text-xs text-muted-foreground">{video.views.toLocaleString()} views</p>
                        <span className="text-xs text-muted-foreground">•</span>
                        <p className="truncate text-xs text-muted-foreground">{video.date}</p>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="schedule" className="mt-6">
            <div className="space-y-4">
              {schedule.map((event) => (
                <div key={event.id} className="p-4 rounded-lg border border-fhsb-green/20 bg-card/50">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-fhsb-cream">{event.title}</h3>
                      <p className="text-sm text-muted-foreground">{event.date}</p>
                      <p className="text-sm text-fhsb-cream mt-2">{event.description}</p>
                    </div>
                    <Button
                      variant="outline"
                      className="border-fhsb-green/30 text-fhsb-cream hover:bg-fhsb-green hover:text-black"
                    >
                      Set Reminder
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="about" className="mt-6">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-fhsb-cream mb-2">About {channel.displayName}</h3>
                <p className="text-fhsb-cream">{channel.description}</p>
              </div>

              <div>
                <h3 className="text-lg font-medium text-fhsb-cream mb-2">Channel Stats</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-lg border border-fhsb-green/20 bg-card/50">
                    <p className="text-sm text-muted-foreground">Followers</p>
                    <p className="text-xl font-bold text-fhsb-cream">{channel.followers.toLocaleString()}</p>
                  </div>
                  <div className="p-4 rounded-lg border border-fhsb-green/20 bg-card/50">
                    <p className="text-sm text-muted-foreground">Total Views</p>
                    <p className="text-xl font-bold text-fhsb-cream">2.5M</p>
                  </div>
                  <div className="p-4 rounded-lg border border-fhsb-green/20 bg-card/50">
                    <p className="text-sm text-muted-foreground">Joined</p>
                    <p className="text-xl font-bold text-fhsb-cream">Jan 2023</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-fhsb-cream mb-2">Social Media</h3>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    className="border-fhsb-green/30 text-fhsb-cream hover:bg-fhsb-green hover:text-black"
                  >
                    Twitter
                  </Button>
                  <Button
                    variant="outline"
                    className="border-fhsb-green/30 text-fhsb-cream hover:bg-fhsb-green hover:text-black"
                  >
                    Instagram
                  </Button>
                  <Button
                    variant="outline"
                    className="border-fhsb-green/30 text-fhsb-cream hover:bg-fhsb-green hover:text-black"
                  >
                    Facebook
                  </Button>
                  <Button
                    variant="outline"
                    className="border-fhsb-green/30 text-fhsb-cream hover:bg-fhsb-green hover:text-black"
                  >
                    YouTube
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
