import pexpect
import sys

def run_vps_command(cmd):
    try:
        print(f"Running command: {cmd}")
        # -o StrictHostKeyChecking=no to avoid yes/no prompt for new hosts (optional but good for automation)
        child = pexpect.spawn(f'ssh -o StrictHostKeyChecking=no ubuntu@51.81.203.89 "{cmd}"')
        
        index = child.expect(['password:', pexpect.EOF, pexpect.TIMEOUT], timeout=10)
        
        if index == 0:
            child.sendline('Jemc8534!')
            # Wait for command to finish (could take a while for generation)
            # Increasing timeout to 900 seconds (15 mins) just in case
            index = child.expect([pexpect.EOF, 'Permission denied', pexpect.TIMEOUT], timeout=900)
            
            if index == 0:
                 print("Command output:")
                 print(child.before.decode())
            elif index == 1:
                 print("Error: Permission denied.")
            else:
                 print("Error: Timeout waiting for command.")
                 print(child.before.decode())
        elif index == 1:
            print("Connection closed unexpectedly.")
            print(child.before.decode())
        else:
            print("Error: Timeout waiting for prompt.")

    except Exception as e:
        print(f"An error occurred: {e}")

if __name__ == "__main__":
    if len(sys.argv) > 1:
        cmd = " ".join(sys.argv[1:])
        run_vps_command(cmd)
    else:
        print("Please provide a command to run.")
