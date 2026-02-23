import { scrypt, randomBytes } from "crypto";
import { promisify } from "util";
import { storage } from "./storage";

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

export async function seedDatabase() {
  const existingUsers = await storage.getStats();
  if (existingUsers.totalMembers === 0) {
    const hashedPassword = await hashPassword("admin123");
    await storage.createUser({
      name: "Admin User",
      email: "admin@csi.edu",
      password: hashedPassword,
      role: "admin",
      membershipStatus: "approved",
      rollNumber: "ADMIN001",
    });

    const studentPassword = await hashPassword("student123");
    await storage.createUser({
      name: "John Student",
      email: "john@csi.edu",
      password: studentPassword,
      role: "student",
      membershipStatus: "approved",
      rollNumber: "S12345",
    });

    // Seed events
    await storage.createEvent({
      title: "Tech Symposium 2024",
      description: "Annual technical symposium featuring keynote speakers and workshops.",
      date: new Date("2024-11-15T10:00:00"),
      venue: "Main Auditorium",
      capacity: 200,
      status: "upcoming"
    });

    await storage.createEvent({
      title: "Web Development Workshop",
      description: "Hands-on session on React and Node.js.",
      date: new Date("2024-10-20T14:00:00"),
      venue: "Lab 3",
      capacity: 50,
      status: "completed"
    });

    // Seed gallery
    await storage.addToGallery({
      imageUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80",
      caption: "Symposium 2023 Audience",
    });

    console.log("Database seeded successfully");
  }
}
