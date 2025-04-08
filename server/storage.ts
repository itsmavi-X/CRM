import { users, customers, type User, type InsertUser, type Customer, type InsertCustomer } from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  createCustomer(customer: InsertCustomer): Promise<Customer>;
  getAllCustomers(): Promise<Customer[]>;
  getCustomer(id: number): Promise<Customer | undefined>;
  updateCustomer(id: number, customer: InsertCustomer): Promise<Customer | undefined>;
  deleteCustomer(id: number): Promise<boolean>;
  
  sessionStore: session.SessionStore;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private customers: Map<number, Customer>;
  private userIdCounter: number;
  private customerIdCounter: number;
  sessionStore: session.SessionStore;

  constructor() {
    this.users = new Map();
    this.customers = new Map();
    this.userIdCounter = 1;
    this.customerIdCounter = 1;
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000, // 1 day
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Customer methods
  async createCustomer(insertCustomer: InsertCustomer): Promise<Customer> {
    const id = this.customerIdCounter++;
    const createdAt = new Date();
    const customer: Customer = { ...insertCustomer, id, createdAt };
    this.customers.set(id, customer);
    return customer;
  }

  async getAllCustomers(): Promise<Customer[]> {
    return Array.from(this.customers.values());
  }

  async getCustomer(id: number): Promise<Customer | undefined> {
    return this.customers.get(id);
  }

  async updateCustomer(id: number, insertCustomer: InsertCustomer): Promise<Customer | undefined> {
    const existingCustomer = this.customers.get(id);
    if (!existingCustomer) {
      return undefined;
    }

    const updatedCustomer: Customer = {
      ...existingCustomer,
      ...insertCustomer,
    };
    
    this.customers.set(id, updatedCustomer);
    return updatedCustomer;
  }

  async deleteCustomer(id: number): Promise<boolean> {
    if (!this.customers.has(id)) {
      return false;
    }
    this.customers.delete(id);
    return true;
  }
}

export const storage = new MemStorage();
