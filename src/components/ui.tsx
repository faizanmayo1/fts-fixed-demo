import { type ReactNode } from 'react'

export function cn(...v: (string | false | null | undefined)[]) {
  return v.filter(Boolean).join(' ')
}

export function Card({
  children,
  className,
  pad = true,
}: {
  children: ReactNode
  className?: string
  pad?: boolean
}) {
  return (
    <div
      className={cn('rounded-card border border-line bg-surface shadow-card', pad && 'p-5', className)}
    >
      {children}
    </div>
  )
}

export function SectionTitle({ eyebrow, title, right }: { eyebrow?: string; title: ReactNode; right?: ReactNode }) {
  return (
    <div className="mb-4 flex items-end justify-between gap-4">
      <div>
        {eyebrow && (
          <div className="mb-1 text-[10.5px] font-600 uppercase tracking-[0.16em] text-ink-faint">{eyebrow}</div>
        )}
        <h2 className="font-display text-[18px] font-600 leading-tight text-ink">{title}</h2>
      </div>
      {right}
    </div>
  )
}

type Accent = 'ink' | 'amber' | 'beacon' | 'steel' | 'go' | 'warn' | 'risk'

export function StatTile({
  label,
  value,
  sub,
  accent = 'ink',
  icon,
}: {
  label: string
  value: ReactNode
  sub?: ReactNode
  accent?: Accent
  icon?: ReactNode
}) {
  const accentText: Record<Accent, string> = {
    ink: 'text-ink',
    amber: 'text-amber-deep',
    beacon: 'text-beacon-deep',
    steel: 'text-steel-deep',
    go: 'text-go-deep',
    warn: 'text-warn-deep',
    risk: 'text-risk-deep',
  }
  return (
    <Card className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <span className="text-[12px] font-500 text-ink-faint">{label}</span>
        {icon && <span className="text-ink-faint">{icon}</span>}
      </div>
      <div className={cn('font-display text-[26px] font-700 leading-none tabular', accentText[accent])}>{value}</div>
      {sub && <div className="text-[12px] text-ink-soft">{sub}</div>}
    </Card>
  )
}

type Tone = 'ink' | 'amber' | 'beacon' | 'steel' | 'go' | 'warn' | 'risk' | 'neutral'

export function Badge({
  children,
  tone = 'neutral',
  solid = false,
  className,
}: {
  children: ReactNode
  tone?: Tone
  solid?: boolean
  className?: string
}) {
  const map: Record<Tone, string> = {
    neutral: 'bg-mist text-ink-soft',
    ink: 'bg-ink/8 text-ink',
    amber: solid ? 'bg-amber text-white' : 'bg-amber-tint text-amber-deep',
    beacon: solid ? 'bg-beacon text-white' : 'bg-beacon-tint text-beacon-deep',
    steel: solid ? 'bg-steel text-white' : 'bg-steel-tint text-steel-deep',
    go: 'bg-go-tint text-go-deep',
    warn: 'bg-warn-tint text-warn-deep',
    risk: 'bg-risk-tint text-risk-deep',
  }
  return (
    <span
      className={cn('inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-550', map[tone], className)}
    >
      {children}
    </span>
  )
}

/** The AI signature chip - Beacon, the cobalt intelligence layer. */
export function AIBadge({ label = 'Beacon AI' }: { label?: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-beacon/30 bg-beacon-wash px-2 py-0.5 text-[11px] font-600 text-beacon-deep">
      <span className="relative flex h-1.5 w-1.5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-beacon opacity-60" />
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-beacon" />
      </span>
      {label}
    </span>
  )
}

export function Meter({
  value,
  tone = 'amber',
  className,
}: {
  value: number
  tone?: 'amber' | 'beacon' | 'steel' | 'go' | 'warn' | 'risk'
  className?: string
}) {
  const bar: Record<string, string> = {
    amber: 'bg-amber',
    beacon: 'bg-beacon',
    steel: 'bg-steel',
    go: 'bg-go',
    warn: 'bg-warn',
    risk: 'bg-risk',
  }
  return (
    <div className={cn('h-1.5 w-full overflow-hidden rounded-full bg-mist', className)}>
      <div className={cn('h-full rounded-full transition-all', bar[tone])} style={{ width: `${Math.min(100, Math.max(0, value))}%` }} />
    </div>
  )
}

/** Signature motif - a school-bus silhouette. */
export function BusMark({ size = 30, tone = 'amber' }: { size?: number; tone?: 'amber' | 'beacon' | 'steel' | 'white' }) {
  const c = tone === 'amber' ? '#F2A413' : tone === 'beacon' ? '#2563EB' : tone === 'white' ? '#FFFFFF' : '#5C6B7A'
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden>
      <path d="M4 9.5c0-1.1.9-2 2-2h17.5c.6 0 1.2.28 1.6.75L28 12v9.5H4V9.5z" stroke={c} strokeWidth="1.8" strokeLinejoin="round" />
      <rect x="7" y="11" width="3.6" height="3.4" rx="0.6" fill={c} opacity="0.85" />
      <rect x="12" y="11" width="3.6" height="3.4" rx="0.6" fill={c} opacity="0.85" />
      <rect x="17" y="11" width="3.6" height="3.4" rx="0.6" fill={c} opacity="0.85" />
      <circle cx="10" cy="22.5" r="2.4" stroke={c} strokeWidth="1.8" />
      <circle cx="22" cy="22.5" r="2.4" stroke={c} strokeWidth="1.8" />
      <path d="M4 21.5h2.2M25.8 21.5H28" stroke={c} strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

/** Readiness status dot (traffic-signal semantics). */
export function ReadyDot({ state }: { state: 'ready' | 'atrisk' | 'down' }) {
  const c = state === 'ready' ? 'bg-go' : state === 'atrisk' ? 'bg-amber' : 'bg-risk'
  return <span className={cn('inline-block h-2 w-2 rounded-full', c)} />
}

export function Divider() {
  return <div className="h-px w-full bg-line" />
}

/** USD formatter for demo figures (Florida). */
export function usd(n: number, opts?: { k?: boolean }) {
  if (opts?.k) return `$${(n / 1000).toLocaleString('en-US', { maximumFractionDigits: 1 })}k`
  return `$${n.toLocaleString('en-US')}`
}
