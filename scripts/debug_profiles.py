
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

def check_profiles_schema():
    print("Checking profiles for teacher linkage...")
    try:
        # Get one student profile (we know '94727509-40f6-4844-a6dd-eeb3c148e6f8' is a student)
        resp = supabase.table("profiles").select("*").limit(1).execute()
        
        if resp.data:
            print("Sample Profile Row:")
            print(json.dumps(resp.data[0], indent=2))
        else:
            print("❌ No profiles found.")

    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    check_profiles_schema()
