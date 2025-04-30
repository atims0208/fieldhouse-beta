import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import routes from './routes';
import { initializeDatabase } from './models';
import { setupWebSocket } from './websocket/index';

const app = express();

// Initialize database
initializeDatabase()
  .then(() => console.log('Database initialized'))
  .catch(err => console.error('Database initialization error:', err));

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json());

// Routes
app.use('/api', routes);

// Error handling
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something broke!' });
});

export { app, setupWebSocket }; 