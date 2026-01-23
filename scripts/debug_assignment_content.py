
import os
import json
from dotenv import load_dotenv
from supabase import create_client, Client

load_dotenv()
url = os.environ.get("VITE_SUPABASE_URL")
key = os.environ.get("VITE_SUPABASE_ANON_KEY")
supabase = create_client(url, key)

def inspect_latest_assignment():
    print("Fetching latest assignment...")
    try:
        resp = supabase.table("assignments").select("*").order("created_at", desc=True).limit(1).execute()
        
        if resp.data:
            assignment = resp.data[0]
            print(f"Title: {assignment['title']}")
            print(f"ID: {assignment['id']}")
            print("Questions Raw Data:")
            print(json.dumps(assignment['questions'], indent=2))
        else:
            print("No assignments found.")

    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    inspect_latest_assignment()
