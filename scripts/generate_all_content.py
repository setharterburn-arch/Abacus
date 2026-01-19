#!/usr/bin/env python3
"""
Automated Content Generation for Abacus Learn
Generates 1000 curriculum sets and 600 learning paths overnight
"""

import os
import json
import time
import subprocess
from datetime import datetime
from pathlib import Path

# Try to import Gemini, provide helpful error if missing
try:
    import google.generativeai as genai
except ImportError:
    print("❌ Error: google-generativeai not installed")
    print("Run: pip install google-generativeai")
    exit(1)

# Configuration
GEMINI_API_KEY = os.getenv('VITE_GEMINI_API_KEY')
if not GEMINI_API_KEY:
    print("❌ Error: VITE_GEMINI_API_KEY not found in environment")
    print("Make sure .env file is loaded")
    exit(1)

genai.configure(api_key=GEMINI_API_KEY)
model = genai.GenerativeModel('gemini-2.0-flash-exp')

# Paths
PROJECT_ROOT = Path(__file__).parent.parent
CURRICULUM_FILE = PROJECT_ROOT / 'src' / 'data' / 'curriculum.json'
PATHS_MD_FILE = PROJECT_ROOT / 'data' / 'learning_paths.md'
LOG_FILE = PROJECT_ROOT / 'generation_log.txt'

# Progress tracking
progress = {
    'curriculum_sets_generated': 0,
    'learning_paths_generated': 0,
    'errors': [],
    'start_time': None,
    'end_time': None
}

def log(message):
    """Log to both console and file"""
    timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    log_message = f"[{timestamp}] {message}"
    print(log_message)
    with open(LOG_FILE, 'a') as f:
        f.write(log_message + '\n')

def save_progress():
    """Save progress to checkpoint file"""
    with open(PROJECT_ROOT / 'generation_progress.json', 'w') as f:
        json.dump(progress, f, indent=2)

def load_existing_curriculum():
    """Load existing curriculum to avoid duplicates"""
    if CURRICULUM_FILE.exists():
        with open(CURRICULUM_FILE, 'r') as f:
            return json.load(f)
    return []

def generate_curriculum_set(grade, topic, subtopic, set_number):
    """Generate a single curriculum set using Gemini"""
    try:
        prompt = f"""Generate a math curriculum set for Grade {grade}.

Topic: {topic}
Subtopic: {subtopic}
Set Number: {set_number}

Create 12 multiple choice questions with 4 options each.
Format as JSON with this structure:
{{
  "id": "{grade}-{topic.lower().replace(' ', '-')}-{set_number}",
  "title": "{subtopic} - Set {set_number}",
  "description": "Practice {subtopic.lower()}",
  "grade_level": {grade},
  "topic": "{topic}",
  "questions": [
    {{
      "question": "Question text here",
      "options": ["A", "B", "C", "D"],
      "answer": "A",
      "explanation": "Why A is correct"
    }}
  ]
}}

Make questions progressively harder. Include variety. Return ONLY the JSON, no markdown formatting."""

        response = model.generate_content(prompt)
        
        # Parse JSON from response
        response_text = response.text.strip()
        if response_text.startswith('```json'):
            response_text = response_text[7:]
        if response_text.startswith('```'):
            response_text = response_text[3:]
        if response_text.endswith('```'):
            response_text = response_text[:-3]
        
        curriculum_set = json.loads(response_text.strip())
        
        # Validate
        if len(curriculum_set.get('questions', [])) != 12:
            raise ValueError(f"Expected 12 questions, got {len(curriculum_set.get('questions', []))}")
        
        return curriculum_set
        
    except Exception as e:
        log(f"❌ Error generating set: {e}")
        progress['errors'].append(str(e))
        return None

