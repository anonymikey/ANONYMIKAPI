"use client"

import { FormEvent, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowRight, Check, Eye, EyeOff, LockKeyhole, Mail, UserRound } from "lucide-react"
import { authClient } from "@/lib/auth-client"

export function AuthForm({ mode }: { mode: "sign-in" | "sign-up" }) {
  const router = useRouter()
  const isSignUp = mode === "sign-up"
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [pending, setPending] = useState(false)

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (pending) return
    setPending(true)
    setError("")

    const result = isSignUp
      ? await authClient.signUp.email({ email, password, name })
      : await authClient.signIn.email({ email, password })

    if (result.error) {
      setError(result.error.message || "Unable to authenticate with those details.")
      setPending(false)
      return
    }

    router.push("/dashboard")
    router.refresh()
  }

  return (
    <main className="auth-shell">
      <div className="auth-visual">
        <Link href="/" className="landing-brand">
          <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-12MIwOyS13Ak3csSyWilaIvwbj7PkO.png" alt="ANONYMIKAPI logo" />
          <span>ANONYMIKAPI</span>
        </Link>
        <div className="auth-visual-copy">
          <p className="eyebrow"><span className="status-dot" /> SECURE CONTROL PLANE</p>
          <h1>Build with<br /><span>confidence.</span></h1>
          <p>One private workspace for discovering, testing, and operating the APIs your team depends on.</p>
          <ul className="auth-benefits">
            <li><Check /> Curated API intelligence</li>
            <li><Check /> Secure credentials vault</li>
            <li><Check /> Live workspace observability</li>
          </ul>
        </div>
        <span className="auth-coordinate">SYS.CORE // ONLINE<br />AUTH 01 / 01</span>
      </div>

      <section className="auth-panel" aria-labelledby="auth-title">
        <div className="auth-panel-inner">
          <div className="auth-panel-topline"><span>{isSignUp ? "NEW WORKSPACE" : "WELCOME BACK"}</span><span className="auth-signal"><span /> ENCRYPTED</span></div>
          <div className="auth-heading">
            <div className="auth-lock"><LockKeyhole /></div>
            <div><h2 id="auth-title">{isSignUp ? "Create your workspace." : "Welcome back."}</h2><p>{isSignUp ? "Start building your private API control plane." : "Sign in to continue to your control center."}</p></div>
          </div>

          <form className="auth-form" onSubmit={submit}>
            {isSignUp && <label className="auth-field"><span>Full name</span><div className="auth-input-wrap"><UserRound /><input autoComplete="name" aria-label="Full name" placeholder="Jordan Davis" value={name} onChange={(event) => setName(event.target.value)} required /></div></label>}
            <label className="auth-field"><span>Email address</span><div className="auth-input-wrap"><Mail /><input type="email" autoComplete="email" aria-label="Email address" placeholder="you@company.com" value={email} onChange={(event) => setEmail(event.target.value)} required /></div></label>
            <label className="auth-field"><span>Password</span><div className="auth-input-wrap"><LockKeyhole /><input type={showPassword ? "text" : "password"} autoComplete={isSignUp ? "new-password" : "current-password"} aria-label="Password" placeholder="Enter your password" value={password} onChange={(event) => setPassword(event.target.value)} minLength={8} required /><button type="button" className="password-toggle" onClick={() => setShowPassword((visible) => !visible)} aria-label={showPassword ? "Hide password" : "Show password"}>{showPassword ? <EyeOff /> : <Eye />}</button></div>{isSignUp && <small>Use at least 8 characters.</small>}</label>
            {error && <p className="auth-error" role="alert">{error}</p>}
            <button className="auth-submit" type="submit" disabled={pending}>{pending ? "Connecting..." : isSignUp ? "Create workspace" : "Sign in to control center"}<ArrowRight /></button>
          </form>

          <p className="auth-switch">{isSignUp ? "Already have an account?" : "New to ANONYMIKAPI?"} <Link href={isSignUp ? "/sign-in" : "/sign-up"}>{isSignUp ? "Sign in" : "Create your account"}</Link></p>
          <Link href="/" className="auth-back">← Back to platform</Link>
        </div>
      </section>
    </main>
  )
}
