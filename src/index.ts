import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import { initializeDatabase } from './config/database';
import authRoutes from './routes/auth.routes';

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

// Middleware
app.use(helmet());
app.use(cors({
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    const allowedOrigins = [
      process.env.CORS_ORIGIN || 'http://localhost:3000',
      'http://localhost:3000',
      'https://fieldhouse-beta-2024.vercel.app'
    ];

    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'healthy' });
});

// Routes
app.use('/auth', authRoutes);

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal server error' });
});

const startServer = async () => {
  try {
    await initializeDatabase();
    
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer(); 