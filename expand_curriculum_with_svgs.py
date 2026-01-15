#!/usr/bin/env python3
"""
Generate curriculum sets with SVG images for K-2 students.
Creates simple, clean SVG graphics for counting, shapes, and basic math.
"""

import json
import os

def create_counting_svg(count, shape='circle', color='#4f46e5'):
    """Create SVG with counting objects arranged in rows."""
    size = 400
    obj_size = 30
    spacing = 50
    per_row = 5
    
    svg = f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {size} {size}">'
    svg += f'<rect width="{size}" height="{size}" fill="white"/>'
    
    for i in range(count):
        row = i // per_row
        col = i % per_row
        x = 50 + col * spacing
        y = 50 + row * spacing
        
        if shape == 'circle':
            svg += f'<circle cx="{x}" cy="{y}" r="{obj_size//2}" fill="{color}" stroke="#1e293b" stroke-width="2"/>'
        elif shape == 'square':
            svg += f'<rect x="{x-obj_size//2}" y="{y-obj_size//2}" width="{obj_size}" height="{obj_size}" fill="{color}" stroke="#1e293b" stroke-width="2"/>'
        elif shape == 'star':
            svg += f'<text x="{x}" y="{y}" font-size="30" text-anchor="middle" dominant-baseline="middle">⭐</text>'
        elif shape == 'apple':
            svg += f'<text x="{x}" y="{y}" font-size="30" text-anchor="middle" dominant-baseline="middle">🍎</text>'
    
    svg += '</svg>'
    return svg

def create_shape_svg(shape_type, color='#4f46e5'):
    """Create SVG of a basic shape."""
    size = 300
    svg = f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {size} {size}">'
    svg += f'<rect width="{size}" height="{size}" fill="white"/>'
    
    center = size // 2
    
    if shape_type == 'circle':
        svg += f'<circle cx="{center}" cy="{center}" r="100" fill="{color}" stroke="#1e293b" stroke-width="3"/>'
    elif shape_type == 'square':
        svg += f'<rect x="75" y="75" width="150" height="150" fill="{color}" stroke="#1e293b" stroke-width="3"/>'
    elif shape_type == 'triangle':
        svg += f'<polygon points="{center},75 225,225 75,225" fill="{color}" stroke="#1e293b" stroke-width="3"/>'
    elif shape_type == 'rectangle':
        svg += f'<rect x="50" y="100" width="200" height="100" fill="{color}" stroke="#1e293b" stroke-width="3"/>'
    
    svg += '</svg>'
    return svg

def create_comparison_svg(left_count, right_count):
    """Create SVG showing two groups for comparison."""
    size = 400
    svg = f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {size} {size}">'
    svg += f'<rect width="{size}" height="{size}" fill="white"/>'
    
    # Left group
    for i in range(left_count):
        row = i // 3
        col = i % 3
        x = 50 + col * 40
        y = 150 + row * 40
        svg += f'<circle cx="{x}" cy="{y}" r="15" fill="#6366f1" stroke="#1e293b" stroke-width="2"/>'
    
    # Right group
    for i in range(right_count):
        row = i // 3
        col = i % 3
        x = 250 + col * 40
        y = 150 + row * 40
        svg += f'<circle cx="{x}" cy="{y}" r="15" fill="#ec4899" stroke="#1e293b" stroke-width="2"/>'
    
    svg += '</svg>'
    return svg

def save_svg(svg_content, filename):
    """Save SVG to file."""
    os.makedirs('public/curriculum-images', exist_ok=True)
    filepath = f'public/curriculum-images/{filename}'
    with open(filepath, 'w') as f:
        f.write(svg_content)
    return f'/curriculum-images/{filename}'

# Generate 100 new curriculum sets
new_sets = []
image_counter = 100  # Start after existing images

# Kindergarten - Counting (20 sets)
for i in range(1, 21):
    num = i
    shape = ['circle', 'square', 'star', 'apple'][i % 4]
    
    # Create image
    svg = create_counting_svg(num, shape)
    img_path = save_svg(svg, f'count-{num}-{shape}.svg')
    
    questions = [
        {
            "question": f"How many {shape}s do you see?",
            "options": [str(num-1), str(num), str(num+1), str(num+2)],
            "answer": str(num),
            "image": img_path
        },
        {
            "question": f"Count the {shape}s. Which number is correct?",
            "options": [str(num), str(num+2), str(num-2) if num > 2 else "0", str(num+3)],
            "answer": str(num),
            "image": img_path
        }
    ]
    
    new_sets.append({
        "id": f"k-counting-{num}",
        "title": f"Counting to {num}",
        "description": f"Practice counting objects up to {num}",
        "grade_level": 0,
        "topic": "Counting",
        "questions": questions
    })

# Kindergarten - Shapes (10 sets)
shapes = ['circle', 'square', 'triangle', 'rectangle']
for i, shape in enumerate(shapes * 3):  # Repeat to get 12, take 10
    if len([s for s in new_sets if s['topic'] == 'Shapes']) >= 10:
        break
    
    svg = create_shape_svg(shape)
    img_path = save_svg(svg, f'shape-{shape}-{i}.svg')
    
    sides = {'circle': 0, 'square': 4, 'triangle': 3, 'rectangle': 4}
    corners = {'circle': 0, 'square': 4, 'triangle': 3, 'rectangle': 4}
    
    questions = [
        {
            "question": f"What shape is this?",
            "options": ["Circle", "Square", "Triangle", "Rectangle"],
            "answer": shape.capitalize(),
            "image": img_path
        },
        {
            "question": f"How many sides does this shape have?",
            "options": ["0", "3", "4", "5"],
            "answer": str(sides[shape]),
            "image": img_path
        }
    ]
    
    new_sets.append({
        "id": f"k-shapes-{shape}-{i}",
        "title": f"Identifying {shape.capitalize()}s",
        "description": f"Learn about {shape}s and their properties",
        "grade_level": 0,
        "topic": "Shapes",
        "questions": questions
    })

