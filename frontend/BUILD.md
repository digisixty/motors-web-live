# Building Docker Images

This guide explains how to build Docker images for the frontend applications in this Turborepo monorepo.

## Prerequisites

- Docker installed
- pnpm installed (or use `corepack enable pnpm`)

## Building from the Monorepo Root

All Docker builds should be run from the monorepo root directory (`/frontend/`) to ensure all necessary files (including `turbo.json`) are available in the build context.

### Web Application

```bash
# From the monorepo root (frontend/)
docker build -t web-app -f apps/web/Dockerfile .
```

### Backoffice Application

```bash
# From the monorepo root (frontend/)
docker build -t backoffice-app -f apps/backoffice/Dockerfile .
```

## Running the Containers

```bash
# Run web app on port 3000
docker run -p 3000:3000 web-app

# Run backoffice on port 3001
docker run -p 3001:3001 backoffice-app
```

## What the Docker Files Do

The Docker files use Turborepo's `prune` command to optimize builds:

1. **Pruning**: Only copies dependencies and files needed by each specific app
2. **Layer Caching**: Dependencies are only re-installed when they actually change
3. **Optimized Builds**: Changes to one app don't trigger rebuilds of other apps

## Production Deployment

For production deployment, the GitHub Actions workflows automatically build and deploy the images when code is pushed to the respective branches:
- `main-web` → Web application
- `main-backoffice` → Backoffice application

The deployment process uses Docker Swarm and updates the services defined in `docker-stack.yml`.