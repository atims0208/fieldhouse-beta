import { Metadata } from 'next'
import ProductDetails from './product-details'

export const metadata: Metadata = {
  title: 'Product Details - Fieldhouse',
  description: 'View product details and make a purchase',
}

type Props = {
  params: {
    id: string
  }
  searchParams: { [key: string]: string | string[] | undefined }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default async function ProductPage({ params, searchParams }: Props) {
  return <ProductDetails params={params} />
} 