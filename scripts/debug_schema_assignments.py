
import os
import json
from dotenv import load_dotenv
from supabase import create_client, Client

load_dotenv()
url = os.environ.get("VITE_SUPABASE_URL")
key = os.environ.get("VITE_SUPABASE_ANON_KEY")
supabase = create_client(url, key)

def check_structure():
    print("Checking 'assignments' structure...")
    try:
        # Fetch one row to see columns
        resp = supabase.table("assignments").select("*").limit(1).execute()
        if resp.data:
            print("Row keys:", resp.data[0].keys())
        else:
            print("Table empty, cannot see columns easily via select.")
            
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    check_structure()
