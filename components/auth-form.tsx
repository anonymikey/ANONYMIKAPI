"use client"

import { FormEvent, useState } from "react"
import { useRouter } from "next/navigation"
import { authClient } from "@/lib/auth-client"

export function AuthForm({ mode }: { mode: "sign-in" | "sign-up" }) {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [error, setError] = useState("")
  const [pending, setPending] = useState(false)

  async function submit(event: FormEvent) {
    event.preventDefault()
    setPending(true); setError("")
    const result = mode === "sign-in"
      ? await authClient.signIn.email({ email, password })
      : await authClient.signUp.email({ email, password, name })
    if (result.error) setError("Unable to authenticate with those details.")
    else { router.push("/"); router.refresh() }
    setPending(false)
  }

  return <main className="auth-page"><form className="auth-card" onSubmit={submit}>
    <p className="eyebrow">ANONYMIKAPI ADMIN</p><h1>{mode === "sign-in" ? "Sign in" : "Create admin account"}</h1>
    {mode === "sign-up" && <input aria-label="Name" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />}
    <input type="email" aria-label="Email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
    <input type="password" aria-label="Password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} minLength={8} required />
    {error && <p className="auth-error">{error}</p>}
    <button type="submit" disabled={pending}>{pending ? "Working..." : mode === "sign-in" ? "Continue" : "Create account"}</button>
  </form></main>
}
