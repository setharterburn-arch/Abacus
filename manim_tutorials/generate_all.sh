#!/bin/bash

# Docker-based Manim Video Generator
# Generates all tutorial videos using Docker (no local dependencies needed)

echo "================================"
echo "Manim Video Generator (Docker)"
echo "================================"
echo ""

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running!"
    echo ""
    echo "Please:"
    echo "1. Install Docker Desktop from: https://www.docker.com/products/docker-desktop/"
    echo "2. Start Docker Desktop"
    echo "3. Run this script again"
    exit 1
fi

echo "✅ Docker is running!"
echo ""

# Pull Manim image if not already present
echo "Checking for Manim Docker image..."
if ! docker images | grep -q "manimcommunity/manim"; then
    echo "Pulling Manim image (this may take a few minutes, ~1GB)..."
    docker pull manimcommunity/manim
else
    echo "✅ Manim image already present"
fi
echo ""

# Create output directory
mkdir -p ../public/videos

echo "Generating videos..."
echo ""

# Generate Addition Tutorial
echo "[1/3] Generating Addition Tutorial..."
docker run --rm -v "$(pwd):/manim" manimcommunity/manim manim -pql addition_tutorial.py AdditionTutorial
if [ $? -eq 0 ]; then
    cp media/videos/addition_tutorial/480p15/AdditionTutorial.mp4 ../public/videos/addition_tutorial.mp4
    echo "✅ Addition tutorial complete!"
else
    echo "❌ Addition tutorial failed"
fi
echo ""

# Generate Subtraction Tutorial
echo "[2/3] Generating Subtraction Tutorial..."
docker run --rm -v "$(pwd):/manim" manimcommunity/manim manim -pql subtraction_tutorial.py SubtractionTutorial
if [ $? -eq 0 ]; then
    cp media/videos/subtraction_tutorial/480p15/SubtractionTutorial.mp4 ../public/videos/subtraction_tutorial.mp4
    echo "✅ Subtraction tutorial complete!"
else
    echo "❌ Subtraction tutorial failed"
fi
echo ""

# Generate Multiplication Tutorial
echo "[3/3] Generating Multiplication Tutorial..."
docker run --rm -v "$(pwd):/manim" manimcommunity/manim manim -pql multiplication_tutorial.py MultiplicationTutorial
if [ $? -eq 0 ]; then
    cp media/videos/multiplication_tutorial/480p15/MultiplicationTutorial.mp4 ../public/videos/multiplication_tutorial.mp4
    echo "✅ Multiplication tutorial complete!"
else
    echo "❌ Multiplication tutorial failed"
fi
echo ""

echo "================================"
echo "✅ All videos generated!"
echo "Videos saved to: ../public/videos/"
echo ""
echo "Test them at: http://localhost:5173/beta/videos"
echo "================================"
