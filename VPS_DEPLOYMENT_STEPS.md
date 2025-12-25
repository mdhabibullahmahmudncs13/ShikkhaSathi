# ShikkhaSathi VPS Deployment Steps

## 🔐 VPS Connection Details
- **IP**: 103.73.225.187
- **Username**: devops
- **Password**: devops#habib@4545

## 🚀 Quick Deployment Steps

### Step 1: Connect to VPS
```bash
ssh devops@103.73.225.187
# Enter password: devops#habib@4545
```

### Step 2: Upload Project Files
You have two options:

#### Option A: Upload via SCP (from your local machine)
```bash
# From your local machine where ShikkhaSathi project is located
scp -r . devops@103.73.225.187:/home/devops/ShikkhaSathi/
```

#### Option B: Clone from Git Repository (recommended)
```bash
# On the VPS, clone your repository
cd /home/devops
git clone <your-repository-url> ShikkhaSathi
```

### Step 3: Run Deployment Script
```bash
# On the VPS
cd /home/devops/ShikkhaSathi
chmod +x deploy-to-vps.sh
./deploy-to-vps.sh
```

## 📋 What the Deployment Script Does

1. **System Setup**
   - Updates Ubuntu packages
   - Installs Docker, Docker Compose, Node.js, Python, Nginx

2. **Project Setup**
   - Creates necessary directories
   - Sets up environment files
   - Configures production settings

3. **Database Setup**
   - Starts PostgreSQL, MongoDB, Redis containers
   - Runs database migrations
   - Creates sample data

4. **AI Models Setup**
   - Installs Ollama with llama3.2:1b model
   - Sets up local voice processing

5. **Application Deployment**
   - Builds React frontend
   - Sets up FastAPI backend service
   - Configures Nginx reverse proxy

6. **Security & Monitoring**
   - Configures firewall
   - Sets up automated backups
   - Enables system monitoring

## 🌐 Access URLs After Deployment

- **Main Application**: http://103.73.225.187
- **API Documentation**: http://103.73.225.187/api/v1/docs
- **API Health Check**: http://103.73.225.187/api/v1/health

## 🔑 Test Accounts

- **Student**: student1@shikkhasathi.com / student123
- **Teacher**: teacher1@shikkhasathi.com / teacher123
- **Parent**: parent1@shikkhasathi.com / parent123

## 🛠️ Management Commands

### Check Service Status
```bash
# Backend service
sudo systemctl status shikkhasathi-backend

# Nginx
sudo systemctl status nginx

# Docker containers
docker ps
```

### View Logs
```bash
# Backend logs
sudo journalctl -u shikkhasathi-backend -f

# Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### Restart Services
```bash
# Restart backend
sudo systemctl restart shikkhasathi-backend

# Restart Nginx
sudo systemctl restart nginx

# Restart databases
docker-compose -f docker-compose.prod.yml restart
```

### Update Application
```bash
cd /home/devops/ShikkhaSathi
git pull origin main

# Rebuild frontend
cd frontend
npm run build
sudo cp -r dist/* /var/www/shikkhasathi/

# Restart backend
sudo systemctl restart shikkhasathi-backend
```

## 🔧 Troubleshooting

### If Backend Won't Start
```bash
# Check logs
sudo journalctl -u shikkhasathi-backend -n 50

# Check if databases are running
docker ps

# Restart databases if needed
docker-compose -f docker-compose.prod.yml restart
```

### If Frontend Shows 404
```bash
# Check Nginx configuration
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx

# Check if files exist
ls -la /var/www/shikkhasathi/
```

### If API Returns 500 Errors
```bash
# Check database connections
docker exec shikkhasathi-postgres psql -U shikkhasathi -c "SELECT 1;"
docker exec shikkhasathi-mongodb mongosh --eval "db.runCommand('ping')"

# Check backend environment
cd /home/devops/ShikkhaSathi/backend
cat .env
```

## 📊 Performance Monitoring

### System Resources
```bash
# CPU and Memory usage
htop

# Disk usage
df -h

# Docker container stats
docker stats
```

### Application Performance
```bash
# API response time test
curl -w "@curl-format.txt" -o /dev/null -s http://localhost:8000/api/v1/health

# Database performance
docker exec shikkhasathi-postgres psql -U shikkhasathi -c "SELECT count(*) FROM pg_stat_activity;"
```

## 🔒 Security Notes

1. **Firewall**: Only ports 22 (SSH), 80 (HTTP), and 443 (HTTPS) are open
2. **Database**: Databases are only accessible locally
3. **Rate Limiting**: API endpoints have rate limiting enabled
4. **Backups**: Automated daily backups at 2 AM

## 📞 Support

If you encounter issues:

1. Check the logs first
2. Verify all services are running
3. Test database connections
4. Check firewall rules
5. Review Nginx configuration

The deployment script includes comprehensive error checking and will provide detailed output for troubleshooting.

## 🎯 Next Steps After Deployment

1. **Domain Setup** (Optional)
   - Point your domain to 103.73.225.187
   - Update Nginx configuration with your domain
   - Set up SSL certificate with Let's Encrypt

2. **Email Configuration**
   - Configure SMTP settings in backend/.env
   - Test email notifications

3. **Monitoring Setup**
   - Set up log monitoring
   - Configure alerts for system issues

4. **Content Management**
   - Upload additional NCTB textbooks
   - Configure learning content

Your ShikkhaSathi platform will be fully operational after running the deployment script! 🚀