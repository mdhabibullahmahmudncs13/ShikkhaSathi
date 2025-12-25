#!/bin/bash

# Fresh deployment script for ShikkhaSathi from GitHub
set -e

VPS_HOST="103.73.225.187"
VPS_USER="devops"
VPS_PASS="devops#habib@4545"
GITHUB_REPO="https://github.com/mdhabibullahmahmudncs13/ShikkhaSathi.git"
PROJECT_DIR="ShikkhaSathi"

echo "🚀 Starting fresh ShikkhaSathi deployment from GitHub..."

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

echo "🧹 Cleaning up existing deployment..."
execute_remote "sudo docker-compose -f /home/devops/$PROJECT_DIR/docker-compose.yml down --volumes --remove-orphans 2>/dev/null || true"
execute_remote "sudo docker system prune -af"
execute_remote "rm -rf /home/devops/$PROJECT_DIR"

echo "📥 Cloning fresh repository from GitHub..."
execute_remote "cd /home/devops && git clone $GITHUB_REPO"

echo "🐳 Installing Docker and Docker Compose..."
execute_remote "
    # Update system
    sudo apt-get update
    
    # Install Docker if not present
    if ! command -v docker &> /dev/null; then
        curl -fsSL https://get.docker.com -o get-docker.sh
        sudo sh get-docker.sh
        sudo usermod -aG docker devops
        rm get-docker.sh
    fi
    
    # Install Docker Compose if not present
    if ! command -v docker-compose &> /dev/null; then
        sudo curl -L \"https://github.com/docker/compose/releases/download/v2.24.0/docker-compose-\$(uname -s)-\$(uname -m)\" -o /usr/local/bin/docker-compose
        sudo chmod +x /usr/local/bin/docker-compose
    fi
"

echo "🔧 Setting up environment and configuration..."
execute_remote "
    cd /home/devops/$PROJECT_DIR
    
    # Create environment file for backend
    cat > backend/.env << 'EOF'
DATABASE_URL=postgresql://shikshasathi:shikshasathi123@localhost:5432/shikshasathi_db
MONGODB_URL=mongodb://localhost:27017/shikshasathi
REDIS_URL=redis://localhost:6379
SECRET_KEY=your-super-secret-key-change-in-production
OPENAI_API_KEY=your-openai-api-key
PINECONE_API_KEY=your-pinecone-api-key
PINECONE_ENVIRONMENT=your-pinecone-environment
ELEVENLABS_API_KEY=your-elevenlabs-api-key
CORS_ORIGINS=[\"http://localhost:3000\",\"http://103.73.225.187:3000\",\"http://103.73.225.187\"]
EOF
    
    # Make scripts executable
    chmod +x *.sh
"

echo "🚀 Starting database services..."
execute_remote "
    cd /home/devops/$PROJECT_DIR
    sudo docker-compose up -d postgres mongodb redis
    
    # Wait for databases to be ready
    echo 'Waiting for databases to start...'
    sleep 30
    
    # Check database status
    sudo docker-compose ps
"

echo "🔧 Setting up Python backend..."
execute_remote "
    cd /home/devops/$PROJECT_DIR/backend
    
    # Install Python and pip if not present
    sudo apt-get install -y python3 python3-pip python3-venv
    
    # Create virtual environment
    python3 -m venv venv
    source venv/bin/activate
    
    # Install dependencies
    pip install --upgrade pip
    pip install -r requirements.txt
    
    # Run database migrations
    alembic upgrade head || echo 'Migration failed, continuing...'
"

echo "🌐 Setting up Node.js frontend..."
execute_remote "
    # Install Node.js if not present
    if ! command -v node &> /dev/null; then
        curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
        sudo apt-get install -y nodejs
    fi
    
    cd /home/devops/$PROJECT_DIR/frontend
    
    # Install dependencies
    npm install
    
    # Build frontend
    npm run build
"

echo "🔧 Setting up Nginx..."
execute_remote "
    # Install Nginx
    sudo apt-get install -y nginx
    
    # Create Nginx configuration
    sudo tee /etc/nginx/sites-available/shikshasathi << 'EOF'
server {
    listen 80;
    server_name 103.73.225.187;
    
    # Frontend
    location / {
        root /home/devops/ShikkhaSathi/frontend/dist;
        try_files \$uri \$uri/ /index.html;
        index index.html;
    }
    
    # Backend API
    location /api/ {
        proxy_pass http://localhost:8001;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
    
    # WebSocket support
    location /ws {
        proxy_pass http://localhost:8001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection \"upgrade\";
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
EOF
    
    # Enable site
    sudo ln -sf /etc/nginx/sites-available/shikshasathi /etc/nginx/sites-enabled/
    sudo rm -f /etc/nginx/sites-enabled/default
    
    # Test and reload Nginx
    sudo nginx -t
    sudo systemctl reload nginx
    sudo systemctl enable nginx
"

echo "🚀 Starting backend service..."
execute_remote "
    cd /home/devops/$PROJECT_DIR/backend
    
    # Create systemd service for backend
    sudo tee /etc/systemd/system/shikshasathi-backend.service << 'EOF'
[Unit]
Description=ShikkhaSathi Backend Service
After=network.target

[Service]
Type=simple
User=devops
WorkingDirectory=/home/devops/ShikkhaSathi/backend
Environment=PATH=/home/devops/ShikkhaSathi/backend/venv/bin
ExecStart=/home/devops/ShikkhaSathi/backend/venv/bin/python -m uvicorn app.main:app --host 0.0.0.0 --port 8001
Restart=always
RestartSec=3

[Install]
WantedBy=multi-user.target
EOF
    
    # Enable and start the service
    sudo systemctl daemon-reload
    sudo systemctl enable shikshasathi-backend
    sudo systemctl start shikshasathi-backend
    
    # Check service status
    sudo systemctl status shikshasathi-backend --no-pager
"

echo "🔍 Final deployment verification..."
execute_remote "
    echo '=== Docker Services ==='
    sudo docker-compose -f /home/devops/$PROJECT_DIR/docker-compose.yml ps
    
    echo '=== Backend Service ==='
    sudo systemctl status shikshasathi-backend --no-pager
    
    echo '=== Nginx Status ==='
    sudo systemctl status nginx --no-pager
    
    echo '=== Port Check ==='
    sudo netstat -tlnp | grep -E ':(80|8001|5432|27017|6379)'
    
    echo '=== Backend Health Check ==='
    curl -f http://localhost:8001/health || echo 'Backend health check failed'
"

echo "✅ Deployment completed!"
echo "🌐 Application should be available at: http://103.73.225.187"
echo "🔧 Backend API available at: http://103.73.225.187/api"
echo ""
echo "📋 Next steps:"
echo "1. Configure your API keys in backend/.env"
echo "2. Test the application functionality"
echo "3. Set up SSL certificate for production"
echo "4. Configure monitoring and backups"