"use client"

import Link from "next/link"
import Image from "next/image"

interface CategoryCardProps {
  id: string
  name: string
  image: string // Changed from imageUrl to image to match how it's used in page.tsx
  viewerCount: number
}

export default function CategoryCard({ id, name, image, viewerCount }: CategoryCardProps) {
  return (
    <Link href={`/categories/${id}`}>
      <div className="group overflow-hidden rounded-lg border border-border bg-card transition-colors hover:border-primary">
        <div className="relative aspect-square overflow-hidden bg-muted">
          <Image
            src={image || "/placeholder.svg"}
            alt={name}
            fill
            className="object-cover transition-transform group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            style={{ width: '100%', height: '100%' }}
          />
        </div>
        <div className="p-3">
          <h3 className="line-clamp-1 font-medium text-foreground group-hover:text-primary">{name}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{viewerCount.toLocaleString()} viewers</p>
        </div>
      </div>
    </Link>
  )
}
