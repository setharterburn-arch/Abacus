#!/bin/bash
# Deploy and run Grade 7-9 content generation on VPS

VPS_USER="ubuntu"
VPS_HOST="51.81.203.89"
VPS_DIR="/home/ubuntu/math-homeschool-gen"

echo "📦 Creating deployment package..."

# Create temp directory
TEMP_DIR=$(mktemp -d)
mkdir -p "$TEMP_DIR/scripts"

# Copy necessary files
cp scripts/generate_grades_7_9.py "$TEMP_DIR/scripts/"
cp scripts/run_migration.py "$TEMP_DIR/"
cp migration_fixes.sql "$TEMP_DIR/"
cp .env "$TEMP_DIR/"

# Create requirements file
cat > "$TEMP_DIR/requirements.txt" << EOF
anthropic
psycopg2-binary
EOF

# Create archive
cd "$TEMP_DIR"
tar -czf /tmp/grade_7_9_gen.tar.gz .
cd -

echo "🚀 Uploading to VPS..."
scp -o StrictHostKeyChecking=no /tmp/grade_7_9_gen.tar.gz ${VPS_USER}@${VPS_HOST}:~/

echo "🔧 Setting up and running on VPS..."
ssh -o StrictHostKeyChecking=no ${VPS_USER}@${VPS_HOST} << 'ENDSSH'
    cd ~/math-homeschool-gen
    
    # Extract new files
    tar -xzf ~/grade_7_9_gen.tar.gz
    
    # Activate venv
    source venv/bin/activate
    
    # Install dependencies
    pip install -q -r requirements.txt
    
    # Run migration first
    echo "📊 Running database migration..."
    python run_migration.py
    
    # Run content generation
    echo "🎨 Starting content generation..."
    nohup python scripts/generate_grades_7_9.py > generation_7_9.log 2>&1 &
    
    PID=$!
    echo "✅ Generation started with PID $PID"
    echo "📝 Logs: tail -f ~/math-homeschool-gen/generation_7_9.log"
    
    # Show initial output
    sleep 2
    tail -n 20 generation_7_9.log
ENDSSH

echo "✨ Deployment complete!"
echo "📊 Monitor progress: ssh ${VPS_USER}@${VPS_HOST} 'tail -f ~/math-homeschool-gen/generation_7_9.log'"

# Cleanup
rm -rf "$TEMP_DIR"
rm /tmp/grade_7_9_gen.tar.gz
