import pexpect

VPS_USER = "ubuntu"
VPS_HOST = "51.81.203.89"
PASSWORD = "Jemc8534!"

print("🐛 Debugging why log is empty...\n")

try:
    # Check if script can even import modules
    print("1. Testing script manually...")
    cmd = """
cd ~/math-homeschool-gen
source venv/bin/activate
export $(cat .env | xargs)
python -c "from anthropic import Anthropic; print('✅ Anthropic imported'); import os; print('CLAUDE_API_KEY:', 'SET' if os.getenv('CLAUDE_API_KEY') else 'NOT SET')"
"""
    
    child = pexpect.spawn(f'ssh -o StrictHostKeyChecking=no {VPS_USER}@{VPS_HOST} "bash -c \'{cmd}\'"')
    
    index = child.expect(['password:', pexpect.EOF, pexpect.TIMEOUT], timeout=10)
    if index == 0:
        child.sendline(PASSWORD)
        child.expect(pexpect.EOF, timeout=10)
        print(child.before.decode())
    
    # Check if there are any errors in stderr
    print("\n2. Checking for errors...")
    cmd2 = "cat ~/math-homeschool-gen/generation_7_9.log 2>&1; echo '---STDERR---'; ls -la ~/math-homeschool-gen/*.log"
    
    child = pexpect.spawn(f'ssh -o StrictHostKeyChecking=no {VPS_USER}@{VPS_HOST} "{cmd2}"')
    
    index = child.expect(['password:', pexpect.EOF, pexpect.TIMEOUT], timeout=10)
    if index == 0:
        child.sendline(PASSWORD)
        child.expect(pexpect.EOF, timeout=10)
        print(child.before.decode())
        
except Exception as e:
    print(f"Error: {e}")
