#!/bin/bash

# TIMS Database Setup Script
echo "🗄️  Setting up TIMS Database..."

# Check if MySQL is running
if ! pgrep -x "mysqld" > /dev/null; then
    echo "❌ MySQL is not running. Starting MySQL..."
    
    # Try to start MySQL (works on macOS with Homebrew)
    if command -v brew &> /dev/null; then
        brew services start mysql
        sleep 3
    else
        echo "Please start MySQL manually and run this script again."
        exit 1
    fi
fi

echo "✅ MySQL is running"

# Get database credentials
echo "🔐 Please enter your MySQL credentials:"
read -p "MySQL root password: " -s MYSQL_PASSWORD
echo

# Test connection
echo "🔍 Testing MySQL connection..."
mysql -u root -p$MYSQL_PASSWORD -e "SELECT 1;" 2>/dev/null

if [ $? -eq 0 ]; then
    echo "✅ MySQL connection successful"
else
    echo "❌ MySQL connection failed. Please check your password."
    exit 1
fi

# Create database
echo "📦 Creating database..."
mysql -u root -p$MYSQL_PASSWORD -e "CREATE DATABASE IF NOT EXISTS tims_database;" 2>/dev/null

if [ $? -eq 0 ]; then
    echo "✅ Database 'tims_database' created successfully"
else
    echo "❌ Failed to create database"
    exit 1
fi

# Update .env file
echo "📝 Updating .env file..."
if [ -f .env ]; then
    # Update existing .env file
    sed -i.bak "s/DB_PASSWORD=.*/DB_PASSWORD=$MYSQL_PASSWORD/" .env
    echo "✅ Updated .env file with database password"
else
    echo "❌ .env file not found. Please run ./setup.sh first."
    exit 1
fi

echo ""
echo "🎉 Database setup completed successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Run the main setup script: ./setup.sh"
echo "2. Or start the development server: npm run dev"
echo ""
