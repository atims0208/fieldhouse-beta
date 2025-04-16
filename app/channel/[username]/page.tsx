"use client"

import * as React from "react"
import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { userAPI, streamAPI } from '@/lib/api'
import { StreamCard } from '@/components/stream-card'
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getInitials } from '@/lib/utils'

interface User {
  id: string
  username: string
  avatar: string | null
  isStreamer: boolean
}

interface Stream {
  id: string
  title: string
  thumbnail: string
  streamer: User
  category: string
  viewerCount: number
  isLive: boolean
}

export default function ChannelPage() {
  const { username } = useParams()
  const [user, setUser] = useState<User | null>(null)
  const [streams, setStreams] = useState<Stream[]>([])
  const [isFollowing, setIsFollowing] = useState(false)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await userAPI.getProfile(username)
        setUser(response.data)
      } catch (error) {
        console.error("Error fetching user:", error)
      }
    }

    const fetchStreams = async () => {
      try {
        const response = await streamAPI.getStreamById(user?.currentStreamId || "")
        setStreams([response.data])
      } catch (error) {
        console.error("Error fetching streams:", error)
      }
    }

    fetchUser()
    fetchStreams()
  }, [username])

  const handleFollow = async () => {
    try {
      if (isFollowing) {
        await userAPI.unfollowUser(username)
      } else {
        await userAPI.followUser(username)
      }
      setIsFollowing(!isFollowing)
    } catch (error) {
      console.error("Error following/unfollowing user:", error)
    }
  }

  if (!user) {
    return <div>Loading...</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-8">
        <Avatar className="h-20 w-20">
          <AvatarImage src={user.avatar || undefined} />
          <AvatarFallback>{getInitials(user.username)}</AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-2xl font-bold">{user.username}</h1>
          <Button onClick={handleFollow} variant="outline" className="mt-2">
            {isFollowing ? "Unfollow" : "Follow"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {streams.map((stream) => (
          <StreamCard key={stream.id} {...stream} />
        ))}
      </div>
    </div>
  )
}
