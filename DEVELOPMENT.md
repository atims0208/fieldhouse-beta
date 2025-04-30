# Fieldhouse Development Guide

## Branch Strategy

- `main`: Production branch
- `development`: Development and testing branch
- Feature branches should be created from `development`

## Development Workflow

1. Create a new feature branch from development:
   ```bash
   git checkout development
   git pull origin development
   git checkout -b feature/your-feature-name
   ```

2. Make your changes and commit:
   ```bash
   git add .
   git commit -m "feat: your feature description"
   ```

3. Push changes and create a pull request:
   ```bash
   git push origin feature/your-feature-name
   ```

4. Create a Pull Request to merge into `development`

## Deployment Process

### Development
- Automatic deployment when changes are pushed to `development` branch
- Accessible at: https://fieldhouse-beta-bbcpy.ondigitalocean.app

### Production
- Requires Pull Request from `development` to `main`
- Automatic deployment when merged to `main`

## Monitoring and Logging

- Logs are stored in `/api/logs/`
- Error logs: `error.log`
- Combined logs: `combined.log`
- Production logs are available in DigitalOcean dashboard

## Environment Variables

Make sure to set these in DigitalOcean App Platform:
- `NODE_ENV`
- `PORT`
- `DB_*` credentials
- `JWT_SECRET`
- `CORS_ORIGIN`

## Testing

Run tests before creating a PR:
```bash
cd api
npm test
```

## CI/CD Pipeline

GitHub Actions will:
1. Run tests
2. Check code quality
3. Deploy to appropriate environment

## Monitoring

- Application logs: Available in DigitalOcean App Platform
- Error tracking: Sentry
- Performance monitoring: DigitalOcean metrics 