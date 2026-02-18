import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { seedDatabase } from "./seed";

export async function registerRoutes(httpServer: Server, app: Express): Promise<Server> {
  setupAuth(app);

  // Seed DB
  seedDatabase().catch(console.error);

  // Events
  app.get(api.events.list.path, async (req, res) => {
    const events = await storage.getEvents();
    res.json(events);
  });

  app.get(api.events.get.path, async (req, res) => {
    const event = await storage.getEvent(Number(req.params.id));
    if (!event) return res.status(404).json({ message: "Event not found" });
    res.json(event);
  });

  app.post(api.events.create.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).send("Unauthorized");
    const event = await storage.createEvent({
        ...req.body,
        date: new Date(req.body.date)
    });
    res.status(201).json(event);
  });

  app.delete(api.events.delete.path, async (req, res) => {
      if (!req.isAuthenticated()) return res.status(401).send("Unauthorized");
      await storage.deleteEvent(Number(req.params.id));
      res.sendStatus(204);
  });
  
  app.post(api.events.register.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).send("Unauthorized");
    const registration = await storage.createRegistration({
        userId: req.user!.id,
        eventId: Number(req.params.id),
        status: "registered",
        attended: false
    });
    res.status(201).json(registration);
  });

  // Gallery
  app.get(api.gallery.list.path, async (req, res) => {
    const items = await storage.getGallery();
    res.json(items);
  });

  app.post(api.gallery.upload.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).send("Unauthorized");
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

  app.get(api.contact.list.path, async (req, res) => {
      if (!req.isAuthenticated() || req.user!.role !== 'admin') return res.status(401).send("Unauthorized");
      const contacts = await storage.getContacts();
      res.json(contacts);
  });

  // Admin
  app.get(api.admin.stats.path, async (req, res) => {
      if (!req.isAuthenticated()) return res.status(401).send("Unauthorized");
      const stats = await storage.getStats();
      res.json(stats);
  });

  app.get(api.admin.users.path, async (req, res) => {
      if (!req.isAuthenticated()) return res.status(401).send("Unauthorized");
      const users = await storage.getAllUsers();
      res.json(users);
  });
  
  app.patch(api.admin.approveMember.path, async (req, res) => {
      if (!req.isAuthenticated()) return res.status(401).send("Unauthorized");
      const user = await storage.updateUser(Number(req.params.id), { membershipStatus: "active" });
      res.json(user);
  });

  return httpServer;
}
