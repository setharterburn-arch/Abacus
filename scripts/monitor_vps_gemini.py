#!/usr/bin/env python3
"""
Monitor Gemini generation on VPS
"""
import pexpect
import sys
import time

VPS_USER = "ubuntu"
VPS_HOST = "51.81.203.89"
VPS_PASSWORD = "Jemc8534!"
REMOTE_LOG = "~/math-homeschool-gen/generation_200_gemini.log"

def main():
    print(f"🔍 Connecting to VPS to monitor {REMOTE_LOG}...")
    print("Press Ctrl+C to stop monitoring (process will continue on VPS)")
    
    cmd = f"ssh {VPS_USER}@{VPS_HOST} 'tail -f {REMOTE_LOG}'"
    child = pexpect.spawn(cmd)
    
    i = child.expect(['password:', pexpect.EOF, pexpect.TIMEOUT], timeout=10)
    if i == 0:
        child.sendline(VPS_PASSWORD)
    elif i == 1:
        print("❌ Connection closed unexpectedly")
        print(child.before.decode())
        return
    elif i == 2:
        print("❌ Connection timeout")
        return
        
    try:
        # Stream output for 30 seconds
        start_time = time.time()
        while time.time() - start_time < 30:
            try:
                # Read line (non-blocking if possible, but expect is blocking)
                line = child.readline()
                if not line:
                    break
                print(line.decode().strip())
            except pexpect.TIMEOUT:
                continue
            except pexpect.EOF:
                break
                
    except KeyboardInterrupt:
        pass
    
    print("\n✅ Monitoring finished (snapshot)")
    child.close()

if __name__ == '__main__':
    main()
