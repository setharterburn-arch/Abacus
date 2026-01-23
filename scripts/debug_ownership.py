
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

def check_ownership():
    print("Checking Class Ownership & Enrollment...")
    try:
        # 1. Get all class_students to find active classes
        resp_cs = supabase.table("class_students").select("class_id").execute()
        active_class_ids = list(set([row['class_id'] for row in resp_cs.data]))
        
        print(f"Found {len(active_class_ids)} classes with students enrolled.")
        
        # 2. Get details for these classes
        if active_class_ids:
            resp_classes = supabase.table("classes") \
                .select("id, name, teacher_id, join_code") \
                .in_("id", active_class_ids) \
                .execute()
                
            for cls in resp_classes.data:
                print(f"Class: {cls['name']} (Code: {cls['join_code']})")
                print(f"  - ID: {cls['id']}")
                print(f"  - Teacher ID: {cls['teacher_id']}")
                print("---")
        else:
            print("No active classes found.")
            
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    check_ownership()
