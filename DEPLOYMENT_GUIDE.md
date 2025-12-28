# ShikkhaSathi VPS Deployment Guide

## 🚀 VPS Specifications
- **CPU**: 4 cores
- **RAM**: 8GB
- **Storage**: 1TB
- **OS**: Ubuntu 20.04/22.04 LTS (recommended)

## 📋 Prerequisites

### 1. Initial VPS Setup
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install essential packages
sudo apt install -y curl wget git vim htop unzip software-properties-common apt-transport-https ca-certificates gnupg lsb-release

# Create a non-root user (if not exists)
sudo adduser shikkhasathi
sudo usermod -aG sudo shikkhasathi
su - shikkhasathi
```

### 2. Install Docker & Docker Compose
```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Verify installation
docker --version
docker-compose --version

# Logout and login again for group changes
exit
su - shikkhasathi
```

### 3. Install Node.js & Python
```bash
# Install Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install Python 3.9+
sudo apt install -y python3 python3-pip python3-venv

# Verify installations
node --version
npm --version
python3 --version
```

### 4. Install Nginx
```bash
sudo apt install -y nginx
sudo systemctl enable nginx
sudo systemctl start nginx
```

## 🏗️ Project Deployment

### 1. Clone Repository
```bash
cd /home/shikkhasathi
git clone <your-repository-url> ShikkhaSathi
cd ShikkhaSathi
```

### 2. Environment Configuration

#### Backend Environment
```bash
cd backend
cp .env.example .env
vim .env
```

Update `.env` with production values:
```env
# FastAPI Configuration
SECRET_KEY=your-super-secret-key-change-this-in-production
ACCESS_TOKEN_EXPIRE_MINUTES=11520

# Database Configuration
POSTGRES_SERVER=localhost
POSTGRES_USER=shikkhasathi
POSTGRES_PASSWORD=your-secure-password
POSTGRES_DB=shikkhasathi
POSTGRES_PORT=5432

# MongoDB Configuration
MONGODB_URL=mongodb://localhost:27017
MONGODB_DB_NAME=shikkhasathi

# Redis Configuration
REDIS_URL=redis://localhost:6379

# Production Settings
ENVIRONMENT=production
DEBUG=false
ALLOWED_HOSTS=your-domain.com,www.your-domain.com,your-vps-ip

# AI Configuration (Local - No API keys needed)
OLLAMA_BASE_URL=http://localhost:11434
WHISPER_MODEL_PATH=/home/shikkhasathi/models/whisper
COQUI_MODEL_PATH=/home/shikkhasathi/models/coqui

# Email Configuration (Optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
```

#### Frontend Environment
```bash
cd ../frontend
echo "VITE_API_BASE_URL=https://your-domain.com" > .env.production
```

### 3. Setup Production Docker Compose

Create `docker-compose.prod.yml`:
```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_USER: shikkhasathi
      POSTGRES_PASSWORD: your-secure-password
      POSTGRES_DB: shikkhasathi
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./backup:/backup
    restart: unless-stopped
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U shikkhasathi"]
      interval: 30s
      timeout: 10s
      retries: 3

  mongodb:
    image: mongo:7
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: your-secure-password
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db
      - ./backup:/backup
    restart: unless-stopped
    healthcheck:
      test: echo 'db.runCommand("ping").ok' | mongosh localhost:27017/test --quiet
      interval: 30s
      timeout: 10s
      retries: 3

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    restart: unless-stopped
    command: redis-server --appendonly yes --requirepass your-redis-password
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 30s
      timeout: 10s
      retries: 3

  ollama:
    image: ollama/ollama:latest
    ports:
      - "11434:11434"
    volumes:
      - ollama_data:/root/.ollama
    restart: unless-stopped
    environment:
      - OLLAMA_HOST=0.0.0.0

volumes:
  postgres_data:
  mongodb_data:
  redis_data:
  ollama_data:
```

### 4. Setup Local AI Models

#### Install Ollama and Models
```bash
# Start Ollama service
docker-compose -f docker-compose.prod.yml up -d ollama

# Wait for Ollama to start
sleep 30

# Pull the required model
docker exec -it shikkhasathi-ollama-1 ollama pull llama3.2:1b

# Verify model installation
docker exec -it shikkhasathi-ollama-1 ollama list
```

#### Setup Voice Models
```bash
# Create models directory
mkdir -p /home/shikkhasathi/models/{whisper,coqui}

# Install Python dependencies for voice setup
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt

# Run voice setup script
python setup_local_voice.py
```

### 5. Database Setup
```bash
# Start databases
docker-compose -f docker-compose.prod.yml up -d postgres mongodb redis

# Wait for databases to be ready
sleep 30

# Run database migrations
cd backend
source .venv/bin/activate
alembic upgrade head

# Database setup complete
echo "ℹ️  Skipping sample data creation - production deployment"
```

### 6. Build and Deploy Application

#### Build Frontend
```bash
cd frontend
npm install
npm run build

