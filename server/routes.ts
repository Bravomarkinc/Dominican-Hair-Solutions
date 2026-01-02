import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertAppointmentSchema } from "@shared/schema";
import { randomBytes, createHash } from "crypto";

const adminTokens = new Set<string>();

function generateToken(): string {
  return randomBytes(32).toString('hex');
}

function verifyAdminToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.replace('Bearer ', '');
  
  if (!token || !adminTokens.has(token)) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  app.post("/api/admin/login", async (req, res) => {
    const { password } = req.body;
    const adminPassword = process.env.ADMIN_PASSWORD;
    
    if (!adminPassword) {
      console.error("ADMIN_PASSWORD not set");
      return res.status(500).json({ error: "Admin not configured" });
    }
    
    if (password === adminPassword) {
      const token = generateToken();
      adminTokens.add(token);
      res.json({ token });
    } else {
      res.status(401).json({ error: "Invalid password" });
    }
  });

  app.post("/api/admin/logout", (req, res) => {
    const authHeader = req.headers.authorization;
    const token = authHeader?.replace('Bearer ', '');
    if (token) {
      adminTokens.delete(token);
    }
    res.json({ success: true });
  });

  app.post("/api/bookings", async (req, res) => {
    try {
      const validatedData = insertAppointmentSchema.parse(req.body);
      const appointment = await storage.createAppointment(validatedData);
      res.json(appointment);
    } catch (error) {
      console.error("Error creating booking:", error);
      res.status(400).json({ error: "Invalid booking data" });
    }
  });

  app.get("/api/bookings", verifyAdminToken, async (req, res) => {
    try {
      const appointments = await storage.getAllAppointments();
      res.json(appointments);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      res.status(500).json({ error: "Failed to fetch bookings" });
    }
  });

  app.patch("/api/bookings/:id/status", verifyAdminToken, async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      
      if (!["scheduled", "completed", "no-show", "cancelled"].includes(status)) {
        return res.status(400).json({ error: "Invalid status" });
      }
      
      const appointment = await storage.updateAppointmentStatus(id, status);
      if (!appointment) {
        return res.status(404).json({ error: "Appointment not found" });
      }
      res.json(appointment);
    } catch (error) {
      console.error("Error updating appointment status:", error);
      res.status(500).json({ error: "Failed to update status" });
    }
  });

  app.patch("/api/bookings/:id", verifyAdminToken, async (req, res) => {
    try {
      const { id } = req.params;
      const { appointmentDate, appointmentTime, serviceName, servicePrice, customerName, customerEmail, customerPhone } = req.body;
      
      const appointment = await storage.updateAppointment(id, {
        appointmentDate,
        appointmentTime,
        serviceName,
        servicePrice,
        customerName,
        customerEmail,
        customerPhone,
      });
      
      if (!appointment) {
        return res.status(404).json({ error: "Appointment not found" });
      }
      res.json(appointment);
    } catch (error) {
      console.error("Error updating appointment:", error);
      res.status(500).json({ error: "Failed to update appointment" });
    }
  });

  app.delete("/api/bookings/:id", verifyAdminToken, async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteAppointment(id);
      if (!deleted) {
        return res.status(404).json({ error: "Appointment not found" });
      }
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting appointment:", error);
      res.status(500).json({ error: "Failed to delete appointment" });
    }
  });

  return httpServer;
}
