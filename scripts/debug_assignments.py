
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

def debug_assignment_insert():
    print("Testing Assignment Insert Permissions (Anon)...")
    
    # We need a valid class_id and student_id to test constraints
    # From previous debug: Class 6th Grade (76859308-388c-463a-8e3c-5cb07996ba17) has student
    class_id = "76859308-388c-463a-8e3c-5cb07996ba17" 
    
    # We'll try to insert a dummy assignment
    payload = {
        "class_id": class_id,
        "title": "Debug Assignment",
        "description": "Test from debug script",
        "teacher_id": "3b47ebbb-6a23-4191-9a2b-504736a79b3f", # Des Childress ID
        "student_id": "94727509-40f6-4844-a6dd-eeb3c148e6f8" # Dummy student ID
    }

    try:
        # NOTE: This runs as ANON. If RLS is set to 'Authenticated Only', this might fail, 
        # but if it fails with 'new row violates row-level security policy', we know RLS is active.
        response = supabase.table("assignments").insert(payload).execute()
        
        if response.data:
            print("✅ Insert successful (Anon role).")
            print(json.dumps(response.data, indent=2))
            
            # Clean up
            print("Cleaning up debug assignment...")
            supabase.table("assignments").delete().eq("id", response.data[0]['id']).execute()
        else:
            print("⚠️ Insert returned no data (RLS blocked?)")
            
    except Exception as e:
        print(f"❌ Insert Failed: {e}")

if __name__ == "__main__":
    debug_assignment_insert()
