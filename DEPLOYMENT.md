# Fieldhouse Deployment Guide

This guide provides instructions for deploying the Fieldhouse livestreaming application to a production environment.

## Prerequisites

- Node.js (v18.x or later)
- PostgreSQL (v14.x or later)
- Redis (v6.x or later)
- Bunny.net account for video streaming
- AWS S3 or equivalent for file storage
- Domain name with SSL certificate
- SMTP server for email notifications

## Environment Setup

### 1. Clone the Repository

```bash
git clone https://github.com/atims0208/fieldhouse-beta.git
cd fieldhouse-beta
```

### 2. Configure Environment Variables

Create `.env` files for both the frontend and API based on the provided examples:

```bash
cp .env.example .env
cp api/.env.example api/.env
```

Edit both `.env` files with your production settings:

#### Frontend (.env)

```
# API Configuration
NEXT_PUBLIC_API_URL=https://api.yourdomain.com

# Authentication
NEXTAUTH_URL=https://yourdomain.com
NEXTAUTH_SECRET=your_nextauth_secret_here

# Streaming Configuration
NEXT_PUBLIC_STREAM_SERVER_URL=rtmp://your-stream-server-url/live
NEXT_PUBLIC_PLAYBACK_BASE_URL=https://your-bunny-pull-zone-url

# Feature Flags
NEXT_PUBLIC_ENABLE_DONATIONS=true
NEXT_PUBLIC_ENABLE_CHAT=true
```

#### API (api/.env)

```
# Server Configuration
PORT=8000
NODE_ENV=production
API_URL=https://api.yourdomain.com
FRONTEND_URL=https://yourdomain.com
CORS_ORIGIN=https://yourdomain.com

# Database Configuration
# Option 1: Connection string
DATABASE_URL=postgresql://username:password@localhost:5432/fieldhouse
# Option 2: Individual parameters
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_secure_password
DB_DATABASE=fieldhouse

# Redis
REDIS_URL=redis://localhost:6379

# Authentication
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES_IN=1d
JWT_REFRESH_SECRET=your_refresh_token_secret_here
JWT_REFRESH_EXPIRES_IN=7d
COOKIE_SECRET=your_cookie_secret_here

# Bunny.net Streaming Configuration
BUNNY_API_KEY=your_bunny_api_key
BUNNY_STREAM_LIBRARY_ID=your_library_id
BUNNY_PULL_ZONE_URL=https://your_cdn_url.b-cdn.net

# Security
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100

# Logging
LOG_LEVEL=info

# AWS S3
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=your_aws_region
AWS_BUCKET_NAME=your_bucket_name

# Email
SMTP_HOST=your_smtp_host
SMTP_PORT=587
SMTP_USER=your_smtp_user
SMTP_PASSWORD=your_smtp_password
EMAIL_FROM=noreply@yourdomain.com
```

### 3. Install Dependencies

Install dependencies for both the frontend and API:

```bash
# Install frontend dependencies
npm install

# Install API dependencies
cd api
npm install
cd ..
```

## Database Setup

### 1. Create the Database

```bash
createdb fieldhouse
```

### 2. Run Migrations

```bash
cd api
npm run migrate
cd ..
```

## Building the Application

### 1. Build the API

```bash
cd api
npm run build
cd ..
```

### 2. Build the Frontend

```bash
npm run build
```

## Deployment Options

### Option 1: Traditional Server Deployment

#### API Deployment

1. Set up a Node.js server (e.g., using PM2):

```bash
cd api
npm install -g pm2
pm2 start dist/index.js --name fieldhouse-api
pm2 save
pm2 startup
cd ..
```

2. Configure Nginx as a reverse proxy:

