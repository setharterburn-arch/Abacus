import pexpect

VPS_USER = "ubuntu"
VPS_HOST = "51.81.203.89"
PASSWORD = "Jemc8534!"

print("🔍 Running script in foreground to see errors...\n")

try:
    # Kill background process
    print("Killing background process...")
    child = pexpect.spawn(f'ssh -o StrictHostKeyChecking=no {VPS_USER}@{VPS_HOST} "pkill -f generate_grades_7_9.py"')
    
    index = child.expect(['password:', pexpect.EOF, pexpect.TIMEOUT], timeout=10)
    if index == 0:
        child.sendline(PASSWORD)
        child.expect(pexpect.EOF, timeout=5)
    
    print("Running script in foreground for 10 seconds...\n")
    
    # Run in foreground with timeout
    cmd = """
cd ~/math-homeschool-gen
source venv/bin/activate
export $(cat .env | xargs)
timeout 10 python scripts/generate_grades_7_9.py 2>&1 || echo "Script output above"
"""
    
    child = pexpect.spawn(f'ssh -o StrictHostKeyChecking=no {VPS_USER}@{VPS_HOST} "bash -c \'{cmd}\'"')
    
    index = child.expect(['password:', pexpect.EOF, pexpect.TIMEOUT], timeout=15)
    if index == 0:
        child.sendline(PASSWORD)
        child.expect(pexpect.EOF, timeout=20)
        print(child.before.decode())
        
except Exception as e:
    print(f"Error: {e}")
