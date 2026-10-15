import { pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: varchar("id", { length: 255 }).primaryKey(),
  githubId: varchar("github_id", { length: 255 }).unique().notNull(),
  username: varchar("username", { length: 255 }).unique().notNull(),
  name: text("name"),
  bio: text("bio"),
  avatarUrl: text("avatar_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});