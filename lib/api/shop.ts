import { apiClient } from './client';

export interface Shop {
  id: string;
  name: string;
  description?: string;
  userId: string;
  printfulStore?: {
    id: string;
    isActive: boolean;
    lastSyncedAt: string;
  };
  createdAt: string;
  updatedAt: string;
}

export const shopApi = {
  getMyShop: async (): Promise<Shop> => {
    const response = await apiClient.get('/shop/me');
    return response.data;
  },

  updateShop: async (shopId: string, data: Partial<Shop>) => {
    const response = await apiClient.patch(`/shop/${shopId}`, data);
    return response.data;
  },

  // Add more shop-related API methods here
}; 