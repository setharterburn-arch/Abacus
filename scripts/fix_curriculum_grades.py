#!/usr/bin/env python3
"""
Fix curriculum grade levels by analyzing topics
"""

import json
from pathlib import Path

# Load curriculum
PROJECT_ROOT = Path(__file__).parent.parent
CURRICULUM_FILE = PROJECT_ROOT / 'src' / 'data' / 'curriculum.json'

with open(CURRICULUM_FILE, 'r') as f:
    curriculum = json.load(f)

print(f"Total sets: {len(curriculum)}")

# Grade mapping based on topic keywords
GRADE_KEYWORDS = {
    0: ['counting 1-10', 'counting 1-20', 'shapes', 'basic shapes', 'pattern recognition', 'adding 1-5', 'adding 6-10', 'picture addition', 'numbers 1-10', 'numbers 11-20', 'counting objects', 'number order', 'shape properties'],
    1: ['facts to 10', 'facts to 20', 'word problems', 'missing addends', 'fact families', 'tens and ones', 'comparing numbers', 'number patterns', 'addition facts', 'subtraction facts'],
    2: ['2-digit', '3-digit', 'regrouping', 'mental math', 'borrowing', 'length', 'weight', 'capacity', 'time', 'counting coins', 'making change'],
    3: ['multiplication', 'tables 2-5', 'tables 6-9', 'arrays', 'division', 'remainders', 'unit fractions', 'comparing fractions', 'equivalent fractions', 'angles', 'perimeter', 'area'],
    4: ['multi-digit', 'factors', 'multiples', 'prime numbers', 'long division', 'mixed numbers', 'decimals', 'volume'],
    5: ['decimals', 'operations', 'rounding', 'ratios', 'proportions', 'rates', 'percentages', 'coordinate plane', 'surface area']
}

def infer_grade(curriculum_set):
    """Infer grade level from topic, title, and description"""
    # Check ID first
    id_str = curriculum_set.get('id', '').lower()
    if id_str.startswith('k-') or id_str.startswith('0-'):
        return 0
    for grade in range(1, 6):
        if id_str.startswith(f'{grade}-'):
            return grade
    
    # Check topic, title, description
    text = f"{curriculum_set.get('topic', '')} {curriculum_set.get('title', '')} {curriculum_set.get('description', '')}".lower()
    
    # Score each grade
    scores = {grade: 0 for grade in range(6)}
    for grade, keywords in GRADE_KEYWORDS.items():
        for keyword in keywords:
            if keyword in text:
                scores[grade] += 1
    
    # Return grade with highest score, or existing grade if tie
    max_score = max(scores.values())
    if max_score > 0:
        return max(scores, key=scores.get)
    
    # Fallback to existing grade
    return curriculum_set.get('grade_level', 0)

# Fix grades
fixed_count = 0
grade_distribution = {i: 0 for i in range(7)}

for curriculum_set in curriculum:
    old_grade = curriculum_set.get('grade_level', 0)
    new_grade = infer_grade(curriculum_set)
    
    if old_grade != new_grade:
        curriculum_set['grade_level'] = new_grade
        fixed_count += 1
        print(f"Fixed: {curriculum_set.get('id')} from Grade {old_grade} to Grade {new_grade}")
    
    grade_distribution[new_grade] += 1

print(f"\n✅ Fixed {fixed_count} curriculum sets")
print(f"\nNew distribution:")
for grade, count in sorted(grade_distribution.items()):
    if count > 0:
        print(f"  Grade {grade}: {count} sets")

# Save fixed curriculum
with open(CURRICULUM_FILE, 'w') as f:
    json.dump(curriculum, f, indent=2)

print(f"\n✅ Saved to {CURRICULUM_FILE}")
