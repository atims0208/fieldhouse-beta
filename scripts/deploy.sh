#!/bin/bash

# Build the application
echo "Building the application..."
npm run build

# Copy necessary files
echo "Copying files..."
mkdir -p dist/config
cp package.json dist/
cp .env.production dist/.env
cp -r node_modules dist/

# Create or update PM2 process
echo "Updating PM2 process..."
pm2 delete fieldhouse-api || true
cd dist && pm2 start index.js --name fieldhouse-api

echo "Deployment complete!" 