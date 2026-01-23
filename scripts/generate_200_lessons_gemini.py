#!/usr/bin/env python3
"""
Generate 200 curriculum sets for Grades 7-9 using Gemini API
Robust version with proper file handling, rate limiting, and progress tracking
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
    print("Run: pip install google-generativeai")
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
PROGRESS_FILE = PROJECT_ROOT / 'progress_gemini.json'
LOG_FILE = PROJECT_ROOT / 'generation_200_gemini.log'
IMAGES_DIR = PROJECT_ROOT / 'public' / 'curriculum-images'

IMAGES_DIR.mkdir(parents=True, exist_ok=True)

# Rate limiting: Gemini free tier = 15 RPM
# 15 requests per minute = 1 request per 4 seconds
RATE_LIMIT_DELAY = 4.0

def log(message):
    """Log to console and file"""
    timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    log_message = f"[{timestamp}] {message}"
    print(log_message)
    with open(LOG_FILE, 'a') as f:
        f.write(log_message + '\n')

def save_progress(completed_lessons):
    """Save progress to resume later"""
    with open(PROGRESS_FILE, 'w') as f:
        json.dump({
            'completed': completed_lessons,
            'timestamp': datetime.now().isoformat()
        }, f, indent=2)

def load_progress():
    """Load progress from previous run"""
    if PROGRESS_FILE.exists():
        with open(PROGRESS_FILE, 'r') as f:
            data = json.load(f)
            return set(data.get('completed', []))
    return set()

def generate_curriculum_set(grade, topic, subtopic, set_number):
    """Generate a curriculum set using Gemini"""
    try:
        illustration_guidance = ""
        if topic in ['Geometry', 'Graphing', 'Coordinate Plane', 'Functions', 'Algebra', 'Trigonometry']:
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

# 200 lessons across Grades 7-9
# Structured for comprehensive coverage
LESSON_PLAN = [
    # ===== GRADE 7 (70 lessons) =====
    {'grade': 7, 'topic': 'Pre-Algebra', 'subtopics': ['Variables and Expressions', 'Solving Equations', 'Order of Operations', 'Distributive Property', 'Combining Like Terms'], 'sets_per': 4},
    {'grade': 7, 'topic': 'Ratios and Proportions', 'subtopics': ['Unit Rates', 'Proportional Relationships', 'Scale Drawings', 'Percent Problems'], 'sets_per': 4},
    {'grade': 7, 'topic': 'Geometry Basics', 'subtopics': ['Angles', 'Triangles', 'Quadrilaterals', 'Area and Perimeter'], 'sets_per': 4},
    {'grade': 7, 'topic': 'Statistics', 'subtopics': ['Mean, Median, Mode', 'Data Displays', 'Probability'], 'sets_per': 3},
    {'grade': 7, 'topic': 'Number Theory', 'subtopics': ['Divisibility', 'GCF and LCM', 'Prime Factorization'], 'sets_per': 3},
    {'grade': 7, 'topic': 'Rational Numbers', 'subtopics': ['Fractions', 'Decimals', 'Negative Numbers'], 'sets_per': 2},
    
    # ===== GRADE 8 (65 lessons) =====
    {'grade': 8, 'topic': 'Algebra I', 'subtopics': ['Linear Equations', 'Systems of Equations', 'Slope', 'Graphing Lines', 'Inequalities'], 'sets_per': 4},
    {'grade': 8, 'topic': 'Functions', 'subtopics': ['Function Notation', 'Linear Functions', 'Comparing Functions'], 'sets_per': 5},
    {'grade': 8, 'topic': 'Geometry', 'subtopics': ['Pythagorean Theorem', 'Volume', 'Transformations', 'Congruence'], 'sets_per': 4},
    {'grade': 8, 'topic': 'Exponents', 'subtopics': ['Laws of Exponents', 'Scientific Notation', 'Square Roots'], 'sets_per': 3},
    {'grade': 8, 'topic': 'Data Analysis', 'subtopics': ['Scatter Plots', 'Two-Way Tables', 'Outliers'], 'sets_per': 3},
    
    # ===== GRADE 9 (65 lessons) =====
    {'grade': 9, 'topic': 'Algebra II', 'subtopics': ['Polynomials', 'Factoring', 'Rational Expressions', 'Radical Equations', 'Complex Numbers'], 'sets_per': 4},
    {'grade': 9, 'topic': 'Quadratic Functions', 'subtopics': ['Graphing Parabolas', 'Quadratic Formula', 'Completing the Square', 'Applications'], 'sets_per': 4},
    {'grade': 9, 'topic': 'Exponential Functions', 'subtopics': ['Growth and Decay', 'Logarithms', 'Applications'], 'sets_per': 3},
    {'grade': 9, 'topic': 'Trigonometry', 'subtopics': ['Right Triangle Trig', 'Unit Circle', 'Trig Identities'], 'sets_per': 3},
    {'grade': 9, 'topic': 'Advanced Geometry', 'subtopics': ['Circles', 'Similarity', 'Coordinate Geometry'], 'sets_per': 3},
]

def main(limit=None):
    """Generate 200 curriculum sets for Grades 7-9"""
    log("=" * 60)
    log("🚀 Generating 200 Curriculum Sets (Grades 7-9)")
    if limit:
        log(f"⚠️  TEST MODE: Limited to {limit} sets")
    log("=" * 60)
    
    # Load existing curriculum ONCE
    if CURRICULUM_FILE.exists():
        with open(CURRICULUM_FILE, 'r') as f:
            curriculum = json.load(f)
    else:
        curriculum = []
    
    initial_count = len(curriculum)
    log(f"📚 Loaded {initial_count} existing sets")
    
    # Load progress
    completed = load_progress()
    if completed:
        log(f"📋 Resuming: {len(completed)} lessons already completed")
    
    # Build lesson queue
    lesson_queue = []
    for topic_data in LESSON_PLAN:
        grade = topic_data['grade']
        topic = topic_data['topic']
        subtopics = topic_data['subtopics']
        sets_per = topic_data['sets_per']
        
        for subtopic in subtopics:
            for set_num in range(1, sets_per + 1):
                lesson_id = f"{grade}-{topic}-{subtopic}-{set_num}"
                if lesson_id not in completed:
                    lesson_queue.append({
                        'id': lesson_id,
                        'grade': grade,
                        'topic': topic,
                        'subtopic': subtopic,
                        'set_num': set_num
                    })
    
    total_lessons = len(lesson_queue)
    if limit and limit < total_lessons:
        total_lessons = limit
        
    log(f"📝 {total_lessons} lessons to generate")
    
    if total_lessons == 0:
        log("✅ All lessons already completed!")
        return
    
    # Estimate time
    estimated_minutes = (total_lessons * RATE_LIMIT_DELAY) / 60
    log(f"⏱️  Estimated time: {estimated_minutes:.1f} minutes")
    log(f"🔄 Rate limit: {RATE_LIMIT_DELAY}s per request (15 RPM)")
    log("")
    
    # Generate lessons
    generated_count = 0
    save_interval = 10
    
    for i, lesson in enumerate(lesson_queue, 1):
        if limit and generated_count >= limit:
            log(f"🛑 Reached limit of {limit} sets")
            break
            
        log(f"[{i}/{total_lessons}] Grade {lesson['grade']} - {lesson['topic']} - {lesson['subtopic']} - Set {lesson['set_num']}")
        
        curriculum_set = generate_curriculum_set(
            lesson['grade'],
            lesson['topic'],
            lesson['subtopic'],
            lesson['set_num']
        )
        
        if curriculum_set:
            curriculum.append(curriculum_set)
            completed.add(lesson['id'])
            generated_count += 1
            
            # Save progress every 10 lessons
            if generated_count % save_interval == 0:
                with open(CURRICULUM_FILE, 'w') as f:
                    json.dump(curriculum, f, indent=2)
                save_progress(list(completed))
                log(f"💾 Saved progress: {len(curriculum)} total sets ({generated_count} new)")
        
        # Rate limiting
        if i < total_lessons:  # Don't sleep after last request
            time.sleep(RATE_LIMIT_DELAY)
    
    # Final save
    with open(CURRICULUM_FILE, 'w') as f:
        json.dump(curriculum, f, indent=2)
    save_progress(list(completed))
    
    log("")
    log("=" * 60)
    log(f"✅ COMPLETE! Generated {generated_count} new sets")
    log(f"📊 Total curriculum sets: {len(curriculum)}")
    log("=" * 60)
    
    # Show distribution
    grade_counts = {}
    for item in curriculum:
        grade = item.get('grade_level', 0)
        grade_counts[grade] = grade_counts.get(grade, 0) + 1
    
    log("\nFinal distribution:")
    for grade in sorted(grade_counts.keys()):
        log(f"  Grade {grade}: {grade_counts[grade]} sets")

if __name__ == '__main__':
    import argparse
    parser = argparse.ArgumentParser()
    parser.add_argument('--limit', type=int, help='Limit number of sets to generate (for testing)')
    args = parser.parse_args()
    
    main(limit=args.limit)
