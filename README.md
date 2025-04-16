# Fieldhouse Livestreaming Platform

A Twitch-like livestreaming platform built with Next.js, Node.js, PostgreSQL, and Bunny.net for streaming.

## Project Structure

- `app/`: Next.js frontend application
- `api/`: Node.js backend API
- `components/`: Reusable UI components
- `lib/`: Utility functions and API client

## Prerequisites

- Node.js 16+ and npm/pnpm
- PostgreSQL database (We use DigitalOcean managed database)
- Bunny.net account with Video Streaming configured
- DigitalOcean account for deployment

## Environment Setup

1. Backend environment variables (api/.env):
   - Database connection details
   - JWT secret key
   - Bunny.net credentials
   - CORS settings

2. Frontend environment variables (.env.local):
   - `NEXT_PUBLIC_API_URL`: URL of the backend API

## Getting Started

### Installing Dependencies

```bash
# Install frontend dependencies
pnpm install

# Install backend dependencies
cd api
npm install
```

### Running the Application

1. Start the backend API server:
```bash
cd api
npm run dev
```

2. Start the frontend Next.js application:
```bash
# From the root directory
pnpm dev
```

3. Open your browser and navigate to:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:4000/api

## Key Features

- User authentication (login/register)
- User profiles and following system
- Live streaming capabilities via Bunny.net
- Stream discovery and browsing
- Stream viewer counts and analytics

## API Documentation

### Authentication Endpoints
- `POST /api/auth/register`: Register a new user
- `POST /api/auth/login`: Log in a user
- `GET /api/auth/me`: Get current authenticated user

### User Endpoints
- `GET /api/users/profile/:username`: Get user profile
- `PUT /api/users/profile`: Update user profile
- `POST /api/users/upgrade-to-streamer`: Upgrade user to streamer
- `POST /api/users/follow/:username`: Follow a user
- `DELETE /api/users/follow/:username`: Unfollow a user
- `GET /api/users/following`: Get users the current user is following

### Stream Endpoints
- `GET /api/streams/active`: Get all active streams
- `GET /api/streams/:streamId`: Get stream by ID
- `POST /api/streams/start`: Start a new stream
- `POST /api/streams/:streamId/end`: End a stream
- `PUT /api/streams/:streamId/viewers`: Update viewer count

## Deployment

### DigitalOcean App Platform Deployment

1. Fork this repository to your GitHub account
2. Visit the [DigitalOcean App Platform](https://cloud.digitalocean.com/apps) and click **Create App**
3. Select **GitHub** as the source and choose your forked repository
4. Configure the app settings:
   - Set environment variables
   - Configure HTTP routes
   - Add the PostgreSQL database
5. Choose your preferred region and plan
6. Click **Launch Basic/Pro App**

The app will be automatically deployed and any future pushes to the main branch will trigger automatic redeployments.

### Database Credentials

The application connects to a DigitalOcean PostgreSQL database with these credentials:
- Username: doadmin
- Host: db-postgresql-nyc1-23413-do-user-13790243-0.g.db.ondigitalocean.com
- Port: 25060
- Database: defaultdb

### Streaming Integration

Streaming is powered by Bunny.net with these credentials:
- Video Library ID: 409856
- CDN Hostname: vz-4f8c314d-49b.b-cdn.net

# Fieldhouse API

Backend API service for the Fieldhouse livestreaming platform.

## Production Deployment

### Prerequisites

1. Node.js 16+ installed on the server
2. PM2 installed globally (`npm install -g pm2`)
3. PostgreSQL database set up on DigitalOcean
4. Domain name configured (if applicable)

### Deployment Steps

1. Clone the repository on your DigitalOcean server:
   ```bash
   git clone <your-repo-url>
   cd fieldhouse-api
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   # Copy the production env file
   cp .env.production .env
   
   # Edit the environment variables
   nano .env
   ```

   Update the following variables:
   - `DATABASE_URL`: Your DigitalOcean PostgreSQL connection string
   - `JWT_SECRET`: A secure random string
   - `CORS_ORIGIN`: Your frontend Vercel deployment URL
   - `BUNNY_API_KEY`: Your Bunny.net production API key

4. Run the deployment script:
   ```bash
   chmod +x scripts/deploy.sh
   ./scripts/deploy.sh
   ```

5. Set up Nginx reverse proxy (if not already configured):
   ```nginx
   server {
       listen 80;
       server_name api.yourdomain.com;

       location / {
           proxy_pass http://localhost:4000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

6. Set up SSL with Let's Encrypt:
   ```bash
   sudo certbot --nginx -d api.yourdomain.com
   ```

### Monitoring

- View logs: `pm2 logs fieldhouse-api`
- Monitor status: `pm2 status`
- Restart server: `pm2 restart fieldhouse-api`

### Database Migrations

Run migrations in production:
```bash
npm run migrate
```

### Troubleshooting

1. Check server logs:
   ```bash
   pm2 logs fieldhouse-api
   ```

2. Check database connection:
   ```bash
   curl http://localhost:4000/health
   ```

3. Verify CORS settings if the frontend can't connect:
   - Ensure `CORS_ORIGIN` in `.env` matches your Vercel deployment URL
   - Check for any CORS errors in the browser console

4. If the server won't start:
   ```bash
   # Check the logs
   pm2 logs fieldhouse-api
   
   # Restart the process
   pm2 restart fieldhouse-api
   ```
