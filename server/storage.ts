import { db, pool } from "./db";
import { users, events, registrations, gallery, contacts } from "@shared/schema";
import { eq, desc } from "drizzle-orm";
import session from "express-session";
import connectPg from "connect-pg-simple";
import type { 
  User, InsertUser, 
  Event, InsertEvent, 
  Registration, InsertRegistration,
  GalleryItem, InsertGalleryItem,
  ContactMessage, InsertContactMessage
} from "@shared/schema";

const PostgresSessionStore = connectPg(session);

export interface IStorage {
  sessionStore: session.Store;

  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<User>): Promise<User>;
  getAllUsers(): Promise<User[]>;
  getPendingUsers(): Promise<User[]>;

  // Events
  getEvents(): Promise<Event[]>;
  getEvent(id: number): Promise<Event | undefined>;
  createEvent(event: InsertEvent): Promise<Event>;
  updateEvent(id: number, event: Partial<Event>): Promise<Event>;
  deleteEvent(id: number): Promise<void>;

  // Registrations
  createRegistration(registration: InsertRegistration): Promise<Registration>;
  getRegistrationsForEvent(eventId: number): Promise<Registration[]>;
  getUserRegistrations(userId: number): Promise<Registration[]>;

  // Gallery
  getGallery(): Promise<GalleryItem[]>;
  addToGallery(item: InsertGalleryItem): Promise<GalleryItem>;

  // Contacts
  createContact(contact: InsertContactMessage): Promise<ContactMessage>;
  getContacts(): Promise<ContactMessage[]>;

  // Admin Stats
  getStats(): Promise<{ totalMembers: number, totalEvents: number, pendingApprovals: number }>;
}

export class DatabaseStorage implements IStorage {
  sessionStore: session.Store;

  constructor() {
    this.sessionStore = new PostgresSessionStore({
      pool,
      createTableIfMissing: true,
    });
  }

  // Users
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, username)); // using email as username
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async updateUser(id: number, updates: Partial<User>): Promise<User> {
    const [user] = await db.update(users).set(updates).where(eq(users.id, id)).returning();
    return user;
  }

  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users);
  }

  async getPendingUsers(): Promise<User[]> {
    return await db.select().from(users).where(eq(users.membershipStatus, "pending"));
  }

  // Events
  async getEvents(): Promise<Event[]> {
    return await db.select().from(events).orderBy(desc(events.date));
  }

  async getEvent(id: number): Promise<Event | undefined> {
    const [event] = await db.select().from(events).where(eq(events.id, id));
    return event;
  }

  async createEvent(event: InsertEvent): Promise<Event> {
    const [newEvent] = await db.insert(events).values(event).returning();
    return newEvent;
  }

  async updateEvent(id: number, updates: Partial<Event>): Promise<Event> {
    const [event] = await db.update(events).set(updates).where(eq(events.id, id)).returning();
    return event;
  }

  async deleteEvent(id: number): Promise<void> {
    await db.delete(events).where(eq(events.id, id));
  }

  // Registrations
  async createRegistration(registration: InsertRegistration): Promise<Registration> {
    const [reg] = await db.insert(registrations).values(registration).returning();
    return reg;
  }

  async getRegistrationsForEvent(eventId: number): Promise<Registration[]> {
    return await db.select().from(registrations).where(eq(registrations.eventId, eventId));
  }

  async getUserRegistrations(userId: number): Promise<Registration[]> {
    return await db.select().from(registrations).where(eq(registrations.userId, userId));
  }

  // Gallery
  async getGallery(): Promise<GalleryItem[]> {
    return await db.select().from(gallery).orderBy(desc(gallery.createdAt));
  }

  async addToGallery(item: InsertGalleryItem): Promise<GalleryItem> {
    const [newItem] = await db.insert(gallery).values(item).returning();
    return newItem;
  }

  // Contacts
  async createContact(contact: InsertContactMessage): Promise<ContactMessage> {
    const [newContact] = await db.insert(contacts).values(contact).returning();
    return newContact;
  }

  async getContacts(): Promise<ContactMessage[]> {
    return await db.select().from(contacts).orderBy(desc(contacts.createdAt));
  }

  // Admin Stats
  async getStats(): Promise<{ totalMembers: number, totalEvents: number, pendingApprovals: number }> {
    const usersCount = await db.select().from(users);
    const eventsCount = await db.select().from(events);
    const pendingCount = await db.select().from(users).where(eq(users.membershipStatus, "pending"));

    return {
      totalMembers: usersCount.length,
      totalEvents: eventsCount.length,
      pendingApprovals: pendingCount.length
    };
  }
}

export const storage = new DatabaseStorage();
