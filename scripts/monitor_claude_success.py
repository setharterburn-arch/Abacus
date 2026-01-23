import pexpect
import time

VPS_USER = "ubuntu"
VPS_HOST = "51.81.203.89"
PASSWORD = "Jemc8534!"

def get_claude_stats():
    """Get Claude generation statistics"""
    try:
        child = pexpect.spawn(f'ssh -o StrictHostKeyChecking=no {VPS_USER}@{VPS_HOST} "tail -n 100 ~/math-homeschool-gen/generation_7_9.log"')
        
        index = child.expect(['password:', pexpect.EOF, pexpect.TIMEOUT], timeout=10)
        if index == 0:
            child.sendline(PASSWORD)
            child.expect(pexpect.EOF, timeout=10)
            log_content = child.before.decode()
            
            # Count attempts and errors
            attempts = log_content.count('📝 Grade')
            errors = log_content.count('❌ Error')
            
            if attempts > 0:
                success_rate = ((attempts - errors) / attempts) * 100
                return attempts, errors, success_rate
            
        return 0, 0, 100.0
    except Exception as e:
        print(f"Error checking stats: {e}")
        return 0, 0, 100.0

def kill_claude():
    """Kill Claude process on VPS"""
    try:
        child = pexpect.spawn(f'ssh -o StrictHostKeyChecking=no {VPS_USER}@{VPS_HOST} "pkill -f generate_grades_7_9.py"')
        
        index = child.expect(['password:', pexpect.EOF, pexpect.TIMEOUT], timeout=10)
        if index == 0:
            child.sendline(PASSWORD)
            child.expect(pexpect.EOF, timeout=10)
            return True
    except Exception as e:
        print(f"Error killing process: {e}")
        return False

print("🔍 Monitoring Claude success rate...")
print("Will terminate if success rate drops below 70%\n")

check_interval = 30  # Check every 30 seconds
min_attempts = 20    # Wait for at least 20 attempts before checking

while True:
    attempts, errors, success_rate = get_claude_stats()
    
    print(f"[{time.strftime('%H:%M:%S')}] Claude Stats: {attempts} attempts, {errors} errors, {success_rate:.1f}% success rate")
    
    if attempts >= min_attempts and success_rate < 70:
        print(f"\n⚠️  SUCCESS RATE DROPPED BELOW 70% ({success_rate:.1f}%)")
        print("🛑 Terminating Claude process to save costs...")
        
        if kill_claude():
            print("✅ Claude process terminated")
            print(f"📊 Final stats: {attempts} attempts, {attempts - errors} successful sets")
            print("\n✨ Gemini will continue running")
            break
        else:
            print("❌ Failed to terminate process")
    
    elif success_rate < 70:
        print(f"   ⚠️  Low success rate but waiting for {min_attempts} attempts (currently {attempts})")
    
    time.sleep(check_interval)

print("\n✅ Monitoring complete")
