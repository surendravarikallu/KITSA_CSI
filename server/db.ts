import { drizzle } from "drizzle-orm/neon-serverless";
import { Pool, neonConfig } from "@neondatabase/serverless";
import * as schema from "../shared/schema";

try {
  // Required in standard Node but may fail or be unnecessary in Vercel Edge/Serverless depending on node ver setup
  const ws = require("ws");
  neonConfig.webSocketConstructor = ws;
} catch (e) {
  console.log("Using default WebSocket constructor");
}

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20, // Set pool max size
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000, // Increased timeout to 10s for Serverless Postgres instances waking up
});
export const db = drizzle(pool, { schema });
