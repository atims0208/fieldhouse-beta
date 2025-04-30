import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import StreamCard from "@/components/stream-card"

export default function BrowsePage() {
  // Mock streams data
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
      category: "Basketball",
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
      category: "Education",
      viewerCount: 1543,
      isLive: true,
    },
    {
      id: "stream-8",
      title: "Fitness for Athletes - Strength Training",
      thumbnail: "/placeholder.svg?height=720&width=1280",
      streamer: {
        username: "AthleteFit",
        avatar: "/placeholder.svg?height=200&width=200",
      },
      category: "Fitness",
      viewerCount: 1298,
      isLive: true,
    },
    {
      id: "stream-9",
      title: "High School Championship - Final Game",
      thumbnail: "/placeholder.svg?height=720&width=1280",
      streamer: {
        username: "PrepSports",
        avatar: "/placeholder.svg?height=200&width=200",
      },
      category: "Basketball",
      viewerCount: 2567,
      isLive: false,
    },
    {
      id: "stream-10",
      title: "Sports Medicine - Injury Prevention",
      thumbnail: "/placeholder.svg?height=720&width=1280",
      streamer: {
        username: "MedicalCorner",
        avatar: "/placeholder.svg?height=200&width=200",
      },
      category: "Education",
      viewerCount: 987,
      isLive: false,
    },
    {
      id: "stream-11",
      title: "Esports Tournament - Semifinals",
      thumbnail: "/placeholder.svg?height=720&width=1280",
      streamer: {
        username: "GamingLeague",
        avatar: "/placeholder.svg?height=200&width=200",
      },
      category: "Esports",
      viewerCount: 5432,
      isLive: true,
    },
    {
      id: "stream-12",
      title: "Athlete Q&A Session - Ask Me Anything",
      thumbnail: "/placeholder.svg?height=720&width=1280",
      streamer: {
        username: "ProAthlete",
        avatar: "/placeholder.svg?height=200&width=200",
      },
      category: "Talk Show",
      viewerCount: 3210,
      isLive: true,
    },
  ]

  return (
    <div className="container px-4 py-6 md:px-6 space-y-8">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <h1 className="text-2xl font-bold text-fhsb-cream">Browse Streams</h1>

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

            <Select defaultValue="all">
              <SelectTrigger className="w-[140px] bg-muted/10 border-fhsb-green/30 focus:ring-fhsb-green/50">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent className="bg-black border-fhsb-green/30">
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="basketball">Basketball</SelectItem>
                <SelectItem value="football">Football</SelectItem>
                <SelectItem value="baseball">Baseball</SelectItem>
                <SelectItem value="soccer">Soccer</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {streams.map((stream) => (
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
