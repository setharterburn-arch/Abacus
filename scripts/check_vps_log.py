import pexpect
import sys

try:
    print("Attempting to connect to VPS...")
    child = pexpect.spawn('ssh ubuntu@51.81.203.89 "tail -n 50 ~/math-homeschool-gen/generation.log"')
    
    # Expect password prompt
    index = child.expect(['password:', pexpect.EOF, pexpect.TIMEOUT], timeout=10)
    
    if index == 0:
        print("Sending password...")
        child.sendline('Jemc8534!')
        # Expect EOF (command finishes) or another prompt if login failed
        index = child.expect([pexpect.EOF, 'Permission denied', pexpect.TIMEOUT], timeout=30)
        
        if index == 0:
             print("Command output:")
             print(child.before.decode())
        elif index == 1:
             print("Error: Permission denied (Incorrect password?).")
             print(child.before.decode())
        else:
             print("Error: Timeout waiting for command output.")
             print(child.before.decode())

    elif index == 1:
        # EOF before password? Maybe keys worked or connection failed immediately
        print("Connection closed unexpectedly.")
        print(child.before.decode())
    else:
        print("Error: Timeout waiting for password prompt.")
        print(child.before.decode())

except Exception as e:
    print(f"An error occurred: {e}")
