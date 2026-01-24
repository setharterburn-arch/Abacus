import json
import re

CURRICULUM_FILE = 'src/data/curriculum.json'
REPORT_FILE = 'audit-report.json'
LOG_FILE = 'fix_log.txt'

def normalize(text):
    if not isinstance(text, str): return str(text)
    return text.lower().strip().replace(' ', '')

def main():
    print("Loading files...")
    with open(CURRICULUM_FILE, 'r') as f:
        curriculum = json.load(f)
    
    with open(REPORT_FILE, 'r') as f:
        report = json.load(f)

    # Index curriculum by set_id, handling duplicates
    curr_map = {}
    for item in curriculum:
        sid = item.get('id')
        if sid not in curr_map:
            curr_map[sid] = []
        curr_map[sid].append(item)
    
    fixes = []
    skipped = 0
    fixed_count = 0
    deleted_count = 0

    print(f"Processing {len(report)} findings...")

    for item in report:
        reason = item.get('reason', '')
        correct_answer = item.get('correct_answer')
        current_answer = item.get('current_answer')
        
        # Skip False Positives
        if "No error" in reason or "answer provided is correct" in reason:
            skipped += 1
            continue
        
        if str(correct_answer) == str(current_answer):
            skipped += 1
            continue

        set_id = item.get('set_id')
        set_title = item.get('set_title')
        q_text = item.get('question_text')
        
        if set_id not in curr_map:
            print(f"Set ID {set_id} not found.")
            continue
            
        # Find the correct set among duplicates using title
        candidates = curr_map[set_id]
        curriculum_set = None
        
        if len(candidates) == 1:
            curriculum_set = candidates[0]
        else:
            # Try to match title
            for c in candidates:
                if c.get('title') == set_title:
                    curriculum_set = c
                    break
            # Fallback if title mismatch (audit title might be slightly diff?)
            if not curriculum_set and candidates:
                # Search all candidates for the question
                for c in candidates:
                     for q in c.get('questions', []):
                         if q_text in q['question'] or q['question'] in q_text:
                             curriculum_set = c
                             break
                             
        if not curriculum_set:
             print(f"Could not disambiguate set {set_id} with title '{set_title}'")
             continue
        
        # Find the specific question
        target_q = None
        for q in curriculum_set['questions']:
            if q['question'] == q_text:
                target_q = q
                break
        
        if not target_q:
            # Try fuzzy match
            for q in curriculum_set['questions']:
                if q_text in q['question'] or q['question'] in q_text:
                    target_q = q
                    break
        
        if not target_q:
            print(f"Question not found in set {set_id}: {q_text}")
            continue

        # ACTION: Delete if flagged as nonsensical/error
        if correct_answer in ["This question contains an error.", "null", None] or "nonsensical" in reason.lower() or "question is flawed" in reason.lower():
            curriculum_set['questions'].remove(target_q)
            msg = f"[DELETE] Set: {set_id} | Q: {q_text}\nReason: {reason}\n"
            fixes.append(msg)
            deleted_count += 1
            continue

        # ACTION: Fix Answer
        # Strategy: Update the question's correct answer and ensure it exists in options
        old_ans = target_q.get('answer') or target_q.get('correctAnswer')
        
        # Determine the new answer from the report
        new_ans = str(correct_answer)
        
        # Check if new answer is in options
        options = target_q.get('options', [])
        
        # If options are strings, simple check
        # If the new answer is NOT in options, we should replace the old wrong answer in the options with the new right one
        # to preserve the structure.
        
        # Find if the old answer is in options
        replaced_in_options = False
        for i, opt in enumerate(options):
            if str(opt) == str(old_ans) or normalize(str(opt)) == normalize(str(old_ans)):
                options[i] = new_ans
                replaced_in_options = True
                break
        
        # If we didn't find the old answer to replace, just append/ensure the new answer is there?
        # Or maybe the old answer WAS correct but the Key was wrong? 
        # Case A: Key was wrong (Options: A, B(CORRECT), C; Key says A). 
        # -> We should just change Key to B. We don't change option text.
        
        # Case B: Answer text incorrect (Options: 1, 2, 4; Correct is 3).
        # -> We must change one option to 3.
        
        # Simple heueristic:
        # If `new_ans` is ALREADY in options, just update the key.
        # If `new_ans` is NOT in options, replace the `old_ans` option with `new_ans` and update key.
        
        if new_ans in [str(o) for o in options]:
            # Update key only
            pass
        elif replaced_in_options:
            # We already updated the option text above
            pass
        else:
            # Fallback: Just replace the first option or append?
            # Let's replace the option that matched 'current_answer' from report if possible
            # (We tried that above with old_ans).
            # If still not found, just append it? No, array length might matter.
            # Let's replace the last option.
            if options:
                options[-1] = new_ans
        
        # Update the question object
        if 'correctAnswer' in target_q:
            target_q['correctAnswer'] = new_ans
        if 'answer' in target_q:
            target_q['answer'] = new_ans
            
        target_q['options'] = options
        
        msg = f"[FIX] Set: {set_id}\nQ: {q_text}\nOld Answer: {old_ans} -> New Answer: {new_ans}\nReason: {reason}\n"
        fixes.append(msg)
        fixed_count += 1

    # Save Log
    with open(LOG_FILE, 'w') as f:
        f.write(f"Fixed {fixed_count} questions. Deleted {deleted_count} questions. Skipped {skipped} false positives.\n\n")
        f.write("\n".join(fixes))
        
    # Save Curriculum
    with open(CURRICULUM_FILE, 'w') as f:
        json.dump(curriculum, f, indent=4)

    print(f"Done. Fixed {fixed_count}, Deleted {deleted_count}. Log saved to {LOG_FILE}.")

if __name__ == "__main__":
    main()
