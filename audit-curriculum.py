#!/usr/bin/env python3
import json
import re

# Load curriculum
with open('src/data/curriculum.json', 'r') as f:
    curriculum = json.load(f)

# Grade level expectations
grade_expectations = {
    0: {'max_number': 20, 'topics': ['Counting', 'Shapes', 'Patterns'], 'no_operations': True},
    1: {'max_number': 100, 'topics': ['Addition', 'Subtraction', 'Counting', 'Time', 'Money'], 'no_mult_div': True},
    2: {'max_number': 1000, 'topics': ['Addition', 'Subtraction', 'Place Value', 'Measurement'], 'no_mult_div': True},
    3: {'max_number': 10000, 'topics': ['Multiplication', 'Division', 'Fractions', 'Area']},
    4: {'max_number': 1000000, 'topics': ['Multiplication', 'Division', 'Fractions', 'Decimals', 'Geometry']},
    5: {'max_number': 1000000, 'topics': ['Decimals', 'Fractions', 'Volume', 'Coordinate Plane']},
    6: {'max_number': float('inf'), 'topics': ['Ratios', 'Percentages', 'Negative Numbers', 'Expressions']}
}

issues = []
warnings = []

print("="*80)
print("CURRICULUM AGE-APPROPRIATENESS AUDIT")
print("="*80)
print(f"\nAnalyzing {len(curriculum)} curriculum sets...\n")

for set_data in curriculum:
    grade = set_data['grade_level']
    expectations = grade_expectations.get(grade, {})
    
    for q_idx, question in enumerate(set_data['questions'], 1):
        q_text = question['question']
        
        # Extract numbers
        numbers = [int(n) for n in re.findall(r'\d+', q_text)]
        max_num = max(numbers) if numbers else 0
        
        # Check number size
        if max_num > expectations.get('max_number', float('inf')):
            issues.append({
                'set': set_data['title'],
                'grade': f"Grade {grade}" if grade > 0 else "Kindergarten",
                'question_num': q_idx,
                'question': q_text[:80] + "..." if len(q_text) > 80 else q_text,
                'issue': f"Number {max_num} too large (max: {expectations['max_number']})",
                'severity': 'HIGH'
            })
        
        # Check for inappropriate operations
        if expectations.get('no_operations') and re.search(r'[\+\-\*÷×]', q_text):
            issues.append({
                'set': set_data['title'],
                'grade': f"Grade {grade}" if grade > 0 else "Kindergarten",
                'question_num': q_idx,
                'question': q_text[:80] + "..." if len(q_text) > 80 else q_text,
                'issue': 'Arithmetic operations not appropriate for Kindergarten',
                'severity': 'HIGH'
            })
        
        if expectations.get('no_mult_div') and re.search(r'[\*÷×]|multipl|divid|times', q_text.lower()):
            issues.append({
                'set': set_data['title'],
                'grade': f"Grade {grade}" if grade > 0 else "Kindergarten",
                'question_num': q_idx,
                'question': q_text[:80] + "..." if len(q_text) > 80 else q_text,
                'issue': f'Multiplication/division not appropriate for Grade {grade}',
                'severity': 'HIGH'
            })
        
        # Check for fractions/decimals in early grades
        if grade <= 2 and re.search(r'fraction|decimal|½|¼|\.5|percent', q_text.lower()):
            issues.append({
                'set': set_data['title'],
                'grade': f"Grade {grade}" if grade > 0 else "Kindergarten",
                'question_num': q_idx,
                'question': q_text[:80] + "..." if len(q_text) > 80 else q_text,
                'issue': f'Fractions/decimals not appropriate for Grade {grade}',
                'severity': 'HIGH'
            })
        
        # Check question length
        word_count = len(q_text.split())
        max_words = 10 if grade == 0 else grade * 8
        if word_count > max_words:
            warnings.append({
                'set': set_data['title'],
                'grade': f"Grade {grade}" if grade > 0 else "Kindergarten",
                'question_num': q_idx,
                'issue': f'Question too long ({word_count} words, max recommended: {max_words})'
            })

# Print results
print(f"✅ Total Sets Analyzed: {len(curriculum)}")
print(f"🚨 High Priority Issues: {len(issues)}")
print(f"⚠️  Warnings: {len(warnings)}\n")

if issues:
    print("\n" + "="*80)
    print("🚨 HIGH PRIORITY ISSUES (MUST FIX)")
    print("="*80)
    for i, issue in enumerate(issues[:20], 1):  # Show first 20
        print(f"\n{i}. {issue['set']} ({issue['grade']})")
        print(f"   Question #{issue['question_num']}: {issue['question']}")
        print(f"   ❌ {issue['issue']}")
    
    if len(issues) > 20:
        print(f"\n... and {len(issues) - 20} more issues")

if warnings:
    print("\n" + "="*80)
    print("⚠️  WARNINGS (Review Recommended)")
    print("="*80)
    for i, warning in enumerate(warnings[:10], 1):  # Show first 10
        print(f"\n{i}. {warning['set']} ({warning['grade']})")
        print(f"   Question #{warning['question_num']}")
        print(f"   ⚠️  {warning['issue']}")
    
    if len(warnings) > 10:
        print(f"\n... and {len(warnings) - 10} more warnings")

# Grade distribution
grade_dist = {}
for set_data in curriculum:
    grade = f"Grade {set_data['grade_level']}" if set_data['grade_level'] > 0 else "Kindergarten"
    grade_dist[grade] = grade_dist.get(grade, 0) + 1

print("\n" + "="*80)
print("📊 GRADE DISTRIBUTION")
print("="*80)
for grade in sorted(grade_dist.keys()):
    print(f"{grade}: {grade_dist[grade]} sets")

# Save report
report = {
    'summary': {
        'total_sets': len(curriculum),
        'total_issues': len(issues),
        'total_warnings': len(warnings)
    },
    'issues': issues,
    'warnings': warnings,
    'grade_distribution': grade_dist
}

with open('audit-report.json', 'w') as f:
    json.dump(report, f, indent=2)

print("\n" + "="*80)
print("💾 Full report saved to: audit-report.json")
print("="*80)