```nginx
server {
    listen 80;
    server_name api.yourdomain.com;
    
    location / {
        proxy_pass http://localhost:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

#### Frontend Deployment

1. Set up a Node.js server for Next.js:

```bash
npm install -g pm2
pm2 start npm --name fieldhouse-frontend -- start
pm2 save
```

2. Configure Nginx for the frontend:

```nginx
server {
    listen 80;
    server_name yourdomain.com;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

3. Set up SSL with Certbot:

```bash
sudo apt-get install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d api.yourdomain.com
```

### Option 2: Docker Deployment

1. Create a `docker-compose.yml` file:

```yaml
version: '3'

services:
  postgres:
    image: postgres:14
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: fieldhouse
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: always

  redis:
    image: redis:6
    volumes:
      - redis_data:/data
    restart: always

  api:
    build:
      context: ./api
      dockerfile: Dockerfile
    depends_on:
      - postgres
      - redis
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://postgres:postgres@postgres:5432/fieldhouse
      - REDIS_URL=redis://redis:6379
    restart: always

  frontend:
    build:
      context: .
      dockerfile: Dockerfile
    depends_on:
      - api
    environment:
      - NEXT_PUBLIC_API_URL=https://api.yourdomain.com
    restart: always

  nginx:
    image: nginx:latest
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx:/etc/nginx/conf.d
      - ./certbot/conf:/etc/letsencrypt
      - ./certbot/www:/var/www/certbot
    depends_on:
      - frontend
      - api
    restart: always

  certbot:
    image: certbot/certbot
    volumes:
      - ./certbot/conf:/etc/letsencrypt
      - ./certbot/www:/var/www/certbot
    entrypoint: "/bin/sh -c 'trap exit TERM; while :; do certbot renew; sleep 12h & wait $${!}; done;'"

volumes:
  postgres_data:
  redis_data:
```

2. Create Dockerfiles for the API and frontend.

API Dockerfile (`api/Dockerfile`):

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

EXPOSE 8000

CMD ["node", "dist/index.js"]
```

Frontend Dockerfile (`Dockerfile`):

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

3. Create Nginx configuration:

```nginx
# nginx/default.conf
server {
    listen 80;
    server_name yourdomain.com;
    
    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }
    
    location / {
        return 301 https://$host$request_uri;
    }
}