# Kindergarten - More/Less (15 sets)
for i in range(15):
    left = (i % 7) + 1
    right = ((i + 3) % 7) + 1
    
    svg = create_comparison_svg(left, right)
    img_path = save_svg(svg, f'compare-{left}-{right}.svg')
    
    more_count = max(left, right)
    less_count = min(left, right)
    
    questions = [
        {
            "question": "Which group has MORE?",
            "options": ["Left (blue)", "Right (pink)", "They are equal", "Cannot tell"],
            "answer": "Left (blue)" if left > right else "Right (pink)" if right > left else "They are equal",
            "image": img_path
        },
        {
            "question": "Which group has LESS?",
            "options": ["Left (blue)", "Right (pink)", "They are equal", "Cannot tell"],
            "answer": "Left (blue)" if left < right else "Right (pink)" if right < left else "They are equal",
            "image": img_path
        }
    ]
    
    new_sets.append({
        "id": f"k-compare-{i}",
        "title": f"Comparing Groups",
        "description": "Practice comparing quantities",
        "grade_level": 0,
        "topic": "Comparison",
        "questions": questions
    })

# Grade 1 - Addition with pictures (20 sets)
for i in range(20):
    a = (i % 5) + 1
    b = ((i + 2) % 5) + 1
    total = a + b
    
    # Create two groups side by side
    svg = create_comparison_svg(a, b)
    img_path = save_svg(svg, f'add-{a}-{b}.svg')
    
    questions = [
        {
            "question": f"How many circles in total?",
            "options": [str(total-1), str(total), str(total+1), str(total+2)],
            "answer": str(total),
            "image": img_path
        },
        {
            "question": f"{a} + {b} = ?",
            "options": [str(total), str(total-1), str(total+1), str(total+2)],
            "answer": str(total),
            "image": img_path
        }
    ]
    
    new_sets.append({
        "id": f"1-addition-visual-{i}",
        "title": f"Addition: {a} + {b}",
        "description": f"Visual addition practice",
        "grade_level": 1,
        "topic": "Addition",
        "questions": questions
    })

# Grade 1 - Subtraction with pictures (15 sets)
for i in range(15):
    start = (i % 8) + 3
    subtract = (i % 3) + 1
    result = start - subtract
    
    svg = create_counting_svg(start, 'circle')
    img_path = save_svg(svg, f'subtract-{start}-{subtract}.svg')
    
    questions = [
        {
            "question": f"If you cross out {subtract} circles, how many are left?",
            "options": [str(result), str(result+1), str(result-1) if result > 0 else "0", str(result+2)],
            "answer": str(result),
            "image": img_path
        },
        {
            "question": f"{start} - {subtract} = ?",
            "options": [str(result-1) if result > 0 else "0", str(result), str(result+1), str(result+2)],
            "answer": str(result),
            "image": img_path
        }
    ]
    
    new_sets.append({
        "id": f"1-subtraction-visual-{i}",
        "title": f"Subtraction: {start} - {subtract}",
        "description": "Visual subtraction practice",
        "grade_level": 1,
        "topic": "Subtraction",
        "questions": questions
    })

# Grade 2 - Arrays (10 sets)
for i in range(10):
    rows = (i % 3) + 2
    cols = ((i + 1) % 3) + 2
    total = rows * cols
    
    # Create array grid
    size = 400
    svg = f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {size} {size}">'
    svg += f'<rect width="{size}" height="{size}" fill="white"/>'
    
    spacing = 60
    for r in range(rows):
        for c in range(cols):
            x = 80 + c * spacing
            y = 80 + r * spacing
            svg += f'<circle cx="{x}" cy="{y}" r="20" fill="#6366f1" stroke="#1e293b" stroke-width="2"/>'
    
    svg += '</svg>'
    img_path = save_svg(svg, f'array-{rows}x{cols}.svg')
    
    questions = [
        {
            "question": f"How many rows are there?",
            "options": [str(rows-1) if rows > 1 else "1", str(rows), str(rows+1), str(cols)],
            "answer": str(rows),
            "image": img_path
        },
        {
            "question": f"How many circles in total?",
            "options": [str(total-1), str(total), str(total+1), str(total+2)],
            "answer": str(total),
            "image": img_path
        }
    ]
    
    new_sets.append({
        "id": f"2-arrays-{i}",
        "title": f"Arrays: {rows} × {cols}",
        "description": "Understanding arrays and multiplication",
        "grade_level": 2,
        "topic": "Arrays",
        "questions": questions
    })

print(f"Generated {len(new_sets)} new curriculum sets with images!")

# Load existing curriculum
with open('src/data/curriculum.json', 'r') as f:
    existing = json.load(f)

# Combine
all_sets = existing + new_sets

# Save
with open('src/data/curriculum.json', 'w') as f:
    json.dump(all_sets, f, indent=2)

print(f"Total curriculum sets: {len(all_sets)}")
print(f"Images created: {len(new_sets)} sets × ~2 questions each")
