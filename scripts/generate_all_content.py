#!/usr/bin/env python3
"""
Automated Content Generation for Abacus Learn
Generates curriculum sets and learning paths using Claude API
"""

import os
import json
import time
import subprocess
from datetime import datetime
from pathlib import Path

# Import Anthropic (Claude)
try:
    from anthropic import Anthropic
except ImportError:
    print("❌ Error: anthropic not installed")
    print("Run: pip3 install anthropic")
    exit(1)

# Configuration
CLAUDE_API_KEY = os.getenv('CLAUDE_API_KEY')
if not CLAUDE_API_KEY:
    print("❌ Error: CLAUDE_API_KEY not found in environment")
    print("Make sure .env file has CLAUDE_API_KEY set")
    exit(1)

# Initialize Claude client
client = Anthropic(api_key=CLAUDE_API_KEY)

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
    """Generate a single curriculum set using Claude"""
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

        # Call Claude API
        message = client.messages.create(
            model="claude-3-5-sonnet-20241022",
            max_tokens=4096,
            messages=[
                {"role": "user", "content": prompt}
            ]
        )
        
        # Extract text from Claude response
        response_text = message.content[0].text.strip()
        
        # Clean up markdown formatting if present
        if response_text.startswith('```json'):
            response_text = response_text.split('```json')[1].split('```')[0].strip()
        elif response_text.startswith('```'):
            response_text = response_text.split('```')[1].split('```')[0].strip()
        
        # Parse JSON
        curriculum_set = json.loads(response_text)
        
        # Ensure grade_level is correct (Claude sometimes changes it)
        curriculum_set['grade_level'] = grade
        
        return curriculum_set
        
    except json.JSONDecodeError as e:
        log(f"❌ JSON parse error for {grade}-{topic}: {e}")
        progress['errors'].append(f"JSON error: {grade}-{topic}-{set_number}")
        return None
    except Exception as e:
        log(f"❌ Error generating {grade}-{topic}: {e}")
        progress['errors'].append(f"Generation error: {grade}-{topic}-{set_number}: {str(e)}")
        return None

# Curriculum topics by grade
topics = [
    # Grade K
    {'grade': 0, 'topic': 'Counting', 'subtopics': ['Numbers 1-10', 'Numbers 11-20', 'Counting Objects']},
    {'grade': 0, 'topic': 'Shapes', 'subtopics': ['Basic Shapes', 'Shape Properties', 'Pattern Recognition']},
    {'grade': 0, 'topic': 'Addition', 'subtopics': ['Adding 1-5', 'Adding 6-10', 'Picture Addition']},
    
    # Grade 1
    {'grade': 1, 'topic': 'Addition', 'subtopics': ['Facts to 10', 'Facts to 20', 'Word Problems']},
    {'grade': 1, 'topic': 'Subtraction', 'subtopics': ['Facts to 10', 'Facts to 20', 'Missing Numbers']},
    {'grade': 1, 'topic': 'Place Value', 'subtopics': ['Tens and Ones', 'Comparing Numbers', 'Number Patterns']},
    
    # Grade 2
    {'grade': 2, 'topic': 'Addition', 'subtopics': ['2-Digit Addition', '3-Digit Addition', 'Regrouping']},
    {'grade': 2, 'topic': 'Subtraction', 'subtopics': ['2-Digit Subtraction', '3-Digit Subtraction', 'Borrowing']},
    {'grade': 2, 'topic': 'Measurement', 'subtopics': ['Length', 'Weight', 'Time']},
    
    # Grade 3
    {'grade': 3, 'topic': 'Multiplication', 'subtopics': ['Tables 2-5', 'Tables 6-9', 'Arrays']},
    {'grade': 3, 'topic': 'Division', 'subtopics': ['Basic Division', 'Division with Remainders', 'Word Problems']},
    {'grade': 3, 'topic': 'Fractions', 'subtopics': ['Unit Fractions', 'Comparing Fractions', 'Equivalent Fractions']},
    
    # Grade 4
    {'grade': 4, 'topic': 'Multiplication', 'subtopics': ['Multi-Digit', 'Factors', 'Prime Numbers']},
    {'grade': 4, 'topic': 'Division', 'subtopics': ['Long Division', 'Multiples', 'Word Problems']},
    {'grade': 4, 'topic': 'Fractions', 'subtopics': ['Mixed Numbers', 'Adding Fractions', 'Subtracting Fractions']},
    
    # Grade 5
    {'grade': 5, 'topic': 'Decimals', 'subtopics': ['Place Value', 'Operations', 'Rounding']},
    {'grade': 5, 'topic': 'Fractions', 'subtopics': ['Multiplying', 'Dividing', 'Converting']},
    {'grade': 5, 'topic': 'Geometry', 'subtopics': ['Coordinate Plane', 'Volume', 'Surface Area']},
]

def generate_all_curriculum(target_count=1000):
    """Generate curriculum sets"""
    log("🎯 Starting curriculum generation...")
    log(f"Target: {target_count} sets")
    
    curriculum = load_existing_curriculum()
    log(f"📚 Loaded {len(curriculum)} existing sets")
    
    sets_per_topic = max(1, (target_count - len(curriculum)) // len(topics))
    log(f"📊 Generating ~{sets_per_topic} sets per topic")
    
    for topic_data in topics:
        grade = topic_data['grade']
        topic = topic_data['topic']
        subtopics = topic_data['subtopics']
        
        for subtopic in subtopics:
            for set_num in range(1, sets_per_topic + 1):
                if len(curriculum) >= target_count:
                    break
                    
                log(f"📝 Generating Grade {grade} - {topic} - {subtopic} - Set {set_num}")
                
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
                
                # Rate limiting - Claude can handle faster requests
                time.sleep(0.5)
                
            if len(curriculum) >= target_count:
                break
        if len(curriculum) >= target_count:
            break
    
    # Final save
    with open(CURRICULUM_FILE, 'w') as f:
        json.dump(curriculum, f, indent=2)
    
    log(f"✅ Generated {len(curriculum)} total curriculum sets")
    return len(curriculum)

def main():
    """Main execution"""
    progress['start_time'] = datetime.now().isoformat()
    
    log("=" * 60)
    log("🚀 Abacus Learn Content Generation (Claude API)")
    log("=" * 60)
    
    try:
        # Generate curriculum
        total_sets = generate_all_curriculum(target_count=100)  # Start with 100 for testing
        
        progress['end_time'] = datetime.now().isoformat()
        save_progress()
        
        log("=" * 60)
        log("✅ GENERATION COMPLETE!")
        log(f"📊 Curriculum Sets: {total_sets}")
        log(f"❌ Errors: {len(progress['errors'])}")
        log("=" * 60)
        
        if progress['errors']:
            log("\n⚠️  Errors encountered:")
            for error in progress['errors'][:10]:  # Show first 10
                log(f"  - {error}")
        
    except KeyboardInterrupt:
        log("\n⚠️  Generation interrupted by user")
        save_progress()
    except Exception as e:
        log(f"\n❌ Fatal error: {e}")
        save_progress()
        raise

if __name__ == '__main__':
    main()
