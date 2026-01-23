#!/usr/bin/env python3
"""
Prototype Manim Curriculum Generator
Generates sample Grade 7-9 content with Manim animations for equations.
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

PROMPT = """
Generate a sample math curriculum JSON for Grades 7-9 (Middle/High School).
Focus on ALGEBRA and EQUATIONS where visual animations would be helpful.

Generate 2 curriculum sets:
1. Grade 7: Simple Equations (e.g., 2x + 5 = 15)
2. Grade 8/9: Systems of Equations or Quadratics (e.g., x^2 - 4 = 0)

CRITICAL REQUIREMENTS:
1. Output ONLY valid JSON array.
2. Structure:
   - id, title, description, grade_level, topic, difficulty
   - questions (array):
     - question, options, answer, explanation
     - manim_code (string): A COMPLETE, RUNNABLE Python script using Manim Community Edition.
       - The script must define a class inheriting from `Scene`.
       - It should visualize the solution step-by-step.
       - Do NOT include markdown blocks inside the JSON string for manim_code.

Example `manim_code` content:
"from manim import *\n\nclass SolveEquation(Scene):\n    def construct(self):\n        ..."

Generative 2 sets with 2 questions each for this prototype.
"""

print("Generating prototype content...")
try:
    response = model.generate_content(PROMPT)
    text = response.text
    
    # improved cleanup
    if '```json' in text:
        text = text.split('```json')[1].split('```')[0]
    elif '```' in text:
        text = text.split('```')[1].split('```')[0]
    text = text.strip()
    
    data = json.loads(text)
    
    # Save JSON
    with open('data/prototype_manim_curriculum.json', 'w') as f:
        json.dump(data, f, indent=2)
    print("Saved JSON to data/prototype_manim_curriculum.json")
    
    # Extract and save Manim scripts
    for i, item in enumerate(data):
        for j, q in enumerate(item.get('questions', [])):
            code = q.get('manim_code')
            if code:
                filename = f"manim_tutorials/scene_{item['id']}_q{j+1}.py"
                # Clean up potential escaped newlines if they aren't real newlines
                # (JSON loader handles \n, but sometimes LLM double escapes)
                with open(filename, 'w') as f:
                    f.write(code)
                print(f"Saved Manim script to {filename}")

except Exception as e:
    print(f"Error: {e}")
    print(f"Raw output: {text[:500]}...")
