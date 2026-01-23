import pexpect
import sys

# Command with single quotes inside double quotes, handled purely in python string
cmd = "bash -c 'cd /home/ubuntu/math-homeschool-gen && set -a && source .env && set +a && ./venv/bin/python scripts/generate_upper_curriculum.py'"

print(f"Running remote command: {cmd}")

try:
    child = pexpect.spawn(f'ssh -o StrictHostKeyChecking=no ubuntu@51.81.203.89 "{cmd}"')
    
    index = child.expect(['password:', pexpect.EOF, pexpect.TIMEOUT], timeout=10)
    
    if index == 0:
        child.sendline('Jemc8534!')
        # Timeout 900s for generation
        index = child.expect([pexpect.EOF, 'Permission denied', pexpect.TIMEOUT], timeout=900)
        
        if index == 0:
             print("Command finished.")
             print(child.before.decode())
        elif index == 1:
             print("Error: Permission denied.")
        else:
             print("Error: Timeout waiting for completion.")
             print(child.before.decode())
    elif index == 1:
        print("Connection closed unexpectedly.")
        print(child.before.decode())
    else:
        print("Error: Timeout waiting for prompt.")

except Exception as e:
    print(f"An error occurred: {e}")
