
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

def test_join():
    class_id = "5e964a14-b473-4b41-9982-9ac16a9d78bf" # ID found in previous step
    print(f"Testing Join Query for class_id: {class_id}")
    
    try:
        # Mimic the frontend query
        response = supabase.from_('class_students') \
            .select('student_id, profiles:student_id (id, first_name, last_name, email)') \
            .eq('class_id', class_id) \
            .execute()
            
        data = response.data
        if data:
            print(f"✅ Query returned {len(data)} rows.")
            print(json.dumps(data, indent=2))
        else:
            print("⚠️ Query returned 0 rows.")
            
    except Exception as e:
        print(f"❌ Query failed: {e}")

if __name__ == "__main__":
    test_join()
