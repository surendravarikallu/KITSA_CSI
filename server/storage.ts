import { db, pool } from "./db";
import { users, events, registrations, gallery, contacts, committeeMembers } from "../shared/schema";
import { eq, desc, sql } from "drizzle-orm";
import session from "express-session";
import createMemoryStore from "memorystore";
import connectPgSimple from "connect-pg-simple";
import { Pool } from "pg";

const MemoryStore = createMemoryStore(session);
const PgSessionStore = connectPgSimple(session);

import type {
  User, InsertUser,
  Event, InsertEvent,
  Registration, InsertRegistration,
  GalleryItem, InsertGalleryItem,
  ContactMessage, InsertContactMessage,
  CommitteeMember, InsertCommitteeMember
} from "../shared/schema";


export interface IStorage {
  sessionStore: session.Store;

  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  createUsers(users: InsertUser[]): Promise<User[]>;
  updateUser(id: number, user: Partial<User>): Promise<User>;
  setUserIdCard(id: number, url: string): Promise<User>;
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

  // Committee Members
  getCommitteeMembers(): Promise<CommitteeMember[]>;
  createCommitteeMember(member: InsertCommitteeMember): Promise<CommitteeMember>;
  updateCommitteeMember(id: number, member: Partial<CommitteeMember>): Promise<CommitteeMember>;
  deleteCommitteeMember(id: number): Promise<void>;

  // Admin Stats
  getStats(): Promise<{ totalMembers: number, totalEvents: number, pendingApprovals: number }>;
}

export class DatabaseStorage implements IStorage {
  sessionStore: session.Store;

  constructor() {
    if (process.env.DATABASE_URL) {
      // Use PostgreSQL for session storage so logins persist in serverless environments (like Vercel)
      this.sessionStore = new PgSessionStore({
        pool: new Pool({
          connectionString: process.env.DATABASE_URL,
          ssl: { rejectUnauthorized: false }
        }),
        tableName: 'session',
        createTableIfMissing: true,
      });
    } else {
      // Fallback for local development if not using database sessions
      this.sessionStore = new MemoryStore({
        checkPeriod: 86400000 // prune expired entries every 24h
      });
    }
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

  async createUsers(insertUsers: InsertUser[]): Promise<User[]> {
    if (insertUsers.length === 0) return [];
    const insertedUsers = await db.insert(users).values(insertUsers).returning();
    return insertedUsers;
  }

  async updateUser(id: number, updates: Partial<User>): Promise<User> {
    const [user] = await db.update(users).set(updates).where(eq(users.id, id)).returning();
    return user;
  }

  async setUserIdCard(id: number, url: string): Promise<User> {
    const [user] = await db.update(users).set({ idCardUrl: url }).where(eq(users.id, id)).returning();
    return user;
  }

  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users).orderBy(desc(users.createdAt)).limit(100);
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
    const [[usersCountRes], [eventsCountRes], [pendingCountRes]] = await Promise.all([
      db.select({ count: sql<number>`cast(count(${users.id}) as integer)` }).from(users),
      db.select({ count: sql<number>`cast(count(${events.id}) as integer)` }).from(events),
      db.select({ count: sql<number>`cast(count(${users.id}) as integer)` })
        .from(users)
        .where(eq(users.membershipStatus, "pending"))
    ]);

    return {
      totalMembers: usersCountRes?.count ?? 0,
      totalEvents: eventsCountRes?.count ?? 0,
      pendingApprovals: pendingCountRes?.count ?? 0
    };
  }

  // Committee Members
  async getCommitteeMembers(): Promise<CommitteeMember[]> {
    return await db.select().from(committeeMembers).orderBy(committeeMembers.orderOffset);
  }

  async createCommitteeMember(member: InsertCommitteeMember): Promise<CommitteeMember> {
    const [newMember] = await db.insert(committeeMembers).values(member).returning();
    return newMember;
  }

  async updateCommitteeMember(id: number, updates: Partial<CommitteeMember>): Promise<CommitteeMember> {
    const [updated] = await db.update(committeeMembers).set(updates).where(eq(committeeMembers.id, id)).returning();
    return updated;
  }

  async deleteCommitteeMember(id: number): Promise<void> {
    await db.delete(committeeMembers).where(eq(committeeMembers.id, id));
  }
}

export const storage = new DatabaseStorage();
