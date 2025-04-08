import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { insertCustomerSchema } from "@shared/schema";

// Middleware to check if user is authenticated
const isAuthenticated = (req: any, res: any, next: any) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: "Unauthorized" });
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication routes
  setupAuth(app);

  // Customers API routes
  // Create a new customer
  app.post("/api/customers", isAuthenticated, async (req, res, next) => {
    try {
      const customerData = insertCustomerSchema.parse(req.body);
      const customer = await storage.createCustomer(customerData);
      res.status(201).json(customer);
    } catch (error) {
      next(error);
    }
  });

  // Get all customers
  app.get("/api/customers", isAuthenticated, async (req, res, next) => {
    try {
      const customers = await storage.getAllCustomers();
      res.json(customers);
    } catch (error) {
      next(error);
    }
  });

  // Get a single customer
  app.get("/api/customers/:id", isAuthenticated, async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      const customer = await storage.getCustomer(id);
      if (!customer) {
        return res.status(404).json({ message: "Customer not found" });
      }
      res.json(customer);
    } catch (error) {
      next(error);
    }
  });

  // Update a customer
  app.put("/api/customers/:id", isAuthenticated, async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      const customerData = insertCustomerSchema.parse(req.body);
      const customer = await storage.updateCustomer(id, customerData);
      if (!customer) {
        return res.status(404).json({ message: "Customer not found" });
      }
      res.json(customer);
    } catch (error) {
      next(error);
    }
  });

  // Delete a customer
  app.delete("/api/customers/:id", isAuthenticated, async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteCustomer(id);
      if (!deleted) {
        return res.status(404).json({ message: "Customer not found" });
      }
      res.status(204).end();
    } catch (error) {
      next(error);
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
