# MySQL Database Setup Guide

This guide provides step-by-step instructions for setting up the MySQL database for the CRM system.

## 1. Install MySQL

### Windows
1. Download the MySQL Installer from the [official MySQL website](https://dev.mysql.com/downloads/installer/)
2. Run the installer and follow the setup wizard
3. Choose the "Developer Default" setup type
4. Set a root password when prompted
5. Complete the installation

### macOS
1. Download MySQL from the [official MySQL website](https://dev.mysql.com/downloads/mysql/)
2. Install the downloaded package
3. Follow the setup wizard and set a root password
4. MySQL will be installed and started automatically

### Linux (Ubuntu/Debian)
```bash
sudo apt update
sudo apt install mysql-server
sudo mysql_secure_installation
```

## 2. Create the Database and User

1. Open MySQL command line:
   - Windows: Open MySQL Command Line Client from the Start menu
   - macOS/Linux: Run `mysql -u root -p` in Terminal

2. Enter the following commands:

```sql
CREATE DATABASE crmdb;
CREATE USER 'crmuser'@'localhost' IDENTIFIED BY 'yourpassword';
GRANT ALL PRIVILEGES ON crmdb.* TO 'crmuser'@'localhost';
FLUSH PRIVILEGES;
```

Replace 'yourpassword' with a strong password of your choice.

## 3. MySQL Connection Code

Make the following changes to your project files to use MySQL instead of PostgreSQL:

### server/db.ts
```typescript
import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from '@shared/schema';

// Create MySQL connection pool
export const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  user: process.env.DB_USER || 'crmuser',
  password: process.env.DB_PASSWORD || 'yourpassword',
  database: process.env.DB_DATABASE || 'crmdb',
});

// Initialize Drizzle with MySQL
export const db = drizzle(pool, { schema });
```

### shared/schema.ts
Update the imports at the top:
```typescript
import { 
  mysqlTable, int, varchar, boolean, 
  mysqlEnum, primaryKey, timestamp 
} from 'drizzle-orm/mysql-core';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';
```

Update the table definitions:
```typescript
export const users = mysqlTable('users', {
  id: int('id').autoincrement().primaryKey(),
  username: varchar('username', { length: 255 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
});

export const customers = mysqlTable('customers', {
  id: int('id').autoincrement().primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  phone: varchar('phone', { length: 50 }),
  address: varchar('address', { length: 500 }),
  status: mysqlEnum('status', ['Active', 'Inactive']).default('Active'),
  notes: varchar('notes', { length: 1000 }),
  createdAt: timestamp('createdAt').defaultNow(),
});
```

### server/storage.ts
Update the session store:
```typescript
import { users, customers, type User, type InsertUser, type Customer, type InsertCustomer } from "@shared/schema";
import session from "express-session";
import { db } from "./db";
import { eq } from "drizzle-orm";
import MySQLStore from 'express-mysql-session';

export interface IStorage {
  // Same interface methods
  sessionStore: any;
}

export class DatabaseStorage implements IStorage {
  sessionStore: any;

  constructor() {
    this.sessionStore = new MySQLStore({
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '3306', 10),
      user: process.env.DB_USER || 'crmuser',
      password: process.env.DB_PASSWORD || 'yourpassword',
      database: process.env.DB_DATABASE || 'crmdb',
      createDatabaseTable: true,
    });
  }

  // Rest of the methods remain the same
}
```

## 4. Environment Variables

Create a `.env` file in the root directory with:
```
DB_HOST=localhost
DB_PORT=3306
DB_USER=crmuser
DB_PASSWORD=yourpassword
DB_DATABASE=crmdb
SESSION_SECRET=yoursecretkey
```

Replace 'yourpassword' with the password you set in step 2.

## 5. Testing the Connection

After updating the code, run:
```bash
npm run db:push
```

This will create the necessary tables in your MySQL database.

## Troubleshooting

### Connection Issues
- Make sure MySQL is running
- Check that the username and password are correct
- Ensure the database 'crmdb' exists

### Permission Issues
If you encounter permission errors:
```sql
GRANT ALL PRIVILEGES ON *.* TO 'crmuser'@'localhost';
FLUSH PRIVILEGES;
```

### Database Schema Issues
If tables aren't being created correctly:
1. Drop the database and recreate it:
```sql
DROP DATABASE crmdb;
CREATE DATABASE crmdb;
```
2. Run `npm run db:push` again