import pexpect
import os

VPS_USER = "ubuntu"
VPS_HOST = "51.81.203.89"
VPS_DIR = "/home/ubuntu/math-homeschool-gen"
PASSWORD = "Jemc8534!"

def download_file(remote_path, local_path):
    print(f"Downloading {remote_path} to {local_path}...")
    cmd = f"scp -o StrictHostKeyChecking=no {VPS_USER}@{VPS_HOST}:{remote_path} {local_path}"
    child = pexpect.spawn(cmd)
    index = child.expect(['password:', pexpect.EOF, pexpect.TIMEOUT], timeout=30)
    if index == 0:
        child.sendline(PASSWORD)
        child.expect(pexpect.EOF)
    elif index == 1:
        pass
    else:
        print("Timeout downloading")

def download_folder(remote_dir, local_dir):
    print(f"Downloading folder {remote_dir} to {local_dir}...")
    # Recursive scp
    cmd = f"scp -r -o StrictHostKeyChecking=no {VPS_USER}@{VPS_HOST}:{remote_dir} {local_dir}"
    child = pexpect.spawn(cmd)
    index = child.expect(['password:', pexpect.EOF, pexpect.TIMEOUT], timeout=60)
    if index == 0:
        child.sendline(PASSWORD)
        child.expect(pexpect.EOF)
    elif index == 1:
        pass
    else:
        print("Timeout downloading folder")

if __name__ == "__main__":
    # Ensure local directories exist
    os.makedirs("data", exist_ok=True)
    os.makedirs("manim_tutorials", exist_ok=True)
    
    # Download JSON
    download_file(f"{VPS_DIR}/data/curriculum_7_9.json", "data/curriculum_7_9.json")
    
    # Download Manim scripts
    # Note: scp -r remote_dir local_dir downloads the directory ITSELF into local_dir
    # So if I want content of manim_tutorials to be in manim_tutorials, I should verify scp behavior
    # scp -r host:dir local -> creates local/dir
    # So scp -r host:manim_tutorials . -> creates ./manim_tutorials
    
    download_folder(f"{VPS_DIR}/manim_tutorials", ".")
