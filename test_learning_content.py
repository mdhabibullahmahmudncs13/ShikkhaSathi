#!/usr/bin/env python3
"""
Test script to check learning content API
"""

import requests
import json

# API base URL
BASE_URL = "http://localhost:8000/api/v1"

def login_and_get_token():
    """Login and get access token"""
    # Try the sample data accounts first
    login_accounts = [
        {"email": "student1@shikkhasathi.com", "password": "student123"},
        {"email": "student1@example.com", "password": "password123"}
    ]
    
    for login_data in login_accounts:
        response = requests.post(f"{BASE_URL}/auth/login", json=login_data)
        if response.status_code == 200:
            return response.json()["access_token"]
        else:
            print(f"Login failed for {login_data['email']}: {response.status_code}")
    
    print("All login attempts failed")
    return None
    if response.status_code == 200:
        return response.json()["access_token"]
    else:
        print(f"Login failed: {response.status_code} - {response.text}")
        return None

def test_learning_arenas(token):
    """Test the learning arenas endpoint"""
    headers = {"Authorization": f"Bearer {token}"}
    
    response = requests.get(f"{BASE_URL}/learning/arenas", headers=headers)
    print(f"Learning Arenas Response: {response.status_code}")
    
    if response.status_code == 200:
        data = response.json()
        print(f"Found {len(data.get('arenas', []))} arenas")
        for arena in data.get('arenas', []):
            print(f"  - {arena.get('name', 'Unknown')} ({arena.get('subject', 'Unknown')})")
    else:
        print(f"Error: {response.text}")

def test_textbooks():
    """Test the textbooks endpoint (if it doesn't require auth)"""
    try:
        response = requests.get(f"{BASE_URL}/learning/textbooks")
        print(f"Textbooks Response: {response.status_code}")
        
        if response.status_code == 200:
            textbooks = response.json()
            print(f"Found {len(textbooks)} textbooks:")
            for textbook in textbooks:
                print(f"  - {textbook}")
        else:
            print(f"Error: {response.text}")
    except Exception as e:
        print(f"Error testing textbooks: {e}")

def main():
    print("🧪 Testing Learning Content API...")
    
    # Test textbooks first (might not need auth)
    print("\n1. Testing textbooks endpoint:")
    test_textbooks()
    
    # Login and test arenas
    print("\n2. Testing learning arenas:")
    token = login_and_get_token()
    if token:
        test_learning_arenas(token)
    else:
        print("Could not get authentication token")

if __name__ == "__main__":
    main()