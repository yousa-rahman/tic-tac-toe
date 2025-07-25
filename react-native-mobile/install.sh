#!/bin/bash

echo "🚀 Setting up React Native Tic-Tac-Toe App..."

# Clean any existing node_modules and lock files
echo "🧹 Cleaning existing dependencies..."
rm -rf node_modules
rm -f package-lock.json
rm -f yarn.lock

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Check if installation was successful
if [ $? -eq 0 ]; then
    echo "✅ Dependencies installed successfully!"
    echo ""
    echo "🎯 Next steps:"
    echo "1. For iOS: cd ios && pod install && cd .."
    echo "2. Start Metro: npm start"
    echo "3. Run on iOS: npm run ios"
    echo "4. Run on Android: npm run android"
else
    echo "❌ Installation failed. Please check the error messages above."
    exit 1
fi 