# Copy build files to nginx directory
sudo mkdir -p /var/www/shikkhasathi
sudo cp -r dist/* /var/www/shikkhasathi/
sudo chown -R www-data:www-data /var/www/shikkhasathi
```

#### Setup Backend Service
Create systemd service file:
```bash
sudo vim /etc/systemd/system/shikkhasathi-backend.service
```

Add the following content:
```ini
[Unit]
Description=ShikkhaSathi FastAPI Backend
After=network.target postgresql.service mongodb.service redis.service

[Service]
Type=simple
User=shikkhasathi
Group=shikkhasathi
WorkingDirectory=/home/shikkhasathi/ShikkhaSathi/backend
Environment=PATH=/home/shikkhasathi/ShikkhaSathi/backend/.venv/bin
ExecStart=/home/shikkhasathi/ShikkhaSathi/backend/.venv/bin/uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4
Restart=always
RestartSec=3

[Install]
WantedBy=multi-user.target
```

Enable and start the service:
```bash
sudo systemctl daemon-reload
sudo systemctl enable shikkhasathi-backend
sudo systemctl start shikkhasathi-backend
sudo systemctl status shikkhasathi-backend
```

### 7. Nginx Configuration

Create Nginx configuration:
```bash
sudo vim /etc/nginx/sites-available/shikkhasathi
```

Add the following configuration:
```nginx
# Rate limiting
limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
limit_req_zone $binary_remote_addr zone=auth:10m rate=5r/s;

server {
    listen 80;
    server_name your-domain.com www.your-domain.com your-vps-ip;
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied expired no-cache no-store private must-revalidate auth;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/javascript application/json;

    # Frontend static files
    location / {
        root /var/www/shikkhasathi;
        index index.html;
        try_files $uri $uri/ /index.html;
        
        # Cache static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }

    # API routes
    location /api/ {
        # Rate limiting
        limit_req zone=api burst=20 nodelay;
        
        proxy_pass http://127.0.0.1:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Auth endpoints with stricter rate limiting
    location /api/v1/auth/ {
        limit_req zone=auth burst=10 nodelay;
        
        proxy_pass http://127.0.0.1:8000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # WebSocket support for real-time features
    location /ws {
        proxy_pass http://127.0.0.1:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # File upload size limit
    client_max_body_size 50M;
}
```

Enable the site:
```bash
sudo ln -s /etc/nginx/sites-available/shikkhasathi /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 8. SSL Certificate (Let's Encrypt)
```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# Auto-renewal
sudo crontab -e
# Add this line:
# 0 12 * * * /usr/bin/certbot renew --quiet
```

## 🔧 Production Optimizations

### 1. System Optimizations
```bash
# Increase file limits
sudo vim /etc/security/limits.conf
# Add:
# shikkhasathi soft nofile 65536
# shikkhasathi hard nofile 65536

# Optimize kernel parameters
sudo vim /etc/sysctl.conf
# Add:
# net.core.somaxconn = 65536
# net.ipv4.tcp_max_syn_backlog = 65536
# vm.swappiness = 10

# Apply changes
sudo sysctl -p
```

### 2. Database Optimizations

#### PostgreSQL
```bash
sudo vim /etc/postgresql/*/main/postgresql.conf
```
Add optimizations:
```
# Memory settings
shared_buffers = 2GB
effective_cache_size = 6GB
maintenance_work_mem = 512MB
work_mem = 32MB

# Connection settings
max_connections = 200

# Performance settings
random_page_cost = 1.1
effective_io_concurrency = 200
```

#### MongoDB
```bash
# Create MongoDB configuration
sudo vim /etc/mongod.conf
```
Add:
```yaml
storage:
  wiredTiger:
    engineConfig:
      cacheSizeGB: 2
```

### 3. Monitoring Setup

#### Install monitoring tools
```bash
# Install htop, iotop, nethogs
sudo apt install -y htop iotop nethogs

# Install Docker stats monitoring
docker run -d --name=cadvisor --restart=unless-stopped \
  -p 8080:8080 \
  -v /:/rootfs:ro \
  -v /var/run:/var/run:ro \
  -v /sys:/sys:ro \
  -v /var/lib/docker/:/var/lib/docker:ro \
  -v /dev/disk/:/dev/disk:ro \
  gcr.io/cadvisor/cadvisor:latest
