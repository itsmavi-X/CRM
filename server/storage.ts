import MySQLStoreFactory from 'express-mysql-session';
import session from 'express-session';
import { db } from './db';
import { users, customers, InsertUser, InsertCustomer } from '@shared/schema';
import { eq } from 'drizzle-orm';

const MySQLStore = MySQLStoreFactory(session);

export class DatabaseStorage {
  sessionStore: any;

  constructor() {
    this.sessionStore = new MySQLStore({
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '3306', 10),
      user: process.env.DB_USER || 'crmuser',
      password: process.env.DB_PASSWORD || '@kuki3001',
      database: process.env.DB_DATABASE || 'crmdb',
      createDatabaseTable: true,
    });
  }

  // User methods
  async createUser(user: InsertUser) {
    const result = await db.insert(users).values(user);
    return { ...user, id: result.insertId };
  }

  async getUserByUsername(username: string) {
    const result = await db.select().from(users).where(eq(users.username, username));
    return result[0] || null;
  }

  async getUser(id: number) {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0] || null;
  }

  // Customer methods
  async getAllCustomers() {
    return await db.select().from(customers);
  }

  async createCustomer(customer: InsertCustomer) {
    const result = await db.insert(customers).values(customer);
    return { ...customer, id: result.insertId };
  }

  async getCustomerById(id: number) {
    const result = await db.select().from(customers).where(eq(customers.id, id));
    return result[0] || null;
  }

  async updateCustomer(id: number, customer: Partial<InsertCustomer>) {
    return await db.update(customers).set(customer).where(eq(customers.id, id));
  }

  async deleteCustomer(id: number) {
    return await db.delete(customers).where(eq(customers.id, id));
  }
}
