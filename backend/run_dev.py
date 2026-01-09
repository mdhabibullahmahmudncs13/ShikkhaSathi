#!/usr/bin/env python3
"""
Development server for ShikkhaSathi
Runs with minimal dependencies using SQLite and mock services
"""

import sys
import os
import uvicorn
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

# Add the app directory to Python path
sys.path.append(os.path.join(os.path.dirname(__file__), 'app'))

# Import development configuration
from app.core.config_dev import dev_settings
from app.db.session_dev import create_tables

# Create FastAPI app
app = FastAPI(
    title="ShikkhaSathi API",
    description="AI-Powered Learning Platform for Bangladesh",
    version="1.0.0-dev",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=dev_settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Health check endpoint
@app.get("/")
async def root():
    return {
        "message": "ShikkhaSathi API - Development Mode",
        "version": "1.0.0-dev",
        "status": "running",
        "database": "SQLite (development)",
        "docs": "/docs"
    }

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "timestamp": "2025-01-09T00:00:00Z",
        "database": "connected",
        "mode": "development"
    }

# Basic API endpoints for testing
@app.get("/api/v1/status")
async def api_status():
    return {
        "api_version": "v1",
        "status": "operational",
        "features": {
            "authentication": "available",
            "database": "sqlite",
            "ai_services": "mock",
            "voice_services": "mock"
        }
    }

# Mock authentication endpoint
@app.post("/api/v1/auth/login")
async def login(credentials: dict):
    # Mock login for development
    email = credentials.get("email", "")
    password = credentials.get("password", "")
    
    # Mock users for testing
    mock_users = {
        "student1@example.com": {"role": "student", "name": "Student One"},
        "teacher1@example.com": {"role": "teacher", "name": "Teacher One"},
        "parent1@example.com": {"role": "parent", "name": "Parent One"},
        "admin@example.com": {"role": "admin", "name": "Admin User"}
    }
    
    if email in mock_users and password == "password123":
        user_data = mock_users[email]
        return {
            "access_token": f"mock_token_{email}",
            "token_type": "bearer",
            "user": {
                "id": hash(email) % 1000,
                "email": email,
                "name": user_data["name"],
                "role": user_data["role"],
                "is_active": True
            }
        }
    else:
        raise HTTPException(status_code=401, detail="Invalid credentials")

@app.get("/api/v1/auth/me")
async def get_current_user():
    # Mock current user for development
    return {
        "id": 1,
        "email": "student1@example.com",
        "name": "Student One",
        "role": "student",
        "is_active": True
    }

# Mock dashboard endpoints
@app.get("/api/v1/connect/student/dashboard")
async def student_dashboard():
    return {
        "user": {
            "id": 1,
            "name": "Student One",
            "email": "student1@example.com",
            "role": "student"
        },
        "stats": {
            "total_xp": 1250,
            "current_streak": 5,
            "completed_quizzes": 12,
            "average_score": 85.5
        },
        "recent_activities": [
            {"type": "quiz_completed", "subject": "Mathematics", "score": 90, "date": "2025-01-08"},
            {"type": "achievement_unlocked", "name": "Quiz Master", "date": "2025-01-07"},
            {"type": "streak_milestone", "days": 5, "date": "2025-01-06"}
        ],
        "available_quizzes": [
            {"id": 1, "title": "Basic Algebra", "subject": "Mathematics", "difficulty": "easy"},
            {"id": 2, "title": "English Grammar", "subject": "English", "difficulty": "medium"},
            {"id": 3, "title": "Bangladesh History", "subject": "History", "difficulty": "medium"}
        ]
    }

@app.get("/api/v1/connect/teacher/dashboard")
async def teacher_dashboard():
    return {
        "user": {
            "id": 2,
            "name": "Teacher One",
            "email": "teacher1@example.com",
            "role": "teacher"
        },
        "classes": [
            {
                "id": 1,
                "name": "Class 8A Mathematics",
                "subject": "Mathematics",
                "student_count": 25,
                "recent_activity": "Quiz assigned 2 hours ago"
            },
            {
                "id": 2,
                "name": "Class 9B Science",
                "subject": "Science",
                "student_count": 30,
                "recent_activity": "Assessment created yesterday"
            }
        ],
        "recent_activities": [
            {"type": "quiz_created", "title": "Algebra Basics", "class": "8A", "date": "2025-01-08"},
            {"type": "student_progress", "student": "John Doe", "improvement": "+15%", "date": "2025-01-07"}
        ],
        "analytics": {
            "total_students": 55,
            "active_quizzes": 8,
            "average_class_performance": 78.5,
            "pending_reviews": 12
        }
    }

@app.get("/api/v1/connect/parent/dashboard")
async def parent_dashboard():
    return {
        "user": {
            "id": 3,
            "name": "Parent One",
            "email": "parent1@example.com",
            "role": "parent"
        },
        "children": [
            {
                "id": 1,
                "name": "Child One",
                "class": "Grade 8",
                "school": "Dhaka High School",
                "performance": {
                    "overall_score": 85,
                    "recent_improvement": "+5%",
                    "subjects": {
                        "Mathematics": 90,
                        "English": 82,
                        "Science": 88,
                        "History": 80
                    }
                },
                "recent_activities": [
                    {"type": "quiz_completed", "subject": "Mathematics", "score": 95, "date": "2025-01-08"},
                    {"type": "achievement", "name": "Math Wizard", "date": "2025-01-07"}
                ]
            }
        ],
        "notifications": [
            {"type": "achievement", "message": "Your child earned a new achievement!", "date": "2025-01-08"},
            {"type": "progress", "message": "Weekly progress report available", "date": "2025-01-07"}
        ]
    }

# Initialize database on startup
@app.on_event("startup")
async def startup_event():
    print("🚀 Starting ShikkhaSathi Development Server...")
    print("📊 Creating database tables...")
    try:
        create_tables()
        print("✅ Database initialized successfully")
    except Exception as e:
        print(f"⚠️  Database initialization warning: {e}")
    
    print("🌐 Server ready!")
    print(f"📖 API Documentation: http://localhost:8000/docs")
    print(f"🔍 API Explorer: http://localhost:8000/redoc")

if __name__ == "__main__":
    print("🎓 ShikkhaSathi - AI-Powered Learning Platform")
    print("🔧 Development Mode - Using SQLite and Mock Services")
    print("=" * 50)
    
    uvicorn.run(
        "run_dev:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )