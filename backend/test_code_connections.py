#!/usr/bin/env python3
"""
Simple test script for code connection system
"""

import requests
import json

BASE_URL = "http://localhost:8000/api/v1"

def test_health():
    """Test if API is running"""
    response = requests.get(f"{BASE_URL}/health")
    print(f"Health check: {response.status_code} - {response.json()}")
    return response.status_code == 200

def test_code_endpoints():
    """Test if code connection endpoints are available"""
    # Test endpoints without authentication (should get 401/403)
    endpoints = [
        "/connect/my-classes",
        "/connect/my-connections"
    ]
    
    for endpoint in endpoints:
        try:
            response = requests.get(f"{BASE_URL}{endpoint}")
            print(f"Endpoint {endpoint}: {response.status_code}")
            if response.status_code in [401, 403]:
                print(f"  ✓ Endpoint exists and requires authentication")
            else:
                print(f"  ⚠ Unexpected status code: {response.status_code}")
        except Exception as e:
            print(f"  ✗ Error testing {endpoint}: {e}")

def main():
    print("🧪 Testing ShikkhaSathi Code Connection System")
    print("=" * 50)
    
    if test_health():
        print("✅ Backend is running")
        test_code_endpoints()
    else:
        print("❌ Backend is not responding")

if __name__ == "__main__":
    main()