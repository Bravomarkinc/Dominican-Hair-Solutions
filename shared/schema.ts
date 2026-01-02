import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const appointments = pgTable("appointments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  customerName: text("customer_name").notNull(),
  customerEmail: text("customer_email").notNull(),
  customerPhone: text("customer_phone").notNull(),
  appointmentDate: text("appointment_date").notNull(),
  appointmentTime: text("appointment_time").notNull(),
  serviceName: text("service_name").notNull(),
  servicePrice: integer("service_price").notNull(),
  status: text("status").notNull().default("scheduled"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertAppointmentSchema = createInsertSchema(appointments).omit({
  id: true,
  status: true,
  createdAt: true,
});

export type InsertAppointment = z.infer<typeof insertAppointmentSchema>;
export type Appointment = typeof appointments.$inferSelect;
