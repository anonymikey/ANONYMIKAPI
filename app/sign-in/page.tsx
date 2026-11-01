import Link from "next/link"
import { AuthForm } from "@/components/auth-form"

export default function SignInPage() {
  return (
    <main className="auth-shell">
      <div className="auth-visual"><Link href="/" className="landing-brand"><img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-12MIwOyS13Ak3csSyWilaIvwbj7PkO.png" alt="ANONYMIKAPI logo" /><span>ANONYMIKAPI</span></Link><div className="auth-visual-copy"><p className="eyebrow"><span className="status-dot" /> SECURE CONTROL PLANE</p><h1>Your APIs,<br /><span>in formation.</span></h1><p>Private infrastructure intelligence for teams building what comes next.</p></div><span className="auth-coordinate">SYS.CORE // ONLINE<br />AUTH 01 / 01</span></div>
      <section className="auth-panel" aria-labelledby="sign-in-title"><div className="auth-panel-inner"><div className="auth-kicker">WELCOME BACK <span>↗</span></div><h2 id="sign-in-title">Sign in to<br />your control center.</h2><p className="auth-subtitle">Continue where you left off.</p><AuthForm mode="sign-in" /><p className="auth-switch">New to ANONYMIKAPI? <Link href="/sign-up">Create your account</Link></p><Link href="/" className="auth-back">← Back to platform</Link></div></section>
    </main>
  )
}
