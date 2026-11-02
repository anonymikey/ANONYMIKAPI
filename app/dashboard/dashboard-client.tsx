'use client'

import { useMemo, useState } from 'react'
import {
  Activity,
  AlertTriangle,
  ArrowUpRight,
  Bell,
  Boxes,
  Check,
  ChevronDown,
  CircleHelp,
  Cloud,
  Code2,
  Copy,
  Database,
  FileKey2,
  Gauge,
  Globe2,
  Grid2X2,
  HeartPulse,
  KeyRound,
  LayoutDashboard,
  LifeBuoy,
  ListFilter,
  LockKeyhole,
  Menu,
  MoreHorizontal,
  Network,
  PanelLeftClose,
  PanelLeftOpen,
  Plus,
  Rocket,
  Search,
  Settings,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Terminal,
  TestTube2,
  Users,
  X,
  Zap,
} from 'lucide-react'

type NavItem = { label: string; icon: typeof Activity }

const groups: { label: string; items: NavItem[] }[] = [
  { label: 'Workspace', items: [{ label: 'Overview', icon: LayoutDashboard }, { label: 'API Explorer', icon: Globe2 }, { label: 'My APIs', icon: Boxes }, { label: 'Providers', icon: Network }] },
  { label: 'Management', items: [{ label: 'Subscriptions', icon: Zap }, { label: 'Credentials Vault', icon: LockKeyhole }, { label: 'API Tester', icon: TestTube2 }, { label: 'Integrations', icon: Code2 }, { label: 'Projects', icon: Rocket }] },
  { label: 'Observability', items: [{ label: 'Monitoring', icon: Activity }, { label: 'Usage Analytics', icon: Gauge }, { label: 'Health Checks', icon: HeartPulse }, { label: 'Audit Logs', icon: ListFilter }] },
  { label: 'System', items: [{ label: 'Settings', icon: Settings }] },
]

import type { DashboardData } from '@/lib/dashboard-data'
import { createApiKey } from '@/app/actions/api-keys'
import { useRouter } from 'next/navigation'

type Metric = { label: string; value: string; change: string; icon: typeof Activity; tone: string }

function buildMetrics(data: DashboardData): Metric[] {
  return [
    { label: 'Managed APIs', value: data.metrics.discovered.toLocaleString(), change: data.hasData ? 'From your workspace' : 'No credentials yet', icon: Globe2, tone: 'blue' },
    { label: 'Selected APIs', value: data.metrics.selected.toLocaleString(), change: 'Scoped to your account', icon: Boxes, tone: 'violet' },
    { label: 'Active Subscriptions', value: data.metrics.subscriptions.toLocaleString(), change: 'No subscription data', icon: Zap, tone: 'amber' },
    { label: 'Active Integrations', value: data.metrics.integrations.toLocaleString(), change: 'No integration data', icon: Network, tone: 'cyan' },
    { label: 'API Tests', value: data.metrics.tests.toLocaleString(), change: 'Last 100 events', icon: TestTube2, tone: 'green' },
    { label: 'Failed Requests', value: data.metrics.failures.toLocaleString(), change: 'No failures recorded', icon: AlertTriangle, tone: 'red' },
  ]
}

function Logo() {
  return <div className="brand-mark"><img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-12MIwOyS13Ak3csSyWilaIvwbj7PkO.png" alt="ANONYMIKAPI logo" /></div>
}

function Badge({ children, tone = 'neutral' }: { children: React.ReactNode; tone?: string }) {
  return <span className={`badge badge-${tone}`}><span className="badge-dot" />{children}</span>
}

