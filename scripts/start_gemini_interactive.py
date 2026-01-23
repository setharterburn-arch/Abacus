import pexpect

child = pexpect.spawn('ssh ubuntu@51.81.203.89')
child.expect('password:')
child.sendline('Jemc8534!')
child.expect('\\$')

child.sendline('cd ~/math-homeschool-gen')
child.expect('\\$')

child.sendline('source venv/bin/activate')
child.expect('\\$')

child.sendline('export $(cat .env | xargs)')
child.expect('\\$')

child.sendline('nohup python scripts/generate_grades_7_9_gemini.py > generation_7_9_gemini.log 2>&1 &')
child.expect('\\$')

child.sendline('echo "Gemini PID: $!"')
child.expect('\\$')
print(child.before.decode())

child.sendline('ps aux | grep [p]ython | grep generate')
child.expect('\\$')
print(child.before.decode())

child.sendline('exit')
child.expect(pexpect.EOF)
