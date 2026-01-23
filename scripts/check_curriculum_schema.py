
import os
import json
from supabase import create_client, Client

# Initialize Supabase
url: str = os.environ.get("VITE_SUPABASE_URL")
key: str = os.environ.get("VITE_SUPABASE_ANON_KEY")

if not url or not key:
    try:
        from dotenv import load_dotenv
        load_dotenv()
        url = os.environ.get("VITE_SUPABASE_URL")
        key = os.environ.get("VITE_SUPABASE_ANON_KEY")
    except ImportError:
        pass

if not url or not key:
    print("Missing credentials")
    exit(1)

supabase: Client = create_client(url, key)

def check_structure():
    print("Checking curriculum_sets structure...")
    try:
        # Fetch one row to verify it works and see structure returned
        response = supabase.table("curriculum_sets").select("*").limit(1).execute()
        if response.data:
            print("Found existing data. Keys:")
            print(response.data[0].keys())
        else:
            print("Table exists but is empty.")
    except Exception as e:
        print(f"Error accessing table: {e}")

if __name__ == "__main__":
    check_structure()
