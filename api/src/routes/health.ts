import { Router, Request, Response } from 'express';
import { AppDataSource } from '../data-source';

const router = Router();

router.get('/', async (_req: Request, res: Response) => {
  try {
    // Check database connection
    const isDbConnected = AppDataSource.isInitialized;

    // Basic memory usage check
    const memoryUsage = process.memoryUsage();
    const memoryUsageMB = {
      heapUsed: Math.round(memoryUsage.heapUsed / 1024 / 1024),
      heapTotal: Math.round(memoryUsage.heapTotal / 1024 / 1024),
      rss: Math.round(memoryUsage.rss / 1024 / 1024),
    };

    return res.status(200).json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      database: isDbConnected ? 'connected' : 'disconnected',
      uptime: process.uptime(),
      memoryUsage: memoryUsageMB,
    });
  } catch (error) {
    console.error('Health check failed:', error);
    return res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: 'Health check failed',
      database: 'disconnected',
    });
  }
});

export default router; 