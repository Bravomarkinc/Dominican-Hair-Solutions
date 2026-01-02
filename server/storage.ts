import { appointments, type Appointment, type InsertAppointment } from "@shared/schema";
import { db } from "./db";
import { desc, eq } from "drizzle-orm";

export interface IStorage {
  createAppointment(appointment: InsertAppointment): Promise<Appointment>;
  getAllAppointments(): Promise<Appointment[]>;
  updateAppointmentStatus(id: string, status: string): Promise<Appointment | undefined>;
  updateAppointment(id: string, data: Partial<InsertAppointment>): Promise<Appointment | undefined>;
  deleteAppointment(id: string): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  async createAppointment(insertAppointment: InsertAppointment): Promise<Appointment> {
    const [appointment] = await db
      .insert(appointments)
      .values(insertAppointment)
      .returning();
    return appointment;
  }

  async getAllAppointments(): Promise<Appointment[]> {
    return await db
      .select()
      .from(appointments)
      .orderBy(desc(appointments.createdAt));
  }

  async updateAppointmentStatus(id: string, status: string): Promise<Appointment | undefined> {
    const [appointment] = await db
      .update(appointments)
      .set({ status })
      .where(eq(appointments.id, id))
      .returning();
    return appointment;
  }

  async updateAppointment(id: string, data: Partial<InsertAppointment>): Promise<Appointment | undefined> {
    const [appointment] = await db
      .update(appointments)
      .set(data)
      .where(eq(appointments.id, id))
      .returning();
    return appointment;
  }

  async deleteAppointment(id: string): Promise<boolean> {
    const result = await db
      .delete(appointments)
      .where(eq(appointments.id, id))
      .returning();
    return result.length > 0;
  }
}

export const storage = new DatabaseStorage();
