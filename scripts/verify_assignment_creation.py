
import os
import json
import random
from dotenv import load_dotenv
from supabase import create_client, Client

load_dotenv()
url = os.environ.get("VITE_SUPABASE_URL")
key = os.environ.get("VITE_SUPABASE_ANON_KEY")
supabase = create_client(url, key)

def verify_creation():
    print("1. Fetching first curriculum set...")
    resp = supabase.table("curriculum_sets").select("*").limit(1).execute()
    if not resp.data: return
    
    curriculum = resp.data[0]
    questions_source = curriculum.get('questions', [])
    
    # 2. Mimic Frontend Mapping
    mapped_questions = []
    for q in questions_source:
        mapped_questions.append({
            "question": q.get("question"),
            "options": q.get("options", []),
            "answer": q.get("answer"),
            "image": q.get("image")
        })
        
    print(f"Mapped {len(mapped_questions)} questions.")

    # 3. Create Assignment
    # Need a class ID - grabbing first class
    class_resp = supabase.table("classes").select("id").limit(1).execute()
    if not class_resp.data:
        print("No classes found to assign to.")
        return
        
    class_id = class_resp.data[0]['id']
    
    payload = {
        "class_id": class_id,
        "title": f"VERIFY: {curriculum['title']} {random.randint(1,999)}",
        "description": "Verification Test",
        "questions": mapped_questions
    }
    
    print("Payload keys:", payload.keys())
    
    try:
        # Just insert and execute, default returns representation usually if headers set, 
        # or we might need to query it back.
        ins_resp = supabase.table("assignments").insert(payload).execute()
        
        if ins_resp.data:
            new_assign = ins_resp.data[0]
            print(f"✅ Assignment Created: {new_assign['id']}")
            print(f"Questions stored: {len(new_assign['questions'])}")
            
            # Cleanup
            # supabase.table("assignments").delete().eq("id", new_assign['id']).execute()
            # print("Cleaned up.")
        else:
            print("❌ Insert failed (no data returned).")
            
    except Exception as e:
        print(f"❌ Insert Exception: {e}")

if __name__ == "__main__":
    verify_creation()
