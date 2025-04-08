#!/bin/bash

# CRM System Setup Script
echo "====================================="
echo "CRM System Setup"
echo "====================================="

# Function to check if MySQL is installed
check_mysql() {
  if command -v mysql >/dev/null 2>&1; then
    echo "✅ MySQL is installed."
    return 0
  else
    echo "❌ MySQL is not installed. Please install MySQL first."
    echo "   For installation instructions, see DATABASE_SETUP.md"
    return 1
  fi
}

# Function to create .env file
create_env_file() {
  echo "Creating .env file..."
  
  # Ask for database connection details
  read -p "Enter MySQL host (default: localhost): " db_host
  db_host=${db_host:-localhost}
  
  read -p "Enter MySQL port (default: 3306): " db_port
  db_port=${db_port:-3306}
  
  read -p "Enter MySQL username (default: crmuser): " db_user
  db_user=${db_user:-crmuser}
  
  read -sp "Enter MySQL password: " db_password
  echo
  
  read -p "Enter MySQL database name (default: crmdb): " db_database
  db_database=${db_database:-crmdb}
  
  # Generate a random session secret
  session_secret=$(openssl rand -hex 32)
  
  # Create the .env file
  cat > .env << EOF
DB_HOST=${db_host}
DB_PORT=${db_port}
DB_USER=${db_user}
DB_PASSWORD=${db_password}
DB_DATABASE=${db_database}
SESSION_SECRET=${session_secret}
EOF
  
  echo "✅ .env file created."
}

# Function to install npm dependencies
install_dependencies() {
  echo "Installing dependencies..."
  npm install
  
  # Install MySQL specific dependencies
  echo "Installing MySQL dependencies..."
  npm install mysql2 express-mysql-session --save
  
  echo "✅ Dependencies installed."
}

# Main setup script
echo "This script will help you set up the CRM system on your local machine."
echo "It will create a .env file and install dependencies."
echo

# Check if Node.js is installed
if ! command -v node >/dev/null 2>&1; then
  echo "❌ Node.js is not installed. Please install Node.js first."
  exit 1
fi

echo "✅ Node.js is installed: $(node -v)"

# Check MySQL
check_mysql || exit 1

# Ask user if they want to set up the database
read -p "Have you already created the MySQL database and user? (y/n): " db_setup
if [[ $db_setup != "y" && $db_setup != "Y" ]]; then
  echo
  echo "Please set up the MySQL database and user first:"
  echo "1. Connect to MySQL as root"
  echo "2. Run the following commands:"
  echo "   CREATE DATABASE crmdb;"
  echo "   CREATE USER 'crmuser'@'localhost' IDENTIFIED BY 'your_password';"
  echo "   GRANT ALL PRIVILEGES ON crmdb.* TO 'crmuser'@'localhost';"
  echo "   FLUSH PRIVILEGES;"
  echo
  echo "For more detailed instructions, see DATABASE_SETUP.md"
  exit 1
fi

# Create .env file
create_env_file

# Install dependencies
install_dependencies

# Instructions for next steps
echo
echo "====================================="
echo "Setup Complete!"
echo "====================================="
echo
echo "Next steps:"
echo "1. Update the database files to use MySQL:"
echo "   - See DATABASE_SETUP.md for specific code changes"
echo "2. Push the database schema:"
echo "   npm run db:push"
echo "3. Start the development server:"
echo "   npm run dev"
echo "4. Access the application at http://localhost:5000"
echo
echo "For more information, refer to README.md and DATABASE_SETUP.md"
echo

# End of script