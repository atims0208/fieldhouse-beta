"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Share2, Flag, ThumbsUp, ThumbsDown, MessageSquare } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { getInitials } from "@/lib/utils"

interface Video {
  id: string
  title: string
  description: string
  thumbnail: string
  url: string
  uploadDate: Date
  category: string
  tags: string[]
  creator: {
    username: string
    avatar: string | null
  }
}

export default function VideoPage() {
  const { id } = useParams()
  const { user } = useAuth()
  const [isFollowing, setIsFollowing] = useState(false)
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [likeCount, setLikeCount] = useState(1245)
  const [dislikeCount, setDislikeCount] = useState(32)
  const [hasLiked, setHasLiked] = useState(false)
  const [hasDisliked, setHasDisliked] = useState(false)
  const [viewerCount] = useState(0)
  const [video, setVideo] = useState<Video | null>(null)

  useEffect(() => {
    // Mock video data
    const mockVideo: Video = {
      id: id as string,
      title: "Championship Finals - Team Alpha vs Team Omega",
      description:
        "Watch the exciting championship finals between Team Alpha and Team Omega. This is the culmination of months of competition, and both teams have shown incredible skill throughout the tournament. Don't miss this epic showdown!",
      thumbnail: "/placeholder.svg?height=720&width=1280",
      url: "",
      uploadDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
      category: "Basketball",
      tags: ["Championship", "Finals", "Basketball", "Tournament"],
      creator: {
        username: "OfficialFHSB",
        avatar: "/placeholder.svg?height=200&width=200",
      },
    }
    setVideo(mockVideo)
  }, [id])

  // Mock recommended videos
  const recommendedVideos = [
    {
      id: "rec-1",
      title: "Semifinals - Team Alpha vs Team Beta",
      thumbnail: "/placeholder.svg?height=720&width=1280",
      duration: "2:15:30",
      views: 12500,
      uploadDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4), // 4 days ago
      streamer: {
        username: "OfficialFHSB",
        avatar: "/placeholder.svg?height=200&width=200",
      },
    },
    {
      id: "rec-2",
      title: "Quarterfinals - Team Alpha vs Team Gamma",
      thumbnail: "/placeholder.svg?height=720&width=1280",
      duration: "1:45:12",
      views: 8300,
      uploadDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7), // 7 days ago
      streamer: {
        username: "OfficialFHSB",
        avatar: "/placeholder.svg?height=200&width=200",
      },
    },
    {
      id: "rec-3",
      title: "Round of 16 - Team Alpha vs Team Delta",
      thumbnail: "/placeholder.svg?height=720&width=1280",
      duration: "2:05:45",
      views: 6700,
      uploadDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14), // 14 days ago
      streamer: {
        username: "OfficialFHSB",
        avatar: "/placeholder.svg?height=200&width=200",
      },
    },
  ]

  const toggleFollow = () => {
    setIsFollowing((prev) => !prev)
  }

  const toggleSubscribe = () => {
    setIsSubscribed((prev) => !prev)
  }

  const handleLike = () => {
    if (hasLiked) {
      setLikeCount((prev) => prev - 1)
      setHasLiked(false)
    } else {
      setLikeCount((prev) => prev + 1)
      setHasLiked(true)
      if (hasDisliked) {
        setDislikeCount((prev) => prev - 1)
        setHasDisliked(false)
      }
    }
  }

  const handleDislike = () => {
    if (hasDisliked) {
      setDislikeCount((prev) => prev - 1)
      setHasDisliked(false)
    } else {
      setDislikeCount((prev) => prev + 1)
      setHasDisliked(true)
      if (hasLiked) {
        setLikeCount((prev) => prev - 1)
        setHasLiked(false)
      }
    }
  }

  const formatViews = (count: number) => {
    return count.toLocaleString()
  }

  const formatDate = (date: Date) => {
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffDays === 0) {
      return "Today"
    } else if (diffDays === 1) {
      return "Yesterday"
    } else if (diffDays < 7) {
      return `${diffDays} days ago`
    } else if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7)
      return `${weeks} ${weeks === 1 ? "week" : "weeks"} ago`
    } else if (diffDays < 365) {
      const months = Math.floor(diffDays / 30)
      return `${months} ${months === 1 ? "month" : "months"} ago`
    } else {
      const years = Math.floor(diffDays / 365)
      return `${years} ${years === 1 ? "year" : "years"} ago`
    }
  }

  if (!video) {
    return <div>Loading...</div>
  }

  return (
    <div className="container px-4 py-6 md:px-6 space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-6">
        <div className="space-y-4">
          {/* Video Player */}
          <div className="video-player-container rounded-lg border border-fhsb-green/20 overflow-hidden">
            <div className="w-full h-full flex items-center justify-center bg-black">
              <video
                src={video.url}
                controls
                className="w-full h-full object-contain"
              />
            </div>
          </div>

          {/* Video Info */}
          <div className="space-y-4">
            <div className="space-y-2">
              <h1 className="text-xl font-bold text-fhsb-cream">{video.title}</h1>
              <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                <span>{formatViews(viewerCount)} views</span>
                <span>•</span>
                <span>{formatDate(video.uploadDate)}</span>
                <span>•</span>
                <Link href={`/categories/${video.category.toLowerCase()}`} className="hover:text-fhsb-green">
                  {video.category}
                </Link>
                {video.tags.map((tag) => (
                  <Link key={tag} href={`/tags/${tag.toLowerCase()}`} className="hover:text-fhsb-green">
                    #{tag}
                  </Link>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Avatar>
                <AvatarImage src={video.creator.avatar || undefined} />
                <AvatarFallback>{getInitials(video.creator.username)}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <Link href={`/profile/${video.creator.username}`} className="font-semibold hover:text-fhsb-green">
                    {video.creator.username}
                  </Link>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" onClick={toggleFollow}>
                  {isFollowing ? "Following" : "Follow"}
                </Button>
                <Button onClick={toggleSubscribe}>
                  {isSubscribed ? "Subscribed" : "Subscribe"}
                </Button>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 py-2 border-t border-fhsb-green/20">
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className={`flex items-center gap-1 ${hasLiked ? "text-fhsb-green" : "text-muted-foreground"}`}
                  onClick={handleLike}
                >
                  <ThumbsUp className="h-4 w-4" />
                  <span>{likeCount}</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`flex items-center gap-1 ${hasDisliked ? "text-red-500" : "text-muted-foreground"}`}
                  onClick={handleDislike}
                >
                  <ThumbsDown className="h-4 w-4" />
                  <span>{dislikeCount}</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-1 text-muted-foreground"
                >
                  <MessageSquare className="h-4 w-4" />
                  <span>Comments</span>
                </Button>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-fhsb-green/30 text-fhsb-cream hover:bg-transparent"
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
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

            <Tabs defaultValue="description">
              <TabsList className="bg-muted/10 border border-fhsb-green/20">
                <TabsTrigger value="description" className="data-[state=active]:bg-fhsb-green data-[state=active]:text-black">
                  Description
                </TabsTrigger>
                <TabsTrigger value="comments" className="data-[state=active]:bg-fhsb-green data-[state=active]:text-black">
                  Comments
                </TabsTrigger>
              </TabsList>

              <TabsContent value="description" className="mt-4">
                <p className="text-fhsb-cream">{video.description}</p>
              </TabsContent>

              <TabsContent value="comments" className="mt-4">
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-10 w-10 border border-fhsb-green/30">
                      <AvatarFallback className="bg-muted text-fhsb-cream">
                        {user ? user.username.substring(0, 2).toUpperCase() : "GU"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <input
                        type="text"
                        placeholder="Add a comment..."
                        className="w-full bg-transparent border-b border-fhsb-green/30 focus:border-fhsb-green focus:outline-none py-2"
                      />
                    </div>
                  </div>

                  <div className="space-y-4 pt-4">
                    <div className="flex gap-4">
                      <Avatar className="h-10 w-10 border border-fhsb-green/30">
                        <AvatarImage src="/placeholder.svg?height=200&width=200" alt="User" />
                        <AvatarFallback className="bg-muted text-fhsb-cream">JD</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-fhsb-cream">JohnDoe</p>
                          <p className="text-xs text-muted-foreground">2 days ago</p>
                        </div>
                        <p className="text-fhsb-cream mt-1">
                          Great game! Team Alpha really showed their skills in the second half.
                        </p>
                        <div className="flex items-center gap-4 mt-2">
                          <Button variant="ghost" size="sm" className="text-muted-foreground h-auto p-0">
                            <ThumbsUp className="h-3 w-3 mr-1" />
                            <span className="text-xs">24</span>
                          </Button>
                          <Button variant="ghost" size="sm" className="text-muted-foreground h-auto p-0">
                            <ThumbsDown className="h-3 w-3 mr-1" />
                            <span className="text-xs">2</span>
                          </Button>
                          <Button variant="ghost" size="sm" className="text-muted-foreground h-auto p-0">
                            <span className="text-xs">Reply</span>
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <Avatar className="h-10 w-10 border border-fhsb-green/30">
                        <AvatarImage src="/placeholder.svg?height=200&width=200" alt="User" />
                        <AvatarFallback className="bg-muted text-fhsb-cream">JS</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-fhsb-cream">JaneSmith</p>
                          <p className="text-xs text-muted-foreground">1 day ago</p>
                        </div>
                        <p className="text-fhsb-cream mt-1">
                          The defense from Team Omega was impressive, but they couldn't keep up with Alpha's offense.
                        </p>
                        <div className="flex items-center gap-4 mt-2">
                          <Button variant="ghost" size="sm" className="text-muted-foreground h-auto p-0">
                            <ThumbsUp className="h-3 w-3 mr-1" />
                            <span className="text-xs">18</span>
                          </Button>
                          <Button variant="ghost" size="sm" className="text-muted-foreground h-auto p-0">
                            <ThumbsDown className="h-3 w-3 mr-1" />
                            <span className="text-xs">1</span>
                          </Button>
                          <Button variant="ghost" size="sm" className="text-muted-foreground h-auto p-0">
                            <span className="text-xs">Reply</span>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-fhsb-cream">Recommended Videos</h2>
          <div className="space-y-4">
            {recommendedVideos.map((video) => (
              <Link key={video.id} href={`/videos/${video.id}`}>
                <div className="flex gap-4 group hover:bg-card/80 p-2 rounded-lg transition-colors">
                  <div className="relative aspect-video w-40 flex-shrink-0 overflow-hidden rounded">
                    <Image
                      src={video.thumbnail || "/placeholder.svg"}
                      alt={video.title}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                    />
                    <div className="absolute bottom-1 right-1 bg-black/80 text-white text-xs px-1 py-0.5 rounded">
                      {video.duration}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm text-fhsb-cream group-hover:text-fhsb-green line-clamp-2">
                      {video.title}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1">{video.streamer.username}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <p className="text-xs text-muted-foreground">{formatViews(video.views)} views</p>
                      <span className="text-xs text-muted-foreground">•</span>
                      <p className="text-xs text-muted-foreground">{formatDate(new Date(video.uploadDate))}</p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
