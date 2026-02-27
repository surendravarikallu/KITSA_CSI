import { seedDatabase } from "../server/seed";

seedDatabase()
    .then(() => {
        console.log("Seeding completed successfully.");
        process.exit(0);
    })
    .catch((err) => {
        console.error("Seeding failed:", err);
        process.exit(1);
    });
