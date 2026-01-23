
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
    print("❌ Missing Credentials")
    exit(1)

supabase: Client = create_client(url, key)

def check_db():
    print("Querying Supabase (curriculum_sets)...")
    try:
        response = supabase.table("curriculum_sets").select("*").execute()
        data = response.data
        print(f"✅ Found {len(data)} rows.")
        if len(data) > 0:
            print("Sample row:")
            print(json.dumps(data[0], indent=2))
            
            # Check grade distribution and types
            grades = {}
            types = set()
            for item in data:
                g = item.get('grade')
                grades[g] = grades.get(g, 0) + 1
                types.add(type(g))
            print(f"\nGrade Counts: {grades}")
            print(f"Grade Types: {types}")
        else:
            print("⚠️ Table is empty or RLS is blocking read.")
            
    except Exception as e:
        print(f"❌ Query failed: {e}")

if __name__ == "__main__":
    check_db()