```

#### Log Management
```bash
# Setup log rotation
sudo vim /etc/logrotate.d/shikkhasathi
```
Add:
```
/home/shikkhasathi/ShikkhaSathi/backend/logs/*.log {
    daily
    missingok
    rotate 30
    compress
    delaycompress
    notifempty
    create 644 shikkhasathi shikkhasathi
    postrotate
        systemctl reload shikkhasathi-backend
    endscript
}
```

## 🔒 Security Hardening

### 1. Firewall Setup
```bash
# Install and configure UFW
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

### 2. Fail2Ban
```bash
# Install Fail2Ban
sudo apt install -y fail2ban

# Configure for Nginx
sudo vim /etc/fail2ban/jail.local
```
Add:
```ini
[DEFAULT]
bantime = 3600
findtime = 600
maxretry = 5

[nginx-http-auth]
enabled = true

[nginx-limit-req]
enabled = true
filter = nginx-limit-req
action = iptables-multiport[name=ReqLimit, port="http,https", protocol=tcp]
logpath = /var/log/nginx/error.log
findtime = 600
bantime = 7200
maxretry = 10
```

### 3. Database Security
```bash
# Secure PostgreSQL
sudo -u postgres psql
ALTER USER postgres PASSWORD 'your-secure-password';
\q

# Secure MongoDB
docker exec -it shikkhasathi-mongodb-1 mongosh
use admin
db.createUser({
  user: "shikkhasathi",
  pwd: "your-secure-password",
  roles: ["readWriteAnyDatabase"]
})
exit
```

## 📊 Backup Strategy

### 1. Database Backup Script
```bash
vim /home/shikkhasathi/backup.sh
```
Add:
```bash
#!/bin/bash
BACKUP_DIR="/home/shikkhasathi/ShikkhaSathi/backup"
DATE=$(date +%Y%m%d_%H%M%S)

# Create backup directory
mkdir -p $BACKUP_DIR

# PostgreSQL backup
docker exec shikkhasathi-postgres-1 pg_dump -U shikkhasathi shikkhasathi > $BACKUP_DIR/postgres_$DATE.sql

# MongoDB backup
docker exec shikkhasathi-mongodb-1 mongodump --out /backup/mongodb_$DATE

# Compress backups
tar -czf $BACKUP_DIR/backup_$DATE.tar.gz $BACKUP_DIR/*_$DATE*

# Clean old backups (keep 7 days)
find $BACKUP_DIR -name "*.tar.gz" -mtime +7 -delete

echo "Backup completed: $DATE"
```

Make executable and schedule:
```bash
chmod +x /home/shikkhasathi/backup.sh
crontab -e
# Add: 0 2 * * * /home/shikkhasathi/backup.sh
```

## 🚀 Deployment Commands

### Complete Deployment Script
```bash
vim deploy.sh
```
Add:
```bash
#!/bin/bash
set -e

echo "🚀 Starting ShikkhaSathi deployment..."

# Pull latest code
git pull origin main

# Start databases
docker-compose -f docker-compose.prod.yml up -d postgres mongodb redis ollama

# Wait for databases
sleep 30

# Backend setup
cd backend
source .venv/bin/activate
pip install -r requirements.txt
alembic upgrade head

# Build frontend
cd ../frontend
npm install
npm run build
sudo cp -r dist/* /var/www/shikkhasathi/

# Restart services
sudo systemctl restart shikkhasathi-backend
sudo systemctl reload nginx

echo "✅ Deployment completed successfully!"
echo "🌐 Access your application at: https://your-domain.com"
```

Make executable:
```bash
chmod +x deploy.sh
```

## 📈 Performance Monitoring

### Key Metrics to Monitor
- **CPU Usage**: Should stay below 70%
- **Memory Usage**: Should stay below 80%
- **Disk Usage**: Monitor database growth
- **Response Times**: API should respond < 500ms
- **Error Rates**: Should be < 1%

### Monitoring Commands
```bash
# System resources
htop

# Docker containers
docker stats

# Nginx logs
sudo tail -f /var/log/nginx/access.log

# Application logs
sudo journalctl -u shikkhasathi-backend -f

# Database connections
docker exec shikkhasathi-postgres-1 psql -U shikkhasathi -c "SELECT count(*) FROM pg_stat_activity;"
```

## 🎯 Final Checklist

- [ ] VPS setup completed
- [ ] Docker and Docker Compose installed
- [ ] Project cloned and configured
- [ ] Databases running and migrated
- [ ] Local AI models installed
- [ ] Frontend built and deployed
- [ ] Backend service running
- [ ] Nginx configured with SSL
- [ ] Firewall and security configured
- [ ] Backup system setup
- [ ] Monitoring tools installed

## 🆘 Troubleshooting

### Common Issues

1. **Service won't start**
   ```bash
   sudo systemctl status shikkhasathi-backend
   sudo journalctl -u shikkhasathi-backend -n 50
   ```

2. **Database connection issues**
   ```bash
   docker-compose -f docker-compose.prod.yml logs postgres
   ```

3. **Nginx configuration errors**
   ```bash
   sudo nginx -t
   sudo tail -f /var/log/nginx/error.log
   ```

4. **High memory usage**
   ```bash
   # Restart services
   sudo systemctl restart shikkhasathi-backend
   docker-compose -f docker-compose.prod.yml restart
   ```

## 📞 Support

For deployment issues:
1. Check logs first
2. Verify all services are running
3. Test database connections
4. Check firewall rules
5. Verify SSL certificates

Your ShikkhaSathi platform will be production-ready with this setup! 🎉