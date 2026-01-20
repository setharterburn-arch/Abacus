#!/usr/bin/env python3
"""
Safe Bulk Curriculum Generator using Gemini API
Target: Grades 1-6
Constraint: Respect free tier rate limits (~15 RPM)
"""

import os
import json
import time
import random
import google.generativeai as genai
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables
load_dotenv(Path(__file__).parent.parent / '.env')

# Configuration
GEMINI_API_KEY = os.getenv('VITE_GEMINI_API_KEY')
if not GEMINI_API_KEY:
    print("❌ Error: VITE_GEMINI_API_KEY not found in .env")
    exit(1)

genai.configure(api_key=GEMINI_API_KEY)

# Constants
MODEL_NAME = "gemini-2.0-flash"
DELAY_SECONDS = 4.0  # Safe buffer for 15 RPM limit
BATCH_SIZE = 1  # Save after every set to prevent data loss
MAX_RETRIES = 5

# Paths
PROJECT_ROOT = Path(__file__).parent.parent
CURRICULUM_FILE = PROJECT_ROOT / 'src' / 'data' / 'curriculum.json'

# Topics Configuration
TOPICS = [
    # Grade 1
    {'grade': 1, 'topic': 'Addition', 'subtopics': ['Sums to 10', 'Sums to 20', 'Word Problems', 'Missing Addends']},
    {'grade': 1, 'topic': 'Subtraction', 'subtopics': ['From 10', 'From 20', 'Word Problems', 'Find the Difference']},
    {'grade': 1, 'topic': 'Place Value', 'subtopics': ['Tens and Ones', 'Counting to 120', 'Comparing Numbers']},
    {'grade': 1, 'topic': 'Geometry', 'subtopics': ['2D Shapes', '3D Shapes', 'Partitioning Shapes']},
    {'grade': 1, 'topic': 'Measurement', 'subtopics': ['Length', 'Time to Hour', 'Money (Coins)']},

    # Grade 2
    {'grade': 2, 'topic': 'Addition', 'subtopics': ['2-Digit with Regrouping', '3-Digit Addition', 'Mental Math']},
    {'grade': 2, 'topic': 'Subtraction', 'subtopics': ['2-Digit with Regrouping', '3-Digit Subtraction', 'Word Problems']},
    {'grade': 2, 'topic': 'Place Value', 'subtopics': ['Hundreds', 'Skip Counting', 'Standard Form']},
    {'grade': 2, 'topic': 'Measurement', 'subtopics': ['Inches and Feet', 'Time to 5 Mins', 'Money (Mixed Coins)']},
    {'grade': 2, 'topic': 'Data', 'subtopics': ['Bar Graphs', 'Line Plots']},

    # Grade 3
    {'grade': 3, 'topic': 'Multiplication', 'subtopics': ['Arrays', 'Facts 0-5', 'Facts 6-9', 'Properties']},
    {'grade': 3, 'topic': 'Division', 'subtopics': ['Equal Groups', 'Facts 1-10', 'Inverse Operations']},
    {'grade': 3, 'topic': 'Fractions', 'subtopics': ['Unit Fractions', 'Fractions on Number Line', 'Equivalent Fractions']},
    {'grade': 3, 'topic': 'Area and Perimeter', 'subtopics': ['Rectangle Area', 'Perimeter Calculations']},
    {'grade': 3, 'topic': 'Time', 'subtopics': ['Elapsed Time', 'Nearest Minute']},

    # Grade 4
    {'grade': 4, 'topic': 'Multiplication', 'subtopics': ['Multi-Digit', 'Factors and Multiples', 'Prime vs Composite']},
    {'grade': 4, 'topic': 'Division', 'subtopics': ['Long Division', 'Remainders', 'Word Problems']},
    {'grade': 4, 'topic': 'Fractions', 'subtopics': ['Adding Like Denominators', 'Mixed Numbers', 'Multiplying Fractions']},
    {'grade': 4, 'topic': 'Decimals', 'subtopics': ['Tenths and Hundredths', 'Comparing Decimals']},
    {'grade': 4, 'topic': 'Geometry', 'subtopics': ['Lines and Angles', 'Symmetry', 'Classifying Shapes']},

    # Grade 5
    {'grade': 5, 'topic': 'Decimals', 'subtopics': ['Add/Sub Decimals', 'Multiply/Divide Decimals', 'Rounding']},
    {'grade': 5, 'topic': 'Fractions', 'subtopics': ['Add/Sub Unlike Denominators', 'Multiplying Mixed Numbers', 'Dividing Fractions']},
    {'grade': 5, 'topic': 'Volume', 'subtopics': ['Unit Cubes', 'Volume Formula', 'Composite Volume']},
    {'grade': 5, 'topic': 'Coordinate Plane', 'subtopics': ['Plotting Points', 'Real World Problems']},
    {'grade': 5, 'topic': 'Algebraic Thinking', 'subtopics': ['Order of Operations', 'Numerical Expressions']},

    # Grade 6
    {'grade': 6, 'topic': 'Ratios', 'subtopics': ['Ratio Language', 'Unit Rates', 'Percentages']},
    {'grade': 6, 'topic': 'Number System', 'subtopics': ['Dividing Fractions', 'Multi-Digit Decimals', 'Negative Numbers']},
    {'grade': 6, 'topic': 'Expressions', 'subtopics': ['Variables', 'Evaluate Expressions', 'Equivalent Expressions']},
    {'grade': 6, 'topic': 'Equations', 'subtopics': ['One-Step Equations', 'Inequalities']},
    {'grade': 6, 'topic': 'Statistics', 'subtopics': ['Mean, Median, Mode', 'Box Plots', 'Histograms']},
]

