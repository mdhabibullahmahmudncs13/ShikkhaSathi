#!/usr/bin/env python3
"""
Debug script to identify the password hashing/verification issue
"""
import requests
import json
import hashlib
import secrets

# API base URL
BASE_URL = "http://localhost:8000/api/v1"

def test_password_hashing():
    """Test password hashing and verification logic"""
    
    print("🔍 Debugging Password Hashing Issue")
    print("=" * 60)
    
    # Test password
    test_password = "TestDebugPassword123!"
    
    # Test 1: Create a new user with a known password
    print("\n1️⃣ Creating a new test user...")
    
    test_user = {
        "email": f"debug_user_{secrets.token_hex(4)}@example.com",
        "password": test_password,
        "full_name": "Debug User",
        "phone": "01712345678",
        "date_of_birth": "2000-01-01",
        "school": "Debug School",
        "district": "ঢাকা",
        "grade": 10,
        "medium": "bangla",
        "role": "student"
    }
    
    try:
        # Register the user
        response = requests.post(f"{BASE_URL}/auth/register", json=test_user)
        print(f"Registration Status: {response.status_code}")
        
        if response.status_code == 201:
            print("✅ User created successfully!")
            user_data = response.json()
            print(f"   User ID: {user_data.get('id')}")
            print(f"   Email: {user_data.get('email')}")
            
            # Test 2: Immediately try to login with the same password
            print("\n2️⃣ Testing immediate login...")
            login_data = {
                "email": test_user["email"],
                "password": test_password
            }
            
            login_response = requests.post(f"{BASE_URL}/auth/login", json=login_data)
            print(f"Login Status: {login_response.status_code}")
            
            if login_response.status_code == 200:
                print("✅ Login successful! Password hashing/verification is working.")
                token_data = login_response.json()
                print(f"   Access Token: {token_data.get('access_token')[:50]}...")
                return True
            else:
                print("❌ Login failed immediately after registration!")
                print(f"   Error: {login_response.json()}")
                
                # Test 3: Try with different password variations
                print("\n3️⃣ Testing password variations...")
                variations = [
                    test_password.lower(),
                    test_password.upper(),
                    test_password.strip(),
                    test_password + " ",
                    " " + test_password
                ]
                
                for i, variation in enumerate(variations):
                    print(f"   Testing variation {i+1}: {'*' * len(variation)}")
                    var_login = {
                        "email": test_user["email"],
                        "password": variation
                    }
                    var_response = requests.post(f"{BASE_URL}/auth/login", json=var_login)
                    if var_response.status_code == 200:
                        print(f"   ✅ Variation {i+1} worked!")
                        return True
                    else:
                        print(f"   ❌ Variation {i+1} failed")
                
                return False
        else:
            print("❌ User creation failed!")
            print(f"   Error: {response.json()}")
            return False
            
    except Exception as e:
        print(f"❌ Error during testing: {e}")
        return False

def test_existing_user_login():
    """Test login with the existing problematic user"""
    
    print("\n" + "=" * 60)
    print("🔍 Testing Existing User Login")
    print("=" * 60)
    
    # The problematic credentials from the frontend
    existing_user = {
        "email": "loner@ntraq.clan",
        "password": "Habibag2001"
    }
    
    print(f"Email: {existing_user['email']}")
    print(f"Password: {'*' * len(existing_user['password'])}")
    
    # Test different password variations for the existing user
    password_variations = [
        existing_user["password"],
        existing_user["password"].lower(),
        existing_user["password"].upper(),
        existing_user["password"].strip(),
        existing_user["password"] + " ",
        " " + existing_user["password"],
        "Habibag2001",  # Exact case
        "habibag2001",  # All lowercase
        "HABIBAG2001",  # All uppercase
    ]
    
    print(f"\n🔐 Testing {len(password_variations)} password variations...")
    
    for i, password in enumerate(password_variations):
        print(f"\nVariation {i+1}: {'*' * len(password)}")
        
        login_data = {
            "email": existing_user["email"],
            "password": password
        }
        
        try:
            response = requests.post(f"{BASE_URL}/auth/login", json=login_data)
            if response.status_code == 200:
                print("✅ SUCCESS! This password variation works!")
                token_data = response.json()
                print(f"   Access Token: {token_data.get('access_token')[:50]}...")
                return True
            else:
                print(f"❌ Failed (Status: {response.status_code})")
        except Exception as e:
            print(f"❌ Error: {e}")
    
    print("\n💡 None of the password variations worked.")
    print("   This suggests the user might have been created with a different password")
    print("   or there's a fundamental issue with password verification.")
    
    return False

def suggest_solutions():
    """Suggest potential solutions"""
    
    print("\n" + "=" * 60)
    print("💡 SUGGESTED SOLUTIONS")
    print("=" * 60)
    
    solutions = [
        "1. Reset the user's password in the database",
        "2. Delete the existing user and re-register",
        "3. Check if bcrypt is properly installed and working",
        "4. Verify the password hashing algorithm consistency",
        "5. Check for any character encoding issues",
        "6. Enable debug logging in the backend auth service"
    ]
    
    for solution in solutions:
        print(f"   {solution}")
    
    print("\n🔧 Quick Fix Command:")
    print("   # Delete the problematic user from database")
    print("   # Then try registration again from the frontend")

if __name__ == "__main__":
    print("🚀 Starting Password Debug Session")
    
    # Test 1: Create new user and test immediately
    new_user_works = test_password_hashing()
    
    # Test 2: Test existing problematic user
    existing_user_works = test_existing_user_login()
    
    # Summary
    print("\n" + "=" * 60)
    print("📊 DEBUG SUMMARY")
    print("=" * 60)
    
    if new_user_works:
        print("✅ New user registration and login: WORKING")
    else:
        print("❌ New user registration and login: BROKEN")
    
    if existing_user_works:
        print("✅ Existing user login: WORKING")
    else:
        print("❌ Existing user login: BROKEN")
    
    if new_user_works and not existing_user_works:
        print("\n🎯 DIAGNOSIS: The existing user has a corrupted password hash.")
        print("   SOLUTION: Delete and re-register the user.")
    elif not new_user_works:
        print("\n🎯 DIAGNOSIS: Fundamental password hashing issue.")
        print("   SOLUTION: Fix the password hashing/verification code.")
    else:
        print("\n🎯 DIAGNOSIS: Everything is working correctly!")
    
    suggest_solutions()