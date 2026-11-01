import { and, desc, eq, gte, sql } from "drizzle-orm"
import { db } from "@/lib/db"
import { apiKeys, usageEvents } from "@/lib/db/schema"

type DashboardApi = {
  name: string
  provider: string
  category: string
  auth: string
  status: "Healthy" | "Degraded"
  latency: string
  last: string
  color: string
}

export type DashboardMetrics = {
  discovered: number
  selected: number
  subscriptions: number
  integrations: number
  tests: number
  failures: number
  requests: number
}

export type DashboardData = {
  metrics: DashboardMetrics
  apis: DashboardApi[]
  hasData: boolean
}

const emptyData: DashboardData = {
  metrics: { discovered: 0, selected: 0, subscriptions: 0, integrations: 0, tests: 0, failures: 0, requests: 0 },
  apis: [],
  hasData: false,
}

export async function getDashboardData(userId: string): Promise<DashboardData> {
  if (!process.env.DATABASE_URL) return emptyData

  try {
    const [keys, usage] = await Promise.all([
      db.select({ id: apiKeys.id, name: apiKeys.name, lastUsedAt: apiKeys.lastUsedAt }).from(apiKeys).where(eq(apiKeys.userId, userId)).orderBy(desc(apiKeys.lastUsedAt)),
      db.select({ provider: usageEvents.provider, model: usageEvents.model, tokens: usageEvents.tokens, createdAt: usageEvents.createdAt }).from(usageEvents).where(eq(usageEvents.userId, userId)).orderBy(desc(usageEvents.createdAt)).limit(100),
    ])

    const recentWindow = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    const [summary] = await db.select({ requests: sql<number>`count(*)`, tokens: sql<number>`coalesce(sum(${usageEvents.tokens}), 0)` }).from(usageEvents).where(and(eq(usageEvents.userId, userId), gte(usageEvents.createdAt, recentWindow)))
    const apiRows: DashboardApi[] = keys.map((key, index) => ({
      name: key.name,
      provider: "Managed credential",
      category: "API access",
      auth: "API key",
      status: "Healthy",
      latency: "—",
      last: key.lastUsedAt ? key.lastUsedAt.toLocaleDateString() : "Not used yet",
      color: ["blue", "purple", "green", "orange"][index % 4],
    }))

    return {
      metrics: { discovered: apiRows.length, selected: apiRows.length, subscriptions: 0, integrations: 0, tests: usage.length, failures: 0, requests: Number(summary?.requests ?? 0) },
      apis: apiRows,
      hasData: apiRows.length > 0 || usage.length > 0,
    }
  } catch (error) {
    console.error("[dashboard] Failed to load dashboard data", error)
    return emptyData
  }
}
