import { Metadata } from 'next'
import ProductDetails from '@/app/shop/product/[id]/product-details'

interface PageProps {
  params: {
    id: string
  }
}

export const metadata: Metadata = {
  title: 'Product Details - Fieldhouse',
  description: 'View product details and make a purchase',
}

export default async function ProductPage({ params }: PageProps) {
  // You can fetch product data here if needed
  return <ProductDetails params={params} />
} 