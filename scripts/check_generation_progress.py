import pexpect
import time

VPS_USER = "ubuntu"
VPS_HOST = "51.81.203.89"
PASSWORD = "Jemc8534!"

print("📊 Checking generation progress...\n")

try:
    # Check logs
    child = pexpect.spawn(f'ssh -o StrictHostKeyChecking=no {VPS_USER}@{VPS_HOST} "tail -n 50 ~/math-homeschool-gen/generation_7_9.log"')
    
    index = child.expect(['password:', pexpect.EOF, pexpect.TIMEOUT], timeout=10)
    
    if index == 0:
        child.sendline(PASSWORD)
        child.expect(pexpect.EOF, timeout=10)
        print(child.before.decode())
        
except Exception as e:
    print(f"Error: {e}")
