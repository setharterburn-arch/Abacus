
import os
import json
from dotenv import load_dotenv
from supabase import create_client, Client

# Load environment variables
load_dotenv()

url: str = os.environ.get("VITE_SUPABASE_URL")
key: str = os.environ.get("VITE_SUPABASE_ANON_KEY")

if not url or not key:
    print("❌ Error: Missing Supabase credentials.")
    exit(1)

supabase: Client = create_client(url, key)

def check_user_and_classes():
    email = "des_childress@yahoo.com"
    print(f"Checking for user: {email}...")
    
    try:
        # 1. Find the user ID from profiles
        resp = supabase.table("profiles").select("*").eq("email", email).execute()
        
        if not resp.data:
            print(f"❌ No profile found for {email}")
            print("Listing all profiles to find a match...")
            all_profiles = supabase.table("profiles").select("email, id, first_name, last_name").execute()
            for p in all_profiles.data:
                print(f" - {p['email']} (ID: {p['id']})")
            return

        user = resp.data[0]
        user_id = user['id']
        print(f"✅ User Found: {user['first_name']} {user['last_name']}")
        print(f"   User ID: {user_id}")
        
        # 2. Check classes owned by this user
        print(f"\nChecking classes for Teacher ID: {user_id}...")
        resp_classes = supabase.table("classes").select("*").eq("teacher_id", user_id).execute()
        
        if resp_classes.data:
            print(f"✅ Found {len(resp_classes.data)} classes owned by this user:")
            for cls in resp_classes.data:
                print(f"   - {cls['name']} (ID: {cls['id']})")
                
                # Check for enrolled students in this class
                resp_students = supabase.table("class_students").select("*", count="exact").eq("class_id", cls['id']).execute()
                count = len(resp_students.data) if resp_students.data else 0
                print(f"     -> Enrolled Students: {count}")
        else:
            print("⚠️ No classes found for this teacher.")
            
            # List all classes and their owners to identify mismatch
            print("\nListing ALL classes to check ownership:")
            all_classes = supabase.table("classes").select("name, teacher_id").execute()
            for cls in all_classes.data:
                print(f"   - {cls['name']} (Owner: {cls['teacher_id']})")

    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    check_user_and_classes()
