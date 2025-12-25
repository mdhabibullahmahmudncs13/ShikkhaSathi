#!/usr/bin/env python3
"""
Test script to verify registration and login functionality
"""
import requests
import json

# API base URL
BASE_URL = "http://localhost:8000/api/v1"

def test_registration_and_login():
    """Test the complete registration and login flow"""
    
    # Test data
    test_user = {
        "email": "newtestuser@example.com",  # Changed email to avoid conflict
        "password": "TestPassword123!",
        "full_name": "New Test User",
        "phone": "01712345679",
        "date_of_birth": "2000-01-01",
        "school": "Test School",
        "district": "ঢাকা",
        "grade": 10,
        "medium": "bangla",
        "role": "student"
    }
    
    print("🧪 Testing Registration and Login Flow")
    print("=" * 50)
    
    # Test 1: Registration
    print("\n1️⃣ Testing Registration...")
    try:
        response = requests.post(f"{BASE_URL}/auth/register", json=test_user)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 201:
            print("✅ Registration successful!")
            user_data = response.json()
            print(f"   User ID: {user_data.get('id')}")
            print(f"   Email: {user_data.get('email')}")
            print(f"   Full Name: {user_data.get('full_name')}")
            print(f"   Phone: {user_data.get('phone')}")
            print(f"   School: {user_data.get('school')}")
            print(f"   District: {user_data.get('district')}")
        elif response.status_code == 400 and "already exists" in response.text:
            print("⚠️  User already exists, testing login with existing user...")
            # Try with the original email that might exist
            test_user["email"] = "testuser@example.com"
        else:
            print("❌ Registration failed!")
            print(f"   Error: {response.text}")
            return False
            
    except requests.exceptions.ConnectionError:
        print("❌ Cannot connect to backend server!")
        print("   Make sure the backend server is running on http://localhost:8000")
        return False
    except Exception as e:
        print(f"❌ Registration error: {e}")
        return False
    
    # Test 2: Login
    print("\n2️⃣ Testing Login...")
    try:
        login_data = {
            "email": test_user["email"],
            "password": test_user["password"]
        }
        
        response = requests.post(f"{BASE_URL}/auth/login", json=login_data)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            print("✅ Login successful!")
            token_data = response.json()
            access_token = token_data.get('access_token')
            print(f"   Access Token: {access_token[:50]}...")
            
            # Test 3: Get current user info
            print("\n3️⃣ Testing Get Current User...")
            headers = {"Authorization": f"Bearer {access_token}"}
            response = requests.get(f"{BASE_URL}/auth/me", headers=headers)
            
            if response.status_code == 200:
                print("✅ Get current user successful!")
                user_info = response.json()
                print(f"   User: {user_info.get('full_name')} ({user_info.get('email')})")
                print(f"   Role: {user_info.get('role')}")
                print(f"   Grade: {user_info.get('grade')}")
                print(f"   Medium: {user_info.get('medium')}")
                return True
            else:
                print("❌ Get current user failed!")
                print(f"   Error: {response.text}")
                return False
                
        else:
            print("❌ Login failed!")
            print(f"   Error: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Login error: {e}")
        return False

if __name__ == "__main__":
    success = test_registration_and_login()
    
    print("\n" + "=" * 50)
    if success:
        print("🎉 All tests passed! Registration and login are working correctly.")
    else:
        print("💥 Some tests failed. Check the backend server and database.")
    print("=" * 50)