"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  price: z.string().min(1, "Price is required"),
  images: z.array(z.string()).min(1, "At least one image is required"),
})

type FormData = z.infer<typeof formSchema>

export default function CreateProductPage() {
  const { toast } = useToast()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      price: "",
      images: [],
    },
  })

  const onSubmit = async (data: FormData) => {
    try {
      setIsSubmitting(true)
      // TODO: Implement product creation with data
      console.log('Creating product:', data)
      toast({
        title: "Success",
        description: "Product created successfully",
      })
      router.push("/dashboard/shop")
    } catch {
      toast({
        title: "Error",
        description: "Failed to create product. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Create New Product</h1>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <Label htmlFor="name">Product Name</Label>
            <Input
              id="name"
              {...form.register("name")}
              placeholder="Enter product name"
            />
            {form.formState.errors.name && (
              <p className="text-sm text-red-500 mt-1">
                {form.formState.errors.name.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...form.register("description")}
              placeholder="Enter product description"
            />
            {form.formState.errors.description && (
              <p className="text-sm text-red-500 mt-1">
                {form.formState.errors.description.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="price">Price</Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              {...form.register("price")}
              placeholder="Enter price"
            />
            {form.formState.errors.price && (
              <p className="text-sm text-red-500 mt-1">
                {form.formState.errors.price.message}
              </p>
            )}
          </div>

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create Product"}
          </Button>
        </form>
      </div>
    </div>
  )
} 