import Link from "next/link"
import Image from "next/image"
import { Eye } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getInitials } from "@/lib/utils"

interface StreamCardProps {
  id: string
  title: string
  thumbnail: string
  streamer: {
    username: string
    avatar: string
  }
  category: string
  viewerCount: number
  isLive: boolean
}

export default function StreamCard({ id, title, thumbnail, streamer, category, viewerCount, isLive }: StreamCardProps) {
  return (
    <div className="group overflow-hidden rounded-lg border border-fhsb-green/20 bg-card transition-all duration-300 stream-card">
      <Link href={`/stream/${id}`}>
        <div className="relative aspect-video overflow-hidden">
          <Image
            src={thumbnail || "/placeholder.svg"}
            alt={title}
            fill
            className="object-cover transition-transform group-hover:scale-105"
          />
          {isLive && (
            <div className="absolute top-2 left-2 flex items-center gap-1">
              <div className="h-2 w-2 rounded-full bg-red-600 animate-pulse"></div>
              <span className="text-xs font-medium text-white bg-black/70 px-1.5 py-0.5 rounded">LIVE</span>
            </div>
          )}
          <div className="absolute bottom-2 left-2 flex items-center gap-1 rounded bg-black/70 px-1.5 py-0.5 text-xs font-medium">
            <Eye className="h-3 w-3 text-white" />
            <span className="text-white">{viewerCount.toLocaleString()}</span>
          </div>
        </div>
        <div className="p-3">
          <div className="flex gap-3">
            <Avatar className="h-8 w-8 border border-fhsb-green/30">
              <AvatarImage src={streamer.avatar} alt={streamer.username} />
              <AvatarFallback>{getInitials(streamer.username)}</AvatarFallback>
            </Avatar>
            <div className="flex-1 overflow-hidden">
              <h3 className="truncate font-medium text-sm text-fhsb-cream group-hover:text-fhsb-green">{title}</h3>
              <p className="truncate text-xs text-muted-foreground">{streamer.username}</p>
              <p className="truncate text-xs text-muted-foreground mt-1">{category}</p>
            </div>
          </div>
        </div>
      </Link>
    </div>
  )
}
