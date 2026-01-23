import pexpect

VPS_USER = "ubuntu"
VPS_HOST = "51.81.203.89"
PASSWORD = "Jemc8534!"

print("🔧 Fixing directory structure on VPS...")

try:
    commands = """
cd ~/math-homeschool-gen
mkdir -p src/data
pkill -f generate_grades_7_9
source venv/bin/activate
export $(cat .env | xargs)
echo '[]' > src/data/curriculum.json
nohup python scripts/generate_grades_7_9.py > generation_7_9.log 2>&1 &
echo "Claude restarted: $!"
nohup python scripts/generate_grades_7_9_gemini.py > generation_7_9_gemini.log 2>&1 &
echo "Gemini restarted: $!"
sleep 3
ps aux | grep [g]enerate_grades
tail -n 5 generation_7_9.log
echo "---"
tail -n 5 generation_7_9_gemini.log
"""
    
    child = pexpect.spawn(f'ssh -o StrictHostKeyChecking=no {VPS_USER}@{VPS_HOST} "bash -c \'{commands}\'"')
    
    index = child.expect(['password:', pexpect.EOF, pexpect.TIMEOUT], timeout=10)
    if index == 0:
        child.sendline(PASSWORD)
        child.expect(pexpect.EOF, timeout=15)
        print(child.before.decode())
        
except Exception as e:
    print(f"Error: {e}")