export default function Page({ userName, data }: { userName: string; data: DashboardData }) {
  const metrics = buildMetrics(data)
  const apis = data.apis
  const [active, setActive] = useState('Overview')
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [view, setView] = useState<'list' | 'grid'>('list')
  const [addApiOpen, setAddApiOpen] = useState(false)

  const filteredApis = useMemo(() => apis.filter((api) => `${api.name} ${api.provider} ${api.category}`.toLowerCase().includes(search.toLowerCase())), [apis, search])

  return (
    <div className="app-shell">
      <aside className={`sidebar ${collapsed ? 'sidebar-collapsed' : ''} ${mobileOpen ? 'sidebar-mobile-open' : ''}`}>
        <div className="sidebar-top">
          <div className="brand"><Logo /><div className="brand-copy"><strong>ANONYMIKAPI</strong><span>CONTROL CENTER</span></div></div>
          <button className="icon-button sidebar-close" onClick={() => setMobileOpen(false)} aria-label="Close navigation"><X /></button>
          <button className="icon-button collapse-button" onClick={() => setCollapsed(!collapsed)} aria-label="Toggle sidebar">{collapsed ? <PanelLeftOpen /> : <PanelLeftClose />}</button>
        </div>
        <div className="workspace-switcher"><div className="workspace-avatar">AC</div><div className="workspace-copy"><strong>Personal workspace</strong><span>Administrator</span></div><ChevronDown size={14} /></div>
        <nav className="nav-groups" aria-label="Main navigation">
          {groups.map((group) => <div className="nav-group" key={group.label}><div className="nav-label">{group.label}</div>{group.items.map(({ label, icon: Icon }) => <button key={label} onClick={() => { setActive(label); setMobileOpen(false) }} className={`nav-item ${active === label ? 'active' : ''}`}><Icon /><span>{label}</span>{label === 'API Explorer' && <em>New</em>}</button>)}</div>)}
        </nav>
        <div className="sidebar-footer"><div className="connection"><span className="live-dot" /><span>All systems operational</span></div><div className="sidebar-help"><CircleHelp size={16} /><span>Documentation</span><ArrowUpRight size={13} /></div></div>
      </aside>
      {mobileOpen && <button className="mobile-overlay" onClick={() => setMobileOpen(false)} aria-label="Close navigation overlay" />}
      <main className="main-content">
        <header className="topbar"><div className="topbar-left"><button className="icon-button mobile-menu" onClick={() => setMobileOpen(true)} aria-label="Open navigation"><Menu /></button><div className="breadcrumbs"><span>Workspace</span><span>/</span><strong>{active}</strong></div></div><div className="topbar-right"><div className="global-search"><Search size={16} /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search APIs, providers..." aria-label="Search APIs and providers" /><kbd>⌘ K</kbd></div><button className="icon-button" aria-label="Notifications"><Bell /><i className="notification-dot" /></button><div className="topbar-divider" /><div className="profile"><div className="profile-avatar">{userName.slice(0, 2).toUpperCase()}</div><div className="profile-copy"><strong>{userName}</strong><span>Administrator</span></div><ChevronDown size={14} /></div></div></header>
        <div className="page-container">
          <section className="page-heading"><div><div className="eyebrow"><Sparkles size={13} /> PRIVATE WORKSPACE</div><h1>{active === 'Overview' ? `Good morning, ${userName.split(' ')[0]}` : active}</h1><p>{active === 'Overview' ? 'Here is what is happening across your API ecosystem.' : `Manage and monitor your ${active.toLowerCase()} from one place.`}</p></div><div className="heading-actions"><button className="button button-secondary"><LifeBuoy size={16} /> Help center</button><button className="button button-primary" onClick={() => setAddApiOpen(true)}><Plus size={16} /> Add API</button></div></section>
          {active === 'Overview' ? <Overview metrics={metrics} apis={filteredApis} hasData={data.hasData} /> : <ModuleView title={active} apis={filteredApis} onAdd={() => setAddApiOpen(true)} />}
          {addApiOpen && <AddApiDialog onClose={() => setAddApiOpen(false)} />}
          <footer className="page-footer"><span>API CONTROL CENTER <b>v1.0.0</b></span><span><span className="live-dot" /> Catalogue synced 8 min ago</span></footer>
        </div>
      </main>
    </div>
  )
}

