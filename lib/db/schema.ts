import { pgTable, text, timestamp, integer } from "drizzle-orm/pg-core"

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: integer("emailVerified").notNull().default(0),
  image: text("image"),
  createdAt: timestamp("createdAt").notNull(),
  updatedAt: timestamp("updatedAt").notNull(),
})

export const apiKeys = pgTable("api_keys", {
  id: text("id").primaryKey(),
  userId: text("userId").notNull(),
  name: text("name").notNull(),
  keyPrefix: text("keyPrefix").notNull(),
  lastUsedAt: timestamp("lastUsedAt"),
  createdAt: timestamp("createdAt").notNull(),
})

export const usageEvents = pgTable("usage_events", {
  id: text("id").primaryKey(),
  userId: text("userId").notNull(),
  model: text("model").notNull(),
  provider: text("provider").notNull(),
  tokens: integer("tokens").notNull(),
  costCents: integer("costCents").notNull(),
  createdAt: timestamp("createdAt").notNull(),
})
