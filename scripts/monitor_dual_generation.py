#!/usr/bin/env python3
"""
Monitor both Claude and Gemini generation processes
Shows live progress from both log files
"""

import time
import os
from datetime import datetime

def get_log_tail(filepath, lines=10):
    """Get last N lines from a file"""
    try:
        with open(filepath, 'r') as f:
            all_lines = f.readlines()
            return ''.join(all_lines[-lines:])
    except FileNotFoundError:
        return f"[Log file not found: {filepath}]"
    except Exception as e:
        return f"[Error reading {filepath}: {e}]"

def count_generated(log_content):
    """Count how many sets were generated from log"""
    count = 0
    for line in log_content.split('\n'):
        if '📝 Grade' in line:
            count += 1
    return count

def parse_last_save(log_content):
    """Extract last save message"""
    for line in reversed(log_content.split('\n')):
        if '✅ Saved' in line or '✅ COMPLETE' in line:
            return line.strip()
    return None

def clear_screen():
    """Clear terminal screen"""
    os.system('clear' if os.name == 'posix' else 'cls')

def monitor_logs(claude_log, gemini_log, refresh_seconds=5):
    """Monitor both log files"""
    print("🎯 Starting dual generation monitor...")
    print(f"Refresh rate: {refresh_seconds} seconds")
    print("Press Ctrl+C to exit\n")
    
    try:
        while True:
            clear_screen()
            
            print("=" * 80)
            print(f"📊 DUAL GENERATION MONITOR - {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
            print("=" * 80)
            
            # Claude status
            print("\n🤖 CLAUDE (Haiku) - Core Topics")
            print("-" * 80)
            claude_content = get_log_tail(claude_log, 15)
            claude_count = count_generated(claude_content)
            claude_save = parse_last_save(claude_content)
            
            print(f"Sets attempted: ~{claude_count}")
            if claude_save:
                print(f"Last save: {claude_save}")
            print("\nRecent activity:")
            print(claude_content[-500:] if len(claude_content) > 500 else claude_content)
            
            # Gemini status
            print("\n" + "=" * 80)
            print("✨ GEMINI (2.0 Flash) - Additional Topics")
            print("-" * 80)
            gemini_content = get_log_tail(gemini_log, 15)
            gemini_count = count_generated(gemini_content)
            gemini_save = parse_last_save(gemini_content)
            
            print(f"Sets attempted: ~{gemini_count}")
            if gemini_save:
                print(f"Last save: {gemini_save}")
            print("\nRecent activity:")
            print(gemini_content[-500:] if len(gemini_content) > 500 else gemini_content)
            
            # Summary
            print("\n" + "=" * 80)
            print(f"📈 COMBINED PROGRESS: ~{claude_count + gemini_count} sets attempted")
            print(f"🔄 Next refresh in {refresh_seconds} seconds...")
            print("=" * 80)
            
            time.sleep(refresh_seconds)
            
    except KeyboardInterrupt:
        print("\n\n✅ Monitoring stopped by user")

if __name__ == '__main__':
    import sys
    
    # Default log paths
    claude_log = 'generation_7_9.log'
    gemini_log = 'generation_7_9_gemini.log'
    
    # Allow custom paths as arguments
    if len(sys.argv) > 1:
        claude_log = sys.argv[1]
    if len(sys.argv) > 2:
        gemini_log = sys.argv[2]
    
    monitor_logs(claude_log, gemini_log)
