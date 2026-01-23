import pexpect

VPS_USER = "ubuntu"
VPS_HOST = "51.81.203.89"
PASSWORD = "Jemc8534!"

print("Step 1: Creating directory...")
child = pexpect.spawn(f'ssh {VPS_USER}@{VPS_HOST} "mkdir -p ~/math-homeschool-gen/src/data"')
child.expect('password:')
child.sendline(PASSWORD)
child.expect(pexpect.EOF)
print("✅ Directory created")

print("\nStep 2: Creating empty curriculum file...")
child = pexpect.spawn(f'ssh {VPS_USER}@{VPS_HOST} "echo \'[]\' > ~/math-homeschool-gen/src/data/curriculum.json"')
child.expect('password:')
child.sendline(PASSWORD)
child.expect(pexpect.EOF)
print("✅ File created")

print("\nStep 3: Verifying...")
child = pexpect.spawn(f'ssh {VPS_USER}@{VPS_HOST} "ls -la ~/math-homeschool-gen/src/data/"')
child.expect('password:')
child.sendline(PASSWORD)
child.expect(pexpect.EOF)
print(child.before.decode())

print("\nStep 4: Restarting Claude...")
child = pexpect.spawn(f'ssh {VPS_USER}@{VPS_HOST} "cd ~/math-homeschool-gen && source venv/bin/activate && export $(cat .env | xargs) && nohup python scripts/generate_grades_7_9.py > generation_7_9.log 2>&1 & echo $!"')
child.expect('password:')
child.sendline(PASSWORD)
child.expect(pexpect.EOF, timeout=10)
print(f"Claude PID: {child.before.decode().strip()}")

print("\nStep 5: Restarting Gemini...")
child = pexpect.spawn(f'ssh {VPS_USER}@{VPS_HOST} "cd ~/math-homeschool-gen && source venv/bin/activate && export $(cat .env | xargs) && nohup python scripts/generate_grades_7_9_gemini.py > generation_7_9_gemini.log 2>&1 & echo $!"')
child.expect('password:')
child.sendline(PASSWORD)
child.expect(pexpect.EOF, timeout=10)
print(f"Gemini PID: {child.before.decode().strip()}")

print("\n✅ Both processes restarted!")
