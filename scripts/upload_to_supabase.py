
import os
import json
from supabase import create_client, Client

# Initialize Supabase
url: str = os.environ.get("VITE_SUPABASE_URL")
key: str = os.environ.get("VITE_SUPABASE_ANON_KEY")

if not url or not key:
    print("❌ Error: Missing Supabase credentials in environment variables.")
    # Try loading from .env manually if not in env
    try:
        from dotenv import load_dotenv
        load_dotenv()
        url = os.environ.get("VITE_SUPABASE_URL")
        key = os.environ.get("VITE_SUPABASE_ANON_KEY")
    except ImportError:
        pass

if not url or not key:
    exit(1)

supabase: Client = create_client(url, key)

INPUT_FILE = "data/curriculum_7_9.json"

def upload_curriculum():
    print(f"Loading {INPUT_FILE}...")
    try:
        with open(INPUT_FILE, 'r') as f:
            data = json.load(f)
    except FileNotFoundError:
        print(f"❌ File not found: {INPUT_FILE}")
        return

    print(f"Found {len(data)} curriculum sets. Uploading to Supabase...")

    success_count = 0
    fail_count = 0

    for item in data:
        # Prepare payload matching schema
        # Schema: id (auto), title, description, grade, questions (jsonb), status
        topic = item.get('topic', 'General')
        difficulty = item.get('difficulty', 'Medium')
        
        payload = {
            # "id": item["id"], # Removed to allow UUID generation
            "title": item["title"],
            "description": f"{item.get('description', '')} | Topic: {topic} | Difficulty: {difficulty}",
            "grade": item["grade_level"], # Map 'grade_level' to 'grade'
            "questions": item["questions"],
            "status": "published"
        }
        
        try:
             # Using insert instead of upsert since we don't have the UUID
            response = supabase.table("curriculum_sets").insert(payload).execute()
            
            print(f"✅ Uploaded: {item['title']}")
            success_count += 1
        except Exception as e:
            print(f"❌ Failed to upload {item['title']}: {e}")
            fail_count += 1

    print(f"\nUpload Complete. Success: {success_count}, Fail: {fail_count}")

if __name__ == "__main__":
    upload_curriculum()