def load_curriculum():
    if CURRICULUM_FILE.exists():
        with open(CURRICULUM_FILE, 'r') as f:
            return json.load(f)
    return []

def save_curriculum(data):
    with open(CURRICULUM_FILE, 'w') as f:
        json.dump(data, f, indent=2)

def generate_set(grade, topic, subtopic, existing_ids):
    model = genai.GenerativeModel(MODEL_NAME)
    
    # Unique seed for this generation to encourage variety
    seed = int(time.time() * 1000) % 10000 
    
    prompt = f"""
    Create a math curriculum set for Grade {grade}.
    Topic: {topic}
    Subtopic: {subtopic}
    
    Generate 10 multiple-choice questions.
    Requirements:
    1. Questions must be age-appropriate for Grade {grade}.
    2. Include 4 options per question.
    3. Include 3 progressive hints.
    4. Format as valid JSON.
    
    JSON Structure:
    {{
        "title": "{subtopic} Practice",
        "description": "Mastering {subtopic} concepts",
        "grade_level": {grade},
        "topic": "{topic}",
        "questions": [
            {{
                "question": "string",
                "options": ["string", "string", "string", "string"],
                "answer": "string (must match one option exactly)",
                "hints": ["hint1", "hint2", "hint3"],
                "explanation": "string"
            }}
        ]
    }}
    
    Return ONLY JSON. No markdown formatting.
    """
    
    try:
        response = model.generate_content(prompt)
        text = response.text.replace('```json', '').replace('```', '').strip()
        data = json.loads(text)
        
        # Add metadata
        timestamp = int(time.time())
        unique_id = f"g{grade}-{topic.lower().replace(' ', '')}-{subtopic.lower().replace(' ', '')}-{timestamp}"
        
        # Ensure ID uniqueness (rudimentary check)
        if unique_id in existing_ids:
            unique_id += f"-{random.randint(100, 999)}"
            
        data['id'] = unique_id
        data['generated'] = True
        data['generated_at'] = time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime())
        
        return data
        
    except Exception as e:
        print(f"    ⚠️ Generation failed: {e}")
        return None

def main():
    print(f"🚀 Starting Safe Bulk Generator (Gemini 1.5 Flash)")
    print(f"⏱️  Rate Limit Delay: {DELAY_SECONDS}s between requests")
    
    curriculum = load_curriculum()
    existing_ids = {item['id'] for item in curriculum}
    print(f"📚 Loaded {len(curriculum)} existing sets")
    
    total_new = 0
    consecutive_errors = 0
    
    # Generating 4 sets per subtopic for variety
    SETS_PER_SUBTOPIC = 4
    
    try:
        for item in TOPICS:
            grade = item['grade']
            topic = item['topic']
            
            for subtopic in item['subtopics']:
                print(f"\n📍 Grade {grade} | {topic} | {subtopic}")
                
                for i in range(SETS_PER_SUBTOPIC):
                    print(f"    Generating Set {i+1}/{SETS_PER_SUBTOPIC}...", end="", flush=True)
                    
                    # Rate limit wait FIRST
                    time.sleep(DELAY_SECONDS)
                    
                    retries = 0
                    success = False
                    
                    while retries < MAX_RETRIES:
                        new_set = generate_set(grade, topic, subtopic, existing_ids)
                        
                        if new_set:
                            curriculum.append(new_set)
                            existing_ids.add(new_set['id'])
                            total_new += 1
                            consecutive_errors = 0
                            success = True
                            print(" ✅ Done")
                            
                            # Incremental Save
                            if total_new % BATCH_SIZE == 0:
                                save_curriculum(curriculum)
                            break
                        else:
                            retries += 1
                            wait_time = 30 * (2 ** (retries - 1)) # 30s, 60s, 120s...
                            print(f"\n    ⚠️ Error (429?). Waiting {wait_time}s...")
                            time.sleep(wait_time)
                    
                    if not success:
                        consecutive_errors += 1
                        print(" ❌ Skipped after retries")
                        
                    if consecutive_errors >= 5:
                        print("\n🛑 Too many consecutive errors. Stopping script to protect API key.")
                        return

    except KeyboardInterrupt:
        print("\n👋 Script stopped by user.")
    finally:
        save_curriculum(curriculum)
        print(f"\n💾 Saved! Total curriculum sets: {len(curriculum)} (+{total_new} new)")

if __name__ == "__main__":
    main()
