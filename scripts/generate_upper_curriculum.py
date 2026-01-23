#!/usr/bin/env python3
"""
Grade 7-9 Curriculum Generator with Manim Integration
Generates advanced math curriculum (Algebra, Geometry) and extracts Manim visualization code.
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
model = genai.GenerativeModel('gemini-2.0-flash-exp')

# Configuration
NUM_SETS = 5  # Reduced further to ensure JSON validity
OUTPUT_FILE = "data/curriculum_7_9.json"
MANIM_DIR = "manim_tutorials"

os.makedirs(MANIM_DIR, exist_ok=True)

PROMPT = """
Generate a math curriculum JSON for Grades 7-9 (Middle/High School).
Focus on:
- Grade 7: Pre-Algebra, Ratios, Expressions
- Grade 8: Linear Equations, Functions, Pythagorean Theorem
- Grade 9: Algebra I (Quadratics, Polynomials), Geometry Basics

Generate {num_sets} curriculum sets.

CRITICAL JSON STRUCTURE:
Return ONLY a JSON array. Each object must strictly follow this schema:
{{
  "id": "grade-topic-difficulty",
  "title": "Topic Human Readable",
  "description": "Short description",
  "grade_level": <integer 7-9>,
  "topic": "Topic Category",
  "difficulty": "medium",
  "questions": [
    {{
      "question": "The actual math question text",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "answer": "The correct option text (must match one option exactly)",
      "hints": ["Hint 1", "Hint 2", "Hint 3"],
      "explanation": "Detailed explanation of the solution.",
      "manim_code": "REQUIRED for this question: Complete Python code for a Manim scene visualizing this specific problem. Use `MathTex` for equations. Explain the steps visually."
    }}
  ]
}}

REQUIREMENTS:
1. Generate EXACTLY ONE (1) curriculum set.
2. 5 questions per set.
3. For "manim_code", provide valid `manim` Community Edition Python code.
   - The class name must be unique (use the ID).
   - It must inherit from `Scene`.
   - It should be a self-contained script (imports included).
   - Use `MathTex` for equations.
   - Do NOT wrap `manim_code` in markdown backticks inside the JSON string.
""".format(num_sets=1)

print("=" * 80)
print(f"Generating {NUM_SETS} sets for Grades 7-9 (Iteratively)...")
print("=" * 80)

all_curriculum = []
generated_count = 0

for i in range(NUM_SETS):
    print(f"\nGenerative Set {i+1}/{NUM_SETS}...")
    try:
        response = model.generate_content(
            PROMPT,
            generation_config=genai.types.GenerationConfig(
                temperature=0.7,
                max_output_tokens=50000, # Should be plenty for 1 set
            )
        )
        
        text = response.text
        
        # Clean up markdown
        if '```json' in text:
            text = text.split('```json')[1].split('```')[0]
        elif '```' in text:
            text = text.split('```')[1].split('```')[0]
        text = text.strip()
        
        # Handle cases where LLM returns a list or a single object
        data = json.loads(text)
        if isinstance(data, dict):
            data = [data] # Wrap in list if single object
            
        all_curriculum.extend(data)
        generated_count += 1
        
    except Exception as e:
        print(f"⚠️ Error generating set {i+1}: {e}")
        continue

curriculum = all_curriculum
print(f"\n✅ Successfully generated {len(curriculum)} sets total.")
    
# Process Manim code
manim_count = 0
for set_data in curriculum:
    set_id = set_data.get('id', 'unknown')
    for q_idx, question in enumerate(set_data.get('questions', [])):
        manim_code = question.get('manim_code')
        
        if manim_code:
            manim_count += 1
            # Create a filename
            filename = f"scene_{set_id}_q{q_idx+1}.py"
            filepath = os.path.join(MANIM_DIR, filename)
            
            # Save the script
            with open(filepath, 'w') as f:
                # Ensure imports are present if LLM missed them in the substring
                if "from manim import *" not in manim_code:
                        f.write("from manim import *\n\n")
                f.write(manim_code)
            
            # Add a reference in the JSON (optional, for frontend to know)
            question['manim_file'] = filename
            
            # Clean the big code string out of the JSON if we want to keep it light,
            # BUT the user might want to re-generate on the fly, so let's keep it 
            # or remove it? The prompt asked for it in JSON, so let's keep it for now
            # or maybe minimize it. Let's keep it for completeness unless file size explodes.
            
            # Actually, let's remove it from JSON to keep the app payload small, 
            # since the frontend can't run python code anyway.
            # The 'manim_file' reference is enough for the app to load a video URL later.
            del question['manim_code']

# Save Main JSON
with open(OUTPUT_FILE, 'w') as f:
    json.dump(curriculum, f, indent=2)
    
print(f"✅ Saved curriculum to {OUTPUT_FILE}")
print(f"🎥 Extracted {manim_count} Manim scripts to {MANIM_DIR}/")

