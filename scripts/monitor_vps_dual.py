import pexpect
import time
import os
from datetime import datetime

VPS_USER = "ubuntu"
VPS_HOST = "51.81.203.89"
PASSWORD = "Jemc8534!"

def clear_screen():
    os.system('clear' if os.name == 'posix' else 'cls')

def get_vps_logs():
    """Fetch both log files from VPS"""
    try:
        cmd = 'tail -n 20 ~/math-homeschool-gen/generation_7_9.log && echo "===SEPARATOR===" && tail -n 20 ~/math-homeschool-gen/generation_7_9_gemini.log'
        
        child = pexpect.spawn(f'ssh -o StrictHostKeyChecking=no {VPS_USER}@{VPS_HOST} "{cmd}"')
        
        index = child.expect(['password:', pexpect.EOF, pexpect.TIMEOUT], timeout=10)
        if index == 0:
            child.sendline(PASSWORD)
            child.expect(pexpect.EOF, timeout=10)
            output = child.before.decode()
            
            # Split the output
            if '===SEPARATOR===' in output:
                parts = output.split('===SEPARATOR===')
                claude_log = parts[0].strip()
                gemini_log = parts[1].strip() if len(parts) > 1 else ""
                return claude_log, gemini_log
            
        return "Error fetching logs", "Error fetching logs"
    except Exception as e:
        return f"Error: {e}", f"Error: {e}"

def count_sets(log_content):
    """Count generated sets from log"""
    return log_content.count('📝 Grade')

def get_last_activity(log_content):
    """Get last activity line"""
    lines = [l for l in log_content.split('\n') if l.strip()]
    return lines[-1] if lines else "No activity"

def monitor_dual_generation(refresh_seconds=10):
    """Monitor both generation processes"""
    print("🎯 Starting dual generation monitor...")
    print(f"Refresh rate: {refresh_seconds} seconds")
    print("Press Ctrl+C to exit\n")
    time.sleep(2)
    
    try:
        iteration = 0
        while True:
            iteration += 1
            clear_screen()
            
            print("=" * 80)
            print(f"📊 DUAL GENERATION MONITOR - {datetime.now().strftime('%H:%M:%S')} (Refresh #{iteration})")
            print("=" * 80)
            
            claude_log, gemini_log = get_vps_logs()
            
            # Claude status
            print("\n🤖 CLAUDE (Haiku) - Core Topics (Pre-Algebra, Ratios, Geometry, Stats)")
            print("-" * 80)
            claude_count = count_sets(claude_log)
            claude_last = get_last_activity(claude_log)
            
            print(f"Sets attempted: ~{claude_count}")
            print(f"Last activity: {claude_last}")
            print("\nRecent log:")
            print(claude_log[-600:] if len(claude_log) > 600 else claude_log)
            
            # Gemini status
            print("\n" + "=" * 80)
            print("✨ GEMINI (2.0 Flash) - Additional Topics (Number Theory, Rational Numbers, etc.)")
            print("-" * 80)
            gemini_count = count_sets(gemini_log)
            gemini_last = get_last_activity(gemini_log)
            
            print(f"Sets attempted: ~{gemini_count}")
            print(f"Last activity: {gemini_last}")
            print("\nRecent log:")
            print(gemini_log[-600:] if len(gemini_log) > 600 else gemini_log)
            
            # Summary
            print("\n" + "=" * 80)
            total_attempted = claude_count + gemini_count
            print(f"📈 COMBINED PROGRESS: ~{total_attempted} sets attempted")
            print(f"   Claude: ~{claude_count} | Gemini: ~{gemini_count}")
            
            # Estimate completion
            if total_attempted > 0:
                target_total = 360  # 240 Claude + 120 Gemini
                percent = (total_attempted / target_total) * 100
                print(f"   Progress: {percent:.1f}% of {target_total} target sets")
            
            print(f"\n🔄 Next refresh in {refresh_seconds} seconds...")
            print("=" * 80)
            
            time.sleep(refresh_seconds)
            
    except KeyboardInterrupt:
        print("\n\n✅ Monitoring stopped by user")
        print(f"Final count: Claude ~{claude_count}, Gemini ~{gemini_count}, Total ~{claude_count + gemini_count}")

if __name__ == '__main__':
    monitor_dual_generation()
