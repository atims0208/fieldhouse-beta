'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Settings } from 'lucide-react'
import { PrintfulIntegration } from '@/components/shop/PrintfulIntegration'
import { useAuth } from '@/components/auth-provider'
import { Card } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
import { shopApi, Shop } from '@/lib/api/shop'

export default function ShopSettingsPage() {
  const router = useRouter()
  const { user } = useAuth()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [shop, setShop] = useState<Shop | null>(null)

  useEffect(() => {
    if (!user) {
      router.push('/login')
      return
    }

    const fetchShopDetails = async () => {
      try {
        setLoading(true)
        const data = await shopApi.getMyShop()
        setShop(data)
      } catch (error) {
        console.error('Error fetching shop details:', error)
        toast({
          title: "Error",
          description: "Failed to load shop details",
          variant: "destructive"
        })
      } finally {
        setLoading(false)
      }
    }

    fetchShopDetails()
  }, [user, router, toast])

  const handleIntegrationUpdate = async () => {
    if (shop) {
      const updatedShop = await shopApi.getMyShop()
      setShop(updatedShop)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-6">Shop Settings</h1>
        <div className="animate-pulse">
          <div className="h-48 bg-muted rounded w-full mb-6" />
        </div>
      </div>
    )
  }

  if (!shop) {
    return (
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-6">Shop Settings</h1>
        <Card className="p-6">
          <p className="text-muted-foreground">
            You don't have a shop yet. Please create one first.
          </p>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center mb-6">
        <Settings className="mr-3 h-8 w-8" />
        <h1 className="text-3xl font-bold">Shop Settings</h1>
      </div>

      <div className="grid gap-6">
        <PrintfulIntegration
          shopId={shop.id}
          isConnected={!!shop.printfulStore?.isActive}
          onIntegrationUpdate={handleIntegrationUpdate}
        />

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Shop Details</h2>
          <div className="space-y-2">
            <p>
              <span className="font-medium">Name:</span> {shop.name}
            </p>
            {shop.description && (
              <p>
                <span className="font-medium">Description:</span> {shop.description}
              </p>
            )}
            <p>
              <span className="font-medium">Created:</span>{' '}
              {new Date(shop.createdAt).toLocaleDateString()}
            </p>
          </div>
        </Card>
      </div>
    </div>
  )
} 