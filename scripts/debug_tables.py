
import os
import json
from dotenv import load_dotenv
from supabase import create_client, Client

load_dotenv()
url = os.environ.get("VITE_SUPABASE_URL")
key = os.environ.get("VITE_SUPABASE_ANON_KEY")
supabase = create_client(url, key)

def list_tables():
    # Attempt to infer tables by checking common names, as we can't easily list permissions-blocked system tables
    candidates = ["teacher_students", "enrollments", "class_students", "profiles", "classes", "assignments", "assignment_submissions"]
    
    print("Checking for existence of potential tables...")
    for table in candidates:
        try:
            supabase.table(table).select("*").limit(1).execute()
            print(f"✅ Table '{table}' exists and is accessible.")
        except Exception:
            print(f"❌ Table '{table}' not found or not accessible.")

if __name__ == "__main__":
    list_tables()
