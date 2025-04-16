"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getInitials } from "@/lib/utils"

interface Stream {
  id: string
  title: string
  streamer: {
    username: string
    avatar: string | null
  }
  viewerCount: number
  isLive: boolean
}

export default function StreamPage() {
  const [stream, setStream] = useState<Stream | null>(null)

  // TODO: Fetch stream data based on ID
  useEffect(() => {
    // Mock stream data for now
    const mockStream: Stream = {
      id: "1",
      title: "Live Stream",
      streamer: {
        username: "Streamer",
        avatar: null
      },
      viewerCount: 0,
      isLive: true
    }
    setStream(mockStream)
  }, [])
  
  if (!stream) {
    return <div>Loading...</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-6">
        <div className="space-y-4">
          <div className="aspect-video bg-black rounded-lg overflow-hidden">
            {/* Video player will go here */}
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              Stream not available
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Avatar>
                <AvatarImage src={stream.streamer.avatar || undefined} />
                <AvatarFallback>{getInitials(stream.streamer.username)}</AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-xl font-bold">{stream.title}</h1>
                <p className="text-sm text-muted-foreground">{stream.streamer.username}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline">Follow</Button>
              <Button>Subscribe</Button>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-bold">Chat</h2>
          <div className="h-[600px] rounded-lg border border-border bg-card p-4">
            <div className="flex flex-col h-full">
              <div className="flex-1 space-y-4">
                {/* Chat messages will go here */}
                <p className="text-center text-muted-foreground">No messages yet</p>
              </div>
              <div className="pt-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Send a message"
                    className="flex-1 bg-background rounded-md px-3 py-2 text-sm"
                  />
                  <Button>Send</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
