#!/usr/bin/env python3
"""
Bulk Curriculum Generator using Gemini AI
Generates 100+ curriculum sets in a single API call
"""

import os
import json
from google import generativeai as genai

# Configure Gemini
API_KEY = os.getenv('VITE_GEMINI_API_KEY')
if not API_KEY:
    print("Error: VITE_GEMINI_API_KEY not found in environment")
    exit(1)

genai.configure(api_key=API_KEY)
model = genai.GenerativeModel('gemini-2.0-flash-exp')

# Define curriculum expansion plan
CURRICULUM_PLAN = """
Generate a comprehensive math curriculum JSON file with 100 curriculum sets covering grades K-6.

CRITICAL REQUIREMENTS:
1. Output ONLY valid JSON - no markdown, no explanations, just the JSON array
2. Each set must have: id, title, description, grade_level, topic, difficulty, questions
3. Each question must have: question, options (4 choices), answer, hints (3 levels), explanation
4. Follow age-appropriateness rules strictly

AGE-APPROPRIATENESS RULES:
- Kindergarten (grade_level: 0): Counting 1-20, shapes, patterns. NO arithmetic symbols (+, -, ×, ÷)
- Grade 1 (grade_level: 1): Addition/subtraction within 20, time, money. NO multiplication/division
- Grade 2 (grade_level: 2): Addition/subtraction within 100, place value. NO multiplication/division  
- Grade 3 (grade_level: 3): Multiplication tables, division basics, simple fractions
- Grade 4 (grade_level: 4): Multi-digit operations, decimals, equivalent fractions
- Grade 5 (grade_level: 5): Fraction operations, decimal operations, volume
- Grade 6 (grade_level: 6): Ratios, percentages, negative numbers, basic algebra

DISTRIBUTION (100 sets total):
- Kindergarten: 15 sets
- Grade 1: 20 sets
- Grade 2: 20 sets
- Grade 3: 15 sets
- Grade 4: 15 sets
- Grade 5: 10 sets
- Grade 6: 5 sets

TOPICS TO COVER:
Kindergarten: Counting, Number Recognition, Shapes, Patterns, Comparing Numbers, Sorting
Grade 1: Addition Facts, Subtraction Facts, Word Problems, Time (hour/half-hour), Money (pennies, nickels, dimes), Measurement
Grade 2: 2-digit Addition, 2-digit Subtraction, Place Value (hundreds), Skip Counting, Arrays, Data & Graphs
Grade 3: Multiplication Tables (2-12), Division Facts, Fractions (halves, thirds, fourths), Area, Perimeter
Grade 4: Multi-digit Multiplication, Long Division, Equivalent Fractions, Decimals (tenths, hundredths), Angles
Grade 5: Adding/Subtracting Fractions, Multiplying Fractions, Decimal Operations, Volume, Coordinate Plane
Grade 6: Ratios, Percentages, Negative Numbers, Order of Operations, Simple Equations, Statistical Thinking

QUESTION FORMAT:
Each set should have 10 questions. Example structure:
{
  "id": "g1-addition-facts-1-10",
  "title": "Addition Facts 1-10",
  "description": "Practice basic addition with numbers 1-10",
  "grade_level": 1,
  "topic": "Addition",
  "difficulty": "easy",
  "questions": [
    {
      "question": "What is 3 + 4?",
      "options": ["5", "6", "7", "8"],
      "answer": "7",
      "hints": [
        "Start at 3 and count up 4 more numbers",
        "Try using your fingers: hold up 3, then 4 more",
        "3 + 4 is the same as 4 + 3"
      ],
      "explanation": "When we add 3 + 4, we start at 3 and count up 4 more: 4, 5, 6, 7. So 3 + 4 = 7."
    }
  ]
}

QUALITY GUIDELINES:
- Questions must be clear and unambiguous
- Distractors (wrong answers) should be plausible but clearly incorrect
- Hints should progressively reveal more information (general → specific → strong nudge)
- Explanations should teach the concept, not just state the answer
- Use age-appropriate vocabulary and sentence structure
- Vary question types within each set

Generate 100 complete curriculum sets following this specification. Return ONLY the JSON array.
"""

print("="*80)
print("BULK CURRICULUM GENERATOR")
print("="*80)
print("\nGenerating 100 curriculum sets using Gemini AI...")
print("This may take 30-60 seconds...\n")

try:
    # Generate curriculum
    response = model.generate_content(
        CURRICULUM_PLAN,
        generation_config=genai.types.GenerationConfig(
            temperature=0.7,
            max_output_tokens=100000,  # Large output needed
        )
    )
    
    # Extract JSON from response
    text = response.text
    
    # Remove markdown code blocks if present
    if '```json' in text:
        text = text.split('```json')[1].split('```')[0]
    elif '```' in text:
        text = text.split('```')[1].split('```')[0]
    
    text = text.strip()
    
    # Parse JSON
    curriculum = json.loads(text)
    
    # Validate structure
    if not isinstance(curriculum, list):
        raise ValueError("Response is not a JSON array")
    
    print(f"✅ Successfully generated {len(curriculum)} curriculum sets!")
    
    # Statistics
    grade_dist = {}
    topic_dist = {}
    total_questions = 0
    
    for set_data in curriculum:
        grade = set_data.get('grade_level', -1)
        grade_label = f"Grade {grade}" if grade > 0 else "Kindergarten"
        grade_dist[grade_label] = grade_dist.get(grade_label, 0) + 1
        
        topic = set_data.get('topic', 'Unknown')
        topic_dist[topic] = topic_dist.get(topic, 0) + 1
        
        total_questions += len(set_data.get('questions', []))
    
    print(f"\n📊 Statistics:")
    print(f"   Total Sets: {len(curriculum)}")
    print(f"   Total Questions: {total_questions}")
    print(f"   Average Questions per Set: {total_questions / len(curriculum):.1f}")
    
    print(f"\n📚 Grade Distribution:")
    for grade in sorted(grade_dist.keys()):
        print(f"   {grade}: {grade_dist[grade]} sets")
    
    print(f"\n🎯 Top Topics:")
    for topic, count in sorted(topic_dist.items(), key=lambda x: x[1], reverse=True)[:10]:
        print(f"   {topic}: {count} sets")
    
    # Save to file
    output_file = f"generated-curriculum-bulk-{len(curriculum)}.json"
    with open(output_file, 'w') as f:
        json.dump(curriculum, f, indent=2)
    
    print(f"\n💾 Saved to: {output_file}")
    print(f"\n✅ Success! You can now merge this into your main curriculum.")
    print(f"   Run: ./merge-curriculum.sh {output_file}")
    
except json.JSONDecodeError as e:
    print(f"❌ Error: Failed to parse JSON response")
    print(f"   {str(e)}")
    print(f"\n   Response preview:")
    print(f"   {text[:500]}...")
    
except Exception as e:
    print(f"❌ Error: {str(e)}")
    import traceback
    traceback.print_exc()

print("\n" + "="*80)
