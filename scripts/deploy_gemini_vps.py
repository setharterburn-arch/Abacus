#!/usr/bin/env python3
"""
Deploy and start Gemini generation on VPS using pexpect
"""
import pexpect
import sys
import os
import time

VPS_USER = "ubuntu"
VPS_HOST = "51.81.203.89"
VPS_PASSWORD = "Jemc8534!"
REMOTE_DIR = "~/math-homeschool-gen"

def send_command(child, cmd, expect_pattern='\\$'):
    """Send command and wait for prompt"""
    print(f"Sending: {cmd}")
    child.sendline(cmd)
    child.expect(expect_pattern)
    print(child.before.decode())

def upload_file(local_path, remote_path):
    """Upload file using scp"""
    print(f"🚀 Uploading {local_path}...")
    cmd = f"scp {local_path} {VPS_USER}@{VPS_HOST}:{remote_path}"
    child = pexpect.spawn(cmd)
    
    i = child.expect(['password:', pexpect.EOF])
    if i == 0:
        child.sendline(VPS_PASSWORD)
        child.expect(pexpect.EOF)
    
    if child.exitstatus == 0:
        print("✅ Upload successful")
    else:
        print("❌ Upload failed")
        print(child.before.decode() if child.before else "No output")

def main():
    print("📦 Starting deployment...")
    
    # 1. Upload files
    upload_file('.env', f"{REMOTE_DIR}/.env")
    upload_file('scripts/generate_200_lessons_gemini.py', f"{REMOTE_DIR}/scripts/")
    upload_file('src/data/curriculum.json', f"{REMOTE_DIR}/src/data/")
    
    # 2. SSH and setup
    print("\n🔧 Connecting to VPS...")
    child = pexpect.spawn(f"ssh {VPS_USER}@{VPS_HOST}")
    
    i = child.expect(['password:', '\\$', 'Are you sure you want to continue connecting'])
    if i == 0:
        child.sendline(VPS_PASSWORD)
        child.expect('\\$')
    elif i == 2:
        child.sendline('yes')
        child.expect('password:')
        child.sendline(VPS_PASSWORD)
        child.expect('\\$')
        
    print("✅ Connected")
    
    # Setup environment
    send_command(child, f"cd {REMOTE_DIR}")
    send_command(child, "source venv/bin/activate")
    
    # Load environment variables
    send_command(child, "export $(grep -v '^#' .env | xargs)")
    
    # Install dependency
    print("📦 Installing dependencies...")
    send_command(child, "pip install google-generativeai")
    
    # Stop existing python processes (optional, be careful)
    # send_command(child, "pkill -f generate_200_lessons_gemini.py")
    
    # Start generation
    print("🚀 Starting generation process...")
    send_command(child, "nohup python scripts/generate_200_lessons_gemini.py > generation_200_gemini.log 2>&1 &")
    
    # Get PID
    send_command(child, 'echo "PID: $!"')
    
    print("\n✅ Deployment complete!")
    print(f"📊 Monitor logs with: ssh {VPS_USER}@{VPS_HOST} 'tail -f {REMOTE_DIR}/generation_200_gemini.log'")
    
    child.sendline('exit')
    child.expect(pexpect.EOF)

if __name__ == '__main__':
    main()
