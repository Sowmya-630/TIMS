#!/bin/bash

# TIMS Backend Setup Script
echo "🚀 Setting up TIMS Backend..."

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

# Check if MySQL is installed
if ! command -v mysql &> /dev/null; then
    echo "❌ MySQL is not installed. Please install MySQL 8.0+ first."
    exit 1
fi

echo "✅ MySQL is installed"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cp env.example .env
    echo "⚠️  Please update the .env file with your database credentials and other settings."
else
    echo "✅ .env file already exists"
fi

# Create logs directory
mkdir -p logs
echo "✅ Created logs directory"

# Test database connection
echo "🔍 Testing database connection..."
node -e "
import('./src/config/database.js').then(({ testConnection }) => {
  return testConnection();
}).then(connected => {
  if (connected) {
    console.log('✅ Database connection successful');
    process.exit(0);
  } else {
    console.log('❌ Database connection failed');
    process.exit(1);
  }
}).catch(err => {
  console.log('❌ Database connection error:', err.message);
  process.exit(1);
});
"

if [ $? -eq 0 ]; then
    echo "✅ Database connection test passed"
else
    echo "❌ Database connection test failed."
    echo ""
    echo "🔧 Database Setup Instructions:"
    echo "1. Make sure MySQL is running: brew services start mysql"
    echo "2. Create the database:"
    echo "   mysql -u root -p"
    echo "   CREATE DATABASE tims_database;"
    echo "   EXIT;"
    echo "3. Update the .env file with your MySQL credentials"
    echo "4. Run this setup script again"
    echo ""
    echo "Alternatively, you can skip database setup for now and run:"
    echo "npm run dev"
    echo ""
    read -p "Do you want to continue without database setup? (y/n): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Run database migration (only if database connection was successful)
if [ $? -eq 0 ]; then
    echo "🗄️  Running database migration..."
    npm run migrate

    if [ $? -eq 0 ]; then
        echo "✅ Database migration completed"
        
        # Ask if user wants to seed the database
        read -p "🌱 Do you want to seed the database with sample data? (y/n): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            echo "🌱 Seeding database..."
            npm run seed
            if [ $? -eq 0 ]; then
                echo "✅ Database seeded successfully"
                echo "📧 Default login credentials:"
                echo "   Admin: admin@tims.com / password123"
                echo "   Manager: manager@tims.com / password123"
                echo "   Staff: staff@tims.com / password123"
            else
                echo "❌ Database seeding failed"
            fi
        fi
    else
        echo "❌ Database migration failed"
    fi
else
    echo "⏭️  Skipping database migration due to connection issues"
fi

echo ""
echo "🎉 Setup completed successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Update the .env file with your configuration"
echo "2. Start the development server: npm run dev"
echo "3. Or start the production server: npm start"
echo ""
echo "🔗 API will be available at: http://localhost:5000"
echo "🏥 Health check: http://localhost:5000/health"
echo "📚 API Documentation: See API_DOCUMENTATION.md"
echo ""
echo "Happy coding! 🚀"
