#!/bin/bash

# Docker-based audio+video combiner
# Uses ffmpeg Docker container - no local installation needed

echo "================================"
echo "Combining Audio + Video (Docker)"
echo "================================"
echo ""

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running!"
    echo "Please start Docker Desktop and try again."
    exit 1
fi

echo "✅ Docker is running!"
echo ""

# Addition video
echo "[1/2] Adding voiceover to addition tutorial..."
docker run --rm -v "$(pwd)/..:/project" -w /project/manim_tutorials jrottenberg/ffmpeg:latest \
  -i /project/public/videos/addition_tutorial.mp4 \
  -i /project/manim_tutorials/audio/addition_narration.mp3 \
  -c:v copy -c:a aac -shortest \
  /project/public/videos/addition_final.mp4

if [ $? -eq 0 ]; then
    mv ../public/videos/addition_final.mp4 ../public/videos/addition_tutorial.mp4
    echo "✅ Addition tutorial complete!"
else
    echo "❌ Failed"
fi

echo ""

# Multiplication video
echo "[2/2] Adding voiceover to multiplication tutorial..."
docker run --rm -v "$(pwd)/..:/project" -w /project/manim_tutorials jrottenberg/ffmpeg:latest \
  -i /project/public/videos/multiplication_tutorial.mp4 \
  -i /project/manim_tutorials/audio/multiplication_narration.mp3 \
  -c:v copy -c:a aac -shortest \
  /project/public/videos/multiplication_final.mp4

if [ $? -eq 0 ]; then
    mv ../public/videos/multiplication_final.mp4 ../public/videos/multiplication_tutorial.mp4
    echo "✅ Multiplication tutorial complete!"
else
    echo "❌ Failed"
fi

echo ""
echo "================================"
echo "✅ Videos with voiceovers ready!"
echo "Test at: http://localhost:5173/beta/videos"
echo "================================"
