import { Metadata } from 'next'
import ProductDetails from './product-details'

interface PageProps {
  params: {
    id: string
  }
  searchParams: Record<string, string | string[] | undefined>
}

export const metadata: Metadata = {
  title: 'Product Details - Fieldhouse',
  description: 'View product details and make a purchase',
}

export default function ProductPage({ params }: PageProps) {
  // You can fetch product data here if needed
  return <ProductDetails params={params} />
} 