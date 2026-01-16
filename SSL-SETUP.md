# SSL Setup with Docker Swarm Secrets

This guide shows how to configure SSL for your application using Docker Swarm secrets.

## Prerequisites

1. Docker Swarm initialized (`docker swarm init`)
2. SSL certificate and key files
3. Your domain pointing to the server

## SSL Certificate Files

Create the following directory structure and place your SSL files:

```
nginx/ssl/
├── cert.pem    # Your SSL certificate file
└── key.pem     # Your SSL private key file
```

## Creating Docker Secrets

### Method 1: Using Docker CLI

```bash
# Create SSL secrets from your certificate files
docker secret create ssl_cert nginx/ssl/cert.pem
docker secret create ssl_key nginx/ssl/key.pem
```

### Method 2: Using GitHub Actions

In your GitHub Actions workflow, add these steps before deploying the stack:

```yaml
- name: Create SSL Secrets
  run: |
    docker secret rm ssl_cert || true
    docker secret rm ssl_key || true
    docker secret create ssl_cert nginx/ssl/cert.pem
    docker secret create ssl_key nginx/ssl/key.pem
```

## Deployment

### Deploy with Docker Stack

```bash
docker stack deploy -c docker-stack.yml mattheos-motors
```

### GitHub Actions Example

```yaml
name: Deploy to Docker Swarm
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3

    - name: Set up Docker
      uses: docker/setup-buildx-action@v2

    - name: Deploy to Docker Swarm
      env:
        DOCKER_HOST: ${{ secrets.DOCKER_HOST }}
        DOCKER_TLS_CERTDIR: "/certs"
      run: |
        # Build images (if needed)
        docker build -t localhost/mattheos-motors-backend:latest ./backend
        docker build -t localhost/mattheos-motors-web-frontend:latest ./frontend/apps/web
        docker build -t localhost/mattheos-motors-backoffice-frontend:latest ./frontend/apps/backoffice

        # Create SSL secrets
        docker secret rm ssl_cert || true
        docker secret rm ssl_key || true
        docker secret create ssl_cert nginx/ssl/cert.pem
        docker secret create ssl_key nginx/ssl/key.pem

        # Deploy stack
        docker stack deploy -c docker-stack.yml mattheos-motors
```

## Verification

### Check SSL Secrets

```bash
docker secret ls
```

### Test HTTPS Access

```bash
curl -I https://your-domain.com
```

### View Nginx Logs

```bash
docker service logs mattheos-motors_nginx
```

## Troubleshooting SSL Secrets

### If nginx cannot load SSL certificates:

1. **Check if secrets exist**:
   ```bash
   docker secret ls
   ```

2. **Verify secrets were created correctly**:
   ```bash
   echo "Removing old secrets..."
   docker secret rm ssl_cert ssl_key || true

   echo "Creating new secrets..."
   docker secret create ssl_cert nginx/ssl/cert.pem
   docker secret create ssl_key nginx/ssl/key.pem
   ```

3. **Redeploy the stack**:
   ```bash
   docker stack deploy -c docker-stack.yml mattheos-motors
   ```

4. **Check service status**:
   ```bash
   docker service ls
   docker service ps mattheos-motors_nginx
   ```

5. **Inspect secret mounting**:
   ```bash
   docker service inspect mattheos-motors_nginx
   ```

### Common Issues:

- **Permission denied**: Secrets are mounted with root ownership, nginx runs as nginx user
- **Secret not found**: Secrets weren't created before deploying
- **Invalid certificate format**: Certificate files must be in PEM format

## Troubleshooting

### SSL Certificate Issues

1. Ensure certificate files are in PEM format
2. Check that the certificate chain is complete if using a CA
3. Verify the private key matches the certificate

### Nginx Configuration Issues

1. Test nginx configuration:
   ```bash
   docker exec -it $(docker ps --filter name=nginx --format "{{.ID}}") nginx -t
   ```

2. Check for syntax errors in nginx.conf

### Port Conflicts

Ensure ports 80 and 443 are not already in use:
```bash
netstat -tulpn | grep -E ':80|:443'
```

## Security Notes

1. Keep SSL private keys secure
2. Use strong SSL/TLS cipher suites (already configured in nginx.conf)
3. Enable HSTS (already configured in nginx.conf)
4. Regularly update SSL certificates before they expire
5. Consider using Let's Encrypt for automatic certificate renewal

## Let's Encrypt Integration (Optional)

For automatic SSL certificate management, consider using:

- [Traefik](https://doc.traefik.io/traefik/) with Let's Encrypt integration
- [Certbot](https://certbot.eff.org/) for manual certificate generation
- [Docker Let's Encrypt Companion](https://github.com/JrCs/docker-letsencrypt-nginx-proxy-companion)