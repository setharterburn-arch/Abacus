#!/bin/bash

# Manim Video Generation Script
# Generates all tutorial videos at medium quality for testing

echo "================================"
echo "Manim Video Generator"
echo "================================"
echo ""

# Check if manim is installed
if ! command -v manim &> /dev/null; then
    echo "❌ Manim is not installed!"
    echo "Install with: pip3 install manim"
    echo ""
    echo "Also ensure ffmpeg is installed:"
    echo "  macOS: brew install ffmpeg"
    exit 1
fi

echo "✅ Manim found!"
echo ""

# Create output directory
mkdir -p ../public/videos

echo "Generating videos..."
echo ""

# Generate Addition Tutorial
echo "[1/3] Generating Addition Tutorial..."
manim -pql --disable_caching addition_tutorial.py AdditionTutorial
if [ $? -eq 0 ]; then
    # Move video to public folder
    cp media/videos/addition_tutorial/480p15/AdditionTutorial.mp4 ../public/videos/addition_tutorial.mp4
    echo "✅ Addition tutorial complete!"
else
    echo "❌ Addition tutorial failed"
fi
echo ""

# Generate Subtraction Tutorial
echo "[2/3] Generating Subtraction Tutorial..."
manim -pql --disable_caching subtraction_tutorial.py SubtractionTutorial
if [ $? -eq 0 ]; then
    cp media/videos/subtraction_tutorial/480p15/SubtractionTutorial.mp4 ../public/videos/subtraction_tutorial.mp4
    echo "✅ Subtraction tutorial complete!"
else
    echo "❌ Subtraction tutorial failed"
fi
echo ""

# Generate Multiplication Tutorial
echo "[3/3] Generating Multiplication Tutorial..."
manim -pql --disable_caching multiplication_tutorial.py MultiplicationTutorial
if [ $? -eq 0 ]; then
    cp media/videos/multiplication_tutorial/480p15/MultiplicationTutorial.mp4 ../public/videos/multiplication_tutorial.mp4
    echo "✅ Multiplication tutorial complete!"
else
    echo "❌ Multiplication tutorial failed"
fi
echo ""

echo "================================"
echo "✅ All videos generated!"
echo "Videos saved to: public/videos/"
echo "================================"
