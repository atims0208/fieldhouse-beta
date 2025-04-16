import { Metadata } from 'next'
import ProductDetails from './product-details'

export const metadata: Metadata = {
  title: 'Product Details - Fieldhouse',
  description: 'View product details and make a purchase',
}

export default async function ProductPage({
  params,
}: {
  params: { id: string }
}) {
  return <ProductDetails params={params} />
} 