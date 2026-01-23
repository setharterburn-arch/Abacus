#!/usr/bin/env python3
"""
Test the new Gemini generation script with 3 lessons
"""

import os
import json
import time
from datetime import datetime
from pathlib import Path

try:
    from google import generativeai as genai
except ImportError:
    print("❌ Error: google-generativeai not installed")
    exit(1)

# Configuration
GEMINI_API_KEY = os.getenv('VITE_GEMINI_API_KEY')
if not GEMINI_API_KEY:
    print("❌ Error: VITE_GEMINI_API_KEY not found")
    exit(1)

genai.configure(api_key=GEMINI_API_KEY)
model = genai.GenerativeModel('gemini-2.0-flash-exp')

# Paths
PROJECT_ROOT = Path(__file__).parent.parent
TEST_FILE = PROJECT_ROOT / 'test_curriculum.json'
LOG_FILE = PROJECT_ROOT / 'test_generation.log'

RATE_LIMIT_DELAY = 4.0

def log(message):
    """Log to console and file"""
    timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    log_message = f"[{timestamp}] {message}"
    print(log_message)
    with open(LOG_FILE, 'a') as f:
        f.write(log_message + '\n')

def generate_curriculum_set(grade, topic, subtopic, set_number):
    """Generate a curriculum set using Gemini"""
    try:
        prompt = f"""Generate a math curriculum set for Grade {grade}.

Topic: {topic}
Subtopic: {subtopic}

Create 8-10 multiple choice questions appropriate for Grade {grade}.
Each question should have 4 options.

Return ONLY valid JSON (no markdown) in this exact format:
{{
  "id": "{grade}-{topic.lower().replace(' ', '-')}-{subtopic.lower().replace(' ', '-')}-{set_number}",
  "title": "{subtopic} - Set {set_number}",
  "description": "Practice {subtopic.lower()} for Grade {grade}",
  "grade_level": {grade},
  "topic": "{topic}",
  "questions": [
    {{
      "question": "Question text",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "answer": "Option A",
      "explanation": "Why this is correct"
    }}
  ]
}}

Make questions progressively harder. Use real-world contexts."""

        response = model.generate_content(
            prompt,
            generation_config=genai.types.GenerationConfig(
                temperature=0.7,
                max_output_tokens=4096,
            )
        )
        
        response_text = response.text.strip()
        
        # Clean markdown
        if '```json' in response_text:
            response_text = response_text.split('```json')[1].split('```')[0].strip()
        elif '```' in response_text:
            response_text = response_text.split('```')[1].split('```')[0].strip()
        
        curriculum_set = json.loads(response_text)
        curriculum_set['grade_level'] = grade
        
        return curriculum_set
        
    except Exception as e:
        log(f"❌ Error: {e}")
        return None

def main():
    """Test with 3 lessons"""
    log("=" * 60)
    log("🧪 Testing Gemini Generation (3 lessons)")
    log("=" * 60)
    
    # Start fresh
    curriculum = []
    
    # Test lessons
    test_lessons = [
        {'grade': 7, 'topic': 'Pre-Algebra', 'subtopic': 'Variables and Expressions', 'set_num': 1},
        {'grade': 8, 'topic': 'Algebra I', 'subtopic': 'Linear Equations', 'set_num': 1},
        {'grade': 9, 'topic': 'Quadratic Functions', 'subtopic': 'Graphing Parabolas', 'set_num': 1},
    ]
    
    for i, lesson in enumerate(test_lessons, 1):
        log(f"[{i}/3] Grade {lesson['grade']} - {lesson['topic']} - {lesson['subtopic']}")
        
        curriculum_set = generate_curriculum_set(
            lesson['grade'],
            lesson['topic'],
            lesson['subtopic'],
            lesson['set_num']
        )
        
        if curriculum_set:
            curriculum.append(curriculum_set)
            log(f"✅ Generated {len(curriculum_set.get('questions', []))} questions")
        
        if i < len(test_lessons):
            log(f"⏳ Waiting {RATE_LIMIT_DELAY}s...")
            time.sleep(RATE_LIMIT_DELAY)
    
    # Save test results
    with open(TEST_FILE, 'w') as f:
        json.dump(curriculum, f, indent=2)
    
    log("")
    log("=" * 60)
    log(f"✅ Test complete! Generated {len(curriculum)} sets")
    log(f"📄 Saved to: {TEST_FILE}")
    log("=" * 60)
    
    # Verify no reload bug
    log("\n🔍 Verifying file handling...")
    log(f"  - Curriculum list length: {len(curriculum)}")
    log(f"  - Expected: 3 sets")
    log(f"  - Match: {'✅' if len(curriculum) == 3 else '❌'}")

if __name__ == '__main__':
    main()