function Overview({ metrics, apis, hasData }: { metrics: Metric[]; apis: DashboardData['apis']; hasData: boolean }) {
  const [range, setRange] = useState('7 days')
  const [apiSearch, setApiSearch] = useState('')
  const filtered = apis.filter((a) => `${a.name} ${a.provider}`.toLowerCase().includes(apiSearch.toLowerCase()))
  return <>
    <div className="metrics-grid">{metrics.map(({ label, value, change, icon: Icon, tone }) => <article className="metric-card" key={label}><div className={`metric-icon ${tone}`}><Icon /></div><div className="metric-meta"><span>{label}</span><strong>{value}</strong><small className={tone === 'red' ? 'negative' : ''}>{change}</small></div><MoreHorizontal className="metric-more" size={17} /></article>)}</div>
    <div className="dashboard-grid"><section className="panel activity-panel"><div className="panel-header"><div><h2>API activity</h2><p>Requests across connected APIs</p></div><div className="segmented"><button className={range === '7 days' ? 'selected' : ''} onClick={() => setRange('7 days')}>7 days</button><button className={range === '30 days' ? 'selected' : ''} onClick={() => setRange('30 days')}>30 days</button></div></div><div className="chart-legend"><span><i className="legend-blue" /> Requests</span><span><i className="legend-muted" /> Failed</span><strong>{hasData ? 'Live' : '0'} <small>total requests</small></strong></div><div className="chart"><div className="chart-y"><span>4k</span><span>3k</span><span>2k</span><span>1k</span><span>0</span></div><div className="chart-area"><div className="grid-lines" /> <svg viewBox="0 0 700 190" preserveAspectRatio="none" role="img" aria-label="API request activity chart"><defs><linearGradient id="chartFill" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#2589ff" stopOpacity=".28" /><stop offset="1" stopColor="#2589ff" stopOpacity="0" /></linearGradient></defs><path d="M0 138 C30 145 54 117 78 128 S126 152 150 110 S198 88 223 113 S270 97 300 105 S340 130 370 91 S420 52 447 76 S495 111 520 68 S563 42 590 61 S635 53 700 18 L700 190 L0 190Z" fill="url(#chartFill)" /><path d="M0 138 C30 145 54 117 78 128 S126 152 150 110 S198 88 223 113 S270 97 300 105 S340 130 370 91 S420 52 447 76 S495 111 520 68 S563 42 590 61 S635 53 700 18" fill="none" stroke="#3d9bff" strokeWidth="2.5" vectorEffect="non-scaling-stroke" /><path d="M0 170 C43 158 67 170 100 160 S150 171 193 155 S245 164 290 150 S335 166 380 141 S430 154 469 138 S520 151 560 127 S625 138 700 117" fill="none" stroke="#46556a" strokeWidth="2" strokeDasharray="4 5" vectorEffect="non-scaling-stroke" /></svg><div className="chart-x"><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span></div></div></div></section>
      <section className="panel subscription-panel"><div className="panel-header"><div><h2>Subscriptions</h2><p>Current plan distribution</p></div><button className="text-button">View all <ArrowUpRight size={14} /></button></div><div className="donut-wrap"><div className="donut"><div><strong>0</strong><span>Subscriptions</span></div></div><div className="donut-labels"><div><i className="dot-muted" /><span>Connected</span><strong>0</strong></div><div><i className="dot-muted" /><span>Pending</span><strong>0</strong></div></div></div><div className="panel-callout"><ShieldCheck size={16} /><span>{hasData ? 'Workspace data loaded from Neon' : 'Connect Neon data to populate this panel'}</span></div></section>
    </div>
    <div className="dashboard-grid lower-grid"><section className="panel api-table-panel"><div className="panel-header"><div><h2>Recently tested APIs</h2><p>Latest endpoint test activity</p></div><div className="table-actions"><div className="table-search"><Search size={14} /><input placeholder="Filter results" value={apiSearch} onChange={(e) => setApiSearch(e.target.value)} /></div><button className="icon-button small" aria-label="Filter"><SlidersHorizontal /></button></div></div><div className="table-scroll"><table><thead><tr><th>API NAME</th><th>PROVIDER</th><th>LAST TEST</th><th>RESPONSE</th><th>RESULT</th><th /></tr></thead><tbody>{filtered.map((api) => <tr key={api.name}><td><div className="api-name"><div className={`api-logo ${api.color}`}>{api.name.slice(0, 1)}</div><strong>{api.name}</strong></div></td><td>{api.provider}</td><td>{api.last}</td><td><span className="response"><span className="response-bar" style={{ width: `${Math.min(parseInt(api.latency) / 8, 100)}%` }} />{api.latency}</span></td><td><Badge tone={api.status === 'Healthy' ? 'success' : 'warning'}>{api.status}</Badge></td><td><button className="icon-button small" aria-label={`More actions for ${api.name}`}><MoreHorizontal /></button></td></tr>)}</tbody></table></div><button className="table-footer">View all test activity <ArrowUpRight size={14} /></button></section><section className="panel admin-panel"><div className="panel-header"><div><h2>Administrative activity</h2><p>Recent workspace events</p></div><button className="icon-button small" aria-label="More activity"><MoreHorizontal /></button></div><div className="timeline"><TimelineItem icon={Plus} color="blue" title="API added to workspace" detail="OpenWeather · by Jordan Davis" time="2 min ago" /><TimelineItem icon={Zap} color="amber" title="Subscription updated" detail="GitHub REST API · Pro plan" time="1 hr ago" /><TimelineItem icon={KeyRound} color="violet" title="Credential rotated" detail="Exchange Rates · Production" time="3 hrs ago" /><TimelineItem icon={Code2} color="cyan" title="Integration configured" detail="REST Countries → Atlas" time="Yesterday" /></div></section></div>
  </>
}