def generate_curriculum_batch(start_count, target_count):
    """Generate curriculum sets in batches"""
    log(f"\n🎯 Generating curriculum sets {start_count} to {target_count}...")
    
    # Load existing
    curriculum = load_existing_curriculum()
    existing_count = len(curriculum)
    
    # Topics to generate (expanded list)
    topics = [
        # Grade K
        (0, "Counting", ["Numbers 1-10", "Numbers 11-20", "Counting Objects", "Number Order"]),
        (0, "Shapes", ["Basic Shapes", "Shape Properties", "Pattern Recognition"]),
        (0, "Addition", ["Adding 1-5", "Adding 6-10", "Picture Addition"]),
        
        # Grade 1
        (1, "Addition", ["Facts to 10", "Facts to 20", "Word Problems", "Missing Addends"]),
        (1, "Subtraction", ["Facts to 10", "Facts to 20", "Word Problems", "Fact Families"]),
        (1, "Place Value", ["Tens and Ones", "Comparing Numbers", "Number Patterns"]),
        
        # Grade 2
        (2, "Addition", ["2-Digit Addition", "3-Digit Addition", "Regrouping", "Mental Math"]),
        (2, "Subtraction", ["2-Digit Subtraction", "3-Digit Subtraction", "Borrowing"]),
        (2, "Measurement", ["Length", "Weight", "Capacity", "Time"]),
        (2, "Money", ["Counting Coins", "Making Change", "Word Problems"]),
        
        # Grade 3
        (3, "Multiplication", ["Tables 2-5", "Tables 6-9", "Word Problems", "Arrays"]),
        (3, "Division", ["Basic Facts", "Remainders", "Word Problems", "Fact Families"]),
        (3, "Fractions", ["Unit Fractions", "Comparing Fractions", "Equivalent Fractions"]),
        (3, "Geometry", ["Angles", "Perimeter", "Area", "Shapes"]),
        
        # Grade 4
        (4, "Multiplication", ["Multi-Digit", "Factors", "Multiples", "Prime Numbers"]),
        (4, "Division", ["Long Division", "Remainders", "Word Problems"]),
        (4, "Fractions", ["Operations", "Mixed Numbers", "Decimals"]),
        (4, "Geometry", ["Area", "Perimeter", "Volume", "Angles"]),
        
        # Grade 5
        (5, "Decimals", ["Operations", "Comparing", "Rounding", "Word Problems"]),
        (5, "Fractions", ["Operations", "Mixed Numbers", "Conversions"]),
        (5, "Ratios", ["Basic Ratios", "Proportions", "Rates", "Percentages"]),
        (5, "Geometry", ["Coordinate Plane", "Volume", "Surface Area"])
    ]
    
    # Generate sets
    sets_to_generate = target_count - existing_count
    sets_per_topic = max(1, sets_to_generate // len(topics))
    
    for grade, topic, subtopics in topics:
        for i, subtopic in enumerate(subtopics):
            for set_num in range(1, sets_per_topic + 1):
                if len(curriculum) >= target_count:
                    break
                    
                log(f"Generating: Grade {grade} - {topic} - {subtopic} - Set {set_num}")
                
                curriculum_set = generate_curriculum_set(grade, topic, subtopic, set_num)
                
                if curriculum_set:
                    curriculum.append(curriculum_set)
                    progress['curriculum_sets_generated'] += 1
                    
                    # Save every 10 sets
                    if len(curriculum) % 10 == 0:
                        with open(CURRICULUM_FILE, 'w') as f:
                            json.dump(curriculum, f, indent=2)
                        log(f"✅ Saved {len(curriculum)} sets")
                        save_progress()
                
                # Rate limiting
                time.sleep(1)
                
            if len(curriculum) >= target_count:
                break
        if len(curriculum) >= target_count:
            break
    
    # Final save
    with open(CURRICULUM_FILE, 'w') as f:
        json.dump(curriculum, f, indent=2)
    
    log(f"✅ Generated {len(curriculum)} total curriculum sets")
    return len(curriculum)

def generate_learning_paths_batch(target_count_per_grade=100):
    """Generate learning paths in markdown"""
    log(f"\n🎯 Generating learning paths ({target_count_per_grade} per grade)...")
    
    paths_md = "# Learning Paths for Abacus Learn\n\n"
    
    grades = [
        (0, "K (Kindergarten)"),
        (1, "1"),
        (2, "2"),
        (3, "3"),
        (4, "4"),
        (5, "5")
    ]
    
    for grade_num, grade_name in grades:
        paths_md += f"## Grade {grade_name}\n\n"
        
        # Generate paths for this grade
        for path_num in range(1, target_count_per_grade + 1):
            log(f"Generating learning path {path_num} for Grade {grade_name}")
            
            try:
                prompt = f"""Create a learning path for Grade {grade_name} math.

Path number: {path_num}

Format as markdown:
### Path {path_num}: [Title]
- **Description:** [What students will learn]
- **Estimated Time:** [25-35] minutes
- **Modules:**
  * module-id-1
  * module-id-2
  * module-id-3

Make it focused on a specific skill progression. Return ONLY the markdown, no extra text."""

                response = model.generate_content(prompt)
                path_md = response.text.strip()
                
                # Clean up response
                if path_md.startswith('```markdown'):
                    path_md = path_md[11:]
                if path_md.startswith('```'):
                    path_md = path_md[3:]
                if path_md.endswith('```'):
                    path_md = path_md[:-3]
                
                paths_md += path_md.strip() + "\n\n"
                progress['learning_paths_generated'] += 1
                
                # Save every 20 paths
                if progress['learning_paths_generated'] % 20 == 0:
                    with open(PATHS_MD_FILE, 'w') as f:
                        f.write(paths_md)
                    log(f"✅ Saved {progress['learning_paths_generated']} paths")
                    save_progress()
                
                # Rate limiting
                time.sleep(1)
                
            except Exception as e:
                log(f"❌ Error generating path: {e}")
                progress['errors'].append(str(e))
        
        paths_md += "\n"
    
    # Final save
    with open(PATHS_MD_FILE, 'w') as f:
        f.write(paths_md)
    
    log(f"✅ Generated {progress['learning_paths_generated']} learning paths")
    
    # Convert to JSON
    log("Converting paths to JSON...")
    try:
        subprocess.run(['python3', 'scripts/convert_paths_to_json.py'], 
                      cwd=PROJECT_ROOT, check=True)
        log("✅ Converted paths to JSON")
    except Exception as e:
        log(f"❌ Error converting paths: {e}")

def commit_and_push():
    """Commit and push changes to GitHub"""
    log("\n📤 Committing and pushing to GitHub...")
    
    try:
        subprocess.run(['git', 'add', '-A'], cwd=PROJECT_ROOT, check=True)
        
        commit_msg = f"feat: Generated {progress['curriculum_sets_generated']} curriculum sets and {progress['learning_paths_generated']} learning paths"
        subprocess.run(['git', 'commit', '-m', commit_msg], cwd=PROJECT_ROOT, check=True)
        
        subprocess.run(['git', 'push', 'origin', 'main'], cwd=PROJECT_ROOT, check=True)
        
        log("✅ Successfully pushed to GitHub")
    except Exception as e:
        log(f"❌ Error with git: {e}")
        log("You can manually commit and push later")

def main():
    """Main execution"""
    progress['start_time'] = datetime.now().isoformat()
    
    log("=" * 60)
    log("🚀 ABACUS LEARN - AUTOMATED CONTENT GENERATION")
    log("=" * 60)
    log(f"Target: 1000 curriculum sets, 600 learning paths")
    log(f"Started: {progress['start_time']}")
    log("=" * 60)
    
    try:
        # Generate curriculum sets
        final_count = generate_curriculum_batch(0, 1000)
        log(f"\n✅ Curriculum generation complete: {final_count} sets")
        
        # Generate learning paths
        generate_learning_paths_batch(100)
        log(f"\n✅ Learning paths generation complete: {progress['learning_paths_generated']} paths")
        
        # Commit and push
        commit_and_push()
        
    except KeyboardInterrupt:
        log("\n⚠️  Generation interrupted by user")
    except Exception as e:
        log(f"\n❌ Fatal error: {e}")
        progress['errors'].append(str(e))
    finally:
        progress['end_time'] = datetime.now().isoformat()
        save_progress()
        
        log("\n" + "=" * 60)
        log("📊 GENERATION SUMMARY")
        log("=" * 60)
        log(f"Curriculum sets: {progress['curriculum_sets_generated']}")
        log(f"Learning paths: {progress['learning_paths_generated']}")
        log(f"Errors: {len(progress['errors'])}")
        log(f"Duration: {progress['start_time']} to {progress['end_time']}")
        log("=" * 60)
        
        if progress['errors']:
            log("\n⚠️  Errors encountered:")
            for error in progress['errors'][:10]:  # Show first 10
                log(f"  - {error}")

if __name__ == '__main__':
    main()
