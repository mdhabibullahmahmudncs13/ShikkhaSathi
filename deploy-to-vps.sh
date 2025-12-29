#!/bin/bash

# ShikkhaSathi VPS Deployment Script
# VPS: devops@103.73.225.187
# This script will deploy the complete ShikkhaSathi platform

set -e

echo "🚀 Starting ShikkhaSathi VPS Deployment..."
echo "📍 Target VPS: 103.73.225.187"
echo "👤 User: devops"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_step() {
    echo -e "${BLUE}[STEP]${NC} $1"
}

# Check if we're running on the VPS
if [[ $(hostname -I | grep -c "103.73.225.187") -eq 0 ]]; then
    print_error "This script should be run on the VPS (103.73.225.187)"
    print_status "Please copy this script to your VPS and run it there"
    exit 1
fi

print_step "1. System Update and Basic Setup"
sudo apt update && sudo apt upgrade -y
sudo apt install -y curl wget git vim htop unzip software-properties-common apt-transport-https ca-certificates gnupg lsb-release build-essential

print_step "2. Installing Docker and Docker Compose"
# Install Docker
if ! command -v docker &> /dev/null; then
    curl -fsSL https://get.docker.com -o get-docker.sh
    sudo sh get-docker.sh
    sudo usermod -aG docker $USER
    rm get-docker.sh
    print_status "Docker installed successfully"
else
    print_status "Docker already installed"
fi

# Install Docker Compose
if ! command -v docker-compose &> /dev/null; then
    sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
    print_status "Docker Compose installed successfully"
else
    print_status "Docker Compose already installed"
fi

print_step "3. Installing Node.js 18.x"
if ! command -v node &> /dev/null; then
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt-get install -y nodejs
    print_status "Node.js installed: $(node --version)"
else
    print_status "Node.js already installed: $(node --version)"
fi

print_step "4. Installing Python 3.9+ and pip"
sudo apt install -y python3 python3-pip python3-venv python3-dev
print_status "Python installed: $(python3 --version)"

print_step "5. Installing Nginx"
if ! command -v nginx &> /dev/null; then
    sudo apt install -y nginx
    sudo systemctl enable nginx
    sudo systemctl start nginx
    print_status "Nginx installed and started"
else
    print_status "Nginx already installed"
fi

print_step "6. Creating project directories"
sudo mkdir -p /home/devops/data/{postgres,mongodb,mongodb-config,redis,ollama}
sudo mkdir -p /home/devops/logs/nginx
sudo mkdir -p /home/devops/backup
sudo mkdir -p /var/www/shikkhasathi
sudo chown -R devops:devops /home/devops/data
sudo chown -R devops:devops /home/devops/logs
sudo chown -R devops:devops /home/devops/backup

print_step "7. Cloning ShikkhaSathi Repository"
cd /home/devops
if [ ! -d "ShikkhaSathi" ]; then
    print_warning "Please provide your repository URL:"
    read -p "Repository URL: " REPO_URL
    git clone $REPO_URL ShikkhaSathi
    print_status "Repository cloned successfully"
else
    print_status "Repository already exists, pulling latest changes"
    cd ShikkhaSathi
    git pull origin main
fi

cd /home/devops/ShikkhaSathi

print_step "8. Setting up environment files"
# Backend environment
cd backend
if [ ! -f ".env" ]; then
    cp .env.example .env
    
    # Generate a secure secret key
    SECRET_KEY=$(python3 -c "import secrets; print(secrets.token_urlsafe(32))")
    
    # Update .env file with production values
    cat > .env << EOF
# FastAPI Configuration
SECRET_KEY=$SECRET_KEY
ACCESS_TOKEN_EXPIRE_MINUTES=11520

# Database Configuration
POSTGRES_SERVER=localhost
POSTGRES_USER=shikkhasathi
POSTGRES_PASSWORD=ShikkhaSathi2024!@#
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
ALLOWED_HOSTS=103.73.225.187,localhost

# AI Configuration (Local - No API keys needed)
OLLAMA_BASE_URL=http://localhost:11434
WHISPER_MODEL_PATH=/home/devops/models/whisper
COQUI_MODEL_PATH=/home/devops/models/coqui

