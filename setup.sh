#!/bin/bash

# CRM System Setup Script
echo "Setting up CRM System..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "Node.js version 18 or higher is required. You have version $(node -v)."
    exit 1
fi

# Install dependencies
echo "Installing dependencies..."
npm install
npm install mysql2 drizzle-orm-mysql express-mysql-session

# Check if .env file exists
if [ ! -f .env ]; then
    echo "Creating .env file..."
    echo "DB_HOST=localhost" > .env
    echo "DB_PORT=3306" >> .env
    echo "DB_USER=crmuser" >> .env
    echo "DB_PASSWORD=yourpassword" >> .env
    echo "DB_DATABASE=crmdb" >> .env
    echo "SESSION_SECRET=yoursecretkey" >> .env
    echo ".env file created. Please update with your MySQL database credentials."
fi

# Database Setup Instructions
echo "==========================================================="
echo "MySQL Database Setup Instructions:"
echo "1. Make sure MySQL is installed and running"
echo "2. Create a database named 'crmdb'"
echo "3. Create a user 'crmuser' with password 'yourpassword'"
echo "4. Grant all privileges on 'crmdb' to 'crmuser'"
echo "5. Update the .env file with your actual database credentials"
echo "==========================================================="
echo ""

# Database Schema Setup
echo "Setting up database schema..."
echo "This step requires MySQL to be running and configured in your .env file."
read -p "Do you want to push the database schema now? (y/n): " PUSH_SCHEMA

if [ "$PUSH_SCHEMA" = "y" ]; then
    npm run db:push
    echo "Database schema pushed successfully."
else
    echo "Skipping database schema push. You can run 'npm run db:push' manually later."
fi

echo "Setup completed!"
echo "To start the application, run: npm run dev"