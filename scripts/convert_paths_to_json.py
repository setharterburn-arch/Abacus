import re
import json

def parse_learning_paths(markdown_file):
    """Convert learning paths markdown to JSON"""
    
    with open(markdown_file, 'r') as f:
        content = f.read()
    
    paths = []
    current_grade = None
    
    # Split by path sections
    sections = re.split(r'###\s+Path\s+\d+:', content)
    
    for i, section in enumerate(sections[1:], 1):  # Skip first split (header)
        lines = section.strip().split('\n')
        
        # Extract title (first line)
        title = lines[0].strip()
        
        # Extract description
        desc_match = re.search(r'\*\*Description:\*\*\s+(.+)', section)
        description = desc_match.group(1) if desc_match else ""
        
        # Extract estimated time
        time_match = re.search(r'\*\*Estimated Time:\*\*\s+(\d+)\s+minutes', section)
        estimated_time = int(time_match.group(1)) if time_match else 25
        
        # Extract modules
        modules = []
        in_modules = False
        for line in lines:
            if '**Modules:**' in line:
                in_modules = True
                continue
            if in_modules and line.strip().startswith('*'):
                module_id = line.strip().lstrip('* ').strip()
                if module_id:
                    modules.append(module_id)
        
        # Determine grade from section context
        grade_match = re.search(r'##\s+Grade\s+([K0-9]+)', content[:content.index(section)])
        if grade_match:
            grade_str = grade_match.groups()[-1]  # Get last match
            current_grade = 0 if grade_str == 'K' else int(grade_str)
        
        # Create path ID
        grade_prefix = 'k' if current_grade == 0 else str(current_grade)
        path_id = f"{grade_prefix}-{title.lower().replace(' ', '-').replace('(', '').replace(')', '')}"
        
        path = {
            "id": path_id,
            "title": title,
            "description": description,
            "grade_level": current_grade,
            "estimated_time": estimated_time,
            "modules": modules,
            "total_questions": len(modules) * 12,  # Estimate 12 questions per module
            "prerequisites": [],
            "next_paths": []
        }
        
        paths.append(path)
    
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
