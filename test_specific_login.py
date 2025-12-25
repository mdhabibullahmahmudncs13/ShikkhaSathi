#!/usr/bin/env python3
"""
Test script to verify login with specific credentials from the frontend
"""
import requests
import json

# API base URL
BASE_URL = "http://localhost:8000/api/v1"

def test_specific_login():
    """Test login with the credentials from the screenshot"""
    
    # Credentials from the screenshot
    login_data = {
        "email": "loner@ntraq.clan",
        "password": "Habibag2001"
    }
    
    print("🧪 Testing Login with Frontend Credentials")
    print("=" * 50)
    print(f"Email: {login_data['email']}")
    print(f"Password: {'*' * len(login_data['password'])}")
    
    try:
        print("\n🔐 Attempting login...")
        response = requests.post(f"{BASE_URL}/auth/login", json=login_data)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            print("✅ Login successful!")
            token_data = response.json()
            access_token = token_data.get('access_token')
            print(f"   Access Token: {access_token[:50]}...")
            
            # Get user info
            print("\n👤 Getting user info...")
            headers = {"Authorization": f"Bearer {access_token}"}
            response = requests.get(f"{BASE_URL}/auth/me", headers=headers)
            
            if response.status_code == 200:
                print("✅ User info retrieved!")
                user_info = response.json()
                print(f"   Name: {user_info.get('full_name')}")
                print(f"   Email: {user_info.get('email')}")
                print(f"   Role: {user_info.get('role')}")
                print(f"   Grade: {user_info.get('grade')}")
                print(f"   Phone: {user_info.get('phone')}")
                print(f"   School: {user_info.get('school')}")
                print(f"   District: {user_info.get('district')}")
                return True
            else:
                print("❌ Failed to get user info!")
                print(f"   Error: {response.text}")
                return False
                
        else:
            print("❌ Login failed!")
            error_data = response.json() if response.headers.get('content-type') == 'application/json' else response.text
            print(f"   Error: {error_data}")
            
            # Check if user exists
            print("\n🔍 Checking if user exists...")
            # We can't directly check user existence, but we can try to register with same email
            test_registration = {
                "email": login_data["email"],
                "password": "TempPassword123!",
                "full_name": "Test User",
                "role": "student"
            }
            
            reg_response = requests.post(f"{BASE_URL}/auth/register", json=test_registration)
            if reg_response.status_code == 400 and "already exists" in reg_response.text:
                print("   ✅ User exists in database")
                print("   ❌ But password verification failed")
                print("   💡 This suggests a password hashing/verification issue")
            else:
                print("   ❌ User might not exist in database")
                print("   💡 Registration might have failed silently")
            
            return False
            
    except requests.exceptions.ConnectionError:
        print("❌ Cannot connect to backend server!")
        print("   Make sure the backend server is running on http://localhost:8000")
        return False
    except Exception as e:
        print(f"❌ Login error: {e}")
        return False

if __name__ == "__main__":
    success = test_specific_login()
    
    print("\n" + "=" * 50)
    if success:
        print("🎉 Login test passed! The credentials work correctly.")
    else:
        print("💥 Login test failed. There might be an issue with:")
        print("   - Password hashing/verification")
        print("   - User registration process")
        print("   - Database connection")
    print("=" * 50)