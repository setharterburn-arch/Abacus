#!/bin/bash

# Combines audio narration with video using ffmpeg

echo "Combining audio with videos..."
echo ""

# Check if ffmpeg is installed
if ! command -v ffmpeg &> /dev/null; then
    echo "❌ ffmpeg is not installed!"
    echo "Install with: brew install ffmpeg"
    exit 1
fi

# Combine addition video + audio
echo "[1/2] Adding voiceover to addition tutorial..."
ffmpeg -i ../public/videos/addition_tutorial.mp4 \
       -i audio/addition_narration.mp3 \
       -c:v copy -c:a aac \
       -shortest \
       -y \
       ../public/videos/addition_tutorial_voiced.mp4

if [ $? -eq 0 ]; then
    mv ../public/videos/addition_tutorial_voiced.mp4 ../public/videos/addition_tutorial.mp4
    echo "✅ Addition tutorial complete!"
else
    echo "❌ Failed to add audio to addition tutorial"
fi

echo ""

# Combine multiplication video + audio
echo "[2/2] Adding voiceover to multiplication tutorial..."
ffmpeg -i ../public/videos/multiplication_tutorial.mp4 \
       -i audio/multiplication_narration.mp3 \
       -c:v copy -c:a aac \
       -shortest \
       -y \
       ../public/videos/multiplication_tutorial_voiced.mp4

if [ $? -eq 0 ]; then
    mv ../public/videos/multiplication_tutorial_voiced.mp4 ../public/videos/multiplication_tutorial.mp4
    echo "✅ Multiplication tutorial complete!"
else
    echo "❌ Failed to add audio to multiplication tutorial"
fi

echo ""
echo "================================"
echo "✅ Voiceovers added to all videos!"
echo "Test them at: http://localhost:5173/beta/videos"
echo "================================"
