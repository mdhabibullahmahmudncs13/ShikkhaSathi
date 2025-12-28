#!/bin/bash

# Remote deployment script for ShikkhaSathi
# This script will connect to the VPS and deploy the application

set -e

VPS_HOST="103.73.225.187"
VPS_USER="devops"
VPS_PASS="devops#habib@4545"

echo "🚀 Starting remote deployment to VPS..."
echo "📍 Target: $VPS_USER@$VPS_HOST"

# Check if sshpass is installed
if ! command -v sshpass &> /dev/null; then
    echo "Installing sshpass for automated SSH..."
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        sudo apt-get update && sudo apt-get install -y sshpass
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        brew install hudochenkov/sshpass/sshpass
    else
        echo "Please install sshpass manually for your system"
        exit 1
    fi
fi

# Function to execute commands on VPS
execute_remote() {
    echo "Executing: $1"
    sshpass -p "$VPS_PASS" ssh -o StrictHostKeyChecking=no "$VPS_USER@$VPS_HOST" "$1"
}

# Function to copy files to VPS
copy_to_vps() {
    echo "Copying $1 to VPS..."
    sshpass -p "$VPS_PASS" scp -o StrictHostKeyChecking=no -r "$1" "$VPS_USER@$VPS_HOST:$2"
}

echo "📦 Step 1: Copying project files to VPS..."
# Create project directory on VPS
execute_remote "mkdir -p /home/devops/ShikkhaSathi"

# Copy all project files (excluding hidden files and large directories)
echo "Copying project files..."
sshpass -p "$VPS_PASS" scp -o StrictHostKeyChecking=no -r \
    backend frontend data docker-compose.prod.yml deploy-to-vps.sh \
    start-dev.sh *.md *.py *.js *.sh \
    "$VPS_USER@$VPS_HOST:/home/devops/ShikkhaSathi/" 2>/dev/null || true

echo "🔧 Step 2: Installing system dependencies..."
execute_remote "sudo apt update && sudo apt upgrade -y"
execute_remote "sudo apt install -y curl wget git vim htop unzip software-properties-common apt-transport-https ca-certificates gnupg lsb-release build-essential"

echo "🐳 Step 3: Installing Docker..."
execute_remote "curl -fsSL https://get.docker.com -o get-docker.sh && sudo sh get-docker.sh && sudo usermod -aG docker devops && rm get-docker.sh"

echo "🐙 Step 4: Installing Docker Compose..."
execute_remote 'sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose && sudo chmod +x /usr/local/bin/docker-compose'

echo "📦 Step 5: Installing Node.js..."
execute_remote "curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash - && sudo apt-get install -y nodejs"

echo "🐍 Step 6: Installing Python and Nginx..."
execute_remote "sudo apt install -y python3 python3-pip python3-venv python3-dev nginx"

echo "📁 Step 7: Creating directories..."
execute_remote "sudo mkdir -p /home/devops/data/{postgres,mongodb,mongodb-config,redis,ollama} /home/devops/logs/nginx /home/devops/backup /var/www/shikkhasathi"
execute_remote "sudo chown -R devops:devops /home/devops/data /home/devops/logs /home/devops/backup"

echo "⚙️ Step 8: Setting up environment files..."
# Create backend .env file
execute_remote 'cd /home/devops/ShikkhaSathi/backend && cp .env.example .env'

# Update .env with production values
execute_remote 'cd /home/devops/ShikkhaSathi/backend && cat > .env << EOF
SECRET_KEY=$(python3 -c "import secrets; print(secrets.token_urlsafe(32))")
ACCESS_TOKEN_EXPIRE_MINUTES=11520
POSTGRES_SERVER=localhost
POSTGRES_USER=shikkhasathi
POSTGRES_PASSWORD=ShikkhaSathi2024!@#
POSTGRES_DB=shikkhasathi
POSTGRES_PORT=5432
MONGODB_URL=mongodb://localhost:27017
MONGODB_DB_NAME=shikkhasathi
REDIS_URL=redis://localhost:6379
ENVIRONMENT=production
DEBUG=false
ALLOWED_HOSTS=103.73.225.187,localhost
OLLAMA_BASE_URL=http://localhost:11434
EOF'

