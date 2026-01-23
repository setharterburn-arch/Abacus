
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

def check_classes():
    print("Querying Supabase (classes)...")
    try:
        response = supabase.table("classes").select("*").execute()
        data = response.data
        
        if data:
            print(f"✅ Found {len(data)} rows in classes.")
            print("Sample row:")
            print(json.dumps(data[0], indent=2))
        else:
            print("⚠️ Table 'classes' is empty (or RLS blocking).")
            
    except Exception as e:
        print(f"❌ Error querying classes: {e}")

if __name__ == "__main__":
    check_classes()
