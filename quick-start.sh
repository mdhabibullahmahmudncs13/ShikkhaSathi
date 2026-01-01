#!/bin/bash

# ShikkhaSathi Quick Start Script
# For users who already have Python, Node.js, and Docker installed

set -e

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

echo -e "${BLUE}🚀 ShikkhaSathi Quick Start${NC}\n"

# 1. Start databases
print_status "Starting database services..."
chmod +x start-databases.sh
./start-databases.sh

# 2. Setup backend
print_status "Setting up backend..."
cd backend

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    python3 -m venv venv
fi

# Activate virtual environment and install dependencies
source venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    cp .env.example .env
    print_warning "Created .env file - please update with your API keys"
fi

# Run migrations
print_status "Running database migrations..."
alembic upgrade head

# Fix teacher profiles
if [ -f fix_teacher_profiles.py ]; then
    print_status "Fixing teacher profiles..."
    python fix_teacher_profiles.py
fi

cd ..

# 3. Setup frontend
print_status "Setting up frontend..."
cd frontend
npm install
cd ..

print_success "Setup completed!"

echo -e "\n${GREEN}🎉 Ready to start ShikkhaSathi!${NC}\n"

echo -e "${BLUE}To start the application:${NC}"
echo -e "1. Backend: ${YELLOW}cd backend && source venv/bin/activate && python run.py${NC}"
echo -e "2. Frontend: ${YELLOW}cd frontend && npm run dev${NC} (in a new terminal)"
echo -e ""
echo -e "${BLUE}Access:${NC}"
echo -e "• App: ${GREEN}http://localhost:5173${NC}"
echo -e "• API: ${GREEN}http://localhost:8000/docs${NC}"
echo -e ""
echo -e "${BLUE}Test accounts:${NC}"
echo -e "• Teacher: ${YELLOW}teacher1@example.com / password123${NC}"
echo -e "• Student: ${YELLOW}student1@example.com / password123${NC}"