# Email Configuration (Optional - configure later)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=
SMTP_PASSWORD=
EOF
    print_status "Backend .env file created"
else
    print_status "Backend .env file already exists"
fi

# Frontend environment
cd ../frontend
echo "VITE_API_BASE_URL=http://103.73.225.187" > .env.production
print_status "Frontend .env.production file created"

print_step "9. Setting up Docker Compose for production"
cd /home/devops/ShikkhaSathi

# Create production docker-compose with correct paths
cat > docker-compose.prod.yml << 'EOF'
version: '3.8'

services:
  postgres:
    image: postgres:15
    container_name: shikkhasathi-postgres
    environment:
      POSTGRES_USER: shikkhasathi
      POSTGRES_PASSWORD: ShikkhaSathi2024!@#
      POSTGRES_DB: shikkhasathi
    ports:
      - "5432:5432"
    volumes:
      - /home/devops/data/postgres:/var/lib/postgresql/data
      - /home/devops/backup:/backup
    restart: unless-stopped
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U shikkhasathi -d shikkhasathi"]
      interval: 30s
      timeout: 10s
      retries: 5

  mongodb:
    image: mongo:7
    container_name: shikkhasathi-mongodb
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: ShikkhaSathi2024!@#
    ports:
      - "27017:27017"
    volumes:
      - /home/devops/data/mongodb:/data/db
      - /home/devops/backup:/backup
    restart: unless-stopped
    healthcheck:
      test: echo 'db.runCommand("ping").ok' | mongosh localhost:27017/test --quiet
      interval: 30s
      timeout: 10s
      retries: 5

  redis:
    image: redis:7-alpine
    container_name: shikkhasathi-redis
    ports:
      - "6379:6379"
    volumes:
      - /home/devops/data/redis:/data
    restart: unless-stopped
    command: redis-server --appendonly yes
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 30s
      timeout: 10s
      retries: 5

  ollama:
    image: ollama/ollama:latest
    container_name: shikkhasathi-ollama
    ports:
      - "11434:11434"
    volumes:
      - /home/devops/data/ollama:/root/.ollama
    restart: unless-stopped
    environment:
      - OLLAMA_HOST=0.0.0.0
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:11434/api/tags"]
      interval: 30s
      timeout: 10s
      retries: 5
      start_period: 60s

volumes:
  postgres_data:
  mongodb_data:
  redis_data:
  ollama_data:
EOF

print_status "Production Docker Compose file created"

print_step "10. Starting database services"
docker-compose -f docker-compose.prod.yml up -d postgres mongodb redis ollama

print_status "Waiting for databases to be ready..."
sleep 60

# Check if databases are running
if docker ps | grep -q "shikkhasathi-postgres"; then
    print_status "PostgreSQL is running"
else
    print_error "PostgreSQL failed to start"
fi

if docker ps | grep -q "shikkhasathi-mongodb"; then
    print_status "MongoDB is running"
else
    print_error "MongoDB failed to start"
fi

if docker ps | grep -q "shikkhasathi-redis"; then
    print_status "Redis is running"
else
    print_error "Redis failed to start"
fi

print_step "11. Setting up Python virtual environment and backend"
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt

print_status "Running database migrations..."
alembic upgrade head

print_status "Database setup complete..."
echo "ℹ️  Skipping sample data creation - production deployment"

print_step "12. Installing Ollama models"
print_status "Pulling Ollama model (this may take a few minutes)..."
docker exec shikkhasathi-ollama ollama pull llama3.2:1b

print_step "13. Building frontend"
cd ../frontend
npm install
npm run build

