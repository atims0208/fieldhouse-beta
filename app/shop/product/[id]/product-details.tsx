'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { productAPI } from '@/lib/api'
import { useToast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { useAuth } from '@/components/auth-provider'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'

interface ProductDetailsProps {
  params: {
    id: string
  }
}

interface Product {
  id: string
  title: string
  description: string
  price: number
  images: string[]
  isAvailable: boolean
  category?: string
  seller: {
    id: string
    username: string
    avatarUrl?: string
    bio?: string
  }
}

export default function ProductDetails({ params }: ProductDetailsProps) {
  const { id } = params
  const router = useRouter()
  const { toast } = useToast()
  const { user } = useAuth()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [isOwner, setIsOwner] = useState(false)
  
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true)
        const data = await productAPI.getProductById(id)
        setProduct(data)
        
        // Check if current user is the product owner
        if (user && data.seller && user.id === data.seller.id) {
          setIsOwner(true)
        }
      } catch (error) {
        console.error('Error fetching product:', error)
        toast({
          title: "Error",
          description: "Failed to load product details",
          variant: "destructive"
        })
      } finally {
        setLoading(false)
      }
    }
    
    fetchProduct()
  }, [id, user, toast])
  
  const handleEditProduct = () => {
    router.push(`/dashboard/shop/edit/${id}`)
  }
  
  const handleDeleteProduct = async () => {
    if (confirm('Are you sure you want to delete this product?')) {
      try {
        await productAPI.deleteProduct(id)
        toast({
          title: "Success",
          description: "Product has been deleted"
        })
        router.push('/dashboard/shop')
      } catch (error) {
        console.error('Error deleting product:', error)
        toast({
          title: "Error",
          description: "Failed to delete product",
          variant: "destructive"
        })
      }
    }
  }
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price)
  }
  
  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="animate-pulse">
          <div className="h-8 w-1/3 bg-muted rounded mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="aspect-square bg-muted rounded-lg" />
            <div className="space-y-4">
              <div className="h-8 bg-muted rounded w-2/3" />
              <div className="h-6 bg-muted rounded w-1/4" />
              <div className="h-4 bg-muted rounded w-full mt-6" />
              <div className="h-4 bg-muted rounded w-full" />
              <div className="h-4 bg-muted rounded w-3/4" />
            </div>
          </div>
        </div>
      </div>
    )
  }
  
  if (!product) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="bg-muted/20 p-8 rounded-lg text-center">
          <h2 className="text-2xl font-bold mb-2">Product Not Found</h2>
          <p className="text-muted-foreground mb-4">This product may have been removed or is no longer available.</p>
          <Button asChild>
            <Link href="/shop">Back to Shop</Link>
          </Button>
        </div>
      </div>
    )
  }
  
  return (
    <div className="container mx-auto py-8 px-4">
      <Button variant="ghost" asChild className="mb-6">
        <Link href="/shop" className="flex items-center gap-1">
          <ChevronLeft size={16} />
          Back to Shop
        </Link>
      </Button>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Images */}
        <div>
          {product.images && product.images.length > 0 ? (
            <Carousel className="w-full">
              <CarouselContent>
                {product.images.map((image, index) => (
                  <CarouselItem key={index}>
                    <div className="aspect-square relative rounded-lg overflow-hidden">
                      <Image 
                        src={image}
                        alt={`${product.title} - Image ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          ) : (
            <div className="aspect-square bg-muted rounded-lg flex items-center justify-center">
              <span className="text-muted-foreground">No images available</span>
            </div>
          )}
        </div>
        
        {/* Product Details */}
        <div>
          <h1 className="text-3xl font-bold">{product.title}</h1>
          <p className="text-2xl font-bold mt-2">{formatPrice(product.price)}</p>
          
          {product.category && (
            <div className="mt-2">
              <span className="inline-block px-3 py-1 bg-muted rounded-full text-xs">
                {product.category}
              </span>
            </div>
          )}
          
          <Separator className="my-6" />
          
          <div className="prose max-w-none dark:prose-invert">
            <h3 className="text-lg font-medium mb-2">Description</h3>
            <p className="whitespace-pre-line">{product.description}</p>
          </div>
          
          <Separator className="my-6" />
          
          {/* Seller Info */}
          <div>
            <h3 className="text-lg font-medium mb-4">Seller</h3>
            <Link href={`/channel/${product.seller.username}`}>
              <Card className="hover:bg-muted/50 transition-colors">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="relative h-12 w-12 rounded-full overflow-hidden">
                    {product.seller.avatarUrl ? (
                      <Image 
                        src={product.seller.avatarUrl}
                        alt={product.seller.username}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="h-full w-full bg-muted flex items-center justify-center">
                        <span className="text-muted-foreground uppercase">
                          {product.seller.username.charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>
                  <div>
                    <h4 className="font-medium">{product.seller.username}</h4>
                    {product.seller.bio && (
                      <p className="text-sm text-muted-foreground line-clamp-1">
                        {product.seller.bio}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
          
          <div className="mt-8 space-y-4">
            {/* Owner actions */}
            {isOwner ? (
              <div className="flex gap-4">
                <Button variant="outline" onClick={handleEditProduct}>Edit Product</Button>
                <Button variant="destructive" onClick={handleDeleteProduct}>Delete Product</Button>
              </div>
            ) : (
              <>
                {/* Contact seller button */}
                <Button className="w-full">Contact Seller</Button>
                
                {/* View seller's shop link */}
                <Button variant="outline" asChild className="w-full">
                  <Link href={`/shop/seller/${product.seller.username}`}>
                    View Seller's Shop
                  </Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 