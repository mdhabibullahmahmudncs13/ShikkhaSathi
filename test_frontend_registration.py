#!/usr/bin/env python3
"""
Test script to simulate the exact registration data from the frontend
"""
import requests
import json

# API base URL
BASE_URL = "http://localhost:8000/api/v1"

def test_frontend_registration():
    """Test registration with data that would come from the frontend form"""
    
    # Simulate the registration data from the frontend form
    # Based on the screenshot, the user filled out a multi-step form
    registration_data = {
        "email": "loner@ntraq.clan",
        "password": "Habibag2001",
        "full_name": "Test User",  # This would come from step 1
        "phone": "01712345678",    # This would come from step 1
        "date_of_birth": "2000-01-01",  # This would come from step 1
        "school": "Test School",   # This would come from step 2
        "district": "ঢাকা",        # This would come from step 2
        "grade": 10,               # This would come from step 2
        "medium": "bangla",        # This would come from step 2
        "role": "student"          # Default role
    }
    
    print("🧪 Testing Frontend Registration Data")
    print("=" * 50)
    print("Registration Data:")
    for key, value in registration_data.items():
        if key == "password":
            print(f"   {key}: {'*' * len(str(value))}")
        else:
            print(f"   {key}: {value}")
    
    try:
        print("\n📝 Attempting registration...")
        response = requests.post(f"{BASE_URL}/auth/register", json=registration_data)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 201:
            print("✅ Registration successful!")
            user_data = response.json()
            print("Created User:")
            print(f"   ID: {user_data.get('id')}")
            print(f"   Email: {user_data.get('email')}")
            print(f"   Full Name: {user_data.get('full_name')}")
            print(f"   Phone: {user_data.get('phone')}")
            print(f"   School: {user_data.get('school')}")
            print(f"   District: {user_data.get('district')}")
            print(f"   Grade: {user_data.get('grade')}")
            print(f"   Medium: {user_data.get('medium')}")
            
            # Now test login
            print("\n🔐 Testing login with registered user...")
            login_data = {
                "email": registration_data["email"],
                "password": registration_data["password"]
            }
            
            login_response = requests.post(f"{BASE_URL}/auth/login", json=login_data)
            if login_response.status_code == 200:
                print("✅ Login successful!")
                token_data = login_response.json()
                print(f"   Access Token: {token_data.get('access_token')[:50]}...")
                return True
            else:
                print("❌ Login failed after registration!")
                print(f"   Error: {login_response.text}")
                return False
                
        elif response.status_code == 400:
            print("❌ Registration failed - Validation Error!")
            error_data = response.json()
            print(f"   Error: {error_data}")
            
            # Check if it's because user already exists
            if "already exists" in str(error_data):
                print("   💡 User already exists, testing login...")
                login_data = {
                    "email": registration_data["email"],
                    "password": registration_data["password"]
                }
                
                login_response = requests.post(f"{BASE_URL}/auth/login", json=login_data)
                if login_response.status_code == 200:
                    print("✅ Login successful with existing user!")
                    return True
                else:
                    print("❌ Login failed with existing user!")
                    print(f"   Error: {login_response.text}")
                    return False
            else:
                print("   💡 Check validation requirements:")
                print("      - Email format")
                print("      - Password strength")
                print("      - Phone number format")
                print("      - Required fields")
                return False
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

if __name__ == "__main__":
    success = test_frontend_registration()
    
    print("\n" + "=" * 50)
    if success:
        print("🎉 Frontend registration and login flow works correctly!")
    else:
        print("💥 There's an issue with the registration/login flow.")
        print("   Check the backend logs for more details.")
    print("=" * 50)