import pexpect
import time

VPS_USER = "ubuntu"
VPS_HOST = "51.81.203.89"
PASSWORD = "Jemc8534!"

print("📊 Detailed status check...\n")

try:
    # Check if process is running
    print("1. Checking process status...")
    child = pexpect.spawn(f'ssh -o StrictHostKeyChecking=no {VPS_USER}@{VPS_HOST} "ps aux | grep [g]enerate_grades_7_9"')
    
    index = child.expect(['password:', pexpect.EOF, pexpect.TIMEOUT], timeout=10)
    if index == 0:
        child.sendline(PASSWORD)
        child.expect(pexpect.EOF, timeout=10)
        output = child.before.decode().strip()
        if output and len(output) > 10:
            print(f"✅ Process running:\n{output}\n")
        else:
            print("❌ No process found\n")
    
    # Check log file size and recent content
    print("2. Checking log file...")
    child = pexpect.spawn(f'ssh -o StrictHostKeyChecking=no {VPS_USER}@{VPS_HOST} "ls -lh ~/math-homeschool-gen/generation_7_9.log && echo \'---\' && tail -n 30 ~/math-homeschool-gen/generation_7_9.log"')
    
    index = child.expect(['password:', pexpect.EOF, pexpect.TIMEOUT], timeout=10)
    if index == 0:
        child.sendline(PASSWORD)
        child.expect(pexpect.EOF, timeout=10)
        print(child.before.decode())
        
except Exception as e:
    print(f"Error: {e}")
