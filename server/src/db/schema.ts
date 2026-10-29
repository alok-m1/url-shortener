import {
  integer,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: uuid().primaryKey().defaultRandom(),
  name: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  password: varchar({ length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const urlsTable = pgTable("urls", {
  id: uuid().primaryKey().defaultRandom(),
  shortCode: varchar("short_code", { length: 10 }).notNull().unique(),
  originalUrl: varchar("original_url", { length: 2048 }).notNull(),
  userId: uuid("user_id").references(() => usersTable.id, {
    onDelete: "cascade",
  }),
  clicks: integer().notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
