"use server"

import { randomUUID } from "node:crypto"
import { headers } from "next/headers"
import { revalidatePath } from "next/cache"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { apiKeys } from "@/lib/db/schema"

export async function createApi(input: { name: string; keyPrefix: string }) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) return { error: "Your session has expired. Please sign in again." }

  const name = input.name.trim()
  const keyPrefix = input.keyPrefix.trim().replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 32)
  if (name.length < 2 || name.length > 80) return { error: "Enter an API name between 2 and 80 characters." }
  if (keyPrefix.length < 4) return { error: "Enter a key prefix with at least 4 characters." }

  try {
    await db.insert(apiKeys).values({
      id: randomUUID(),
      userId: session.user.id,
      name,
      keyPrefix,
      createdAt: new Date(),
    })
    revalidatePath("/dashboard")
    return { ok: true }
  } catch (error) {
    console.error("[dashboard] Failed to create API", error)
    return { error: "We could not save this API. Check your database connection and try again." }
  }
}
