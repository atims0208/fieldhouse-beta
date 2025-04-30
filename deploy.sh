#!/bin/bash

# Exit on error
set -e

# Check if registry name is provided
if [ -z "$1" ]; then
    echo "Please provide your DigitalOcean registry name"
    echo "Usage: ./deploy.sh <registry-name>"
    exit 1
fi

REGISTRY_NAME=$1

# Build and push API image
echo "Building API image..."
docker build -t registry.digitalocean.com/$REGISTRY_NAME/fieldhouse-api:latest ./api
echo "Pushing API image..."
docker push registry.digitalocean.com/$REGISTRY_NAME/fieldhouse-api:latest

# Build and push frontend image
echo "Building frontend image..."
docker build -f Dockerfile.frontend -t registry.digitalocean.com/$REGISTRY_NAME/fieldhouse-frontend:latest .
echo "Pushing frontend image..."
docker push registry.digitalocean.com/$REGISTRY_NAME/fieldhouse-frontend:latest

echo "Deployment complete!" 