# PowerShell deployment script

$REGISTRY_NAME = "fieldhouse-registry"

Write-Host "Building API image..."
docker build -t "registry.digitalocean.com/$REGISTRY_NAME/fieldhouse-api:latest" ./api

Write-Host "Pushing API image..."
docker push "registry.digitalocean.com/$REGISTRY_NAME/fieldhouse-api:latest"

Write-Host "Building frontend image..."
docker build -f Dockerfile.frontend -t "registry.digitalocean.com/$REGISTRY_NAME/fieldhouse-frontend:latest" .

Write-Host "Pushing frontend image..."
docker push "registry.digitalocean.com/$REGISTRY_NAME/fieldhouse-frontend:latest"

Write-Host "Deployment complete!" 