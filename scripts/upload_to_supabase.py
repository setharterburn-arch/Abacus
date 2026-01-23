
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

INPUT_FILE = "src/data/curriculum.json"

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
    skip_count = 0

    for item in data:
        # Prepare payload matching schema
        topic = item.get('topic', 'General')
        difficulty = item.get('difficulty', 'Medium')
        title = item["title"]
        grade = item["grade_level"]
        description = f"{item.get('description', '')} | Topic: {topic} | Difficulty: {difficulty}"
        
        try:
            # Check if exists
            existing = supabase.table("curriculum_sets")\
                .select("id")\
                .eq("title", title)\
                .eq("grade", grade)\
                .execute()
            
            if existing.data:
                # Update existing
                record_id = existing.data[0]['id']
                payload = {
                     "description": description,
                     "questions": item["questions"],
                     "status": "published"
                }
                supabase.table("curriculum_sets").update(payload).eq("id", record_id).execute()
                print(f"🔄 Updated: {title}")
                success_count += 1
            else:
                # Insert new
                payload = {
                    "title": title,
                    "description": description,
                    "grade": grade,
                    "questions": item["questions"],
                    "status": "published"
                }
                supabase.table("curriculum_sets").insert(payload).execute()
                print(f"✅ Uploaded: {title}")
                success_count += 1
                
        except Exception as e:
            print(f"❌ Failed to upload {title}: {e}")
            fail_count += 1

    print(f"\nUpload Complete. Success: {success_count}, Skips/Updates included in success. Fail: {fail_count}")

if __name__ == "__main__":
    upload_curriculum()
