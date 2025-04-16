import { Metadata } from 'next'
import ProductDetails from './product-details'

interface PageProps {
  params: {
    id: string
  }
}

export const metadata: Metadata = {
  title: 'Product Details - Fieldhouse',
  description: 'View product details and make a purchase',
}

export default function ProductPage({ params }: PageProps) {
  return <ProductDetails params={params} />
} 