# Manim Installation Guide - Conda Method (RECOMMENDED)

## Why Conda?
Conda handles all system dependencies (cairo, ffmpeg, etc.) automatically, making it the most reliable installation method for Manim on macOS.

## Step-by-Step Installation

### 1. Install Miniconda (if you don't have it)

```bash
# Download Miniconda installer for macOS (ARM/M1/M2)
curl -O https://repo.anaconda.com/miniconda/Miniconda3-latest-MacOSX-arm64.sh

# Run installer
bash Miniconda3-latest-MacOSX-arm64.sh

# Follow prompts:
# - Press ENTER to review license
# - Type 'yes' to accept
# - Press ENTER to confirm location
# - Type 'yes' to initialize conda

# Restart your terminal or run:
source ~/.zshrc
```

### 2. Create Manim Environment

```bash
# Create a new conda environment with Python 3.11
conda create -n manim python=3.11 -y

# Activate the environment
conda activate manim
```

### 3. Install Manim

```bash
# Install manim from conda-forge (includes all dependencies)
conda install -c conda-forge manim -y
```

### 4. Verify Installation

```bash
# Check manim version
manim --version

# Should output something like: Manim Community v0.18.1
```

### 5. Generate Tutorial Videos

```bash
# Navigate to tutorials directory
cd /Users/setharterburn/.gemini/antigravity/scratch/math-homeschool/manim_tutorials

# Make sure conda environment is activated
conda activate manim

# Generate all 3 videos
./generate_all.sh

# Or generate individually:
manim -pql addition_tutorial.py AdditionTutorial
manim -pql subtraction_tutorial.py SubtractionTutorial
manim -pql multiplication_tutorial.py MultiplicationTutorial
```

### 6. Videos Location

After generation, videos will be in:
- `media/videos/addition_tutorial/480p15/AdditionTutorial.mp4`
- `media/videos/subtraction_tutorial/480p15/SubtractionTutorial.mp4`
- `media/videos/multiplication_tutorial/480p15/MultiplicationTutorial.mp4`

The script will automatically copy them to `../public/videos/` for the web app.

## Usage Notes

**Always activate the conda environment before using manim:**
```bash
conda activate manim
```

**To deactivate when done:**
```bash
conda deactivate
```

## Troubleshooting

**If conda command not found after installation:**
```bash
source ~/miniconda3/bin/activate
conda init zsh
source ~/.zshrc
```

**If installation fails:**
Try the Docker method instead (see ALTERNATIVES.md)

## Next Steps

Once videos are generated:
1. Visit `http://localhost:5173/beta/videos`
2. Test the video playback
3. Provide feedback on quality and pacing
4. We can then generate more tutorials for other topics!