function TimelineItem({ icon: Icon, color, title, detail, time }: { icon: typeof Plus; color: string; title: string; detail: string; time: string }) { return <div className="timeline-item"><div className={`timeline-icon ${color}`}><Icon /></div><div className="timeline-copy"><strong>{title}</strong><span>{detail}</span></div><time>{time}</time></div> }
const moduleCopy: Record<string, { description: string; action: string; icon: typeof Activity }> = {
  'API Explorer': { description: 'Search the catalogue and inspect available API access options.', action: 'Browse catalogue', icon: Globe2 },
  'My APIs': { description: 'Manage the API credentials and endpoints connected to your workspace.', action: 'Add API', icon: Boxes },
  Providers: { description: 'Review providers linked to your API catalogue and monitor their availability.', action: 'Connect provider', icon: Network },
  Subscriptions: { description: 'Track plans, renewals, and access subscriptions for your workspace.', action: 'Create subscription', icon: Zap },
  'Credentials Vault': { description: 'Keep API credentials organized and rotate keys without leaving the control center.', action: 'Add credential', icon: LockKeyhole },
  'API Tester': { description: 'Run a request against a managed API and review the response.', action: 'Run a test', icon: TestTube2 },
  Integrations: { description: 'Connect services that power your API workflows and notifications.', action: 'Add integration', icon: Code2 },
  Projects: { description: 'Group APIs, credentials, and tests into focused projects.', action: 'Create project', icon: Rocket },
  Monitoring: { description: 'Watch request health, latency, and availability across your APIs.', action: 'Create monitor', icon: Activity },
  'Usage Analytics': { description: 'Understand request volume, token usage, and spend over time.', action: 'View analytics', icon: Gauge },
  'Health Checks': { description: 'Set up recurring checks so issues are visible before users report them.', action: 'Add health check', icon: HeartPulse },
  'Audit Logs': { description: 'Review security and administrative events for this workspace.', action: 'Export logs', icon: ListFilter },
  Settings: { description: 'Configure workspace preferences, security, and account settings.', action: 'Edit settings', icon: Settings },
}

