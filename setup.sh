#!/bin/bash

# InterviewPrep.ai - Quick Start Script
# This script sets up the entire project for local development

set -e

echo "🚀 InterviewPrep.ai - Quick Start Setup"
echo "========================================"
echo ""

# Check Node.js
echo "✓ Checking Node.js..."
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js 18+ from https://nodejs.org/"
    exit 1
fi
echo "  Node.js version: $(node --version)"
echo ""

# Backend Setup
echo "📦 Setting up Backend..."
echo "------------------------"

cd backend

if [ ! -f .env.local ]; then
    echo "⚠️  Creating .env.local from example..."
    cp .env.example .env.local
    echo "⚠️  IMPORTANT: Update backend/.env.local with your values:"
    echo "   - MONGODB_URI (get from MongoDB Atlas)"
    echo "   - OPENAI_API_KEY (get from OpenAI Platform)"
    echo "   - JWT_SECRET (any strong random string)"
else
    echo "✓ .env.local already exists"
fi

echo "Installing dependencies..."
npm install > /dev/null 2>&1 || true

echo "✓ Backend ready"
echo ""

# Frontend Setup
echo "🎨 Setting up Frontend..."
echo "------------------------"

cd ../frontend

if [ ! -f .env.local ]; then
    echo "⚠️  Creating .env.local from example..."
    cp .env.local.example .env.local
    echo "✓ .env.local created (using default localhost API)"
else
    echo "✓ .env.local already exists"
fi

echo "Installing dependencies..."
npm install > /dev/null 2>&1 || true

echo "✓ Frontend ready"
echo ""

# Summary
echo "✅ Setup Complete!"
echo "===================="
echo ""
echo "Next steps:"
echo ""
echo "1️⃣  Update environment variables:"
echo "   - Edit backend/.env.local with MongoDB and OpenAI keys"
echo ""
echo "2️⃣  Seed the database:"
echo "   cd backend"
echo "   npm run seed"
echo ""
echo "3️⃣  In one terminal, start the backend:"
echo "   cd backend"
echo "   npm run dev"
echo ""
echo "4️⃣  In another terminal, start the frontend:"
echo "   cd frontend"
echo "   npm run dev"
echo ""
echo "5️⃣  Open browser and visit:"
echo "   http://localhost:3000"
echo ""
echo "For detailed setup instructions, see SETUP.md"
echo ""
