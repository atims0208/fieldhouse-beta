import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useAuth } from '@/components/auth-provider'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Gift } from '@/lib/types'
import { cn } from '@/lib/utils'

interface GiftShopProps {
  onGiftSelect: (gift: Gift, quantity: number) => void
  className?: string
}

export function GiftShop({ onGiftSelect, className }: GiftShopProps) {
  const { user } = useAuth()
  const [gifts, setGifts] = useState<Gift[]>([])
  const [selectedGift, setSelectedGift] = useState<Gift | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [filter, setFilter] = useState<string>('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchGifts = async () => {
      try {
        const response = await fetch('/api/gifts')
        if (!response.ok) throw new Error('Failed to fetch gifts')
        const data = await response.json()
        setGifts(data)
      } catch (error) {
        console.error('Error fetching gifts:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchGifts()
  }, [])

  const handleGiftSelect = (gift: Gift) => {
    setSelectedGift(gift)
    setQuantity(1)
  }

  const handleSendGift = () => {
    if (selectedGift) {
      onGiftSelect(selectedGift, quantity)
      setSelectedGift(null)
      setQuantity(1)
    }
  }

  const filteredGifts = gifts.filter(gift => {
    if (filter === 'all') return true
    return gift.tags?.includes(filter)
  })

  const uniqueTags = Array.from(new Set(gifts.flatMap(gift => gift.tags || [])))

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className={cn("w-full", className)}>
          Send a Gift 🎁
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Gift Shop</DialogTitle>
          <DialogDescription>
            Your balance: {user?.coins || 0} coins
          </DialogDescription>
        </DialogHeader>

        <div className="mb-4">
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Gifts</SelectItem>
              {uniqueTags.map(tag => (
                <SelectItem key={tag} value={tag}>
                  {tag.charAt(0).toUpperCase() + tag.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {loading ? (
          <div className="py-8 text-center text-muted-foreground">
            Loading gifts...
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-4 py-4 max-h-[300px] overflow-y-auto">
            {filteredGifts.map((gift) => (
              <button
                key={gift.id}
                className={cn(
                  "flex flex-col items-center p-2 rounded-lg transition-all",
                  selectedGift?.id === gift.id
                    ? "bg-primary/20 border-2 border-primary"
                    : "hover:bg-accent"
                )}
                onClick={() => handleGiftSelect(gift)}
              >
                <div className="relative w-16 h-16">
                  <Image
                    src={gift.imageUrl}
                    alt={gift.name}
                    fill
                    className="object-contain"
                  />
                </div>
                <span className="text-sm font-medium mt-1">{gift.name}</span>
                <span className="text-xs text-muted-foreground">
                  {gift.coins} coins
                </span>
              </button>
            ))}
          </div>
        )}

        {selectedGift && (
          <div className="space-y-4 pt-4 border-t">
            <div className="flex items-center justify-between">
              <span>Quantity:</span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  -
                </Button>
                <span>{quantity}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  +
                </Button>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span>Total:</span>
              <span>{selectedGift.coins * quantity} coins</span>
            </div>
            <Button
              className="w-full"
              onClick={handleSendGift}
              disabled={!user || (user.coins || 0) < selectedGift.coins * quantity}
            >
              Send Gift
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
} 