function ModuleView({ title, apis, onAdd }: { title: string; apis: DashboardData['apis']; onAdd: () => void }) {
  const copy = moduleCopy[title] ?? { description: `Manage ${title.toLowerCase()} in your workspace.`, action: 'Create record', icon: Database }
  const Icon = copy.icon
  return <div className="module-layout"><section className="module-hero panel"><div className="placeholder-icon"><Icon /></div><div><h2>{title}</h2><p>{copy.description}</p></div><button className="button button-primary" onClick={onAdd}><Plus size={16} /> {copy.action}</button></section><section className="panel module-list"><div className="panel-header"><div><h2>{title} activity</h2><p>{apis.length ? `${apis.length} connected API${apis.length === 1 ? '' : 's'} available` : 'Your workspace is ready for its first entry'}</p></div><button className="button button-secondary" onClick={onAdd}><Plus size={15} /> Add</button></div>{apis.length ? <div className="module-rows">{apis.map((api) => <div className="module-row" key={api.name}><div className={`api-logo ${api.color}`}>{api.name.slice(0, 1)}</div><div className="module-row-copy"><strong>{api.name}</strong><span>{api.provider} · {api.last}</span></div><Badge tone="success">{api.status}</Badge><button className="icon-button small" aria-label={`Open ${api.name}`}><ArrowUpRight /></button></div>)}</div> : <div className="module-empty"><Icon /><strong>No {title.toLowerCase()} yet</strong><span>Use the action above to get started. New records will appear here.</span><button className="button button-primary" onClick={onAdd}><Plus size={16} /> {copy.action}</button></div>}</section></div>
}

function AddApiDialog({ onClose }: { onClose: () => void }) {
  const router = useRouter()
  const [name, setName] = useState('')
  const [provider, setProvider] = useState('APILayer')
  const [baseUrl, setBaseUrl] = useState('')
  const [plan, setPlan] = useState('free')
  const [secret, setSecret] = useState('')
  const [pending, setPending] = useState(false)
  const [error, setError] = useState('')

  async function submit() {
    if (!name.trim() || !provider.trim() || !baseUrl.trim() || !secret.trim() || pending) return
    setPending(true)
    setError('')
    try {
      await createApiKey({ name, provider, baseUrl, plan, secret })
      router.refresh()
      onClose()
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Unable to add API')
      setPending(false)
    }
  }

  return <div className="dialog-backdrop" role="presentation" onMouseDown={onClose}>
    <section className="add-dialog panel" role="dialog" aria-modal="true" aria-labelledby="add-api-title" onMouseDown={(event) => event.stopPropagation()}>
      <div className="panel-header"><div><h2 id="add-api-title">Add an API</h2><p>Save a provider key securely for API testing.</p></div><button className="icon-button" onClick={onClose} aria-label="Close"><X /></button></div>
      <div className="dialog-form">
        <label className="dialog-field">API name<input autoFocus value={name} onChange={(event) => setName(event.target.value)} placeholder="e.g. Aviationstack" /></label>
        <label className="dialog-field">Provider<input value={provider} onChange={(event) => setProvider(event.target.value)} placeholder="e.g. APILayer" /></label>
        <label className="dialog-field">Base URL<input value={baseUrl} onChange={(event) => setBaseUrl(event.target.value)} placeholder="https://api.aviationstack.com" /></label>
        <label className="dialog-field">Plan<select value={plan} onChange={(event) => setPlan(event.target.value)}><option value="free">Free</option><option value="pro">Pro</option><option value="enterprise">Enterprise</option></select></label>
        <label className="dialog-field">API key<input type="password" value={secret} onChange={(event) => setSecret(event.target.value)} placeholder="Paste the key from your provider" autoComplete="off" /></label>
        {error && <span className="dialog-error" role="alert">{error}</span>}
      </div>
      <div className="dialog-actions"><button className="button button-secondary" onClick={onClose}>Cancel</button><button className="button button-primary" disabled={!name.trim() || !provider.trim() || !baseUrl.trim() || !secret.trim() || pending} onClick={submit}><Plus size={16} /> {pending ? 'Adding...' : 'Add API'}</button></div>
    </section>
  </div>
}
