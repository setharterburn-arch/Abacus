import json
import os

MAIN_FILE = 'src/data/curriculum.json'
NEW_FILE = 'data/curriculum_7_9.json'

def main():
    if not os.path.exists(NEW_FILE):
        print(f"Error: {NEW_FILE} not found.")
        return

    print("Loading curriculum files...")
    with open(MAIN_FILE, 'r') as f:
        main_data = json.load(f)
    
    with open(NEW_FILE, 'r') as f:
        new_data = json.load(f)
    
    # Create a set of existing IDs
    existing_ids = {item['id'] for item in main_data}
    
    added_count = 0
    skipped_count = 0
    
    for item in new_data:
        if item['id'] in existing_ids:
            skipped_count += 1
        else:
            main_data.append(item)
            existing_ids.add(item['id'])
            added_count += 1
            
    print(f"Merged {added_count} new sets. Skipped {skipped_count} existing sets.")
    
    with open(MAIN_FILE, 'w') as f:
        json.dump(main_data, f, indent=4)
        
    print(f"Saved to {MAIN_FILE}")

if __name__ == "__main__":
    main()
