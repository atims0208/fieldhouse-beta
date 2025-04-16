'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { X, Plus, Upload, ArrowLeft } from 'lucide-react'
import { productAPI } from '@/lib/api'
import { useToast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useAuth } from '@/components/auth-provider'
import Image from 'next/image'
import dynamic from 'next/dynamic'

// Form validation schema
const productSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(100, 'Title must be less than 100 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  price: z.coerce.number().positive('Price must be a positive number'),
  category: z.string().optional(),
  images: z.array(z.string()).min(1, 'At least one image is required').max(5, 'Maximum 5 images allowed'),
})

type ProductFormValues = z.infer<typeof productSchema>

// @ts-expect-error Server Component
const ImageUpload = dynamic(() => import("@/components/image-upload"), {
  ssr: false,
});

export default function CreateProductPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { user } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [imageUrls, setImageUrls] = useState<string[]>([])
  const [imageUrlInput, setImageUrlInput] = useState('')
  
  // Product categories
  const categories = [
    'Electronics',
    'Clothing',
    'Gaming',
    'Home Goods',
    'Sports',
    'Other'
  ]
  
  // Initialize form
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      title: '',
      description: '',
      price: 0,
      category: 'Other',
      images: [],
    },
  })
  
  // Redirect to login if not authenticated
  React.useEffect(() => {
    if (!user) {
      router.push('/login')
    }
  }, [user, router])
  
  const addImageUrl = () => {
    if (!imageUrlInput.trim()) return
    
    if (imageUrls.length >= 5) {
      toast({
        title: "Error",
        description: "Maximum 5 images allowed",
        variant: "destructive"
      })
      return
    }
    
    // Basic URL validation
    try {
      new URL(imageUrlInput)
      const newImages = [...imageUrls, imageUrlInput]
      setImageUrls(newImages)
      form.setValue('images', newImages)
      setImageUrlInput('')
    } catch (error) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid image URL",
        variant: "destructive"
      })
    }
  }
  
  const removeImage = (index: number) => {
    const newImages = imageUrls.filter((_, i) => i !== index)
    setImageUrls(newImages)
    form.setValue('images', newImages)
  }
  
  const onSubmit = async (data: ProductFormValues) => {
    try {
      setIsSubmitting(true);
      
      // Ensure we have at least one image
      if (data.images.length === 0) {
        toast({
          title: "Error",
          description: "At least one product image is required",
          variant: "destructive"
        });
        return;
      }
      
      // Create the product
      await productAPI.createProduct({
        title: data.title,
        description: data.description,
        price: data.price,
        images: data.images,
        category: data.category
      });
      
      toast({
        title: "Success",
        description: "Product created successfully"
      });
      
      // Redirect to product dashboard
      router.push('/dashboard/shop');
    } catch {
      toast({
        title: "Error",
        description: "Failed to create product",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="container mx-auto py-8 px-4">
      <Button
        variant="ghost"
        className="mb-6"
        onClick={() => router.push('/dashboard/shop')}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Shop Dashboard
      </Button>
      
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Add New Product</h1>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Product Title */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter product title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Product Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter product description"
                      rows={5}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Price & Category */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Price */}
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2">$</span>
                        <Input
                          type="number"
                          step="0.01"
                          min="0"
                          placeholder="0.00"
                          className="pl-8"
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value))}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Category */}
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            {/* Product Images */}
            <FormField
              control={form.control}
              name="images"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Images</FormLabel>
                  
                  <div className="p-4 border border-dashed rounded-md mb-4">
                    <div className="flex items-end space-x-2 mb-4">
                      <div className="flex-1">
                        <Label htmlFor="image-url">Image URL</Label>
                        <Input
                          id="image-url"
                          placeholder="Enter image URL"
                          value={imageUrlInput}
                          onChange={(e) => setImageUrlInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault()
                              addImageUrl()
                            }
                          }}
                        />
                      </div>
                      <Button
                        type="button"
                        onClick={addImageUrl}
                        className="mb-[2px]"
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Add
                      </Button>
                    </div>
                    
                    {/* Image preview */}
                    {imageUrls.length > 0 ? (
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                        {imageUrls.map((url, index) => (
                          <div key={index} className="relative group">
                            <div className="aspect-square bg-muted rounded overflow-hidden relative">
                              <Image
                                src={url}
                                alt={`Product image ${index + 1}`}
                                fill
                                className="object-cover"
                                onError={(e) => {
                                  // @ts-ignore - Known limitation with next/image error handling
                                  e.target.src = 'https://placehold.co/600x600/gray/white?text=Error'
                                }}
                              />
                            </div>
                            <button
                              type="button"
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => removeImage(index)}
                              title="Remove image"
                              aria-label="Remove image"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 bg-muted/20 rounded-md">
                        <Upload className="mx-auto h-10 w-10 text-muted-foreground mb-2" />
                        <p className="text-muted-foreground">
                          Add up to 5 images using URLs
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          First image will be used as the product thumbnail
                        </p>
                      </div>
                    )}
                  </div>
                  
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Submit Button */}
            <div className="flex justify-end">
              <Button
                type="button"
                variant="outline"
                className="mr-2"
                onClick={() => router.push('/dashboard/shop')}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Creating...' : 'Create Product'}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
} 