import os
import json
from google import generativeai as genai

# Configure Gemini
genai.configure(api_key=os.getenv('VITE_GEMINI_API_KEY'))
model = genai.GenerativeModel('gemini-2.0-flash-exp')

# Load existing curriculum to see what modules we have
with open('src/data/curriculum.json', 'r') as f:
    curriculum = json.load(f)

# Get all module IDs organized by grade
modules_by_grade = {}
for module in curriculum:
    grade = module['grade_level']
    if grade not in modules_by_grade:
        modules_by_grade[grade] = []
    modules_by_grade[grade].append({
        'id': module['id'],
        'title': module['title'],
        'topic': module.get('topic', ''),
        'difficulty': module.get('difficulty', '')
    })

# Create prompt for Gemini
prompt = f"""You are organizing math curriculum modules into learning paths for K-4 students.

Here are the existing modules organized by grade:

{json.dumps(modules_by_grade, indent=2)}

Create 50 learning paths that group related modules together. Each path should:
- Contain 3-5 modules
- Have a clear learning progression
- Total 30-50 questions (assume ~10-12 questions per module)
- Take 20-30 minutes to complete

Output in this EXACT markdown format:

# Learning Paths

## Grade K

### Path 1: [Path Title]
- **Description:** [One sentence description]
- **Estimated Time:** [X minutes]
- **Modules:**
  * [module-id-1]
  * [module-id-2]
  * [module-id-3]

### Path 2: [Path Title]
...

## Grade 1

### Path 1: [Path Title]
...

Create paths for:
- Grade K: 10 paths
- Grade 1: 12 paths  
- Grade 2: 14 paths
- Grade 3: 14 paths

IMPORTANT: Only use module IDs that exist in the list above. Do not invent new module IDs.
"""

print("Generating learning paths with Gemini...")
response = model.generate_content(prompt)

# Save markdown output
with open('data/learning_paths.md', 'w') as f:
    f.write(response.text)

print("✅ Learning paths generated!")
print(f"Saved to: data/learning_paths.md")
print("\nNext step: Review the markdown file, then run convert_paths_to_json.py")
