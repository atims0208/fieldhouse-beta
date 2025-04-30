FROM node:18-alpine

WORKDIR /app

# Install curl for health checks
RUN apk --no-cache add curl

# Copy package files
COPY package*.json ./
COPY tsconfig.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build TypeScript code
RUN npm run build

# Remove development dependencies
RUN npm prune --production

EXPOSE 4000

# Add health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=30s --retries=3 \
    CMD curl -f http://localhost:4000/api/health || exit 1

CMD ["npm", "start"] 