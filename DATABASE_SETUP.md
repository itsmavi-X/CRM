# MySQL Database Setup Guide for CRM System

This guide will help you set up MySQL for your CRM System project.

## Installing MySQL

### Windows
1. Download the MySQL Installer from the [official website](https://dev.mysql.com/downloads/installer/)
2. Run the installer and select "Full" installation or at minimum select:
   - MySQL Server
   - MySQL Workbench (recommended for GUI management)
3. Set a password for the root user
4. Keep the default port (3306)
5. Complete the installation

### macOS
Option 1: Using Homebrew:
```bash
brew install mysql
brew services start mysql
```

Option 2: Using the installer:
1. Download from [MySQL website](https://dev.mysql.com/downloads/mysql/)
2. Follow the installation instructions

### Linux (Ubuntu/Debian)
```bash
sudo apt update
sudo apt install mysql-server
sudo systemctl start mysql
sudo systemctl enable mysql
```

## Creating the Database

### Using MySQL Command Line

1. Open a terminal or command prompt
2. Access MySQL:
   ```bash
   # Windows
   mysql -u root -p
   
   # macOS/Linux
   sudo mysql -u root -p
   ```
3. Enter your root password when prompted
4. Create a database for the CRM:
   ```sql
   CREATE DATABASE crmdb;
   ```
5. Create a user for your application:
   ```sql
   CREATE USER 'crmuser'@'localhost' IDENTIFIED BY 'yourpassword';
   ```
6. Grant privileges to the user:
   ```sql
   GRANT ALL PRIVILEGES ON crmdb.* TO 'crmuser'@'localhost';
   FLUSH PRIVILEGES;
   ```
7. Exit MySQL:
   ```sql
   EXIT;
   ```

### Using MySQL Workbench (GUI)

1. Open MySQL Workbench and connect to your MySQL server
2. In the Navigator panel, right-click on the empty area under "SCHEMAS" and select "Create Schema..."
3. Enter "crmdb" as the schema name and click Apply
4. Go to "Administration" > "Users and Privileges"
5. Click "Add Account", enter details for a new user (e.g., crmuser)
6. Set the password for the user
7. Go to the "Schema Privileges" tab, click "Add Entry"
8. Select the "crmdb" schema, choose "ALL" for privileges, and click Apply

## Modifying Project Code to Use MySQL

To use MySQL instead of PostgreSQL in your project, you'll need to make a few changes:

### 1. Update Database Connection

Update the `db.ts` file with MySQL connection:

```typescript
import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as schema from "@shared/schema";

// Create the connection
const connection = await mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "crmuser",
  password: process.env.DB_PASSWORD || "yourpassword",
  database: process.env.DB_DATABASE || "crmdb"
});

export const db = drizzle(connection, { schema });
```

### 2. Update Schema Types

In `shared/schema.ts`, update the imports and table definitions:

```typescript
import { mysqlTable, varchar, int, boolean, timestamp } from "drizzle-orm/mysql-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Then replace pgTable with mysqlTable in your table definitions
// For example:
export const users = mysqlTable("users", {
  // ... your columns ...
});
```

### 3. Update Session Store

In `server/auth.ts`, update the session store:

```typescript
import session from "express-session";
import MySQLStore from "express-mysql-session";

// Then in setupAuth function:
const MySQLStoreSession = MySQLStore(session);
const sessionStore = new MySQLStoreSession({
  host: process.env.DB_HOST || "localhost",
  port: 3306,
  user: process.env.DB_USER || "crmuser",
  password: process.env.DB_PASSWORD || "yourpassword",
  database: process.env.DB_DATABASE || "crmdb"
});

const sessionSettings = {
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: sessionStore
};
```

## Configuring Environment Variables

1. Open your project's `.env` file
2. Update with your MySQL connection details:

```
DB_HOST=localhost
DB_PORT=3306
DB_USER=crmuser
DB_PASSWORD=yourpassword
DB_DATABASE=crmdb
SESSION_SECRET=yoursecretkey
```

## Installing Required Packages

You'll need to install MySQL-specific packages:

```bash
npm install mysql2 drizzle-orm-mysql express-mysql-session
```

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
   -- In MySQL
   SELECT * FROM users;
   ```

## Troubleshooting Common Issues

### Connection Refused
- Check if MySQL service is running
- Verify the port in the connection string (default is 3306)
- Ensure your firewall isn't blocking the connection

### Authentication Failed
- Double-check username and password in the environment variables
- Verify that the user has appropriate permissions
- If using a newer MySQL version, you might need to adjust the authentication method

### Database Does Not Exist
- Confirm you created the database with the correct name
- Check for typos in the connection string

### Schema Push Fails
- Check if Drizzle is configured correctly for MySQL
- Ensure the database user has permission to create tables
- Review any error messages for specific issues

## Backup and Restore (Optional)

### Creating a Backup
```bash
mysqldump -u root -p crmdb > crmdb_backup.sql
```

### Restoring from Backup
```bash
mysql -u root -p crmdb < crmdb_backup.sql
```

---

If you encounter any problems not covered in this guide, refer to the [MySQL documentation](https://dev.mysql.com/doc/) or seek assistance from your instructor.