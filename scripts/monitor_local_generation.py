#!/usr/bin/env python3
"""
Monitor local Ollama generation progress
"""

import time
import os
from datetime import datetime

LOG_FILE = 'generation_7_9_local.log'

def clear_screen():
    os.system('clear')

def get_log_tail(lines=30):
    """Get last N lines from log file"""
    try:
        with open(LOG_FILE, 'r') as f:
            all_lines = f.readlines()
            return ''.join(all_lines[-lines:])
    except FileNotFoundError:
        return "[Waiting for generation to start...]"
    except Exception as e:
        return f"[Error reading log: {e}]"

def count_stats(log_content):
    """Extract statistics from log"""
    attempts = log_content.count('📝 Grade')
    successes = log_content.count('✅ Generated')
    failures = log_content.count('❌ Failed')
    saves = log_content.count('💾 Saved')
    
    return attempts, successes, failures, saves

def get_last_line(log_content):
    """Get last meaningful line"""
    lines = [l.strip() for l in log_content.split('\n') if l.strip()]
    return lines[-1] if lines else "No activity yet"

def extract_eta(log_content):
    """Extract ETA from log"""
    for line in reversed(log_content.split('\n')):
        if 'ETA:' in line:
            return line.split('ETA:')[1].strip()
    return "Calculating..."

def monitor_local_generation(refresh_seconds=3):
    """Monitor local Ollama generation"""
    print("🎯 Starting local generation monitor...")
    print(f"Refresh rate: {refresh_seconds} seconds")
    print("Press Ctrl+C to exit\n")
    time.sleep(2)
    
    try:
        iteration = 0
        while True:
            iteration += 1
            clear_screen()
            
            print("=" * 80)
            print(f"🖥️  LOCAL OLLAMA MONITOR - {datetime.now().strftime('%H:%M:%S')} (Refresh #{iteration})")
            print("=" * 80)
            
            log_content = get_log_tail(40)
            attempts, successes, failures, saves = count_stats(log_content)
            
            print(f"\n📊 STATISTICS")
            print("-" * 80)
            print(f"Sets attempted: {attempts}")
            print(f"Successful: {successes} ✅")
            print(f"Failed: {failures} ❌")
            print(f"Success rate: {(successes/attempts*100) if attempts > 0 else 0:.1f}%")
            print(f"Auto-saves: {saves}")
            
            if attempts > 0:
                eta = extract_eta(log_content)
                print(f"ETA: {eta}")
            
            print(f"\n📝 RECENT ACTIVITY")
            print("-" * 80)
            # Show last 25 lines
            recent = '\n'.join(log_content.split('\n')[-25:])
            print(recent)
            
            print("\n" + "=" * 80)
            print(f"🔄 Next refresh in {refresh_seconds} seconds...")
            print("=" * 80)
            
            time.sleep(refresh_seconds)
            
    except KeyboardInterrupt:
        print("\n\n✅ Monitoring stopped by user")
        print(f"Final stats: {attempts} attempts, {successes} successful, {failures} failed")

if __name__ == '__main__':
    monitor_local_generation()
