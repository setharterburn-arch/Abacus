import os
import shutil
import subprocess
import glob

# Configuration
MANIM_DIR = "manim_tutorials"
OUTPUT_DIR = "public/videos"
QUALITY = "-qm" # Medium quality (720p) - Use -ql for low (480p) or -qh for high (1080p)

def process_videos():
    # Ensure output directory exists
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    
    # Check if manim is installed
    if shutil.which("manim") is None:
        print("❌ Error: 'manim' command not found. Please install Manim.")
        print("Installation guide: https://docs.manim.community/en/stable/installation.html")
        return

    # Find all python files
    files = glob.glob(os.path.join(MANIM_DIR, "scene_*.py"))
    
    print(f"found {len(files)} scripts to process.")
    
    for i, file_path in enumerate(files):
        filename = os.path.basename(file_path)
        base_name = os.path.splitext(filename)[0]
        target_file = os.path.join(OUTPUT_DIR, f"{base_name}.mp4")
        
        if os.path.exists(target_file):
             print(f"Skipping {filename} (already exists)...")
             continue
             
        print(f"[{i+1}/{len(files)}] Rendering {filename}...")
        
        # Run Manim
        # We assume the class name isn't needed if we render *all* scenes or use -a, 
        # but the scripts have one scene. Manim automatically finds it.
        # Output directory structure: media/videos/<module_name>/<quality>/<SceneName>.mp4
        
        cmd = ["manim", QUALITY, file_path]
        result = subprocess.run(cmd, capture_output=True, text=True)
        
        if result.returncode != 0:
            print(f"❌ Failed to render {filename}")
            print(result.stderr)
            continue
            
        # Find the output file
        # It's usually in media/videos/<module_name>/<quality>/<SceneName>.mp4
        # We don't know SceneName easily, so we look for any .mp4 in that folder
        quality_folder = "1080p60" if QUALITY == "-qh" else "720p30" if QUALITY == "-qm" else "480p15"
        # Manim quality folder names vary by version. 
        # m: 720p30, l: 480p15, h: 1080p60?
        # Let's search recursively in media/videos/<module_name>
        
        search_path = os.path.join("media", "videos", base_name)
        found_video = None
        
        for root, dirs, video_files in os.walk(search_path):
            for v_file in video_files:
                if v_file.endswith(".mp4") and "partial" not in root:
                    found_video = os.path.join(root, v_file)
                    break
            if found_video:
                break
        
        if found_video:
            print(f"✅ Generated: {found_video}")
            print(f"Moving to {target_file}...")
            shutil.copy2(found_video, target_file)
        else:
            print(f"⚠️ Could not locate output video for {filename}")

    print("\n✨ Processing Complete!")

if __name__ == "__main__":
    process_videos()
