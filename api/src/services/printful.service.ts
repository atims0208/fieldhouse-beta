import axios from 'axios';
import { PrintfulStore } from '../models/printful-store.model';

export class PrintfulService {
  private baseUrl = 'https://api.printful.com';

  constructor() {}

  private async makeRequest(method: string, endpoint: string, apiKey: string, data?: any) {
    try {
      const response = await axios({
        method,
        url: `${this.baseUrl}${endpoint}`,
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        data
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`Printful API Error: ${error.response?.data?.message || error.message}`);
      }
      throw error;
    }
  }

  async validateApiKey(apiKey: string): Promise<boolean> {
    try {
      await this.makeRequest('GET', '/store', apiKey);
      return true;
    } catch (error) {
      return false;
    }
  }

  async getStoreProducts(apiKey: string) {
    const response = await this.makeRequest('GET', '/store/products', apiKey);
    return response.result;
  }

  async syncProducts(printfulStore: PrintfulStore) {
    const products = await this.getStoreProducts(printfulStore.apiKey);
    
    // Transform Printful products to our platform's format
    const transformedProducts = products.map((product: any) => ({
      externalId: product.id,
      name: product.name,
      description: product.description || '',
      price: product.retail_price,
      images: product.files.map((file: any) => file.preview_url),
      variants: product.variants.map((variant: any) => ({
        externalId: variant.id,
        name: variant.name,
        price: variant.retail_price,
        sku: variant.sku
      })),
      printfulData: product
    }));

    return transformedProducts;
  }

  async getProduct(apiKey: string, productId: string) {
    const response = await this.makeRequest('GET', `/store/products/${productId}`, apiKey);
    return response.result;
  }

  async getShippingRates(apiKey: string, address: any, items: any[]) {
    const response = await this.makeRequest('POST', '/shipping/rates', apiKey, {
      recipient: address,
      items
    });
    return response.result;
  }
} 