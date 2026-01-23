#!/usr/bin/env python3
"""
Generate curriculum for Grades 7-9 using local Ollama (Qwen 2.5 Coder 7B)
Zero cost, runs entirely on your M4 Mac
"""

import json
import time
import subprocess
from datetime import datetime
from pathlib import Path

# Configuration
MODEL = "qwen2.5-coder:7b"

# Paths
PROJECT_ROOT = Path(__file__).parent.parent
CURRICULUM_FILE = PROJECT_ROOT / 'src' / 'data' / 'curriculum.json'
LOG_FILE = PROJECT_ROOT / 'generation_7_9_local.log'
IMAGES_DIR = PROJECT_ROOT / 'public' / 'curriculum-images'

IMAGES_DIR.mkdir(parents=True, exist_ok=True)

def log(message):
    """Log to console and file"""
    timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    log_message = f"[{timestamp}] {message}"
    print(log_message)
    with open(LOG_FILE, 'a') as f:
        f.write(log_message + '\n')

def call_ollama(prompt):
    """Call Ollama API"""
    try:
        result = subprocess.run(
            ['ollama', 'run', MODEL],
            input=prompt,
            capture_output=True,
            text=True,
            timeout=120  # Increased to 120 seconds for complex JSON generation
        )
        return result.stdout.strip()
    except subprocess.TimeoutExpired:
        log("⚠️ Ollama timeout (120s)")
        return None
    except Exception as e:
        log(f"❌ Ollama error: {e}")
        return None

def generate_curriculum_set(grade, topic, subtopic, set_number):
    """Generate a curriculum set using local Ollama"""
    try:
        illustration_guidance = ""
        if topic in ['Geometry', 'Graphing', 'Coordinate Plane', 'Functions', 'Algebra']:
            illustration_guidance = """
For visual problems, include an "illustration" field with description.
"""
        
        prompt = f"""Generate a math curriculum set for Grade {grade}.

Topic: {topic}
Subtopic: {subtopic}

Create 5-6 multiple choice questions appropriate for Grade {grade}.
Each question should have 4 options.
{illustration_guidance}

Return ONLY valid JSON (no markdown, no explanations) in this exact format:
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

Make questions progressively harder. Use real-world contexts.
IMPORTANT: Return ONLY the JSON object, nothing else."""

        response_text = call_ollama(prompt)
        
        if not response_text:
            return None
        
        # Clean markdown if present
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

# Topics for Grades 7-9 (Same as Claude script)
topics = [
    # Grade 7
    {'grade': 7, 'topic': 'Pre-Algebra', 'subtopics': ['Integers', 'Order of Operations', 'Expressions', 'Equations', 'Inequalities']},
    {'grade': 7, 'topic': 'Ratios and Proportions', 'subtopics': ['Ratios', 'Rates', 'Proportions', 'Scale Drawings', 'Percent']},
    {'grade': 7, 'topic': 'Geometry', 'subtopics': ['Angles', 'Triangles', 'Quadrilaterals', 'Circles', 'Area and Perimeter']},
    {'grade': 7, 'topic': 'Statistics', 'subtopics': ['Mean and Median', 'Data Analysis', 'Probability']},
    
    # Grade 8
    {'grade': 8, 'topic': 'Algebra', 'subtopics': ['Linear Equations', 'Systems of Equations', 'Functions', 'Slope', 'Graphing']},
    {'grade': 8, 'topic': 'Geometry', 'subtopics': ['Pythagorean Theorem', 'Volume', 'Surface Area', 'Transformations', 'Congruence']},
    {'grade': 8, 'topic': 'Exponents', 'subtopics': ['Powers', 'Scientific Notation', 'Square Roots', 'Cube Roots']},
    {'grade': 8, 'topic': 'Statistics', 'subtopics': ['Scatter Plots', 'Linear Models', 'Two-Way Tables']},
    
    # Grade 9
    {'grade': 9, 'topic': 'Algebra I', 'subtopics': ['Polynomials', 'Factoring', 'Quadratic Equations', 'Quadratic Functions', 'Exponential Functions']},
    {'grade': 9, 'topic': 'Geometry', 'subtopics': ['Coordinate Geometry', 'Parallel Lines', 'Triangle Properties', 'Similarity', 'Right Triangles']},
    {'grade': 9, 'topic': 'Functions', 'subtopics': ['Function Notation', 'Domain and Range', 'Transformations', 'Inverse Functions']},
    {'grade': 9, 'topic': 'Statistics', 'subtopics': ['Data Distributions', 'Standard Deviation', 'Regression']},
]

def main():
    """Generate content for Grades 7-9 using local Ollama"""
    log("=" * 60)
    log(f"🚀 Generating Curriculum for Grades 7-9 (Local Ollama - {MODEL})")
    log("=" * 60)
    
    # Load existing
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
    sets_per_subtopic = 4
    total_generated = 0
    start_time = time.time()
    
    for topic_data in topics:
        grade = topic_data['grade']
        topic = topic_data['topic']
        subtopics = topic_data['subtopics']
        
        for subtopic in subtopics:
            for set_num in range(1, sets_per_subtopic + 1):
                # Stop after 50 sets for testing
                if total_generated >= 50:
                    log("🛑 Reached 50 sets limit (test run)")
                    break
                
                log(f"📝 Grade {grade} - {topic} - {subtopic} - Set {set_num}")
                
                set_start = time.time()
                curriculum_set = generate_curriculum_set(grade, topic, subtopic, set_num)
                set_time = time.time() - set_start
                
                if curriculum_set:
                    curriculum.append(curriculum_set)
                    total_generated += 1
                    log(f"   ✅ Generated in {set_time:.1f}s")
                    
                    # Save every 10 sets
                    if total_generated % 10 == 0:
                        with open(CURRICULUM_FILE, 'w') as f:
                            json.dump(curriculum, f, indent=2)
                        
                        elapsed = time.time() - start_time
                        avg_time = elapsed / total_generated
                        remaining = (240 - total_generated) * avg_time
                        
                        log(f"💾 Saved {len(curriculum)} total sets ({total_generated} new)")
                        log(f"   ⏱️  Avg: {avg_time:.1f}s/set, ETA: {remaining/60:.1f} min")
                else:
                    log(f"   ❌ Failed")
                
                # Small delay to prevent overheating
                time.sleep(0.5)
            
            # Break subtopic loop if limit reached
            if total_generated >= 50:
                break
        
        # Break topic loop if limit reached
        if total_generated >= 50:
            break
    
    # Final save
    with open(CURRICULUM_FILE, 'w') as f:
        json.dump(curriculum, f, indent=2)
    
    total_time = time.time() - start_time
    
    log("=" * 60)
    log(f"✅ COMPLETE! Generated {total_generated} new sets")
    log(f"📊 Total curriculum sets: {len(curriculum)}")
    log(f"⏱️  Total time: {total_time/60:.1f} minutes")
    log(f"📈 Average: {total_time/total_generated:.1f} seconds per set")
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
