
import os
import json
from dotenv import load_dotenv
from supabase import create_client, Client

load_dotenv()
url = os.environ.get("VITE_SUPABASE_URL")
key = os.environ.get("VITE_SUPABASE_ANON_KEY")
supabase = create_client(url, key)

def test_flow():
    print("1. Fetching first curriculum set...")
    resp = supabase.table("curriculum_sets").select("*").limit(1).execute()
    
    if not resp.data:
        print("❌ No curriculum sets found.")
        return

    curriculum = resp.data[0]
    print(f"✅ Found set: {curriculum['title']}")
    questions = curriculum.get('questions', [])
    
    if not questions:
        print("❌ 'questions' field is empty or missing!")
        print("Object keys:", curriculum.keys())
    else:
        print(f"✅ 'questions' found with {len(questions)} items.")
        print("Sample Q1:", json.dumps(questions[0], indent=2))

if __name__ == "__main__":
    test_flow()
