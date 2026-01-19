#!/bin/bash

# Update Coqui TTS to use better voice model
# Run this on your VPS

echo "Updating Coqui TTS to VITS model (better quality)..."

# SSH into VPS and update the server
ssh ubuntu@51.81.203.89 << 'ENDSSH'

# Stop current container
docker stop coqui-tts

# Update server.py to use VITS model
cd ~/coqui-tts

cat > server.py << 'EOF'
from flask import Flask, request, send_file, jsonify
from flask_cors import CORS
from TTS.api import TTS
import os, hashlib, time

app = Flask(__name__)
CORS(app)

# Initialize TTS model - VITS for better quality
print("Loading VITS TTS model (higher quality)...")
tts = TTS(model_name="tts_models/en/vctk/vits")
print("✅ Model loaded!")

CACHE_DIR = "/tmp/tts_cache"
os.makedirs(CACHE_DIR, exist_ok=True)

@app.route('/health', methods=['GET'])
def health():
    return jsonify({"status": "healthy", "model": "vits", "quality": "high"})

@app.route('/generate', methods=['POST'])
def generate():
    text = request.json.get('text', '')
    speaker = request.json.get('speaker', 'p225')  # Default to female voice
    
    if not text: 
        return jsonify({"error": "No text"}), 400
    
    cache_key = hashlib.md5(f"{text}_{speaker}".encode()).hexdigest()
    output = f"{CACHE_DIR}/{cache_key}.wav"
    
    if not os.path.exists(output):
        print(f"Generating: {text[:50]}...")
        tts.tts_to_file(text=text, file_path=output, speaker=speaker)
    
    return send_file(output, mimetype='audio/wav')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
EOF

# Rebuild and restart container
docker build -t coqui-tts .
docker rm coqui-tts
docker run -d --name coqui-tts --restart unless-stopped -p 5000:5000 -v ~/coqui-tts-cache:/tmp/tts_cache coqui-tts

echo "✅ Coqui TTS updated to VITS model!"
echo "Server restarting... (takes ~30 seconds)"

ENDSSH

echo ""
echo "✅ Done! Testing new voice..."
sleep 35

# Test the new voice
curl -X POST http://51.81.203.89:5000/generate \
  -H "Content-Type: application/json" \
  -d '{"text":"Hello! This is the new VITS voice. It sounds much more natural.","speaker":"p225"}' \
  --output test_vits.wav

echo ""
echo "✅ Test audio saved to test_vits.wav"
echo "Play it to hear the new voice quality!"
