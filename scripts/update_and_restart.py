import pexpect

VPS_USER = "ubuntu"
VPS_HOST = "51.81.203.89"
PASSWORD = "Jemc8534!"

print("📦 Uploading updated script...")

# Upload the fixed script
try:
    child = pexpect.spawn(f'scp -o StrictHostKeyChecking=no scripts/generate_grades_7_9.py {VPS_USER}@{VPS_HOST}:~/math-homeschool-gen/scripts/')
    
    index = child.expect(['password:', pexpect.EOF, pexpect.TIMEOUT], timeout=10)
    if index == 0:
        child.sendline(PASSWORD)
        child.expect(pexpect.EOF, timeout=10)
        print("✅ Upload complete")
    
    # Kill old process and restart
    print("🔄 Restarting generation...")
    
    commands = """
cd ~/math-homeschool-gen
pkill -f generate_grades_7_9.py
source venv/bin/activate
export $(cat .env | xargs)
nohup python scripts/generate_grades_7_9.py > generation_7_9.log 2>&1 &
echo "Restarted with PID: $!"
sleep 3
tail -n 20 generation_7_9.log
"""
    
    child = pexpect.spawn(f'ssh -o StrictHostKeyChecking=no {VPS_USER}@{VPS_HOST} "bash -c \'{commands}\'"')
    index = child.expect(['password:', pexpect.EOF, pexpect.TIMEOUT], timeout=10)
    
    if index == 0:
        child.sendline(PASSWORD)
        child.expect(pexpect.EOF, timeout=15)
        print(child.before.decode())
        
except Exception as e:
    print(f"Error: {e}")
