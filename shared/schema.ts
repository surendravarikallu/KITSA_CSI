import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// === TABLE DEFINITIONS ===

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  rollNumber: text("roll_number").unique(), // Optional for non-students
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  role: text("role", { enum: ["admin", "organizer", "student"] }).default("student").notNull(),
  membershipStatus: text("membership_status", { enum: ["pending", "approved", "rejected"] }).default("pending").notNull(),
  idCardUrl: text("id_card_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const events = pgTable("events", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  date: timestamp("date").notNull(),
  venue: text("venue").notNull(),
  capacity: integer("capacity").notNull(),
  createdBy: integer("created_by").references(() => users.id),
  status: text("status", { enum: ["upcoming", "completed", "cancelled"] }).default("upcoming").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const registrations = pgTable("registrations", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  eventId: integer("event_id").notNull().references(() => events.id),
  attended: boolean("attended").default(false),
  status: text("status", { enum: ["registered", "waitlist", "cancelled"] }).default("registered").notNull(),
  registeredAt: timestamp("registered_at").defaultNow(),
});

export const gallery = pgTable("gallery", {
  id: serial("id").primaryKey(),
  imageUrl: text("image_url").notNull(),
  caption: text("caption"),
  eventId: integer("event_id").references(() => events.id), // Optional link to event
  uploadedBy: integer("uploaded_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
});

export const contacts = pgTable("contacts", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const committeeMembers = pgTable("committee_members", {
  id: serial("id").primaryKey(),
  designation: text("designation").notNull(),
  name: text("name").notNull(),
  rollNo: text("roll_no"),
  year: text("year"),
  branch: text("branch"),
  orderOffset: integer("order_offset").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

// === RELATIONS ===

export const usersRelations = relations(users, ({ many }) => ({
  registrations: many(registrations),
  createdEvents: many(events),
}));

export const eventsRelations = relations(events, ({ one, many }) => ({
  creator: one(users, {
    fields: [events.createdBy],
    references: [users.id],
  }),
  registrations: many(registrations),
  galleryImages: many(gallery),
}));

export const registrationsRelations = relations(registrations, ({ one }) => ({
  user: one(users, {
    fields: [registrations.userId],
    references: [users.id],
  }),
  event: one(events, {
    fields: [registrations.eventId],
    references: [events.id],
  }),
}));

export const galleryRelations = relations(gallery, ({ one }) => ({
  event: one(events, {
    fields: [gallery.eventId],
    references: [events.id],
  }),
  uploader: one(users, {
    fields: [gallery.uploadedBy],
    references: [users.id],
  }),
}));


// === BASE SCHEMAS ===

export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true, updatedAt: true });
export const insertEventSchema = createInsertSchema(events).omit({ id: true, createdAt: true, createdBy: true });
export const insertRegistrationSchema = createInsertSchema(registrations).omit({ id: true, registeredAt: true, attended: true, status: true });
export const insertGallerySchema = createInsertSchema(gallery).omit({ id: true, createdAt: true, uploadedBy: true });
export const insertContactSchema = createInsertSchema(contacts).omit({ id: true, createdAt: true });
export const insertCommitteeMemberSchema = createInsertSchema(committeeMembers).omit({ id: true, createdAt: true });

// === EXPLICIT API CONTRACT TYPES ===

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Event = typeof events.$inferSelect;
export type InsertEvent = z.infer<typeof insertEventSchema>;

export type Registration = typeof registrations.$inferSelect;
export type InsertRegistration = z.infer<typeof insertRegistrationSchema>;

export type GalleryItem = typeof gallery.$inferSelect;
export type InsertGalleryItem = z.infer<typeof insertGallerySchema>;

export type ContactMessage = typeof contacts.$inferSelect;
export type InsertContactMessage = z.infer<typeof insertContactSchema>;

export type CommitteeMember = typeof committeeMembers.$inferSelect;
export type InsertCommitteeMember = z.infer<typeof insertCommitteeMemberSchema>;

// Request/Response types
export type LoginRequest = { username: string; password: string };
export type AuthResponse = User;

export type EventResponse = Event & { registeredCount?: number };
