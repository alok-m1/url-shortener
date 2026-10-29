import { migrate } from "drizzle-orm/node-postgres/migrator";
import { db } from "./db";

await migrate(db, { migrationsFolder: "./drizzle" });
await db.$client.end();

console.log("Migrations applied");
