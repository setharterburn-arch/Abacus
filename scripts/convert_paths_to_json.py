import re
import json

def parse_learning_paths(markdown_file):
    """Convert learning paths markdown to JSON"""
    
    with open(markdown_file, 'r') as f:
        content = f.read()
    
    paths = []
    current_grade = 0
    
    # Split content by lines to track grade changes
    lines = content.split('\n')
    current_path = None
    in_modules = False
    
    for line in lines:
        # Check for grade header
        grade_match = re.match(r'##\s+Grade\s+([K0-9]+)', line)
        if grade_match:
            grade_str = grade_match.group(1)
            current_grade = 0 if grade_str == 'K' else int(grade_str)
            continue
        
        # Check for path header
        path_match = re.match(r'###\s+Path\s+\d+:\s+(.+)', line)
        if path_match:
            # Save previous path if exists
            if current_path:
                paths.append(current_path)
            
            # Start new path
            title = path_match.group(1).strip()
            grade_prefix = 'k' if current_grade == 0 else str(current_grade)
            path_id = f"{grade_prefix}-{title.lower().replace(' ', '-').replace('(', '').replace(')', '').replace('&', 'and')}"
            
            current_path = {
                "id": path_id,
                "title": title,
                "description": "",
                "grade_level": current_grade,
                "estimated_time": 25,
                "modules": [],
                "total_questions": 0,
                "prerequisites": [],
                "next_paths": []
            }
            in_modules = False
            continue
        
        # Extract description
        if current_path and '**Description:**' in line:
            desc_match = re.search(r'\*\*Description:\*\*\s+(.+)', line)
            if desc_match:
                current_path['description'] = desc_match.group(1).strip()
            continue
        
        # Extract estimated time
        if current_path and '**Estimated Time:**' in line:
            time_match = re.search(r'\*\*Estimated Time:\*\*\s+(\d+)\s+minutes', line)
            if time_match:
                current_path['estimated_time'] = int(time_match.group(1))
            continue
        
        # Check for modules section
        if current_path and '**Modules:**' in line:
            in_modules = True
            continue
        
        # Extract module IDs
        if current_path and in_modules and line.strip().startswith('*'):
            module_id = line.strip().lstrip('* ').strip()
            if module_id:
                current_path['modules'].append(module_id)
    
    # Add the last path
    if current_path:
        paths.append(current_path)
    
    # Calculate total questions for each path
    for path in paths:
        path['total_questions'] = len(path['modules']) * 12
    
    return paths

def main():
    print("Converting learning paths from markdown to JSON...")
    
    paths = parse_learning_paths('data/learning_paths.md')
    
    # Save to JSON
    with open('src/data/learning_paths.json', 'w') as f:
        json.dump(paths, f, indent=2)
    
    print(f"✅ Converted {len(paths)} learning paths!")
    print(f"Saved to: src/data/learning_paths.json")
    
    # Print summary
    by_grade = {}
    for path in paths:
        grade = path['grade_level']
        if grade not in by_grade:
            by_grade[grade] = 0
        by_grade[grade] += 1
    
    print("\nSummary:")
    for grade, count in sorted(by_grade.items()):
        grade_name = 'K' if grade == 0 else f'Grade {grade}'
        print(f"  {grade_name}: {count} paths")

if __name__ == '__main__':
    main()
