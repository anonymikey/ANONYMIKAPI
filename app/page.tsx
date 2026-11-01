import Link from "next/link"

const sourceLogo = "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-12MIwOyS13Ak3csSyWilaIvwbj7PkO.png"

export default function LandingPage() {
  return (
    <main className="landing-shell">
      <nav className="landing-nav" aria-label="Primary navigation">
        <Link href="/" className="landing-brand">
          <img src={sourceLogo} alt="ANONYMIKAPI logo" />
          <span>ANONYMIKAPI</span>
        </Link>
        <div className="landing-nav-links">
          <Link href="#platform">Platform</Link>
          <Link href="#security">Security</Link>
          <Link href="/sign-in">Sign in</Link>
          <Link href="/sign-up" className="landing-nav-cta">Create account</Link>
        </div>
      </nav>

      <section className="landing-hero" aria-labelledby="hero-title">
        <div className="landing-hero-copy">
          <p className="eyebrow"><span className="status-dot" /> API CONTROL, REIMAGINED</p>
          <h1 id="hero-title">Build the invisible layer behind every <span>great product.</span></h1>
          <p className="landing-lede">ANONYMIKAPI gives teams one clear command center for keys, traffic, reliability, and the systems that keep their APIs moving.</p>
          <div className="landing-actions">
            <Link href="/sign-up" className="button-primary">Start building <span aria-hidden="true">↗</span></Link>
            <Link href="#platform" className="button-quiet">Explore the platform</Link>
          </div>
          <div className="landing-proof"><span>01</span><span>Private by design</span><span>Built for teams that ship</span></div>
        </div>
        <div className="landing-orbit" aria-hidden="true">
          <div className="orbit-ring orbit-ring-one" />
          <div className="orbit-ring orbit-ring-two" />
          <div className="orbit-core"><img src={sourceLogo} alt="" /></div>
          <span className="orbit-label label-top">LIVE TELEMETRY</span>
          <span className="orbit-label label-right">EDGE // 99.99%</span>
          <span className="orbit-label label-bottom">SECURE CONTROL PLANE</span>
        </div>
      </section>

      <section id="platform" className="landing-grid-section">
        <div className="section-intro"><p className="eyebrow">THE CONTROL PLANE</p><h2>Every signal. One source of truth.</h2></div>
        <div className="feature-grid">
          <article className="feature-card feature-card-wide"><span className="feature-index">01 / VISIBILITY</span><h3>See what your APIs are really doing.</h3><p>Trace demand, latency, and errors from one focused workspace. Move from anomaly to answer without losing the thread.</p><div className="mini-chart"><i /><i /><i /><i /><i /><i /><i /><i /><i /></div></article>
          <article className="feature-card"><span className="feature-index">02 / ACCESS</span><h3>Keys with a point of view.</h3><p>Issue, rotate, and revoke credentials with clarity built in.</p></article>
          <article className="feature-card"><span className="feature-index">03 / CONFIDENCE</span><h3>Ship with a quieter mind.</h3><p>Guardrails for the moments your customers never see.</p></article>
        </div>
      </section>

      <section id="security" className="landing-security"><div><p className="eyebrow">SECURITY IS THE DEFAULT</p><h2>Powerful enough for production.<br /><span>Simple enough for today.</span></h2></div><Link href="/sign-up" className="button-primary">Enter the control center <span aria-hidden="true">→</span></Link></section>
      <footer className="landing-footer"><span>© 2026 ANONYMIKAPI</span><span>THE PRIVATE API CONTROL CENTER</span></footer>
    </main>
  )
}
