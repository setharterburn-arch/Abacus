import pexpect
import os

# Files to upload
FILES = [
    "migration_fixes.sql",
    "scripts/run_migration.py"
]

VPS_USER = "ubuntu"
VPS_HOST = "51.81.203.89"
VPS_DIR = "/home/ubuntu/math-homeschool-gen"
PASSWORD = "Jemc8534!"

def upload_file(local_path, remote_path):
    print(f"Uploading {local_path} to {remote_path}...")
    cmd = f"scp -o StrictHostKeyChecking=no {local_path} {VPS_USER}@{VPS_HOST}:{remote_path}"
    child = pexpect.spawn(cmd)
    index = child.expect(['password:', pexpect.EOF, pexpect.TIMEOUT], timeout=30)
    if index == 0:
        child.sendline(PASSWORD)
        child.expect(pexpect.EOF)
    elif index == 1:
        pass # EOF without password (maybe key work?)
    else:
        print("Timeout uploading")

def run_remote_commands():
    # Chain commands: Install dependency -> Run script
    cmds = [
        f"cd {VPS_DIR}",
        "source venv/bin/activate",
        "pip install psycopg2-binary",
        "python run_migration.py"
    ]
    full_cmd = " && ".join(cmds)
    
    # Wrap in bash -c to ensure source works
    final_cmd = f"bash -c '{full_cmd}'"
    
    print(f"Running on VPS: {final_cmd}")
    child = pexpect.spawn(f'ssh -o StrictHostKeyChecking=no {VPS_USER}@{VPS_HOST} "{final_cmd}"')
    
    index = child.expect(['password:', pexpect.EOF, pexpect.TIMEOUT], timeout=30)
    if index == 0:
        child.sendline(PASSWORD)
        # Timeout for install + run
        index = child.expect([pexpect.EOF, pexpect.TIMEOUT], timeout=120)
        if index == 0:
            print("Output:")
            print(child.before.decode())
        else:
            print("Timeout executing commands")

if __name__ == "__main__":
    # Upload
    upload_file("migration_fixes.sql", f"{VPS_DIR}/migration_fixes.sql")
    upload_file("scripts/run_migration.py", f"{VPS_DIR}/run_migration.py")
    
    # Run
    run_remote_commands()