server {
    listen 443 ssl;
    server_name yourdomain.com;
    
    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
    
    location / {
        proxy_pass http://frontend:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

server {
    listen 80;
    server_name api.yourdomain.com;
    
    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }
    
    location / {
        return 301 https://$host$request_uri;
    }
}

server {
    listen 443 ssl;
    server_name api.yourdomain.com;
    
    ssl_certificate /etc/letsencrypt/live/api.yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.yourdomain.com/privkey.pem;
    
    location / {
        proxy_pass http://api:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

4. Deploy with Docker Compose:

```bash
docker-compose up -d
```

### Option 3: Cloud Deployment

#### Vercel (Frontend)

1. Install the Vercel CLI:

```bash
npm install -g vercel
```

2. Deploy to Vercel:

```bash
vercel --prod
```

#### Heroku (API)

1. Install the Heroku CLI:

```bash
npm install -g heroku
```

2. Create a Heroku app:

```bash
cd api
heroku create fieldhouse-api
```

3. Add PostgreSQL and Redis add-ons:

```bash
heroku addons:create heroku-postgresql:hobby-dev
heroku addons:create heroku-redis:hobby-dev
```

4. Configure environment variables:

```bash
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=your_jwt_secret_here
# Add all other environment variables
```

5. Deploy to Heroku:

```bash
git subtree push --prefix api heroku main
```

## Post-Deployment Steps

### 1. Set Up Database Backups

For PostgreSQL:

```bash
# Create a backup script
cat > backup.sh << 'EOF'
#!/bin/bash
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_DIR="/path/to/backups"
FILENAME="fieldhouse_backup_$TIMESTAMP.sql"
pg_dump -U postgres fieldhouse > "$BACKUP_DIR/$FILENAME"
gzip "$BACKUP_DIR/$FILENAME"
# Optional: Upload to S3 or other storage
EOF

chmod +x backup.sh

# Add to crontab
crontab -e
# Add: 0 2 * * * /path/to/backup.sh
```

### 2. Set Up Monitoring

1. Install and configure Prometheus and Grafana for monitoring.
2. Set up application logging with a service like Datadog, New Relic, or ELK Stack.
3. Configure uptime monitoring with a service like UptimeRobot or Pingdom.

### 3. Set Up CI/CD Pipeline

Create a GitHub Actions workflow for continuous integration and deployment:

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: |
          npm install
          cd api && npm install && cd ..
          
      - name: Run tests
        run: |
          npm test
          cd api && npm test && cd ..
          
      - name: Deploy API to Heroku
        uses: akhileshns/heroku-deploy@v3.12.12
        with:
          heroku_api_key: ${{ secrets.HEROKU_API_KEY }}
          heroku_app_name: "fieldhouse-api"
          heroku_email: ${{ secrets.HEROKU_EMAIL }}
          appdir: "api"
          
      - name: Deploy Frontend to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

## Feature Configuration

### Lovense API Integration

1. Ensure the Lovense API credentials are configured in both environment files:

```bash
# Add to .env and api/.env
LOVENSE_TOKEN=your-lovense-token-here
LOVENSE_KEY=your-lovense-key-here
LOVENSE_IV=your-lovense-iv-here
```

2. Register for a Lovense developer account at [https://developer.lovense.com/](https://developer.lovense.com/) to obtain API credentials.

3. Configure the database tables for Lovense toy connections:

```sql
-- Run these migrations if not using TypeORM automatic migrations
CREATE TABLE lovense_toys (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  toy_id VARCHAR(255) UNIQUE NOT NULL,
  toy_type VARCHAR(50) NOT NULL,
  nickname VARCHAR(255),
  is_connected BOOLEAN DEFAULT FALSE,
  last_connected_at TIMESTAMP,
  last_disconnected_at TIMESTAMP,
  connection_token VARCHAR(255),
  settings JSONB,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE lovense_commands (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  toy_id VARCHAR(255) NOT NULL,
  command VARCHAR(50) NOT NULL,
  intensity INTEGER NOT NULL,
  duration INTEGER,
  is_pattern BOOLEAN DEFAULT FALSE,
  pattern JSONB,
  loop_count INTEGER,
  donation_id UUID REFERENCES donations(id) ON DELETE SET NULL,
  triggered_by_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  is_successful BOOLEAN DEFAULT FALSE,
  error_message TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
```

4. Set up webhook endpoints for Lovense toy connections and events.

5. Configure security settings for Lovense API access:

```bash
# Add to api/.env
LOVENSE_WEBHOOK_SECRET=your_webhook_secret_here
LOVENSE_MAX_INTENSITY=20
LOVENSE_RATE_LIMIT=10  # Commands per minute
```

### Donation System

1. Ensure the donation feature flag is enabled in the frontend environment:

```
NEXT_PUBLIC_ENABLE_DONATIONS=true
```

2. Configure the donation processing service (if using a third-party payment processor):

```bash
# Add to api/.env
PAYMENT_PROCESSOR_API_KEY=your_payment_processor_api_key
PAYMENT_PROCESSOR_SECRET=your_payment_processor_secret
PAYMENT_WEBHOOK_SECRET=your_webhook_secret
```

3. Set up webhook endpoints for payment notifications.

4. Configure donation tiers and amounts in the database:

```sql
INSERT INTO donation_tiers (name, amount, description, icon) 
VALUES 
('Bronze', 100, 'Basic donation', 'bronze_icon.png'),
('Silver', 500, 'Medium donation', 'silver_icon.png'),
('Gold', 1000, 'Premium donation', 'gold_icon.png');
```

5. Configure Lovense integration with donations (optional):

```bash
# Add to api/.env
ENABLE_LOVENSE_DONATION_TRIGGERS=true
LOVENSE_MIN_DONATION_AMOUNT=100
LOVENSE_MAX_DONATION_INTENSITY=20
```

### Stream Management

1. Configure RTMP server settings for live streaming:

```
# Add to api/.env
RTMP_SERVER_URL=rtmp://your-rtmp-server/live
RTMP_SERVER_API_KEY=your_rtmp_server_api_key
```

2. Set up stream key generation and management:

```bash
# Generate secure stream keys
openssl rand -hex 16 > stream_key.txt
```

3. Configure stream categories in the database:

```sql
INSERT INTO stream_categories (name, description) 
VALUES 
('Basketball', 'Basketball games and training'),
('Football', 'Football matches and highlights'),
('Baseball', 'Baseball games and commentary'),
('Other', 'Other sports content');
```

### Chat System

1. Ensure the chat feature flag is enabled in the frontend environment:

```
NEXT_PUBLIC_ENABLE_CHAT=true
```

2. Configure WebSocket server for real-time chat:

```bash
# Add to api/.env
WEBSOCKET_PORT=8001
WEBSOCKET_PATH=/ws
REDIS_CHAT_CHANNEL=fieldhouse_chat
```

3. Set up chat moderation settings:

```bash
# Add to api/.env
ENABLE_CHAT_MODERATION=true
PROFANITY_FILTER_LEVEL=medium  # options: low, medium, high
MAX_CHAT_MESSAGE_LENGTH=200
CHAT_RATE_LIMIT_PER_USER=5     # messages per minute
```

4. Configure chat message persistence (optional):

```bash
# Add to api/.env
PERSIST_CHAT_MESSAGES=true
CHAT_MESSAGE_TTL=86400         # Time to live in seconds (24 hours)
```

## Security Considerations

Review the `SECURITY_CHECKLIST.md` file and ensure all items are addressed, particularly:

### Authentication & Authorization
1. Implement proper password hashing using PBKDF2, bcrypt, or Argon2
2. Enforce strong password requirements
3. Implement account lockout after multiple failed login attempts
4. Set secure and HttpOnly flags on cookies
5. Implement proper role-based access control (RBAC)

### API Security
1. Implement rate limiting for all API endpoints
2. Use proper authentication for all API requests
3. Implement proper CORS configuration
4. Log all API access and errors

### Data Protection
1. Encrypt sensitive data at rest
2. Use TLS/SSL for all data in transit
3. Secure storage of API keys and secrets
4. Implement proper backup and recovery procedures

### Infrastructure Security
1. Set up a Web Application Firewall (WAF) like Cloudflare or AWS WAF
2. Implement proper network security (firewalls, VPNs)
3. Secure server configurations
4. Implement proper logging and monitoring for security events
5. Set up regular security scans and penetration testing

### Livestreaming Specific Security
1. Secure stream keys and access credentials
2. Implement proper access controls for streams
3. Secure RTMP ingestion endpoints
4. Implement proper content moderation for streams

## Scaling Considerations

1. Set up a load balancer for the API servers.
2. Configure auto-scaling for both frontend and API servers.
3. Optimize database queries and consider read replicas for high traffic.
4. Implement caching strategies with Redis.
5. Consider using a CDN for static assets.

## Troubleshooting

### Common Issues

1. **Database Connection Issues**
   - Check database credentials and connection string
   - Verify network connectivity and firewall rules

2. **API Not Responding**
   - Check API logs for errors
   - Verify environment variables are set correctly
   - Check if the API server is running

3. **Frontend Not Loading**
   - Check browser console for errors
   - Verify API URL is configured correctly
   - Check if the Next.js server is running

4. **Streaming Issues**
   - Verify Bunny.net credentials and configuration
   - Check RTMP server connectivity
   - Verify stream key permissions

### Logs

Access logs for troubleshooting:

```bash
# API logs (PM2)
pm2 logs fieldhouse-api

# Frontend logs (PM2)
pm2 logs fieldhouse-frontend

# Docker logs
docker-compose logs -f api
docker-compose logs -f frontend

# Nginx logs
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log
```

## Post-Deployment Testing

After deploying the application, perform the following tests to ensure all components are working correctly:

### Basic Functionality Tests

1. **User Authentication**
   - Register a new user account
   - Log in with the new account
   - Test password reset functionality
   - Verify user profile updates

2. **Stream Creation and Management**
   - Create a new stream
   - Edit stream details
   - Test stream key generation
   - Verify stream categories and tags

3. **Livestreaming**
   - Test RTMP ingestion with OBS or similar software
   - Verify stream playback
   - Check stream chat functionality
   - Test stream moderation tools

4. **Donation System**
   - Test donation form submission
   - Verify payment processing
   - Check donation notifications
   - Test donation history display

### Performance Tests

1. **Load Testing**
   - Simulate multiple concurrent viewers
   - Test API endpoint performance under load
   - Verify WebSocket performance for chat

2. **Responsiveness**
   - Test the application on various devices (desktop, tablet, mobile)
   - Verify responsive design elements
   - Check loading times for key pages

### Security Tests

1. **Authentication Security**
   - Test for common vulnerabilities (CSRF, XSS)
   - Verify proper session management
   - Check password policy enforcement

2. **API Security**
   - Test rate limiting functionality
   - Verify proper authorization checks
   - Test input validation and sanitization

3. **Stream Security**
   - Verify stream key security
   - Test access control for private streams
   - Check content moderation tools

## Maintenance

1. Set up regular database maintenance tasks (vacuum, analyze).
2. Configure log rotation to prevent disk space issues.
3. Set up automated backups for the database and user uploads.
4. Implement a strategy for regular updates and security patches.
5. Document the deployment process and keep it updated.

## Support

For issues or questions, contact the development team:

- GitHub: [https://github.com/atims0208/fieldhouse-beta](https://github.com/atims0208/fieldhouse-beta)
- Email: support@yourdomain.com
