import { drizzle } from "drizzle-orm/neon-serverless";
import { Pool, neonConfig } from "@neondatabase/serverless";
import ws from "ws";
import * as schema from "../shared/schema";

neonConfig.webSocketConstructor = ws;

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
