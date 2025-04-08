# Database Setup Guide for CRM System

This guide will help you set up PostgreSQL for your CRM System project.

## Installing PostgreSQL

### Windows
1. Download the PostgreSQL installer from the [official website](https://www.postgresql.org/download/windows/)
2. Run the installer and follow the installation wizard
3. Set a password for the default postgres user
4. Keep the default port (5432)
5. Complete the installation

### macOS
Option 1: Using Homebrew:
```bash
brew install postgresql
brew services start postgresql
```

Option 2: Using the installer:
1. Download from [PostgreSQL website](https://www.postgresql.org/download/macosx/)
2. Follow the installation instructions

### Linux (Ubuntu/Debian)
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

## Creating the Database

### Using psql (Command Line)

1. Open a terminal or command prompt
2. Access PostgreSQL:
   ```bash
   # Windows
   psql -U postgres
   
   # macOS/Linux
   sudo -u postgres psql
   ```
3. Enter your password when prompted
4. Create a database for the CRM:
   ```sql
   CREATE DATABASE crmdb;
   ```
5. Create a user for your application:
   ```sql
   CREATE USER crmuser WITH ENCRYPTED PASSWORD 'yourpassword';
   ```
6. Grant privileges to the user:
   ```sql
   GRANT ALL PRIVILEGES ON DATABASE crmdb TO crmuser;
   ```
7. Connect to your new database:
   ```sql
   \c crmdb
   ```
8. Exit psql:
   ```sql
   \q
   ```

### Using pgAdmin (GUI)

1. Install pgAdmin from [pgAdmin website](https://www.pgadmin.org/download/)
2. Open pgAdmin and connect to your PostgreSQL server
3. Right-click on "Databases" and select "Create" > "Database"
4. Enter "crmdb" as the database name and save
5. Create a new user by navigating to "Login/Group Roles"
6. Right-click and select "Create" > "Login/Group Role"
7. Enter user details and set permissions

## Configuring Environment Variables

1. Open your project's `.env` file
2. Update the DATABASE_URL with your PostgreSQL connection string:

```
DATABASE_URL=postgresql://username:password@localhost:5432/crmdb
```

Replace:
- `username` with your PostgreSQL username (e.g., crmuser)
- `password` with your PostgreSQL user password
- Keep `localhost:5432` unless you changed the default port
- `crmdb` with your database name if different

## Running Database Migrations

Once your database is set up and your environment variables are configured:

```bash
# In your project directory
npm run db:push
```

This command will use Drizzle ORM to create the required tables based on your schema.

## Verifying the Setup

To verify that your database is set up correctly:

1. Start your application:
   ```bash
   npm run dev
   ```

2. Register a new user through the application interface

3. Check if the user was added to the database:
   ```sql
   -- In psql
   SELECT * FROM users;
   ```

## Troubleshooting Common Issues

### Connection Refused
- Check if PostgreSQL service is running
- Verify the port in the connection string (default is 5432)
- Ensure your firewall isn't blocking the connection

### Authentication Failed
- Double-check username and password in the connection string
- Verify that the user has appropriate permissions

### Database Does Not Exist
- Confirm you created the database with the correct name
- Check for typos in the connection string

### Schema Push Fails
- Check if Drizzle is configured correctly
- Ensure the database user has permission to create tables
- Review any error messages for specific issues

## Backup and Restore (Optional)

### Creating a Backup
```bash
pg_dump -U postgres -d crmdb > crmdb_backup.sql
```

### Restoring from Backup
```bash
psql -U postgres -d crmdb < crmdb_backup.sql
```

---

If you encounter any problems not covered in this guide, refer to the [PostgreSQL documentation](https://www.postgresql.org/docs/) or seek assistance from your instructor.