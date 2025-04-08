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

# Check if .env file exists
if [ ! -f .env ]; then
    echo "Creating .env file..."
    echo "DATABASE_URL=postgresql://username:password@localhost:5432/crmdb" > .env
    echo "SESSION_SECRET=yoursecretkey" >> .env
    echo ".env file created. Please update with your database credentials."
fi

# Push database schema
echo "Setting up database schema..."
echo "This step requires PostgreSQL to be running and configured in your .env file."
read -p "Do you want to push the database schema now? (y/n): " PUSH_SCHEMA

if [ "$PUSH_SCHEMA" = "y" ]; then
    npm run db:push
    echo "Database schema pushed successfully."
else
    echo "Skipping database schema push. You can run 'npm run db:push' manually later."
fi

echo "Setup completed!"
echo "To start the application, run: npm run dev"