# Copy built files to nginx directory
sudo cp -r dist/* /var/www/shikkhasathi/
sudo chown -R www-data:www-data /var/www/shikkhasathi

print_step "14. Setting up systemd service for backend"
sudo tee /etc/systemd/system/shikkhasathi-backend.service > /dev/null << EOF
[Unit]
Description=ShikkhaSathi FastAPI Backend
After=network.target docker.service
Requires=docker.service

[Service]
Type=simple
User=devops
Group=devops
WorkingDirectory=/home/devops/ShikkhaSathi/backend
Environment=PATH=/home/devops/ShikkhaSathi/backend/.venv/bin
ExecStart=/home/devops/ShikkhaSathi/backend/.venv/bin/uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 2
Restart=always
RestartSec=3

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl daemon-reload
sudo systemctl enable shikkhasathi-backend
sudo systemctl start shikkhasathi-backend

print_step "15. Configuring Nginx"
sudo tee /etc/nginx/sites-available/shikkhasathi > /dev/null << 'EOF'
# Rate limiting
limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
limit_req_zone $binary_remote_addr zone=auth:10m rate=5r/s;

server {
    listen 80;
    server_name 103.73.225.187;
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
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

    # File upload size limit
    client_max_body_size 50M;
}
EOF

# Enable the site
sudo ln -sf /etc/nginx/sites-available/shikkhasathi /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl reload nginx

print_step "16. Setting up firewall"
sudo ufw --force enable
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

print_step "17. Setting up backup script"
cat > /home/devops/backup.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="/home/devops/backup"
DATE=$(date +%Y%m%d_%H%M%S)

# Create backup directory
mkdir -p $BACKUP_DIR

# PostgreSQL backup
docker exec shikkhasathi-postgres pg_dump -U shikkhasathi shikkhasathi > $BACKUP_DIR/postgres_$DATE.sql

# MongoDB backup
docker exec shikkhasathi-mongodb mongodump --out /backup/mongodb_$DATE

# Compress backups
tar -czf $BACKUP_DIR/backup_$DATE.tar.gz $BACKUP_DIR/*_$DATE*

# Clean old backups (keep 7 days)
find $BACKUP_DIR -name "*.tar.gz" -mtime +7 -delete

echo "Backup completed: $DATE"
EOF

chmod +x /home/devops/backup.sh

# Add to crontab
(crontab -l 2>/dev/null; echo "0 2 * * * /home/devops/backup.sh") | crontab -

print_step "18. Final system checks"
print_status "Checking service status..."

# Check Docker containers
echo "Docker containers:"
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

# Check backend service
echo -e "\nBackend service status:"
sudo systemctl status shikkhasathi-backend --no-pager -l

# Check Nginx
echo -e "\nNginx status:"
sudo systemctl status nginx --no-pager -l

print_step "19. Testing the deployment"
sleep 10

# Test API health
if curl -s http://localhost:8000/api/v1/health > /dev/null; then
    print_status "✅ Backend API is responding"
else
    print_error "❌ Backend API is not responding"
fi

# Test frontend
if curl -s http://localhost > /dev/null; then
    print_status "✅ Frontend is accessible"
else
    print_error "❌ Frontend is not accessible"
fi

print_step "20. Deployment Summary"
echo "=================================================="
echo "🎉 ShikkhaSathi Deployment Completed!"
echo "=================================================="
echo "📍 Server IP: 103.73.225.187"
echo "🌐 Frontend URL: http://103.73.225.187"
echo "🔧 Backend API: http://103.73.225.187/api/v1"
echo "📚 API Docs: http://103.73.225.187/api/v1/docs"
echo ""
echo "🔑 Test Accounts:"
echo "Student: student1@shikkhasathi.com / student123"
echo "Teacher: teacher1@shikkhasathi.com / teacher123"
echo "Parent: parent1@shikkhasathi.com / parent123"
echo ""
echo "📊 Monitoring:"
echo "System: htop"
echo "Docker: docker stats"
echo "Logs: sudo journalctl -u shikkhasathi-backend -f"
echo ""
echo "🔧 Management Commands:"
echo "Restart Backend: sudo systemctl restart shikkhasathi-backend"
echo "Restart Nginx: sudo systemctl restart nginx"
echo "View Logs: sudo journalctl -u shikkhasathi-backend -f"
echo "Backup: /home/devops/backup.sh"
echo ""
echo "=================================================="

print_status "Deployment completed successfully! 🚀"
print_status "You can now access ShikkhaSathi at: http://103.73.225.187"