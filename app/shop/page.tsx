'use client'

import React, { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { productAPI } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

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
  }
}

export default function ShopPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  
  const categories = [
    'Electronics',
    'Clothing',
    'Gaming',
    'Home Goods',
    'Sports',
    'Other'
  ]
  
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        const category = searchParams.get('category') || selectedCategory || undefined
        const page = parseInt(searchParams.get('page') || '1')
        
        const response = await productAPI.getAllProducts(page, 12, category as string | undefined)
        setProducts(response.products)
        setTotalPages(response.totalPages)
        setCurrentPage(response.currentPage)
        
        if (searchParams.get('category') && !selectedCategory) {
          setSelectedCategory(searchParams.get('category'))
        }
      } catch (error) {
        console.error('Error fetching products:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchProducts()
  }, [searchParams, selectedCategory])
  
  const handlePageChange = (page: number) => {
    router.push(`/shop?page=${page}${selectedCategory ? `&category=${selectedCategory}` : ''}`)
  }
  
  const handleCategorySelect = (category: string | null) => {
    setSelectedCategory(category)
    router.push(`/shop${category ? `?category=${category}` : ''}`)
  }
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, you would implement search functionality here
    console.log('Searching for:', searchQuery)
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
        <h1 className="text-3xl font-bold mb-6">Shop</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <Card key={i} className="w-full h-96 animate-pulse">
              <div className="h-52 bg-muted rounded-t-lg" />
              <CardContent className="p-4">
                <div className="h-4 w-3/4 bg-muted rounded mb-2" />
                <div className="h-4 w-1/2 bg-muted rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }
  
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-3xl font-bold mb-4 md:mb-0">Shop</h1>
        <div className="w-full md:w-auto">
          <form onSubmit={handleSearch} className="flex gap-2">
            <Input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-xs"
            />
            <Button type="submit" variant="default">Search</Button>
          </form>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mt-6">
        {/* Category sidebar */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Categories</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              <Button 
                variant={selectedCategory === null ? "default" : "ghost"}
                className="justify-start"
                onClick={() => handleCategorySelect(null)}
              >
                All Products
              </Button>
              
              <Separator className="my-2" />
              
              {categories.map(category => (
                <Button 
                  key={category} 
                  variant={selectedCategory === category ? "default" : "ghost"}
                  className="justify-start"
                  onClick={() => handleCategorySelect(category)}
                >
                  {category}
                </Button>
              ))}
            </CardContent>
          </Card>
        </div>
        
        {/* Products grid */}
        <div className="lg:col-span-3">
          {products.length === 0 ? (
            <div className="flex flex-col items-center justify-center bg-muted/20 py-12 px-4 rounded-lg">
              <h3 className="text-xl font-medium">No products found</h3>
              <p className="text-muted-foreground mt-2">Try changing your search or category filters</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <Link key={product.id} href={`/shop/product/${product.id}`} passHref>
                    <Card className="h-full overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
                      <div className="aspect-[4/3] relative bg-muted">
                        {product.images && product.images.length > 0 ? (
                          <Image
                            src={product.images[0]}
                            alt={product.title}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-muted">
                            <span className="text-muted-foreground">No image</span>
                          </div>
                        )}
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-medium line-clamp-1">{product.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          by {product.seller.username}
                        </p>
                      </CardContent>
                      <CardFooter className="p-4 pt-0 flex justify-between items-center">
                        <span className="font-bold">{formatPrice(product.price)}</span>
                        <Button size="sm" variant="default">View Product</Button>
                      </CardFooter>
                    </Card>
                  </Link>
                ))}
              </div>
              
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center mt-8">
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      disabled={currentPage === 1}
                      onClick={() => handlePageChange(currentPage - 1)}
                    >
                      Previous
                    </Button>
                    
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <Button 
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        onClick={() => handlePageChange(page)}
                      >
                        {page}
                      </Button>
                    ))}
                    
                    <Button 
                      variant="outline" 
                      disabled={currentPage === totalPages}
                      onClick={() => handlePageChange(currentPage + 1)}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
} 