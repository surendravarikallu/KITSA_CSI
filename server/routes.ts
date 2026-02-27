import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth, authenticateUser, authorizeRoles, hashPassword } from "./auth";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import multer from "multer";
import { insertCommitteeMemberSchema } from "@shared/schema";

// Configure multer for ID Card uploads (Memory Storage for Database)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/') || file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only images and PDFs are allowed'));
    }
  }
});
import { seedDatabase } from "./seed";

export async function registerRoutes(httpServer: Server, app: Express): Promise<Server> {
  setupAuth(app);

  // Seed DB only in development
  if (process.env.NODE_ENV !== "production") {
    seedDatabase().catch(console.error);
  }

  // User Events
  app.get(api.auth.myEvents.path, authenticateUser, async (req, res) => {
    const registrations = await storage.getUserRegistrations(req.user!.id);
    const eventsList = await Promise.all(
      registrations.map(async (reg) => {
        const eventDetails = await storage.getEvent(reg.eventId);
        return eventDetails ? { ...eventDetails, registrationStatus: reg.status } : null;
      })
    );
    res.json(eventsList.filter(Boolean));
  });

  // Bulk Import Users
  app.post("/api/users/bulk-import", authenticateUser, authorizeRoles("admin", "organizer"), async (req, res) => {
    try {
      const usersData = Array.isArray(req.body) ? req.body : [];
      if (usersData.length === 0) return res.status(400).json({ message: "No valid users provided" });

      const defaultPasswordHash = await hashPassword("student123");

      const insertPayload = usersData.map((u: any) => ({
        name: u.name,
        email: u.email,
        rollNumber: u.rollNumber || null,
        password: defaultPasswordHash,
        role: (u.role && ["admin", "organizer", "student"].includes(u.role)) ? u.role : "student",
        membershipStatus: "approved" as const
      }));

      const inserted = await storage.createUsers(insertPayload);
      res.status(201).json({ message: `Successfully imported ${inserted.length} users.`, count: inserted.length });
    } catch (error: any) {
      // Drizzle unique constraint errors, etc.
      console.error("Bulk import failed:", error);
      res.status(500).json({ message: error.message || "Failed to import users. Ensure emails are unique." });
    }
  });

  // Upload ID Card
  app.post("/api/upload-id-card", authenticateUser, authorizeRoles("admin", "organizer"), upload.single('idCard'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const { identifier } = req.body; // Can be name or rollNumber
      if (!identifier) {
        return res.status(400).json({ message: "Student identifier (Roll Number or Name) is required" });
      }

      // Find user by rollNumber or name (case-insensitive)
      const allUsers = await storage.getAllUsers();
      const targetUser = allUsers.find(
        (u) =>
          u.rollNumber?.toLowerCase() === identifier.toLowerCase() ||
          u.name.toLowerCase() === identifier.toLowerCase()
      );

      if (!targetUser) {
        return res.status(404).json({ message: "Student not found with the provided identifier" });
      }

      // Convert buffer to base64 Data URI
      const base64Data = req.file.buffer.toString('base64');
      const dataUri = `data:${req.file.mimetype};base64,${base64Data}`;

      await storage.setUserIdCard(targetUser.id, dataUri);

      res.status(200).json({
        message: `ID Card successfully uploaded for ${targetUser.name}`,
        url: 'uploaded_to_db'
      });
    } catch (error: any) {
      console.error("ID Card upload failed:", error);
      res.status(500).json({ message: error.message || "Failed to upload ID card" });
    }
  });

  app.get(api.events.list.path, async (req, res) => {
    const events = await storage.getEvents();
    res.json(events);
  });

  app.get(api.events.get.path, async (req, res) => {
    const event = await storage.getEvent(Number(req.params.id));
    if (!event) return res.status(404).json({ message: "Event not found" });
    res.json(event);
  });

  app.post(api.events.create.path, authenticateUser, authorizeRoles("admin", "organizer"), async (req, res) => {
    const event = await storage.createEvent({
      ...req.body,
      date: new Date(req.body.date)
    });
    res.status(201).json(event);
  });

  app.delete(api.events.delete.path, authenticateUser, authorizeRoles("admin", "organizer"), async (req, res) => {
    await storage.deleteEvent(Number(req.params.id));
    res.sendStatus(204);
  });

  app.post(api.events.register.path, authenticateUser, authorizeRoles("student", "organizer", "admin"), async (req, res) => {
    const registration = await storage.createRegistration({
      userId: req.user!.id,
      eventId: Number(req.params.id),
    });
    res.status(201).json(registration);
  });

  // Gallery
  app.get(api.gallery.list.path, async (req, res) => {
    const items = await storage.getGallery();
    res.json(items);
  });

  app.post(api.gallery.upload.path, authenticateUser, authorizeRoles("admin", "organizer"), async (req, res) => {
    const item = await storage.addToGallery({
      ...req.body,
      uploadedBy: req.user!.id
    });
    res.status(201).json(item);
  });

  // Contact
  app.post(api.contact.submit.path, async (req, res) => {
    const contact = await storage.createContact(req.body);
    res.status(201).json(contact);
  });

  app.get("/api/contacts", authenticateUser, authorizeRoles("admin", "organizer"), async (req, res) => {
    const contacts = await storage.getContacts();
    res.json(contacts);
  });

  // Committee Members Routes
  app.get("/api/committee", async (req, res) => {
    try {
      const members = await storage.getCommitteeMembers();
      res.json(members);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch committee members" });
    }
  });

  app.post("/api/admin/committee", authenticateUser, authorizeRoles("admin"), async (req, res) => {
    try {
      const data = insertCommitteeMemberSchema.parse(req.body);
      const member = await storage.createCommitteeMember(data);
      res.status(201).json(member);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid committee member data", errors: error.errors });
        return;
      }
      res.status(500).json({ message: "Failed to create committee member" });
    }
  });

  app.patch("/api/admin/committee/:id", authenticateUser, authorizeRoles("admin"), async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) return res.status(400).json({ message: "Invalid ID" });

      const updates = insertCommitteeMemberSchema.partial().parse(req.body);
      const member = await storage.updateCommitteeMember(id, updates);
      res.json(member);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid committee member data", errors: error.errors });
        return;
      }
      res.status(500).json({ message: "Failed to update committee member" });
    }
  });

  app.delete("/api/admin/committee/:id", authenticateUser, authorizeRoles("admin"), async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) return res.status(400).json({ message: "Invalid ID" });

      await storage.deleteCommitteeMember(id);
      res.sendStatus(204);
    } catch (error) {
      res.status(500).json({ message: "Failed to delete committee member" });
    }
  });

  // Admin
  app.get(api.admin.stats.path, authenticateUser, authorizeRoles("admin", "organizer"), async (req, res) => {
    const stats = await storage.getStats();
    res.json(stats);
  });

  app.get(api.admin.users.path, authenticateUser, authorizeRoles("admin", "organizer"), async (req, res) => {
    const users = await storage.getAllUsers();
    res.json(users);
  });

  app.patch(api.admin.approveMember.path, authenticateUser, authorizeRoles("admin"), async (req, res) => {
    const user = await storage.updateUser(Number(req.params.id), { membershipStatus: "approved" });
    res.json(user);
  });

  return httpServer;
}
