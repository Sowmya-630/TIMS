#!/bin/bash

# TIMS Development Setup Script (No Database Required)
echo "🚀 Setting up TIMS Backend for Development..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cp env.example .env
    echo "⚠️  Please update the .env file with your database credentials when ready."
else
    echo "✅ .env file already exists"
fi

# Create logs directory
mkdir -p logs
echo "✅ Created logs directory"

echo ""
echo "🎉 Development setup completed!"
echo ""
echo "📋 Next steps:"
echo "1. Set up MySQL database (optional for now):"
echo "   - Run: ./setup-database.sh"
echo "   - Or manually create database and update .env"
echo ""
echo "2. Start the development server:"
echo "   npm run dev"
echo ""
echo "3. The API will be available at: http://localhost:5000"
echo "   Health check: http://localhost:5000/health"
echo ""
echo "Note: The server will start even without database connection,"
echo "but database operations will fail until MySQL is configured."
echo ""

