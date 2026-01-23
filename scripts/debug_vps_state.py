import pexpect

VPS_USER = "ubuntu"
VPS_HOST = "51.81.203.89"
PASSWORD = "Jemc8534!"

print("🔍 Checking if script was updated...")

try:
    # Check the model in the uploaded script
    child = pexpect.spawn(f'ssh -o StrictHostKeyChecking=no {VPS_USER}@{VPS_HOST} "grep -n \'model=\' ~/math-homeschool-gen/scripts/generate_grades_7_9.py | head -1"')
    
    index = child.expect(['password:', pexpect.EOF, pexpect.TIMEOUT], timeout=10)
    if index == 0:
        child.sendline(PASSWORD)
        child.expect(pexpect.EOF, timeout=10)
        print("Current model in VPS script:")
        print(child.before.decode())
    
    # Also check running processes
    print("\n🔍 Checking running processes...")
    child = pexpect.spawn(f'ssh -o StrictHostKeyChecking=no {VPS_USER}@{VPS_HOST} "ps aux | grep generate_grades_7_9 | grep -v grep"')
    
    index = child.expect(['password:', pexpect.EOF, pexpect.TIMEOUT], timeout=10)
    if index == 0:
        child.sendline(PASSWORD)
        child.expect(pexpect.EOF, timeout=10)
        print(child.before.decode())
        
except Exception as e:
    print(f"Error: {e}")
