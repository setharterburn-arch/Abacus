#!/usr/bin/env python3
"""
Generate curriculum for Grades 7-9 using Gemini API (parallel to Claude)
Generates different subtopics to avoid conflicts
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
CURRICULUM_FILE = PROJECT_ROOT / 'src' / 'data' / 'curriculum.json'
LOG_FILE = PROJECT_ROOT / 'generation_7_9_gemini.log'
IMAGES_DIR = PROJECT_ROOT / 'public' / 'curriculum-images'

IMAGES_DIR.mkdir(parents=True, exist_ok=True)

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
        illustration_guidance = ""
        if topic in ['Geometry', 'Graphing', 'Coordinate Plane', 'Functions', 'Algebra']:
            illustration_guidance = """
For visual problems, include an "illustration" field with description.
Format: "illustration": "Description of diagram/graph"
"""
        
        prompt = f"""Generate a math curriculum set for Grade {grade}.

Topic: {topic}
Subtopic: {subtopic}

Create 8-10 multiple choice questions appropriate for Grade {grade}.
Each question should have 4 options.
{illustration_guidance}

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
      "explanation": "Why this is correct",
      "illustration": "Optional: Description if needed"
    }}
  ]
}}

Make questions progressively harder. Use real-world contexts.
For algebra, show work steps. For geometry, include diagrams where helpful."""

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
        
        # Process illustrations
        for i, question in enumerate(curriculum_set.get('questions', [])):
            if 'illustration' in question and question['illustration']:
                img_filename = f"grade{grade}-{topic.lower().replace(' ', '-')}-set{set_number}-q{i+1}.png"
                question['image'] = f"/curriculum-images/{img_filename}"
                question['illustration_description'] = question.pop('illustration')
        
        return curriculum_set
        
    except Exception as e:
        log(f"❌ Error: {e}")
        return None

# Topics for Grades 7-9 (DIFFERENT from Claude to avoid conflicts)
# These are additional subtopics not covered by the Claude script
topics = [
    # Grade 7 - Additional topics
    {'grade': 7, 'topic': 'Number Theory', 'subtopics': ['Divisibility', 'GCF and LCM', 'Prime Factorization']},
    {'grade': 7, 'topic': 'Rational Numbers', 'subtopics': ['Fractions', 'Decimals', 'Negative Numbers', 'Absolute Value']},
    {'grade': 7, 'topic': 'Data and Graphs', 'subtopics': ['Bar Graphs', 'Line Graphs', 'Circle Graphs', 'Histograms']},
    
    # Grade 8 - Additional topics
    {'grade': 8, 'topic': 'Rational Numbers', 'subtopics': ['Irrational Numbers', 'Real Number System', 'Approximations']},
    {'grade': 8, 'topic': 'Linear Relationships', 'subtopics': ['Direct Variation', 'Inverse Variation', 'Rate of Change']},
    {'grade': 8, 'topic': 'Data Analysis', 'subtopics': ['Box Plots', 'Outliers', 'Comparing Data Sets']},
    
    # Grade 9 - Additional topics
    {'grade': 9, 'topic': 'Number Systems', 'subtopics': ['Complex Numbers', 'Radicals', 'Rational Expressions']},
    {'grade': 9, 'topic': 'Sequences', 'subtopics': ['Arithmetic Sequences', 'Geometric Sequences', 'Series']},
    {'grade': 9, 'topic': 'Inequalities', 'subtopics': ['Linear Inequalities', 'Systems of Inequalities', 'Absolute Value Inequalities']},
]

def main():
    """Generate content for Grades 7-9 using Gemini"""
    log("=" * 60)
    log("🚀 Generating Curriculum for Grades 7-9 (Gemini)")
    log("=" * 60)
    
    # Load existing - need to coordinate with Claude script
    # We'll use a lock-free approach: load, append, save
    if CURRICULUM_FILE.exists():
        with open(CURRICULUM_FILE, 'r') as f:
            curriculum = json.load(f)
    else:
        curriculum = []
    
    initial_count = len(curriculum)
    log(f"📚 Loaded {initial_count} existing sets")
    
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
                    # Reload file to get latest (in case Claude saved)
                    with open(CURRICULUM_FILE, 'r') as f:
                        curriculum = json.load(f)
                    
                    curriculum.append(curriculum_set)
                    total_generated += 1
                    
                    # Save every 10 sets
                    if total_generated % 10 == 0:
                        with open(CURRICULUM_FILE, 'w') as f:
                            json.dump(curriculum, f, indent=2)
                        log(f"✅ Saved {len(curriculum)} total sets ({total_generated} new from Gemini)")
                
                # Rate limiting - 1 second to avoid conflicts with Claude
                time.sleep(1.0)
    
    # Final save
    with open(CURRICULUM_FILE, 'r') as f:
        curriculum = json.load(f)
    
    log("=" * 60)
    log(f"✅ COMPLETE! Generated {total_generated} new sets (Gemini)")
    log(f"📊 Total curriculum sets: {len(curriculum)}")
    log("=" * 60)
    
    # Show new distribution
    grade_counts = {}
    for item in curriculum:
        grade = item.get('grade_level', 0)
        grade_counts[grade] = grade_counts.get(grade, 0) + 1
    
    log("\nFinal distribution:")
    for grade in sorted(grade_counts.keys()):
        log(f"  Grade {grade}: {grade_counts[grade]} sets")

if __name__ == '__main__':
    main()
