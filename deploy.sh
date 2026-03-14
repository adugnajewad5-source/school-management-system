#!/bin/bash

# Deployment script for School Management System
echo "🏫 Deploying School Management System with Beautiful Backgrounds"

# Set environment variables
export VITE_API_URL="https://school-management-backend-gnav.onrender.com"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the project
echo "🔨 Building project..."
npm run build

echo "✅ Build complete!"
echo "🎨 Beautiful school building backgrounds ready!"
echo "📱 UI centering fixes applied!"
echo "🚀 Ready for deployment!"