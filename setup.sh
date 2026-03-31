#!/bin/bash
set -e

echo "--- GStack Antigravity Quick Setup ---"
echo ""

# 1. Install dependencies
echo "[1/3] Installing NPM dependencies..."
npm install

# 2. Initialize GStack submodule
echo "[2/3] Initializing GStack..."
if [ -d ".git" ]; then
    git submodule update --init --recursive
fi

if [ ! -f "gstack/SKILL.md" ]; then
    echo "[!] gstack folder not found. Cloning..."
    git clone https://github.com/garrytan/gstack.git gstack
fi

# 3. Run internal setup
echo "[3/3] Running configuration and workflow generation..."
node setup.js

echo ""
echo "--- Setup Successful! ---"
echo ""
echo "Tip: Use 'npm run global:install' to use these workflows in all projects."
