import express from 'express';
import http from 'http'; // Import http module
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { testConnection, syncDatabase, initializeAssociations, User } from './models';
import routes from './routes';
import { initializeWebSocket } from './websocket'; // Import WebSocket initializer

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();
const port = process.env.PORT || 4000;

// Create HTTP server from Express app
const server = http.createServer(app);

// Middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  contentSecurityPolicy: false
})); // Security headers
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json()); // Parse JSON request bodies

// --- DEBUG LOGGING: Check parsed body --- 
app.use((req, res, next) => {
  if (req.originalUrl.includes('/api/auth/login') && req.method === 'POST') {
    console.log('>>> DEBUG: Request Body after express.json():', req.body);
  }
  next();
});
// --- END DEBUG LOGGING ---

app.use(express.urlencoded({ extended: true })); // Parse URL-encoded request bodies

// API routes
app.use('/api', routes);

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Global error handler:', err);
  
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  
  res.status(statusCode).json({
    error: {
      message,
      status: statusCode
    }
  });
});

// Start server
const startServer = async () => {
  try {
    // Test database connection
    await testConnection();
    
    // Initialize model associations
    initializeAssociations();

    // Sync database models (without force to preserve data)
    await syncDatabase(false);

    // --- BEGIN TEMPORARY CODE TO SET ADMIN/STREAMER --- 
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
    // --- END TEMPORARY CODE --- 

    // Initialize WebSocket server
    initializeWebSocket(server); // Pass the HTTP server instance
    
    // Start listening for requests on the HTTP server
    server.listen(port, () => { // Use server.listen instead of app.listen
      console.log(`Server running on port ${port}`);
      console.log(`API available at http://localhost:${port}/api`);
      console.log(`WebSocket available at ws://localhost:${port}`); // Log WebSocket URL
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer(); 