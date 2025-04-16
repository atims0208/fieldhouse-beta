import axios from 'axios';

// Create API base URL
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercept requests to add auth token
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Auth APIs
export const authAPI = {
  register: async (
    username: string, 
    email: string, 
    password: string, 
    isStreamer = false, 
    dateOfBirth?: Date,
    idDocumentUrl?: string
  ) => {
    const payload: any = { username, email, password, isStreamer };
    if (dateOfBirth) payload.dateOfBirth = dateOfBirth.toISOString().split('T')[0];
    if (idDocumentUrl) payload.idDocumentUrl = idDocumentUrl;

    const response = await api.post('/auth/register', payload);
    return response.data;
  },
  
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },
  
  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
};

// User APIs
export const userAPI = {
  getProfile: async (username: string) => {
    const response = await api.get(`/users/profile/${username}`);
    return response.data;
  },
  
  updateProfile: async (data: { bio?: string, avatarUrl?: string }) => {
    const response = await api.put('/users/profile', data);
    return response.data;
  },
  
  upgradeToStreamer: async () => {
    const response = await api.post('/users/upgrade-to-streamer');
    return response.data;
  },
  
  followUser: async (username: string) => {
    const response = await api.post(`/users/follow/${username}`);
    return response.data;
  },
  
  unfollowUser: async (username: string) => {
    const response = await api.delete(`/users/follow/${username}`);
    return response.data;
  },
  
  getFollowing: async () => {
    const response = await api.get('/users/following');
    return response.data;
  },
};

// Stream APIs
export const streamAPI = {
  getActiveStreams: async () => {
    const response = await api.get('/streams/active');
    return response.data;
  },
  
  getStreamById: async (streamId: string) => {
    const response = await api.get(`/streams/${streamId}`);
    return response.data;
  },
  
  startStream: async (data: { title: string, description?: string, category?: string, tags?: string[] }) => {
    const response = await api.post('/streams/start', data);
    return response.data;
  },
  
  endStream: async (streamId: string) => {
    const response = await api.post(`/streams/${streamId}/end`);
    return response.data;
  },
  
  updateViewerCount: async (streamId: string, count: number) => {
    const response = await api.put(`/streams/${streamId}/viewers`, { count });
    return response.data;
  },
};

// Product APIs
export const productAPI = {
  getAllProducts: async (page = 1, limit = 20, category?: string) => {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('limit', limit.toString());
    if (category) params.append('category', category);
    
    const response = await api.get(`/products?${params.toString()}`);
    return response.data;
  },
  
  getProductById: async (productId: string) => {
    const response = await api.get(`/products/${productId}`);
    return response.data;
  },
  
  getProductsByUser: async (username: string) => {
    const response = await api.get(`/products/user/${username}`);
    return response.data;
  },
  
  getMyProducts: async () => {
    const response = await api.get('/products/dashboard/my-products');
    return response.data;
  },
  
  createProduct: async (data: { 
    title: string, 
    description: string, 
    price: number, 
    images: string[], 
    category?: string 
  }) => {
    const response = await api.post('/products', data);
    return response.data;
  },
  
  updateProduct: async (
    productId: string, 
    data: { 
      title?: string, 
      description?: string, 
      price?: number, 
      images?: string[], 
      isAvailable?: boolean,
      category?: string 
    }
  ) => {
    const response = await api.put(`/products/${productId}`, data);
    return response.data;
  },
  
  deleteProduct: async (productId: string) => {
    const response = await api.delete(`/products/${productId}`);
    return response.data;
  },
};

// Admin APIs (New)
export const adminAPI = {
  listUsers: async (page = 1, limit = 20) => {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('limit', limit.toString());
    const response = await api.get(`/admin/users?${params.toString()}`);
    // Expects response format: { users: [], totalUsers: number, currentPage: number, totalPages: number }
    return response.data; 
  },
  
  // TODO: Add functions for ban/unban, listStreams, stopStream
};

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public data: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export const handleError = (error: Error | unknown): never => {
  if (error instanceof Error) {
    throw error;
  }
  throw new Error('An unexpected error occurred');
};

export const createApi = (token?: string) => {
  const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });

  return {
    get: <T>(url: string) => api.get<T>(url),
    post: <T>(url: string, data: unknown) => api.post<T>(url, data),
    put: <T>(url: string, data: unknown) => api.put<T>(url, data),
    patch: <T>(url: string, data: unknown) => api.patch<T>(url, data),
    delete: <T>(url: string) => api.delete<T>(url),
  };
};

export default {
  auth: authAPI,
  user: userAPI,
  stream: streamAPI,
  product: productAPI,
  admin: adminAPI, // Add admin API to default export
}; 