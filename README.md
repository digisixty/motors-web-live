# Mattheos Motors

A modern full-stack automotive platform built with a microservices architecture, featuring a .NET backend, React frontends, and deployed with Docker Swarm.

## 🚀 Technology Stack

### Frontend (Monorepo)

- **Framework**: Next.js 16 with React 19
- **Package Manager**: pnpm with Turborepo for monorepo management
- **Styling**: Tailwind CSS with Radix UI components
- **State Management**: React Query for server state
- **Form Handling**: React Hook Form with Zod validation
- **Icons**: Lucide React
- **Language**: TypeScript

### Backend

- **Framework**: .NET 10 with ASP.NET Core
- **Architecture**: Clean Architecture (Domain, Application, Infrastructure layers)
- **Database**: PostgreSQL 15.2
- **ORM**: Entity Framework Core
- **Authentication**: JWT
- **File Storage**: MinIO S3-compatible storage
- **API Documentation**: Swagger/OpenAPI

### Infrastructure & DevOps

- **Containerization**: Docker
- **Orchestration**: Docker Swarm
- **Reverse Proxy**: Nginx
- **CI/CD**: GitHub Actions
- **Database**: PostgreSQL with persistent volumes
- **Object Storage**: MinIO with persistent volumes

## 🐳 Docker Services

### Core Services

1. **Web Frontend** (`web-frontend`)

   - Public-facing website
   - Built with Next.js
   - Served on port 3000 (internal)

2. **Backoffice** (`backoffice-frontend`)

   - Admin dashboard
   - Built with Next.js
   - Served on port 3001 (internal)

3. **Backend API** (`backend`)

   - RESTful API
   - Built with .NET 10
   - Served on port 8080 (internal)

4. **Nginx** (`nginx`)
   - Reverse proxy and load balancer
   - SSL termination
   - Routes traffic to appropriate services
   - Exposed on ports 80 and 443

### Data Services

5. **PostgreSQL** (`postgres`)

   - Primary database
   - Persistent storage
   - Version 15.2
   - Port 5432 (internal)

6. **MinIO** (`minio`)
   - S3-compatible object storage
   - File uploads, images, documents
   - Persistent storage
   - Console on port 9001 (internal)
   - API on port 9000 (internal)

## 🔧 Development

### Prerequisites

- Docker and Docker Swarm
- pnpm (for frontend development)
- .NET 10 SDK (for backend development)

### Local Development

1. **Frontend Development**:

   ```bash
   cd frontend
   pnpm install
   pnpm dev          # Start all apps in development
   pnpm dev:web      # Start only web app
   pnpm dev:backoffice # Start only backoffice
   ```

2. **Backend Development**:

   ```bash
   cd backend
   dotnet restore
   dotnet run        # Run with in-memory database
   ```

   ### Database Operations (CLI)

   The project supports several database operations through the command line. These should be run from the project root directory.

   **Build the project**:
   ```bash
   cd backend && dotnet build
   ```

   **Add migration**:
   ```bash
   cd backend && SkipNSwag=true dotnet ef migrations add "MigrationName" -p src/Infrastructure -s src/Web -o Data/Migrations
   ```

   **Update database**:
   ```bash
   cd backend && dotnet ef database update -p src/Infrastructure -s src/Web
   ```

   **Remove last migration**:
   ```bash
   cd backend && SkipNSwag=true dotnet ef migrations remove -p src/Infrastructure -s src/Web --no-build
   ```

   **Drop database**:
   ```bash
   cd backend && dotnet ef database drop -p src/Infrastructure -s src/Web --no-build
   ```

   **Migration Workflow**:
   1. Make changes to your Entity Framework models or `DbContext`
   2. Add a new migration with a descriptive name (replace `MigrationName` with your desired name)
   3. Update the database to apply the changes

   **Important**: Always include the `SkipNSwag=true` flag for migration operations to avoid Swagger generation issues. The project paths (`-p src/Infrastructure -s src/Web`) are required for proper execution.

3. **Full Stack Development**:
   ```bash
   # Start all services locally
   docker-compose -f docker-compose.dev.yml up -d
   ```

### Building Docker Images

From the monorepo root:

```bash
# Frontend images
cd frontend
docker build -t web-app -f apps/web/Dockerfile .
docker build -t backoffice-app -f apps/backoffice/Dockerfile .

# Backend image
cd ../backend
docker build -t backend-app .
```

## 🚢 Deployment

### Production Deployment with Docker Swarm

