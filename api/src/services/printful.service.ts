import axios from 'axios';
import { PrintfulStore } from '../models/printful-store.model';
import { AppDataSource } from '../config/database';
import { Product } from '../models/product.model';

export class PrintfulService {
  private apiBaseUrl = 'https://api.printful.com';
  private productRepository = AppDataSource.getRepository(Product);

  constructor() {}

  private async makeRequest(method: string, endpoint: string, apiKey: string, data?: any) {
    try {
      const response = await axios({
        method,
        url: `${this.apiBaseUrl}${endpoint}`,
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

  async validateAccessToken(accessToken: string): Promise<boolean> {
    try {
      await axios.get(`${this.apiBaseUrl}/store`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      return true;
    } catch {
      return false;
    }
  }

  async getStoreProducts(accessToken: string) {
    try {
      const response = await axios.get(`${this.apiBaseUrl}/store/products`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      return response.data.result;
    } catch (error) {
      console.error('Error fetching Printful products:', error);
      throw new Error('Failed to fetch Printful products');
    }
  }

  async syncProducts(printfulStore: PrintfulStore) {
    try {
      const products = await this.getStoreProducts(printfulStore.accessToken);
      
      // Create or update products
      for (const printfulProduct of products) {
        const product = this.productRepository.create({
          printfulStore,
          name: printfulProduct.name,
          description: printfulProduct.description || '',
          price: parseFloat(printfulProduct.retail_price),
          externalId: printfulProduct.id.toString(),
          images: [printfulProduct.thumbnail_url],
          variants: printfulProduct.variants.map((variant: any) => ({
            externalId: variant.id.toString(),
            name: variant.name,
            price: parseFloat(variant.retail_price),
            sku: variant.sku
          })),
          printfulData: printfulProduct,
          isActive: true
        });

        await this.productRepository.save(product);
      }
    } catch (error) {
      console.error('Error syncing products:', error);
      throw new Error('Failed to sync products');
    }
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