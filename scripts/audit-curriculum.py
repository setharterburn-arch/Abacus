
import os
import json
import time
from concurrent.futures import ThreadPoolExecutor
try:
    from google import generativeai as genai
except ImportError:
    print("google-generativeai not installed")
    exit(1)

# Configure Gemini
API_KEY = os.environ.get('VITE_GEMINI_API_KEY')
if not API_KEY:
    # Try finding it in .env
    try:
        from dotenv import load_dotenv
        load_dotenv()
        API_KEY = os.environ.get('VITE_GEMINI_API_KEY')
    except:
        pass

if not API_KEY:
    print("VITE_GEMINI_API_KEY not found")
    exit(1)

genai.configure(api_key=API_KEY)
# Use a lighter model for speed/cost if available, but Flash is good
model = genai.GenerativeModel('gemini-2.0-flash-exp')

CURRICULUM_FILE = "src/data/curriculum.json"
REPORT_FILE = "audit-report.json"

def audit_batch(questions, context):
    """
    Audit a batch of questions.
    Returns list of indices that are incorrect.
    """
    prompt = f"""
    You are a math expert auditing a curriculum.
    Context: {context}
    
    Here is a list of questions (JSON format). 
    Verify if the "answer" provided is correct for the "question" and "options" given.
    
    Questions:
    {json.dumps(questions, indent=2)}
    
    Output ONLY a JSON array of objects for ANY questions that have errors.
    If a question is correct, do NOT include it in the output.
    
    Format for error entry:
    {{
        "question_text": "The question text",
        "current_answer": "The wrong answer",
        "correct_answer": "The actual correct answer",
        "reason": "Brief explanation of error"
    }}
    
    If all are correct, output empty array: []
    """
    
    retries = 3
    for attempt in range(retries):
        try:
            response = model.generate_content(prompt)
            text = response.text.strip()
            if text.startswith("```json"):
                text = text[7:-3]
            elif text.startswith("```"):
                text = text[3:-3]
            return json.loads(text)
        except Exception as e:
            if "429" in str(e) or "Quota" in str(e):
                print(f"⚠️ Quota exceeded. Sleeping 60s... (Attempt {attempt+1}/{retries})")
                time.sleep(60)
            else:
                print(f"Error auditing batch: {e}")
                return []
    return []

def main():
    print(f"Loading {CURRICULUM_FILE}...")
    with open(CURRICULUM_FILE, 'r') as f:
        data = json.load(f)
    
    print(f"Auditing {len(data)} sets...")
    
    errors = []
    
    # Process in chunks
    for i, item in enumerate(data):
        print(f"Checking set {i+1}/{len(data)}: {item['title']}")
        
        batch_errors = audit_batch(item['questions'], f"Grade {item['grade_level']} - {item['title']}")
        
        if batch_errors:
            print(f"❌ Found {len(batch_errors)} errors in {item['title']}")
            for err in batch_errors:
                err['set_id'] = item.get('id')
                err['set_title'] = item.get('title')
                errors.append(err)
        
        # Rate limiting: 10 RPM = 1 request every 6s. Let's do 7s to be safe.
        time.sleep(7)

    # Save report
    with open(REPORT_FILE, 'w') as f:
        json.dump(errors, f, indent=2)
    
    print(f"\nAudit Complete.")
    print(f"Total Errors Found: {len(errors)}")
    if len(errors) > 0:
        print(f"See {REPORT_FILE} for details.")

if __name__ == "__main__":
    main()
