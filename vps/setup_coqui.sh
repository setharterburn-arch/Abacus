#!/bin/bash

# Coqui TTS Docker Setup Script for VPS
# Run this on your VPS: bash setup_coqui.sh

set -e

echo "================================"
echo "Coqui TTS Docker Setup"
echo "================================"
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "Installing Docker..."
    curl -fsSL https://get.docker.com -o get-docker.sh
    sudo sh get-docker.sh
    sudo usermod -aG docker $USER
    echo "✅ Docker installed!"
    echo "⚠️  Please log out and log back in for Docker permissions to take effect"
    echo "Then run this script again."
    exit 0
fi

echo "✅ Docker is installed"
echo ""

# Create directory for TTS server
mkdir -p ~/coqui-tts
cd ~/coqui-tts

# Create Dockerfile
echo "Creating Dockerfile..."
cat > Dockerfile << 'EOF'
FROM python:3.10-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    libsndfile1 \
    ffmpeg \
    && rm -rf /var/lib/apt/lists/*

# Install Python packages
RUN pip install --no-cache-dir \
    TTS==0.22.0 \
    flask==3.0.0 \
    flask-cors==4.0.0

# Create cache directory
RUN mkdir -p /tmp/tts_cache

# Copy server script
COPY server.py /app/

# Expose port
EXPOSE 5000

# Run server
CMD ["python", "server.py"]
EOF

# Create Flask server
echo "Creating Flask server..."
cat > server.py << 'EOF'
from flask import Flask, request, send_file, jsonify
from flask_cors import CORS
from TTS.api import TTS
import os
import hashlib
import time

app = Flask(__name__)
CORS(app)

# Initialize TTS model
print("Loading TTS model... (this takes ~30 seconds)")
start_time = time.time()
tts = TTS(model_name="tts_models/en/ljspeech/tacotron2-DDC")
print(f"✅ TTS model loaded in {time.time() - start_time:.1f}s")

CACHE_DIR = "/tmp/tts_cache"
os.makedirs(CACHE_DIR, exist_ok=True)

@app.route('/health', methods=['GET'])
def health():
    return jsonify({
        "status": "healthy",
        "model": "tacotron2-DDC",
        "cache_size": len(os.listdir(CACHE_DIR))
    })

@app.route('/generate', methods=['POST'])
def generate():
    data = request.json
    text = data.get('text', '')
    
    if not text:
        return jsonify({"error": "No text provided"}), 400
    
    # Create cache key
    cache_key = hashlib.md5(text.encode()).hexdigest()
    output_path = f"{CACHE_DIR}/{cache_key}.wav"
    
    # Check cache
    if os.path.exists(output_path):
        print(f"✓ Cache hit: {text[:50]}...")
        return send_file(output_path, mimetype='audio/wav')
    
    # Generate audio
    print(f"♪ Generating: {text[:50]}...")
    start = time.time()
    tts.tts_to_file(text=text, file_path=output_path)
    print(f"  Generated in {time.time() - start:.1f}s")
    
    return send_file(output_path, mimetype='audio/wav')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
EOF

# Build Docker image
echo ""
echo "Building Docker image... (this takes ~5 minutes)"
docker build -t coqui-tts .

# Stop and remove existing container if it exists
docker stop coqui-tts 2>/dev/null || true
docker rm coqui-tts 2>/dev/null || true

# Run container
echo ""
echo "Starting Coqui TTS server..."
docker run -d \
  --name coqui-tts \
  --restart unless-stopped \
  -p 5000:5000 \
  -v ~/coqui-tts-cache:/tmp/tts_cache \
  coqui-tts

# Wait for server to start
echo ""
echo "Waiting for server to start..."
sleep 10

# Test the server
echo ""
echo "Testing server..."
curl -X POST http://localhost:5000/generate \
  -H "Content-Type: application/json" \
  -d '{"text":"Hello, this is a test of the Coqui TTS system"}' \
  --output test.wav

if [ -f test.wav ]; then
    echo "✅ Test successful! Audio file generated."
    rm test.wav
else
    echo "❌ Test failed"
    docker logs coqui-tts
    exit 1
fi

# Get server IP
SERVER_IP=$(curl -s ifconfig.me)

echo ""
echo "================================"
echo "✅ Coqui TTS Setup Complete!"
echo "================================"
echo ""
echo "Server is running at:"
echo "  Local:  http://localhost:5000"
echo "  Remote: http://$SERVER_IP:5000"
echo ""
echo "Test it:"
echo "  curl -X POST http://$SERVER_IP:5000/health"
echo ""
echo "View logs:"
echo "  docker logs -f coqui-tts"
echo ""
echo "Stop server:"
echo "  docker stop coqui-tts"
echo ""
echo "Start server:"
echo "  docker start coqui-tts"
echo "================================"
