# Manim Video Tutorial Setup Instructions

## Installation Issue

The automatic installation of Manim failed due to compiler issues on your system. This is a common issue on macOS.

## Solution: Manual Installation

### Option 1: Install with Homebrew (Recommended)

```bash
# Install Homebrew if you don't have it
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install Manim via Homebrew
brew install manim

# Verify installation
manim --version
```

### Option 2: Use Docker (Alternative)

```bash
# Pull Manim Docker image
docker pull manimcommunity/manim

# Run Manim in Docker
docker run --rm -v "$(pwd)/manim_tutorials:/manim" manimcommunity/manim manim -pql addition_tutorial.py AdditionTutorial
```

## Generating Videos

Once Manim is installed, generate the tutorial videos:

```bash
cd manim_tutorials
./generate_all.sh
```

This will create 3 videos:
- `public/videos/addition_tutorial.mp4`
- `public/videos/subtraction_tutorial.mp4`
- `public/videos/multiplication_tutorial.mp4`

## Testing Videos

1. Generate the videos using the script above
2. Navigate to `http://localhost:5173/beta/videos`
3. Videos should play in the browser
4. Provide feedback on quality, pacing, and clarity

## What's Already Set Up

✅ 3 Manim Python scripts (addition, subtraction, multiplication)
✅ Video generation shell script
✅ Video player component
✅ Beta testing page at `/beta/videos`
✅ App routing configured

## Next Steps

1. Install Manim using one of the methods above
2. Run `./generate_all.sh` in the `manim_tutorials` directory
3. Test videos at `/beta/videos`
4. Report back on quality and any issues

## Alternative: Pre-rendered Videos

If Manim installation continues to be problematic, I can:
1. Generate the videos on my end (if I had access to a Manim environment)
2. Or we can pivot to using D-ID for avatar-based tutorials instead
3. Or use screen recordings with voiceover (simpler, no dependencies)

Let me know which approach you'd prefer!
