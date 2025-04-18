import 'reflect-metadata';
import { DataSource } from 'typeorm';
import config from '../ormconfig';
import express from 'express';
import http from 'http';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { testConnection, syncDatabase, initializeAssociations, User } from './models';
import routes from './routes';
import { initializeWebSocket } from './websocket';
import sequelize from './models';

// Load environment variables
dotenv.config();

// Debug logging for environment variables
console.log('--- BEGIN DEBUG LOGGING ---');
console.log('Environment Variables:');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_PORT:', process.env.DB_PORT);
console.log('DB_NAME:', process.env.DB_NAME);
console.log('DB_USERNAME:', process.env.DB_USERNAME);
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
expressApp.use('/api', routes);

// Health check endpoint
expressApp.get('/api/health', async (req, res) => {
  try {
    await sequelize.authenticate();
    res.status(200).json({ status: 'healthy' });
  } catch (error) {
    console.error('Health check failed:', error);
    res.status(503).json({ status: 'unhealthy', error: error.message });
  }
});

// Error handling middleware
expressApp.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Global error handler:', err);
  
  const statusCode = (err as any).statusCode || 500;
  const message = err.message || 'Internal Server Error';
  
  res.status(statusCode).json({
    error: {
      message,
      status: statusCode
    }
  });
});

const AppDataSource = new DataSource(config);

// Initialize database and start server
const initializeApp = async () => {
  try {
    await AppDataSource.initialize();
    
    // Test database connection
    await testConnection();
    
    // Initialize model associations
    initializeAssociations();

    // Sync database models (without force to preserve data)
    await syncDatabase(false);

    // Development environment setup
    if (process.env.NODE_ENV === 'development') {
      const targetEmail = 'itsthealvin@gmail.com';
      try {
        const userToUpdate = await User.findOne({ where: { email: targetEmail } });
        if (userToUpdate && (!userToUpdate.isAdmin || !userToUpdate.isStreamer)) {
          console.log(`>>> TEMPORARY: Updating user ${targetEmail} to admin/streamer...`);
          userToUpdate.isAdmin = true;
          userToUpdate.isStreamer = true;
          await userToUpdate.save();
          console.log(`>>> TEMPORARY: User ${targetEmail} updated successfully.`);
        } else if (userToUpdate) {
          console.log(`>>> TEMPORARY: User ${targetEmail} already has admin/streamer status.`);
        } else {
          console.log(`>>> TEMPORARY: User ${targetEmail} not found for update.`);
        }
      } catch (err) {
        console.error(`>>> TEMPORARY: Failed to update user ${targetEmail}:`, err);
      }
    }

    // Initialize WebSocket server
    initializeWebSocket(server);
    
    // Start listening for requests
    server.listen(port, () => {
      console.log(`Server running on port ${port}`);
      console.log(`API available at http://localhost:${port}/api`);
      console.log(`WebSocket available at ws://localhost:${port}`);
    });
  } catch (error: unknown) {
    console.error('Error during application initialization:', error);
    process.exit(1);
  }
};

const MAX_RETRIES = 5;
const RETRY_DELAY = 10000; // 10 seconds

const connectWithRetry = async (attempt = 1) => {
  try {
    console.log(`Database connection attempt ${attempt}/${MAX_RETRIES}...`);
    await sequelize.authenticate();
    console.log('Database connection established successfully');
    
    // Start server after successful database connection
    initializeApp();
  } catch (error) {
    console.error(`Connection attempt ${attempt} failed:`, error.message);
    
    if (attempt < MAX_RETRIES) {
      console.log(`Retrying in ${RETRY_DELAY/1000} seconds...`);
      setTimeout(() => connectWithRetry(attempt + 1), RETRY_DELAY);
    } else {
      console.error('Max retries reached. Exiting...');
      process.exit(1);
    }
  }
};

// Start the connection process
connectWithRetry(); 