import { db } from "./db";
import { users } from "../shared/schema";
import { hashPassword } from "./auth";
import { eq } from "drizzle-orm";

async function seedAdmin() {
    console.log("Checking for existing admin user...");
    const existingAdmins = await db.select().from(users).where(eq(users.role, "admin"));
    const hashedPassword = await hashPassword("AdminCSI@123");

    if (existingAdmins.length > 0) {
        console.log("Admin user already exists. Force updating the password to use hashing...");
        await db.update(users)
            .set({ password: hashedPassword })
            .where(eq(users.id, existingAdmins[0].id));

        console.log("Admin password updated successfully!");
        console.log("Email: " + existingAdmins[0].email);
        console.log("Password: AdminCSI@123");
        process.exit(0);
    }

    console.log("No admin found. Creating default admin...");

    await db.insert(users).values({
        name: "System Admin",
        email: "admin@kitsakshar.ac.in",
        password: hashedPassword,
        role: "admin",
        membershipStatus: "approved",
    });

    console.log("Admin user created successfully!");
    console.log("Email: admin@kitsakshar.ac.in");
    console.log("Password: AdminCSI@123");
    process.exit(0);
}

seedAdmin().catch((err) => {
    console.error("Failed to seed admin:", err);
    process.exit(1);
});
