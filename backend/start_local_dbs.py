#!/usr/bin/env python3
"""
Start lightweight local databases for development without Docker
Uses embedded/in-memory alternatives:
- SQLite for PostgreSQL
- mongomock for MongoDB  
- fakeredis for Redis
"""

import subprocess
import sys
import os
import time

def start_mongodb():
    """Start MongoDB using mongod if available, otherwise use mongomock"""
    print("🔧 Starting MongoDB...")
    try:
        # Try to start actual mongod
        subprocess.Popen(['mongod', '--dbpath', './data/mongodb', '--port', '27017'], 
                        stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        print("✅ MongoDB started on port 27017")
        return True
    except FileNotFoundError:
        print("⚠️  mongod not found - will use mongomock in-memory database")
        return False

def start_redis():
    """Start Redis using redis-server if available"""
    print("🔧 Starting Redis...")
    try:
        subprocess.Popen(['redis-server', '--port', '6379'], 
                        stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        print("✅ Redis started on port 6379")
        return True
    except FileNotFoundError:
        print("⚠️  redis-server not found - will use fakeredis in-memory database")
        return False

def start_postgresql():
    """PostgreSQL info - using SQLite as alternative"""
    print("⚠️  PostgreSQL not available - using SQLite database at ./data/shikkhasathi.db")
    os.makedirs('./data', exist_ok=True)
    return False

if __name__ == "__main__":
    print("🚀 Starting Local Development Databases...\n")
    
    start_postgresql()
    start_mongodb()
    start_redis()
    
    print("\n✅ Database setup complete!")
    print("\nNote: This uses lightweight alternatives for development.")
    print("For full production setup, use Docker containers with docker-compose.")
