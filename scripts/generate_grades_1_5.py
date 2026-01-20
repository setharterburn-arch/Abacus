#!/usr/bin/env python3
"""
Generate additional curriculum for Grades 1-5
Target: ~80 sets per grade to balance distribution
"""

import os
import json
import time
from datetime import datetime
from pathlib import Path
from anthropic import Anthropic

# Configuration
CLAUDE_API_KEY = os.getenv('CLAUDE_API_KEY')
if not CLAUDE_API_KEY:
    print("❌ Error: CLAUDE_API_KEY not found")
    print("Run: export CLAUDE_API_KEY='your-key'")
    exit(1)

client = Anthropic(api_key=CLAUDE_API_KEY)

# Paths
PROJECT_ROOT = Path(__file__).parent.parent
CURRICULUM_FILE = PROJECT_ROOT / 'src' / 'data' / 'curriculum.json'
LOG_FILE = PROJECT_ROOT / 'generation_log.txt'

def log(message):
    """Log to console and file"""
    timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    log_message = f"[{timestamp}] {message}"
    print(log_message)
    with open(LOG_FILE, 'a') as f:
        f.write(log_message + '\n')

def generate_curriculum_set(grade, topic, subtopic, set_number):
    """Generate a curriculum set using Claude"""
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

Make questions progressively harder within the set. Use real-world contexts."""

        message = client.messages.create(
            model="claude-3-haiku-20240307",  # Using Haiku (available with this API key)
            max_tokens=4096,
            messages=[{"role": "user", "content": prompt}]
        )
        
        response_text = message.content[0].text.strip()
        
        # Clean markdown if present
        if response_text.startswith('```json'):
            response_text = response_text.split('```json')[1].split('```')[0].strip()
        elif response_text.startswith('```'):
            response_text = response_text.split('```')[1].split('```')[0].strip()
        
        curriculum_set = json.loads(response_text)
        curriculum_set['grade_level'] = grade  # Ensure correct grade
        
        return curriculum_set
        
    except Exception as e:
        log(f"❌ Error: {e}")
        return None

# Topics for Grades 1-5 (excluding Kindergarten)
topics = [
    # Grade 1 - Need ~80 more sets
    {'grade': 1, 'topic': 'Addition', 'subtopics': ['Facts to 10', 'Facts to 20', 'Word Problems', 'Missing Addends', 'Three Numbers']},
    {'grade': 1, 'topic': 'Subtraction', 'subtopics': ['Facts to 10', 'Facts to 20', 'Word Problems', 'Fact Families', 'Missing Numbers']},
    {'grade': 1, 'topic': 'Place Value', 'subtopics': ['Tens and Ones', 'Comparing Numbers', 'Number Patterns', 'Skip Counting', 'Number Order']},
    {'grade': 1, 'topic': 'Measurement', 'subtopics': ['Length', 'Time', 'Money']},
    
    # Grade 2 - Need ~80 more sets
    {'grade': 2, 'topic': 'Addition', 'subtopics': ['2-Digit', '3-Digit', 'Regrouping', 'Mental Math', 'Word Problems']},
    {'grade': 2, 'topic': 'Subtraction', 'subtopics': ['2-Digit', '3-Digit', 'Borrowing', 'Mental Math', 'Word Problems']},
    {'grade': 2, 'topic': 'Measurement', 'subtopics': ['Length', 'Weight', 'Capacity', 'Time', 'Money']},
    {'grade': 2, 'topic': 'Geometry', 'subtopics': ['2D Shapes', '3D Shapes', 'Symmetry']},
    
    # Grade 3 - Need ~80 more sets
    {'grade': 3, 'topic': 'Multiplication', 'subtopics': ['Tables 2-5', 'Tables 6-9', 'Arrays', 'Word Problems', 'Patterns']},
    {'grade': 3, 'topic': 'Division', 'subtopics': ['Basic Division', 'Remainders', 'Word Problems', 'Fact Families', 'Mental Math']},
    {'grade': 3, 'topic': 'Fractions', 'subtopics': ['Unit Fractions', 'Comparing', 'Equivalent', 'On Number Line', 'Word Problems']},
    {'grade': 3, 'topic': 'Geometry', 'subtopics': ['Angles', 'Perimeter', 'Area']},
    
    # Grade 4 - Need ~80 more sets
    {'grade': 4, 'topic': 'Multiplication', 'subtopics': ['Multi-Digit', 'Factors', 'Multiples', 'Prime Numbers', 'Word Problems']},
    {'grade': 4, 'topic': 'Division', 'subtopics': ['Long Division', '2-Digit Divisors', 'Remainders', 'Word Problems', 'Mental Math']},
    {'grade': 4, 'topic': 'Fractions', 'subtopics': ['Mixed Numbers', 'Adding', 'Subtracting', 'Multiplying', 'Comparing']},
    {'grade': 4, 'topic': 'Decimals', 'subtopics': ['Place Value', 'Comparing', 'Rounding']},
    
    # Grade 5 - Need ~80 more sets
    {'grade': 5, 'topic': 'Decimals', 'subtopics': ['Operations', 'Rounding', 'Word Problems', 'Converting', 'Comparing']},
    {'grade': 5, 'topic': 'Fractions', 'subtopics': ['Multiplying', 'Dividing', 'Converting', 'Mixed Operations', 'Word Problems']},
    {'grade': 5, 'topic': 'Geometry', 'subtopics': ['Coordinate Plane', 'Volume', 'Surface Area', 'Transformations', 'Patterns']},
    {'grade': 5, 'topic': 'Ratios', 'subtopics': ['Proportions', 'Rates', 'Percentages']},
]

def main():
    """Generate content for Grades 1-5"""
    log("=" * 60)
    log("🚀 Generating Curriculum for Grades 1-5")
    log("=" * 60)
    
    # Load existing
    with open(CURRICULUM_FILE, 'r') as f:
        curriculum = json.load(f)
    
    log(f"📚 Loaded {len(curriculum)} existing sets")
    
    # Count by grade
    grade_counts = {}
    for item in curriculum:
        grade = item.get('grade_level', 0)
        grade_counts[grade] = grade_counts.get(grade, 0) + 1
    
    log("Current distribution:")
    for grade in sorted(grade_counts.keys()):
        log(f"  Grade {grade}: {grade_counts[grade]} sets")
    
    # Generate new content
    sets_per_subtopic = 4  # 4 sets per subtopic
    total_generated = 0
    
    for topic_data in topics:
        grade = topic_data['grade']
        topic = topic_data['topic']
        subtopics = topic_data['subtopics']
        
        for subtopic in subtopics:
            for set_num in range(1, sets_per_subtopic + 1):
                log(f"📝 Grade {grade} - {topic} - {subtopic} - Set {set_num}")
                
                curriculum_set = generate_curriculum_set(grade, topic, subtopic, set_num)
                
                if curriculum_set:
                    curriculum.append(curriculum_set)
                    total_generated += 1
                    
                    # Save every 10 sets
                    if total_generated % 10 == 0:
                        with open(CURRICULUM_FILE, 'w') as f:
                            json.dump(curriculum, f, indent=2)
                        log(f"✅ Saved {len(curriculum)} total sets ({total_generated} new)")
                
                # Rate limiting (Claude can handle 0.5s)
                time.sleep(0.5)
    
    # Final save
    with open(CURRICULUM_FILE, 'w') as f:
        json.dump(curriculum, f, indent=2)
    
    log("=" * 60)
    log(f"✅ COMPLETE! Generated {total_generated} new sets")
    log(f"📊 Total curriculum sets: {len(curriculum)}")
    log("=" * 60)
    
    # Show new distribution
    grade_counts = {}
    for item in curriculum:
        grade = item.get('grade_level', 0)
        grade_counts[grade] = grade_counts.get(grade, 0) + 1
    
    log("\nNew distribution:")
    for grade in sorted(grade_counts.keys()):
        log(f"  Grade {grade}: {grade_counts[grade]} sets")

if __name__ == '__main__':
    main()
