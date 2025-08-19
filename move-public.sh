#!/bin/bash

# Shell script to move public directories
# Usage: ./move-public.sh

set -e  # Exit on any error

# Get the script directory (where this script is located)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "Moving public directories..."

# Check if demo/public exists
if [ -d "$SCRIPT_DIR/demo/public" ]; then
    echo "Moving demo/public/ to public/..."
    # Remove existing public directory if it exists
    if [ -d "$SCRIPT_DIR/public" ]; then
        echo "Removing existing public/ directory..."
        rm -rf "$SCRIPT_DIR/public"
    fi
    # Move demo/public to public
    mv "$SCRIPT_DIR/demo/public" "$SCRIPT_DIR/public"
    echo "✓ Moved demo/public/ to public/"
else
    echo "⚠️  demo/public/ directory not found, skipping..."
fi

# Check if test/public exists
if [ -d "$SCRIPT_DIR/test/public" ]; then
    echo "Moving test/public/ to public/test/..."
    # Create public/test directory if it doesn't exist
    mkdir -p "$SCRIPT_DIR/public/test"
    # Move test/public contents to public/test
    mv "$SCRIPT_DIR/test/public"/* "$SCRIPT_DIR/public/test/" 2>/dev/null || true
    # Remove empty test/public directory
    rmdir "$SCRIPT_DIR/test/public" 2>/dev/null || true
    echo "✓ Moved test/public/ to public/test/"
else
    echo "⚠️  test/public/ directory not found, skipping..."
fi

echo "✅ Public directories moved successfully!"
