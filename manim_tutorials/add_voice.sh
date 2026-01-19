#!/bin/bash

# Simple ffmpeg commands to combine audio + video
# Run this after activating conda: conda activate manim

echo "Combining audio with videos..."
echo ""

# Addition video
echo "[1/2] Adding voiceover to addition tutorial..."
ffmpeg -i ../public/videos/addition_tutorial.mp4 \
       -i audio/addition_narration.mp3 \
       -c:v copy -c:a aac \
       -shortest \
       -y \
       ../public/videos/addition_with_voice.mp4

mv ../public/videos/addition_with_voice.mp4 ../public/videos/addition_tutorial.mp4
echo "✅ Addition tutorial complete!"
echo ""

# Multiplication video
echo "[2/2] Adding voiceover to multiplication tutorial..."
ffmpeg -i ../public/videos/multiplication_tutorial.mp4 \
       -i audio/multiplication_narration.mp3 \
       -c:v copy -c:a aac \
       -shortest \
       -y \
       ../public/videos/multiplication_with_voice.mp4

mv ../public/videos/multiplication_with_voice.mp4 ../public/videos/multiplication_tutorial.mp4
echo "✅ Multiplication tutorial complete!"
echo ""

echo "================================"
echo "✅ Done! Test at: http://localhost:5173/beta/videos"
echo "================================"
