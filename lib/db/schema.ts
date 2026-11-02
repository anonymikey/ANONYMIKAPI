import { pgTable, text, timestamp, integer, serial, bigint } from "drizzle-orm/pg-core"

export const apiKeys = pgTable("api_keys", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  name: text("name").notNull(),
  keyPrefix: text("key_prefix").notNull(),
  keyHash: text("key_hash").notNull(),
  provider: text("provider").notNull().default("custom"),
  baseUrl: text("base_url").notNull().default(""),
  plan: text("plan").notNull().default("free"),
  encryptedSecret: text("encrypted_secret").notNull().default(""),
  encryptionIv: text("encryption_iv").notNull().default(""),
  encryptionTag: text("encryption_tag").notNull().default(""),
  status: text("status").notNull().default("active"),
  lastUsedAt: timestamp("last_used_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
})

export const usageEvents = pgTable("usage_events", {
  id: bigint("id", { mode: "number" }).primaryKey().generatedAlwaysAsIdentity(),
  userId: text("user_id").notNull(),
  model: text("model").notNull(),
  provider: text("provider").notNull(),
  endpoint: text("endpoint").notNull(),
  tokens: integer("tokens").notNull(),
  latencyMs: integer("latency_ms").notNull(),
  status: text("status").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
})
