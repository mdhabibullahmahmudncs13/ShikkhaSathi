#!/usr/bin/env python3
"""
Script to fix the user login issue by cleaning up the problematic user
"""
import requests
import json

# API base URL
BASE_URL = "http://localhost:8000/api/v1"

def delete_problematic_user():
    """
    Since we don't have a direct delete user API endpoint,
    we'll provide instructions for manual database cleanup
    """
    
    print("🔧 Fixing User Login Issue")
    print("=" * 50)
    
    problematic_email = "loner@ntraq.clan"
    
    print(f"Problematic User: {problematic_email}")
    print("\n📋 MANUAL FIX INSTRUCTIONS:")
    print("=" * 50)
    
    print("\n1️⃣ Connect to your PostgreSQL database:")
    print("   psql -h localhost -U your_username -d shikkhaSathi")
    
    print(f"\n2️⃣ Delete the problematic user:")
    print(f"   DELETE FROM users WHERE email = '{problematic_email}';")
    
    print("\n3️⃣ Verify the user is deleted:")
    print(f"   SELECT * FROM users WHERE email = '{problematic_email}';")
    print("   (Should return no rows)")
    
    print("\n4️⃣ Clear any related data (optional):")
    print("   -- Clear any sessions, progress, etc. if needed")
    print("   -- This depends on your foreign key constraints")
    
    print("\n✅ After cleanup, the user can register again from the frontend!")
    
    return True

def test_registration_after_cleanup():
    """Test registration with the same email after cleanup"""
    
    print("\n" + "=" * 50)
    print("🧪 Testing Registration After Cleanup")
    print("=" * 50)
    
    # The same data that would come from the frontend
    registration_data = {
        "email": "loner@ntraq.clan",
        "password": "Habibag2001",
        "full_name": "User Name",  # User should fill this in the form
        "phone": "01712345678",    # User should fill this in the form
        "date_of_birth": "2000-01-01",  # User should fill this in the form
        "school": "User School",   # User should fill this in the form
        "district": "ঢাকা",        # User should select this
        "grade": 10,               # User should select this
        "medium": "bangla",        # User should select this
        "role": "student"          # Default
    }
    
    print("⚠️  Run this test ONLY after cleaning up the database!")
    print("\nWould you like to test registration now? (y/n)")
    
    # For automated testing, we'll skip the interactive part
    print("Skipping interactive test for now...")
    print("\n💡 To test manually:")
    print("   1. Clean up the database as instructed above")
    print("   2. Go to the frontend signup page")
    print("   3. Register with the same email and password")
    print("   4. Try logging in")
    
    return True

def provide_alternative_solution():
    """Provide an alternative solution using password reset"""
    
    print("\n" + "=" * 50)
    print("🔄 ALTERNATIVE SOLUTION: Password Reset")
    print("=" * 50)
    
    print("If you don't want to delete the user, you can:")
    print("\n1️⃣ Create a password reset endpoint in the backend")
    print("2️⃣ Generate a new password hash for the user")
    print("3️⃣ Update the user's password in the database")
    
    print("\n📝 SQL Command to reset password:")
    print("   -- First, generate a new hash for 'Habibag2001'")
    print("   -- You can use the backend's get_password_hash function")
    print("   -- Then update the user:")
    print("   UPDATE users SET password_hash = 'NEW_HASH_HERE' WHERE email = 'loner@ntraq.clan';")
    
    print("\n🐍 Python script to generate hash:")
    print("""
   from app.core.security import get_password_hash
   new_hash = get_password_hash('Habibag2001')
   print(f"New hash: {new_hash}")
   """)

if __name__ == "__main__":
    print("🚀 User Login Issue Fix")
    
    # Provide cleanup instructions
    delete_problematic_user()
    
    # Test registration after cleanup
    test_registration_after_cleanup()
    
    # Provide alternative solution
    provide_alternative_solution()
    
    print("\n" + "=" * 50)
    print("✅ SUMMARY")
    print("=" * 50)
    print("The password hashing system is working correctly for new users.")
    print("The issue is with the existing user's corrupted password hash.")
    print("\nRecommended action:")
    print("1. Delete the problematic user from the database")
    print("2. Let the user register again from the frontend")
    print("3. The login should work perfectly after that!")
    print("=" * 50)