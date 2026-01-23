import pexpect

VPS_USER = "ubuntu"
VPS_HOST = "51.81.203.89"
PASSWORD = "Jemc8534!"

print("📦 Uploading Gemini generation script...")

try:
    # Upload the Gemini script
    child = pexpect.spawn(f'scp -o StrictHostKeyChecking=no scripts/generate_grades_7_9_gemini.py {VPS_USER}@{VPS_HOST}:~/math-homeschool-gen/scripts/')
    
    index = child.expect(['password:', pexpect.EOF, pexpect.TIMEOUT], timeout=10)
    if index == 0:
        child.sendline(PASSWORD)
        child.expect(pexpect.EOF, timeout=10)
        print("✅ Upload complete")
    
    # Start Gemini generation in parallel
    print("🚀 Starting Gemini generation in parallel...")
    
    commands = """
cd ~/math-homeschool-gen
source venv/bin/activate
export $(cat .env | xargs)
pip install -q google-generativeai
nohup python scripts/generate_grades_7_9_gemini.py > generation_7_9_gemini.log 2>&1 &
echo "Gemini started with PID: $!"
sleep 3
echo "---"
echo "Claude process:"
ps aux | grep [g]enerate_grades_7_9.py | grep -v gemini
echo "---"
echo "Gemini process:"
ps aux | grep [g]enerate_grades_7_9_gemini.py
echo "---"
tail -n 10 generation_7_9_gemini.log
"""
    
    child = pexpect.spawn(f'ssh -o StrictHostKeyChecking=no {VPS_USER}@{VPS_HOST} "bash -c \'{commands}\'"')
    index = child.expect(['password:', pexpect.EOF, pexpect.TIMEOUT], timeout=10)
    
    if index == 0:
        child.sendline(PASSWORD)
        child.expect(pexpect.EOF, timeout=20)
        print(child.before.decode())
        
except Exception as e:
    print(f"Error: {e}")