1. **Initialize Docker Swarm**:

   ```bash
   docker swarm init
   ```

2. **Deploy Stack**:

   ```bash
   docker stack deploy -c docker-stack.yml mattheos-motors
   ```

3. **Monitor Deployment**:
   ```bash
   docker stack ps mattheos-motors
   docker service ls
   ```

### CI/CD Pipeline

The project uses GitHub Actions for automated deployment:

- **Web Frontend**: Deployed on push to `main-web` branch
- **Backoffice**: Deployed on push to `main-backoffice` branch
- **Backend**: Deployed on push to `main-backend` branch

Each workflow:

1. Builds the Docker image with Turborepo optimization
2. Updates the Docker Swarm service
3. Performs cleanup of unused images

## 🔐 Environment Variables

Create `.env` file for Docker Swarm deployment:

```bash
# Database
POSTGRES_DB=mattheos_motors
POSTGRES_USER=mattheos_user
POSTGRES_PASSWORD=your_secure_password

# MinIO
MINIO_ROOT_USER=minioadmin
MINIO_ROOT_PASSWORD=your_minio_password
MINIO_BUCKET_NAME=mattheos-uploads
MINIO_PUBLIC_BASE_URL=https://your-domain.com/files

# JWT
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRY_MINUTES=60

# Administrator Account (Production)
ADMIN_EMAIL=admin@your-domain.com
ADMIN_PASSWORD=your_secure_admin_password

# Frontend URLs
NEXT_PUBLIC_BASE_URL_WEB=https://your-domain.com
NEXT_PUBLIC_BASE_URL_BACKOFFICE=https://admin.your-domain.com
```

## 🔑 Administrator Account Setup

The application automatically creates an administrator account on first startup:

### Development Environment
- **Email**: `administrator@localhost`
- **Password**: `Administrator1!`

### Production Environment
Set the following environment variables in your `.env` file:
```bash
ADMIN_EMAIL=admin@your-domain.com
ADMIN_PASSWORD=your_secure_admin_password
```

**GitHub Actions Configuration**:
Add these to your GitHub repository:
- **Repository Variables**: `ADMIN_EMAIL`
- **Repository Secrets**: `ADMIN_PASSWORD` (store as a secret for security)

**Important Security Notes**:
- The administrator account is only created if it doesn't already exist
- Use a strong password for production environments
- The account is automatically assigned the "Administrator" role
- Database recreation is disabled in production to prevent data loss

### First Login
1. Navigate to your backoffice URL (e.g., `https://admin.your-domain.com`)
2. Use the administrator credentials above
3. Immediately change the default password after first login

## 🌐 Network Architecture

All services communicate through an overlay network (`mattheos-network`) created by Docker Swarm:

- **External Traffic**: Only Nginx is exposed to the internet (ports 80/443)
- **Internal Communication**: All services communicate internally through the overlay network
- **Security**: Sensitive services (database, storage) are not exposed externally

## 📊 Service Health

All services include health checks:

- **Backend**: `/health` endpoint
- **PostgreSQL**: `pg_isready` command
- **MinIO**: MinIO client connectivity test
- **Frontend**: Nginx proxy health checks

## 🔄 Scaling

Docker Swarm allows easy scaling of services:

```bash
# Scale web frontend to 3 replicas
docker service scale mattheos-motors_web-frontend=3

# Scale backend API to 2 replicas
docker service scale mattheos-motors_backend=2
```

## 📝 Logs and Monitoring

View logs for any service:

```bash
# View all services
docker service ps mattheos-motors

# View logs for specific service
docker service logs mattheos-motors_web-frontend
docker service logs mattheos-motors_backend
```

## 🛠️ Maintenance

### Updates

```bash
# Redeploy updated services
docker stack deploy -c docker-stack.yml mattheos-motors

# Remove unused images
docker image prune -f
```

### Backup

- PostgreSQL data is in `mattheos-db` volume
- MinIO data is in `mattheos-minio` volume
- Regular backups of these volumes are recommended

## 📚 Documentation

- [Frontend Build Guide](./frontend/BUILD.md)
- [API Documentation](https://api.your-domain.com/swagger) (after deployment)
- [Docker Documentation](https://docs.docker.com/)
- [Docker Swarm Documentation](https://docs.docker.com/engine/swarm/)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test locally
5. Push to the appropriate branch:
   - `main-web` for web frontend changes
   - `main-backoffice` for backoffice changes
   - `main-backend` for backend changes

## 📄 License

This project is proprietary to Mattheos Motors.
