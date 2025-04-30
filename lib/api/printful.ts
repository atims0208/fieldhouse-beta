import { apiClient } from './client';

export const printfulApi = {
  connectStore: async (shopId: string, apiKey: string) => {
    const response = await apiClient.post('/printful/connect', {
      shopId,
      apiKey,
    });
    return response.data;
  },

  syncProducts: async (shopId: string) => {
    const response = await apiClient.post(`/printful/${shopId}/sync`);
    return response.data;
  },

  disconnectStore: async (shopId: string) => {
    const response = await apiClient.post(`/printful/${shopId}/disconnect`);
    return response.data;
  },
}; 