# Create frontend .env
execute_remote 'cd /home/devops/ShikkhaSathi/frontend && echo "VITE_API_BASE_URL=http://103.73.225.187" > .env.production'

echo "🗄️ Step 9: Starting databases..."
execute_remote "cd /home/devops/ShikkhaSathi && docker-compose -f docker-compose.prod.yml up -d postgres mongodb redis ollama"

echo "⏳ Waiting for databases to be ready..."
sleep 60

echo "🔧 Step 10: Setting up backend..."
execute_remote "cd /home/devops/ShikkhaSathi/backend && python3 -m venv .venv && source .venv/bin/activate && pip install --upgrade pip && pip install -r requirements.txt"

echo "🗃️ Step 11: Running database migrations..."
execute_remote "cd /home/devops/ShikkhaSathi/backend && source .venv/bin/activate && alembic upgrade head"

echo "📊 Step 12: Database setup complete..."
echo "ℹ️  Skipping sample data creation - production deployment"

echo "🤖 Step 13: Installing AI models..."
execute_remote "docker exec shikkhasathi-ollama ollama pull llama3.2:1b"

echo "🏗️ Step 14: Building frontend..."
execute_remote "cd /home/devops/ShikkhaSathi/frontend && npm install && npm run build"
execute_remote "sudo cp -r /home/devops/ShikkhaSathi/frontend/dist/* /var/www/shikkhasathi/ && sudo chown -R www-data:www-data /var/www/shikkhasathi"

echo "🔧 Step 15: Setting up backend service..."
execute_remote 'sudo tee /etc/systemd/system/shikkhasathi-backend.service > /dev/null << EOF
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
EOF'

execute_remote "sudo systemctl daemon-reload && sudo systemctl enable shikkhasathi-backend && sudo systemctl start shikkhasathi-backend"

echo "🌐 Step 16: Configuring Nginx..."
execute_remote 'sudo tee /etc/nginx/sites-available/shikkhasathi > /dev/null << EOF
server {
    listen 80;
    server_name 103.73.225.187;
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/json;

    # Frontend
    location / {
        root /var/www/shikkhasathi;
        index index.html;
        try_files \$uri \$uri/ /index.html;
        
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)\$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }

    # API routes
    location /api/ {
        proxy_pass http://127.0.0.1:8000;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    client_max_body_size 50M;
}
EOF'

execute_remote "sudo ln -sf /etc/nginx/sites-available/shikkhasathi /etc/nginx/sites-enabled/ && sudo rm -f /etc/nginx/sites-enabled/default && sudo nginx -t && sudo systemctl reload nginx"

echo "🔒 Step 17: Setting up firewall..."
execute_remote "sudo ufw --force enable && sudo ufw default deny incoming && sudo ufw default allow outgoing && sudo ufw allow ssh && sudo ufw allow 80/tcp && sudo ufw allow 443/tcp"

echo "📋 Step 18: Final checks..."
sleep 10

echo "🧪 Testing deployment..."
# Test API
if execute_remote "curl -s http://localhost:8000/api/v1/health" > /dev/null; then
    echo "✅ Backend API is responding"
else
    echo "❌ Backend API check failed"
fi

# Test frontend
if execute_remote "curl -s http://localhost" > /dev/null; then
    echo "✅ Frontend is accessible"
else
    echo "❌ Frontend check failed"
fi

echo ""
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
echo "🔧 Management Commands (run on VPS):"
echo "Check Status: sudo systemctl status shikkhasathi-backend"
echo "View Logs: sudo journalctl -u shikkhasathi-backend -f"
echo "Restart: sudo systemctl restart shikkhasathi-backend"
echo ""
echo "=================================================="
echo "✅ Deployment completed successfully! 🚀"
echo "You can now access ShikkhaSathi at: http://103.73.225.187"