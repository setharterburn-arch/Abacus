#!/usr/bin/env python3
"""
Robust Bulk Curriculum Generator with JSON Repair
Handles malformed JSON responses from Gemini
"""

import os
import json
import re
from google import generativeai as genai

# Configure Gemini
API_KEY = os.getenv('VITE_GEMINI_API_KEY')
if not API_KEY:
    print("Error: VITE_GEMINI_API_KEY not found in environment")
    exit(1)

genai.configure(api_key=API_KEY)

def fix_json_string(json_str):
    """
    Attempt to fix common JSON errors in Gemini responses
    """
    # Remove markdown code blocks
    if '```json' in json_str:
        json_str = json_str.split('```json')[1].split('```')[0]
    elif '```' in json_str:
        json_str = json_str.split('```')[1].split('```')[0]
    
    json_str = json_str.strip()
    
    # Fix unterminated strings by finding the last complete object
    # Strategy: Find the last complete curriculum set and truncate there
    if '"explanation"' in json_str:
        # Find all complete question objects
        last_complete = json_str.rfind('}')
        if last_complete > 0:
            # Find the closing of the questions array
            after_last = json_str[last_complete:]
            if ']' in after_last:
                array_close = last_complete + after_last.find(']')
                # Find the closing of the set object
                after_array = json_str[array_close:]
                if '}' in after_array:
                    set_close = array_close + after_array.find('}')
                    # Truncate and close the main array
                    json_str = json_str[:set_close+1] + '\n]'
    
    return json_str

def generate_curriculum_batch(num_sets=20, grade_focus=None):
    """
    Generate a smaller batch of curriculum sets
    """
    grade_dist = {
        0: 3, 1: 4, 2: 4, 3: 3, 4: 3, 5: 2, 6: 1
    } if not grade_focus else {grade_focus: num_sets}
    
    prompt = f"""Generate EXACTLY {num_sets} math curriculum sets as a JSON array.

CRITICAL: Output ONLY valid JSON. No markdown, no text, just the array.

Each set needs:
- id: unique identifier (e.g., "g1-addition-basic")
- title: descriptive title
- description: brief description
- grade_level: 0-6 (0=Kindergarten)
- topic: math topic
- difficulty: "easy", "medium", or "hard"
- questions: array of 10 question objects

Each question needs:
- question: the question text (keep SHORT and clear)
- options: array of 4 answer choices
- answer: the correct answer (must match one option exactly)
- hints: array of 3 progressive hints
- explanation: brief explanation of the answer

DISTRIBUTION:
{chr(10).join([f'- Grade {k if k > 0 else "K"}: {v} sets' for k, v in grade_dist.items()])}

AGE RULES:
- K: Counting only, NO +/-/×/÷ symbols
- 1-2: Addition/subtraction only
- 3+: Can use multiplication/division/fractions

IMPORTANT: Keep all text SHORT. Questions under 15 words. Explanations under 30 words.

Return ONLY the JSON array, starting with [ and ending with ]."""

    model = genai.GenerativeModel(
        'gemini-2.0-flash-exp',
        generation_config=genai.types.GenerationConfig(
            temperature=0.7,
            max_output_tokens=50000,
        )
    )
    
    response = model.generate_content(prompt)
    return response.text

def generate_curriculum_in_chunks(total_sets=100, chunk_size=20):
    """
    Generate curriculum in multiple smaller chunks
    """
    all_sets = []
    chunks_needed = (total_sets + chunk_size - 1) // chunk_size
    
    print(f"Generating {total_sets} sets in {chunks_needed} chunks of ~{chunk_size} sets each\n")
    
    for i in range(chunks_needed):
        chunk_num = i + 1
        sets_this_chunk = min(chunk_size, total_sets - len(all_sets))
        
        print(f"Chunk {chunk_num}/{chunks_needed}: Generating {sets_this_chunk} sets...", end=' ', flush=True)
        
        try:
            response_text = generate_curriculum_batch(sets_this_chunk)
            
            # Try to parse
            try:
                chunk_sets = json.loads(response_text)
            except json.JSONDecodeError as e:
                print(f"\n⚠️  JSON error, attempting repair...", end=' ', flush=True)
                fixed_text = fix_json_string(response_text)
                chunk_sets = json.loads(fixed_text)
            
            if isinstance(chunk_sets, list):
                all_sets.extend(chunk_sets)
                print(f"✅ Got {len(chunk_sets)} sets (total: {len(all_sets)})")
            else:
                print(f"❌ Response was not an array")
                
        except Exception as e:
            print(f"❌ Error: {str(e)}")
            continue
    
    return all_sets

# Main execution
if __name__ == "__main__":
    print("="*80)
    print("ROBUST BULK CURRICULUM GENERATOR")
    print("="*80)
    print("\nGenerating curriculum in manageable chunks...")
    print("This will take 2-3 minutes for 100 sets\n")
    
    try:
        curriculum = generate_curriculum_in_chunks(total_sets=100, chunk_size=20)
        
        print(f"\n{'='*80}")
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
        print(f"\n✅ Success! Merge with: ./merge-curriculum.sh {output_file}")
        
    except Exception as e:
        print(f"\n❌ Fatal Error: {str(e)}")
        import traceback
        traceback.print_exc()
    
    print("\n" + "="*80)
