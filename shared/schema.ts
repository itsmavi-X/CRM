import { 
  mysqlTable, int, varchar, boolean, 
  mysqlEnum, primaryKey, timestamp 
} from 'drizzle-orm/mysql-core';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';

// Users Table
export const users = mysqlTable('users', {
  id: int('id').autoincrement().primaryKey(),
  username: varchar('username', { length: 255 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
});

// Customers Table
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

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type Customer = typeof customers.$inferSelect;
export type InsertCustomer = typeof customers.$inferInsert;

// Zod Validation Schemas
export const insertUserSchema = createInsertSchema(users);
export const insertCustomerSchema = createInsertSchema(customers, {
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().optional(),
  address: z.string().optional(),
  status: z.enum(['Active', 'Inactive']).optional().default('Active'),
  notes: z.string().optional(),
});

