
import os
import json
from dotenv import load_dotenv
from supabase import create_client, Client

# Load environment variables
load_dotenv()

url: str = os.environ.get("VITE_SUPABASE_URL")
key: str = os.environ.get("VITE_SUPABASE_ANON_KEY")

if not url or not key:
    print("❌ Error: Missing Supabase credentials in environment variables.")
    exit(1)

supabase: Client = create_client(url, key)
def check_students():
    print("Querying Supabase (class_students)...")
    try:
        response = supabase.table("class_students").select("*").execute()
        data = response.data
        
        if data:
            print(f"✅ Found {len(data)} rows in class_students.")
            
            # Count students per class
            class_counts = {}
            for row in data:
                cid = row.get('class_id')
                class_counts[cid] = class_counts.get(cid, 0) + 1
            
            print("\nStudent Counts per Class ID:")
            for cid, count in class_counts.items():
                print(f"Class {cid}: {count} students")
        else:
            print("⚠️ Table 'class_students' is empty.")
            
    except Exception as e:
        print(f"❌ Error querying class_students: {e}")

if __name__ == "__main__":
    check_students()
