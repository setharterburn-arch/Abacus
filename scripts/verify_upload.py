
import os
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

def verify_grade_7():
    print("Verifying Grade 7 Content...")
    try:
        response = supabase.table("curriculum_sets")\
            .select("title, description, grade")\
            .eq("grade", 7)\
            .execute()
            
        print(f"Found {len(response.data)} sets for Grade 7.")
        if len(response.data) > 0:
            print("Examples:")
            for item in response.data[:5]:
                print(f"- {item['title']} ({item['description'][:50]}...)")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    verify_grade_7()
