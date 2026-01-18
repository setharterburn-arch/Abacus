#!/bin/bash

# Merge Generated Curriculum Script
# Usage: ./merge-curriculum.sh path/to/generated-curriculum.json

if [ -z "$1" ]; then
    echo "Usage: ./merge-curriculum.sh <path-to-generated-json>"
    echo "Example: ./merge-curriculum.sh ~/Downloads/generated-curriculum-1234567890.json"
    exit 1
fi

GENERATED_FILE="$1"
MAIN_CURRICULUM="src/data/curriculum.json"

if [ ! -f "$GENERATED_FILE" ]; then
    echo "Error: File not found: $GENERATED_FILE"
    exit 1
fi

if [ ! -f "$MAIN_CURRICULUM" ]; then
    echo "Error: Main curriculum file not found: $MAIN_CURRICULUM"
    exit 1
fi

echo "Merging curriculum..."

# Create backup
cp "$MAIN_CURRICULUM" "${MAIN_CURRICULUM}.backup"
echo "✓ Created backup: ${MAIN_CURRICULUM}.backup"

# Use jq to merge the arrays (install with: brew install jq)
if command -v jq &> /dev/null; then
    jq -s '.[0] + .[1]' "$MAIN_CURRICULUM" "$GENERATED_FILE" > "${MAIN_CURRICULUM}.tmp"
    mv "${MAIN_CURRICULUM}.tmp" "$MAIN_CURRICULUM"
    echo "✓ Merged successfully using jq"
else
    echo "⚠️  jq not found. Manual merge required:"
    echo "   1. Open $MAIN_CURRICULUM"
    echo "   2. Open $GENERATED_FILE"
    echo "   3. Copy the array contents from generated file"
    echo "   4. Paste before the closing ] in main curriculum"
    echo ""
    echo "Or install jq: brew install jq"
fi

# Count total sets
TOTAL=$(jq '. | length' "$MAIN_CURRICULUM" 2>/dev/null || echo "unknown")
echo "✓ Total curriculum sets: $TOTAL"

echo ""
echo "Done! Restart your dev server to see the new curriculum."
