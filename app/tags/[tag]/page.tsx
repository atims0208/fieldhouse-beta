"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import StreamCard from "@/components/stream-card"

export default function TagPage() {
  const { tag } = useParams()
  const [sortBy, setSortBy] = useState("viewers")

  // Format tag for display
  const formattedTag = typeof tag === "string" ? tag.charAt(0).toUpperCase() + tag.slice(1).toLowerCase() : "Tag"

  // Mock streams data for this tag
  const streams = [
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
    {
      id: "stream-4",
      title: "Pro Analysis - Breaking Down the Playoffs",
      thumbnail: "/placeholder.svg?height=720&width=1280",
      streamer: {
        username: "AnalyticsHub",
        avatar: "/placeholder.svg?height=200&width=200",
      },
      category: "Analysis",
      viewerCount: 3578,
      isLive: true,
    },
    {
      id: "stream-5",
      title: "Training Camp Day 3 - Behind the Scenes",
      thumbnail: "/placeholder.svg?height=720&width=1280",
      streamer: {
        username: "InsiderAccess",
        avatar: "/placeholder.svg?height=200&width=200",
      },
      category: "Football",
      viewerCount: 2145,
      isLive: false,
    },
    {
      id: "stream-6",
      title: "Draft Day Special - Live Reactions",
      thumbnail: "/placeholder.svg?height=720&width=1280",
      streamer: {
        username: "DraftCentral",
        avatar: "/placeholder.svg?height=200&width=200",
      },
      category: "Basketball",
      viewerCount: 1876,
      isLive: false,
    },
  ]

  // Sort streams based on selected option
  const sortedStreams = [...streams].sort((a, b) => {
    if (sortBy === "viewers") {
      return b.viewerCount - a.viewerCount
    } else if (sortBy === "newest") {
      return Math.random() - 0.5 // Mock sorting by newest
    } else {
      return Math.random() - 0.5 // Mock sorting by trending
    }
  })

  return (
    <div className="container px-4 py-6 md:px-6 space-y-8">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-fhsb-cream">#{formattedTag}</h1>
          <p className="text-muted-foreground mt-1">Streams and videos tagged with #{formattedTag}</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <Input
            placeholder="Search streams..."
            className="w-full sm:w-[250px] bg-muted/10 border-fhsb-green/30 focus-visible:ring-fhsb-green/50"
          />

          <div className="flex gap-2">
            <Select defaultValue="all">
              <SelectTrigger className="w-[140px] bg-muted/10 border-fhsb-green/30 focus:ring-fhsb-green/50">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="bg-black border-fhsb-green/30">
                <SelectItem value="all">All Content</SelectItem>
                <SelectItem value="live">Live Only</SelectItem>
                <SelectItem value="videos">Videos</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[140px] bg-muted/10 border-fhsb-green/30 focus:ring-fhsb-green/50">
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent className="bg-black border-fhsb-green/30">
                <SelectItem value="viewers">Most Viewers</SelectItem>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="trending">Trending</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {sortedStreams.map((stream) => (
          <StreamCard key={stream.id} {...stream} />
        ))}
      </div>

      <div className="flex justify-center mt-8">
        <Button variant="outline" className="border-fhsb-green/30 text-fhsb-cream hover:bg-fhsb-green hover:text-black">
          Load More
        </Button>
      </div>
    </div>
  )
}
