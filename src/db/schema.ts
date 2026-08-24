import { pgTable, text, jsonb, timestamp, boolean, integer } from "drizzle-orm/pg-core";

// Each project stores the full editable scene graph (objects, lights, camera
// & render settings) as JSON so the client can rebuild the exact Three.js
// scene instantly without any server-side processing.
export const projects = pgTable("projects", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  sceneData: jsonb("scene_data").notNull(),
  thumbnail: text("thumbnail"),
  description: text("description"),
  isPublic: boolean("is_public").notNull().default(false),
  objectCount: integer("object_count").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const leads = pgTable("leads", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  company: text("company"),
  topic: text("topic").notNull().default("general"),
  message: text("message").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const subscribers = pgTable("subscribers", {
  email: text("email").primaryKey(),
  source: text("source").notNull().default("website"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type ProjectRow = typeof projects.$inferSelect;
export type NewProjectRow = typeof projects.$inferInsert;
export type LeadRow = typeof leads.$inferSelect;
export type SubscriberRow = typeof subscribers.$inferSelect;
