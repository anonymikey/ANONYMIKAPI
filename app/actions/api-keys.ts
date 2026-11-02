'use server'

import { createHash, randomBytes } from 'node:crypto'
import { headers } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { apiKeys } from '@/lib/db/schema'

export async function createApiKey(name: string) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) throw new Error('Unauthorized')
  const cleanName = name.trim().slice(0, 80)
  if (!cleanName) throw new Error('API name is required')
  const secret = `ak_${randomBytes(24).toString('hex')}`
  await db.insert(apiKeys).values({
    userId: session.user.id,
    name: cleanName,
    keyPrefix: secret.slice(0, 11),
    keyHash: createHash('sha256').update(secret).digest('hex'),
    status: 'active',
  })
  revalidatePath('/dashboard')
  return { keyPrefix: secret.slice(0, 11) }
}
