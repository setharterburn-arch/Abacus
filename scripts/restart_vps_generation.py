import pexpect
import sys

VPS_USER = "ubuntu"
VPS_HOST = "51.81.203.89"
PASSWORD = "Jemc8534!"

# Commands to fix and restart generation
commands = """
cd ~/math-homeschool-gen
source venv/bin/activate
export $(cat .env | xargs)
nohup python scripts/generate_grades_7_9.py > generation_7_9.log 2>&1 &
echo "Started with PID: $!"
sleep 2
tail -n 30 generation_7_9.log
"""

print("🔧 Fixing environment and restarting generation...")

try:
    child = pexpect.spawn(f'ssh -o StrictHostKeyChecking=no {VPS_USER}@{VPS_HOST} "bash -c \'{commands}\'"')
    
    index = child.expect(['password:', pexpect.EOF, pexpect.TIMEOUT], timeout=10)
    
    if index == 0:
        child.sendline(PASSWORD)
        index = child.expect([pexpect.EOF, pexpect.TIMEOUT], timeout=15)
        
        if index == 0:
            print("✅ Command executed:")
            print(child.before.decode())
        else:
            print("⚠️ Timeout")
            print(child.before.decode())
    else:
        print("Connection issue")
        
except Exception as e:
    print(f"Error: {e}")
