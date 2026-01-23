#!/bin/bash

# Deploy Math Homeschool Generator to VPS
# Usage: ./scripts/deploy_gen.sh <user@host>

if [ -z "$1" ]; then
    echo "Usage: $0 <user@host>"
    echo "Example: $0 root@192.168.1.100"
    exit 1
fi

REMOTE="$1"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
ARCHIVE_NAME="math-gen-$TIMESTAMP.tar.gz"

echo "📦 Packaging generator..."
# Create a temporary requirement file if not exists
if [ ! -f requirements_vps.txt ]; then
    echo "google-generativeai" > requirements_vps.txt
fi

tar -czf "$ARCHIVE_NAME" \
    scripts/generate_upper_curriculum.py \
    requirements_vps.txt \
    .env

echo "🚀 Uploading to $REMOTE..."
scp "$ARCHIVE_NAME" "$REMOTE:~/"

echo "🔧 Installing and Running on VPS..."
ssh "$REMOTE" "bash -s" << 'EOF'
    # Unpack
    mkdir -p math-homeschool-gen
    tar -xzf math-gen-*.tar.gz -C math-homeschool-gen
    cd math-homeschool-gen
    
    # Create and Activate Virtual Environment
    echo "Creating virtual environment..."
    if [ ! -d "venv" ]; then
        python3 -m venv venv
    fi
    source venv/bin/activate
    
    # Install dependencies
    echo "Installing dependencies..."
    pip install -r requirements_vps.txt
    
    # Run Generator (Background)
    echo "Starting Generator..."
    # Source .env if needed or just export key from it
    if [ -f .env ]; then
        export $(cat .env | xargs)
    fi
    
    # Run with nohup using venv python
    nohup python scripts/generate_upper_curriculum.py > generation.log 2>&1 &
    
    PID=$!
    echo "✅ Generator started with PID $PID"
    echo "   Logs: tail -f ~/math-homeschool-gen/generation.log"
EOF

# Cleanup local
rm "$ARCHIVE_NAME"
rm requirements_vps.txt

echo "✨ Deployment Complete!"
