'use server'

import { createCipheriv, createHash, randomBytes } from 'node:crypto'
import { headers } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { apiKeys } from '@/lib/db/schema'

function encryptSecret(secret: string) {
  const key = createHash('sha256').update(process.env.BETTER_AUTH_SECRET ?? '').digest()
  if (!process.env.BETTER_AUTH_SECRET) throw new Error('Credential encryption is not configured')
  const iv = randomBytes(12)
  const cipher = createCipheriv('aes-256-gcm', key, iv)
  const encrypted = Buffer.concat([cipher.update(secret, 'utf8'), cipher.final()])
  return { encryptedSecret: encrypted.toString('base64'), encryptionIv: iv.toString('base64'), encryptionTag: cipher.getAuthTag().toString('base64') }
}

export async function createApiKey(input: { name: string; provider: string; baseUrl: string; plan: string; secret: string }) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) throw new Error('Unauthorized')
  const name = input.name.trim().slice(0, 80)
  const provider = input.provider.trim().slice(0, 80)
  const baseUrl = input.baseUrl.trim().slice(0, 300)
  const plan = input.plan.trim().slice(0, 40)
  const secret = input.secret.trim()
  if (!name || !provider || !baseUrl || !plan || !secret) throw new Error('Complete all API fields')
  if (!/^https:\/\//i.test(baseUrl)) throw new Error('Base URL must use HTTPS')
  const encrypted = encryptSecret(secret)
  await db.insert(apiKeys).values({ userId: session.user.id, name, provider, baseUrl, plan, keyPrefix: secret.slice(0, 8), keyHash: createHash('sha256').update(secret).digest('hex'), ...encrypted, status: 'active' })
  revalidatePath('/dashboard')
  return { keyPrefix: secret.slice(0, 8) }
}
