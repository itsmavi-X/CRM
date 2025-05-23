import 'dotenv/config'; // ✅ This line loads .env automatically
import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from '@shared/schema';

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  user: process.env.DB_USER || 'crmuser',
  password: process.env.DB_PASSWORD || '@kuki3001',
  database: process.env.DB_DATABASE || 'crmdb',
});

export const db = drizzle(pool, {
  schema,
  mode: 'default', // ✅ Required by drizzle when using schema
});
