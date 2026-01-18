#!/usr/bin/env python3
"""
Two-Phase Curriculum Generator
Phase 1: Generate plain text curriculum list
Phase 2: Convert each item to full JSON with questions
"""

import os
import json
import time
from google import generativeai as genai

API_KEY = os.getenv('VITE_GEMINI_API_KEY')
if not API_KEY:
    print("Error: VITE_GEMINI_API_KEY not found")
    exit(1)

genai.configure(api_key=API_KEY)
model = genai.GenerativeModel('gemini-2.0-flash-exp')

def generate_curriculum_list(num_sets=100):
    """Phase 1: Generate simple text list of curriculum topics"""
    
    prompt = f"""Generate a list of {num_sets} math curriculum set ideas for grades K-6.

Format each as: GRADE|TOPIC|TITLE|DIFFICULTY

Example:
1|Addition|Addition Facts 0-10|easy
2|Subtraction|Two-Digit Subtraction|medium
3|Multiplication|Times Tables 2-5|easy

Distribution:
- Kindergarten (0): 15 sets
- Grade 1: 20 sets
- Grade 2: 20 sets
- Grade 3: 15 sets
- Grade 4: 15 sets
- Grade 5: 10 sets
- Grade 6: 5 sets

Rules:
- K: Counting, shapes, patterns only
- 1-2: Addition/subtraction only
- 3+: Can include multiplication, division, fractions

Return ONLY the list, one per line, no other text."""

    response = model.generate_content(prompt)
    return response.text.strip().split('\n')

def generate_questions_for_set(grade, topic, title, difficulty):
    """Phase 2: Generate full JSON for one curriculum set"""
    
    prompt = f"""Generate 10 math questions for this curriculum set:

Title: {title}
Grade: {grade if grade > 0 else 'Kindergarten'}
Topic: {topic}
Difficulty: {difficulty}

Return as JSON object with this EXACT structure:
{{
  "id": "g{grade}-{topic.lower().replace(' ', '-')}-{difficulty}",
  "title": "{title}",
  "description": "Practice {topic.lower()} skills",
  "grade_level": {grade},
  "topic": "{topic}",
  "difficulty": "{difficulty}",
  "questions": [
    {{
      "question": "question text here",
      "options": ["A", "B", "C", "D"],
      "answer": "correct answer",
      "hints": ["hint 1", "hint 2", "hint 3"],
      "explanation": "why this is correct"
    }}
  ]
}}

IMPORTANT:
- Keep questions SHORT (under 15 words)
- Keep explanations SHORT (under 30 words)
- For Kindergarten: NO +, -, ×, ÷ symbols
- Return ONLY the JSON object, no markdown"""

    try:
        response = model.generate_content(prompt)
        text = response.text.strip()
        
        # Remove markdown if present
        if '```json' in text:
            text = text.split('```json')[1].split('```')[0].strip()
        elif '```' in text:
            text = text.split('```')[1].split('```')[0].strip()
        
        return json.loads(text)
    except Exception as e:
        print(f"      ❌ Error: {str(e)[:50]}")
        return None

# Main execution
print("="*80)
print("TWO-PHASE CURRICULUM GENERATOR")
print("="*80)

print("\n📋 PHASE 1: Generating curriculum list...")
curriculum_list = generate_curriculum_list(100)
print(f"✅ Generated {len(curriculum_list)} curriculum ideas\n")

print("📝 PHASE 2: Generating questions for each set...")
print("This will take 3-5 minutes...\n")

all_sets = []
failed = 0

for i, line in enumerate(curriculum_list, 1):
    if '|' not in line:
        continue
    
    try:
        parts = line.split('|')
        if len(parts) < 4:
            continue
            
        grade = int(parts[0].strip())
        topic = parts[1].strip()
        title = parts[2].strip()
        difficulty = parts[3].strip()
        
        print(f"  [{i}/{len(curriculum_list)}] {title}...", end=' ', flush=True)
        
        set_data = generate_questions_for_set(grade, topic, title, difficulty)
        
        if set_data and isinstance(set_data, dict):
            all_sets.append(set_data)
            print(f"✅ ({len(all_sets)} total)")
        else:
            failed += 1
            print(f"❌ (skipped)")
        
        # Small delay to avoid rate limiting
        time.sleep(0.5)
        
    except Exception as e:
        failed += 1
        print(f"❌ Error: {str(e)[:30]}")
        continue

print(f"\n{'='*80}")
print(f"✅ Successfully generated {len(all_sets)} curriculum sets!")
print(f"❌ Failed: {failed}")

if len(all_sets) > 0:
    # Statistics
    grade_dist = {}
    for set_data in all_sets:
        grade = set_data.get('grade_level', -1)
        grade_label = f"Grade {grade}" if grade > 0 else "Kindergarten"
        grade_dist[grade_label] = grade_dist.get(grade_label, 0) + 1
    
    print(f"\n📚 Grade Distribution:")
    for grade in sorted(grade_dist.keys()):
        print(f"   {grade}: {grade_dist[grade]} sets")
    
    # Save
    output_file = f"generated-curriculum-{len(all_sets)}.json"
    with open(output_file, 'w') as f:
        json.dump(all_sets, f, indent=2)
    
    print(f"\n💾 Saved to: {output_file}")
    print(f"✅ Merge with: ./merge-curriculum.sh {output_file}")
else:
    print("\n❌ No sets generated successfully")

print("\n" + "="*80)
