# 🚀 Deployment Instructions for Ola Kurim Server

## 📋 What's Included:
- ✅ PostgreSQL Database (same server)
- ✅ Redis Cache (self-hosted)
- ✅ Your CMS Backend
- ✅ All services in Docker containers

## 🔧 Server Requirements:
- Docker & Docker Compose installed
- Port 5000, 5432, 6379 available

## 📂 Files to Copy to Server:
```bash
# Copy entire project folder to server
scp -r practo-cms-be/ user@your-server:/path/to/deployment/
```

## ⚙️ Setup Steps:

### 1. Update Environment Variables:
```bash
# Edit .env.production on server
nano .env.production

# Change these values:
JWT_SECRET="generate-strong-32-char-secret"
FRONTEND_URL="https://your-actual-domain.com"
```

### 2. Deploy Services:
```bash
# Navigate to project folder
cd practo-cms-be/

# Start all services
docker-compose --env-file .env.production up -d

# Check logs
docker-compose logs -f
```

### 3. Verify Deployment:
```bash
# Check if services are running
docker-compose ps

# Test API
curl http://localhost:5000/health

# Check database
docker-compose exec postgres psql -U postgres -d practocms5 -c "\dt"
```

## 🔍 Service URLs:
- **API**: http://your-server:5000
- **Database**: localhost:5432 (internal)
- **Redis**: localhost:6379 (internal)

## 🛠️ Management Commands:
```bash
# Stop services
docker-compose down

# Restart services
docker-compose restart

# View logs
docker-compose logs app
docker-compose logs postgres
docker-compose logs redis

# Database backup
docker-compose exec postgres pg_dump -U postgres practocms5 > backup.sql
```

## 📊 What Happens:
1. PostgreSQL starts with your database `practocms5`
2. Redis starts for job queue
3. Your app connects to both services
4. Database migrations run automatically
5. API is available on port 5000

## ✅ Success Indicators:
- All 3 containers running: `docker-compose ps`
- API responds: `curl http://localhost:5000/health`
- No errors in logs: `docker-compose logs`

## 🚨 Troubleshooting:
- **Port conflicts**: Change ports in docker-compose.yml
- **Permission issues**: Run with `sudo`
- **Database connection**: Check DATABASE_URL format
- **Memory issues**: Increase server RAM or reduce Redis memory limit

Your CMS is now fully self-hosted! 🎉