'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Plus, Pencil, Trash2, ShoppingBag, Search, Settings } from 'lucide-react'
import { productAPI } from '@/lib/api'
import { useToast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader,
  TableRow 
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useAuth } from '@/components/auth-provider'

interface Product {
  id: string
  title: string
  description: string
  price: number
  images: string[]
  isAvailable: boolean
  category?: string
  createdAt: string
  updatedAt: string
}

export default function ShopDashboardPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { user } = useAuth()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [productToDelete, setProductToDelete] = useState<Product | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  
  useEffect(() => {
    if (!user) {
      // Redirect to login if not authenticated
      router.push('/login')
      return
    }
    
    const fetchProducts = async () => {
      try {
        setLoading(true)
        const data = await productAPI.getMyProducts()
        setProducts(data)
        setFilteredProducts(data)
      } catch (error) {
        console.error('Error fetching products:', error)
        toast({
          title: "Error",
          description: "Failed to load your products",
          variant: "destructive"
        })
      } finally {
        setLoading(false)
      }
    }
    
    fetchProducts()
  }, [user, router, toast])
  
  useEffect(() => {
    // Filter products based on search query
    if (searchQuery.trim() === '') {
      setFilteredProducts(products)
    } else {
      const query = searchQuery.toLowerCase()
      const filtered = products.filter(product => 
        product.title.toLowerCase().includes(query) || 
        product.description.toLowerCase().includes(query) ||
        (product.category && product.category.toLowerCase().includes(query))
      )
      setFilteredProducts(filtered)
    }
  }, [searchQuery, products])
  
  const handleCreateProduct = () => {
    router.push('/dashboard/shop/create')
  }
  
  const handleEditProduct = (productId: string) => {
    router.push(`/dashboard/shop/edit/${productId}`)
  }
  
  const confirmDeleteProduct = (product: Product) => {
    setProductToDelete(product)
    setIsDeleteDialogOpen(true)
  }
  
  const deleteProduct = async () => {
    if (!productToDelete) return
    
    try {
      await productAPI.deleteProduct(productToDelete.id)
      
      // Update local state
      setProducts(products.filter(p => p.id !== productToDelete.id))
      setFilteredProducts(filteredProducts.filter(p => p.id !== productToDelete.id))
      
      toast({
        title: "Success",
        description: "Product deleted successfully"
      })
    } catch (error) {
      console.error('Error deleting product:', error)
      toast({
        title: "Error",
        description: "Failed to delete product",
        variant: "destructive"
      })
    } finally {
      setProductToDelete(null)
      setIsDeleteDialogOpen(false)
    }
  }
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price)
  }
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric', 
      month: 'short', 
      day: 'numeric'
    }).format(date)
  }
  
  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-6">Shop Dashboard</h1>
        <div className="animate-pulse">
          <div className="h-10 bg-muted rounded w-full mb-6" />
          <div className="h-64 bg-muted rounded w-full" />
        </div>
      </div>
    )
  }
  
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div className="flex items-center mb-4 sm:mb-0">
          <ShoppingBag className="mr-3 h-8 w-8" />
          <h1 className="text-3xl font-bold">Shop Dashboard</h1>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button onClick={handleCreateProduct} className="flex-1 sm:flex-none">
            <Plus className="mr-2 h-4 w-4" />
            Add New Product
          </Button>
          <Button
            variant="outline"
            onClick={() => router.push('/dashboard/shop/settings')}
            className="flex-1 sm:flex-none"
          >
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Button>
        </div>
      </div>
      
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>
      
      {filteredProducts.length === 0 ? (
        <Card className="p-8 text-center">
          {products.length === 0 ? (
            <>
              <h2 className="text-2xl font-semibold mb-2">No Products Yet</h2>
              <p className="text-muted-foreground mb-6">You haven't added any products to your shop yet.</p>
              <Button onClick={handleCreateProduct}>
                <Plus className="mr-2 h-4 w-4" />
                Add Your First Product
              </Button>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-semibold mb-2">No Results Found</h2>
              <p className="text-muted-foreground">
                No products match your search criteria. Try using different keywords.
              </p>
            </>
          )}
        </Card>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date Added</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-12 rounded-md overflow-hidden bg-muted">
                        {product.images && product.images.length > 0 ? (
                          <Image
                            src={product.images[0]}
                            alt={product.title}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full w-full">
                            <ShoppingBag className="h-6 w-6 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                      <div>
                        <Link 
                          href={`/shop/product/${product.id}`}
                          className="font-medium hover:underline"
                        >
                          {product.title}
                        </Link>
                        {product.category && (
                          <div className="text-xs text-muted-foreground">
                            {product.category}
                          </div>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{formatPrice(product.price)}</TableCell>
                  <TableCell>
                    <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                      product.isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {product.isAvailable ? 'Available' : 'Hidden'}
                    </span>
                  </TableCell>
                  <TableCell>{formatDate(product.createdAt)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditProduct(product.id)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => confirmDeleteProduct(product)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the product &quot;{productToDelete?.title}&quot;? 
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={deleteProduct}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
} 