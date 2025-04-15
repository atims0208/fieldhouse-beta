"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import StreamCard from "@/components/stream-card"

export default function CategoryPage() {
  const { id } = useParams()
  const [sortBy, setSortBy] = useState("viewers")

  // Mock category data
  const categories = {
    "cat-1": { name: "Basketball", viewerCount: 45230 },
    "cat-2": { name: "Football", viewerCount: 38750 },
    "cat-3": { name: "Baseball", viewerCount: 21540 },
    "cat-4": { name: "Soccer", viewerCount: 19870 },
    "cat-5": { name: "Volleyball", viewerCount: 12450 },
    "cat-6": { name: "Hockey", viewerCount: 9870 },
    basketball: { name: "Basketball", viewerCount: 45230 },
    football: { name: "Football", viewerCount: 38750 },
    baseball: { name: "Baseball", viewerCount: 21540 },
    soccer: { name: "Soccer", viewerCount: 19870 },
    volleyball: { name: "Volleyball", viewerCount: 12450 },
    hockey: { name: "Hockey", viewerCount: 9870 },
  }

  // Get category name based on ID
  const categoryName = categories[id as string]?.name || "Category"

  // Mock streams data for this category
  const streams = [
    {
      id: "stream-1",
      title: "Regional Qualifiers - East Division",
      thumbnail: "/placeholder.svg?height=720&width=1280",
      streamer: {
        username: "SportsCenter",
        avatar: "/placeholder.svg?height=200&width=200",
      },
      category: categoryName,
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
      category: categoryName,
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
      category: categoryName,
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
      category: categoryName,
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
      category: categoryName,
      viewerCount: 2145,
      isLive: true,
    },
    {
      id: "stream-6",
      title: "Draft Day Special - Live Reactions",
      thumbnail: "/placeholder.svg?height=720&width=1280",
      streamer: {
        username: "DraftCentral",
        avatar: "/placeholder.svg?height=200&width=200",
      },
      category: categoryName,
      viewerCount: 1876,
      isLive: true,
    },
    {
      id: "stream-7",
      title: "Coaching Clinic - Advanced Strategies",
      thumbnail: "/placeholder.svg?height=720&width=1280",
      streamer: {
        username: "CoachCorner",
        avatar: "/placeholder.svg?height=200&width=200",
      },
      category: categoryName,
      viewerCount: 1543,
      isLive: false,
    },
    {
      id: "stream-8",
      title: "Fitness for Athletes - Strength Training",
      thumbnail: "/placeholder.svg?height=720&width=1280",
      streamer: {
        username: "AthleteFit",
        avatar: "/placeholder.svg?height=200&width=200",
      },
      category: categoryName,
      viewerCount: 1298,
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
          <h1 className="text-2xl font-bold text-fhsb-cream">{categoryName}</h1>
          <p className="text-muted-foreground mt-1">
            {categories[id as string]?.viewerCount.toLocaleString() || "0"} viewers watching {categoryName} streams
          </p>
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
                <SelectItem value="all">All Streams</SelectItem>
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
