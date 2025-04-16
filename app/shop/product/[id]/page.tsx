import { Metadata } from 'next'
import ProductDetails from '@/app/shop/product/[id]/product-details'

type PageProps = {
  params: {
    id: string
  }
  searchParams: { [key: string]: string | string[] | undefined }
}

export const metadata: Metadata = {
  title: 'Product Details - Fieldhouse',
  description: 'View product details and make a purchase',
}

export default function ProductPage({ params }: PageProps) {
  return <ProductDetails params={params} />
} 