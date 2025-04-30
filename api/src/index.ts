import 'reflect-metadata';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables first
dotenv.config({ path: path.resolve(__dirname, '../.env') });

import express from 'express';
import http from 'http';
import cors from 'cors';
import helmet from 'helmet';
import { User } from './models/User';
import { Stream } from './models/Stream';
import { Product } from './models/Product';
import authRoutes from './routes/authRoutes';
import streamRoutes from './routes/streamRoutes';
import productRoutes from './routes/productRoutes';
import adminRoutes from './routes/adminRoutes';
import { AppDataSource, initializeDatabase } from './config/database';
import { ILike } from 'typeorm';

// Debug logging for environment variables
console.log('--- BEGIN DEBUG LOGGING ---');
console.log('Environment Variables:');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_PORT:', process.env.DB_PORT);
console.log('DB_NAME:', process.env.DB_NAME);
console.log('DB_USERNAME:', process.env.DB_USERNAME);
console.log('DB_PASSWORD:', process.env.DB_PASSWORD ? '[SET]' : '[NOT SET]');
console.log('DB_SSL:', process.env.DB_SSL);
console.log('--- END DEBUG LOGGING ---');

// Initialize express app
const expressApp = express();
const port = process.env.PORT || 4000;

// Create HTTP server from Express app
const server = http.createServer(expressApp);

// Middleware
expressApp.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  contentSecurityPolicy: false
}));

expressApp.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));

expressApp.use(express.json());

// Debug logging middleware
expressApp.use((req: express.Request, _res: express.Response, next: express.NextFunction) => {
  if (req.originalUrl.includes('/api/auth/login') && req.method === 'POST') {
    console.log('>>> DEBUG: Request Body after express.json():', req.body);
  }
  next();
});

expressApp.use(express.urlencoded({ extended: true }));

// API routes
expressApp.use('/api/auth', authRoutes);
expressApp.use('/api/streams', streamRoutes);
expressApp.use('/api/products', productRoutes);
expressApp.use('/api/admin', adminRoutes);

// Health check endpoint
expressApp.get('/api/health', async (_req, res) => {
  try {
    // Check if database is connected
    if (!AppDataSource.isInitialized) {
      await initializeDatabase();
    }

    // Check if required environment variables are set
    const requiredEnvVars = [
      'JWT_SECRET',
      'BUNNY_API_KEY',
      'BUNNY_LIBRARY_ID',
      'DB_HOST',
      'DB_PORT',
      'DB_USERNAME',
      'DB_PASSWORD',
      'DB_NAME'
    ];

    const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);
    if (missingEnvVars.length > 0) {
      throw new Error(`Missing required environment variables: ${missingEnvVars.join(', ')}`);
    }

    return res.json({ status: 'healthy' });
  } catch (error) {
    console.error('Health check failed:', error);
    return res.status(503).json({ 
      status: 'unhealthy', 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    });
  }
});

// Search endpoint
expressApp.get('/api/search', async (req, res) => {
  try {
    const { query } = req.query;
    if (!query || typeof query !== 'string') {
      return res.status(400).json({ error: 'Search query is required' });
    }

    if (!AppDataSource.isInitialized) {
      await initializeDatabase();
    }

    const userRepository = AppDataSource.getRepository(User);
    const streamRepository = AppDataSource.getRepository(Stream);
    const productRepository = AppDataSource.getRepository(Product);

    const [users, streams, products] = await Promise.all([
      userRepository.find({
        where: [
          { username: ILike(`%${query}%`) },
          { email: ILike(`%${query}%`) }
        ],
        take: 5
      }),
      streamRepository.find({
        where: { title: ILike(`%${query}%`) },
        relations: ['user'],
        take: 5
      }),
      productRepository.find({
        where: { name: ILike(`%${query}%`) },
        relations: ['seller'],
        take: 5
      })
    ]);

    return res.json({
      users: users.map(user => ({
        id: user.id,
        username: user.username,
        email: user.email,
        isStreamer: user.isStreamer
      })),
      streams: streams.map(stream => ({
        id: stream.id,
        title: stream.title,
        description: stream.description,
        userId: stream.userId,
        username: stream.user?.username || 'Unknown'
      })),
      products: products.map(product => ({
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        sellerId: product.sellerId,
        username: product.seller?.username || 'Unknown'
      }))
    });
  } catch (error) {
    console.error('Search failed:', error);
    return res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    });
  }
});

// Error handling middleware
expressApp.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Global error handler:', err);
  
  const statusCode = (err as any).statusCode || 500;
  const message = err.message || 'Internal Server Error';
  
  return res.status(statusCode).json({
    error: {
      message,
      status: statusCode
    }
  });
});

// Initialize database and start server
const initializeApp = async () => {
  try {
    console.log('Initializing database connection...');
    await initializeDatabase();
    console.log('Database connection established successfully');
    
    // Development environment setup
    if (process.env.NODE_ENV === 'development') {
      console.log('Setting up development environment...');
      const targetEmail = 'itsthealvin@gmail.com';
      const userRepository = AppDataSource.getRepository(User);
      try {
        const userToUpdate = await userRepository.findOne({ where: { email: targetEmail } });
        if (userToUpdate && (!userToUpdate.isAdmin || !userToUpdate.isStreamer)) {
          console.log(`>>> TEMPORARY: Updating user ${targetEmail} to admin/streamer...`);
          userToUpdate.isAdmin = true;
          userToUpdate.isStreamer = true;
          await userRepository.save(userToUpdate);
        }
      } catch (error) {
        console.error('Error updating test user:', error);
      }
    }

    // Start server
    server.listen(port, () => {
      console.log(`Server is running on port ${port}`);
      console.log(`API URL: ${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'}`);
      console.log(`Environment: ${process.env.NODE_ENV}`);
    });
  } catch (error) {
    console.error('Error during application initialization:', error);
    console.error('Database connection error details:', error instanceof Error ? error.message : error);
    process.exit(1);
  }
};

// Start the application
initializeApp().catch((error) => {
  console.error('Failed to start application:', error);
  process.exit(1);
}); 