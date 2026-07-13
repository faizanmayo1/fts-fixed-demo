import { Link, useNavigate } from 'react-router-dom'
import {
  ArrowUpRight,
  ShieldCheck,
  Package,
  CalendarClock,
  Users,
  ChevronRight,
  AlertTriangle,
  Route,
  Sparkles,
  Wrench,
} from 'lucide-react'
import { Card, StatTile, Badge, AIBadge, BusMark, ReadyDot, cn } from '../components/ui'
import { KPIS, READINESS, ALERTS, BRANCHES, CLIENT, type Alert } from '../data/ops'

const alertTone: Record<Alert['tone'], { bg: string; fg: string; icon: typeof AlertTriangle }> = {
  beacon: { bg: 'bg-beacon-tint', fg: 'text-beacon', icon: ShieldCheck },
  risk: { bg: 'bg-risk-tint', fg: 'text-risk', icon: AlertTriangle },
  warn: { bg: 'bg-warn-tint', fg: 'text-warn-deep', icon: Route },
  amber: { bg: 'bg-amber-tint', fg: 'text-amber-deep', icon: CalendarClock },
}

const alertRoute: Record<Alert['kind'], string> = {
  warranty: '/order',
  parts: '/parts',
  readiness: '/order',
  mobile: '/technicians',
}

export function CommandCenter() {
  const navigate = useNavigate()
  const fleet = READINESS.reduce((a, d) => a + d.fleet, 0)
  const ready = READINESS.reduce((a, d) => a + d.ready, 0)
  const atrisk = READINESS.reduce((a, d) => a + d.atrisk, 0)
  const down = READINESS.reduce((a, d) => a + d.down, 0)
  const readyPct = Math.round((ready / fleet) * 100)

  return (
    <div className="mx-auto max-w-[1180px] space-y-5">
      {/* Beacon headline banner */}
      <div className="animate-rise overflow-hidden rounded-card border border-amber/20 bg-gradient-to-br from-amber-wash via-surface to-beacon-wash p-5">
        <div className="flex items-start gap-4">
          <div className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-ink sm:flex">
            <BusMark size={28} tone="amber" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="mb-1.5 flex items-center gap-2">
              <AIBadge />
              <span className="text-[10.5px] font-600 uppercase tracking-[0.16em] text-ink-faint">
                Fleet readiness · {CLIENT.daysToBTS} days to first bell
              </span>
            </div>
            <h1 className="font-display text-[22px] font-600 leading-snug text-ink">
              <span className="text-go-deep">{ready} of {fleet} buses are road-ready</span> across 5 districts, and
              Beacon has the <span className="text-risk-deep">{down} that are down</span> sequenced to clear before the
              Aug 10 first bell.
            </h1>
            <p className="mt-2 max-w-2xl text-[13px] leading-relaxed text-ink-soft">
              One layer over service scheduling, parts, warranty, and technicians, so gaps and readiness risks surface
              early instead of the week before school starts.
            </p>
          </div>
          <Link
            to="/order"
            className="btn-amber hidden shrink-0 items-center gap-1.5 self-center rounded-lg px-3.5 py-2 text-[12.5px] font-550 text-white shadow-rail transition md:inline-flex"
          >
            Open hero order
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* KPI row */}
      <div className="stagger grid grid-cols-2 gap-4 lg:grid-cols-4">
        {KPIS.map((k) => (
          <StatTile
            key={k.label}
            label={k.label}
            value={k.value}
            accent={k.accent}
            sub={
              <span className="flex items-center gap-1.5">
                {k.trend && <span className="text-[11px] font-600 text-go-deep">{k.trend}</span>}
                <span className="text-ink-faint">{k.sub}</span>
              </span>
            }
          />
        ))}
      </div>

      {/* Fleet readiness by district */}
      <Card pad={false} className="overflow-hidden">
        <div className="flex items-center justify-between border-b border-line px-5 py-3.5">
          <div className="flex items-center gap-2">
            <BusMark size={18} tone="steel" />
            <h2 className="font-display text-[16px] font-600 text-ink">Fleet readiness by district</h2>
          </div>
          <div className="flex items-center gap-3 text-[10.5px] text-ink-faint">
            <span className="inline-flex items-center gap-1"><ReadyDot state="ready" /> Ready {ready}</span>
            <span className="inline-flex items-center gap-1"><ReadyDot state="atrisk" /> At risk {atrisk}</span>
            <span className="inline-flex items-center gap-1"><ReadyDot state="down" /> Down {down}</span>
          </div>
        </div>
        <div className="divide-y divide-line">
          {READINESS.map((d) => {
            const rp = Math.round((d.ready / d.fleet) * 100)
            return (
              <div key={d.name} className="flex items-center gap-4 px-5 py-3">
                <div className="w-40 shrink-0">
                  <div className="text-[13px] font-600 text-ink">{d.name}</div>
                  <div className="text-[10.5px] text-ink-faint">{d.fleet} buses serviced</div>
                </div>
                <div className="flex h-4 flex-1 overflow-hidden rounded-full bg-mist">
                  <div className="bg-go" style={{ width: `${(d.ready / d.fleet) * 100}%` }} title={`Ready ${d.ready}`} />
                  <div className="bg-amber" style={{ width: `${(d.atrisk / d.fleet) * 100}%` }} title={`At risk ${d.atrisk}`} />
                  <div className="bg-risk" style={{ width: `${(d.down / d.fleet) * 100}%` }} title={`Down ${d.down}`} />
                </div>
                <div className="w-24 shrink-0 text-right">
                  <span className={cn('font-display text-[15px] font-700 tabular', rp >= 90 ? 'text-go-deep' : 'text-amber-deep')}>{rp}%</span>
                  <span className="ml-1 text-[10.5px] text-ink-faint">ready</span>
                </div>
                {d.down > 0 && <Badge tone="risk">{d.down} down</Badge>}
                {d.down === 0 && <Badge tone="go">On track</Badge>}
              </div>
            )
          })}
        </div>
        <div className="flex items-center justify-between border-t border-line bg-canvas px-5 py-2.5">
          <span className="text-[12px] text-ink-soft">
            <span className="font-600 text-ink">{readyPct}% fleet-ready</span> overall · {atrisk + down} buses need attention
          </span>
          <Link to="/order" className="inline-flex items-center gap-1 text-[12px] font-600 text-amber-deep transition hover:gap-1.5">
            <Wrench className="h-3.5 w-3.5" /> Work the queue <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1.55fr_1fr]">
        {/* Beacon priority insights */}
        <Card pad={false} className="overflow-hidden">
          <div className="flex items-center justify-between border-b border-line px-5 py-3.5">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-beacon" />
              <h2 className="font-display text-[16px] font-600 text-ink">Priority insights</h2>
            </div>
            <Badge tone="beacon">{ALERTS.length} surfaced by Beacon</Badge>
          </div>
          <div className="divide-y divide-line">
            {ALERTS.map((a) => {
              const T = alertTone[a.tone]
              const Icon = T.icon
              return (
                <div key={a.id} className="group flex gap-3.5 px-5 py-4 transition hover:bg-canvas">
                  <div className="mt-0.5 shrink-0">
                    <span className={cn('flex h-8 w-8 items-center justify-center rounded-lg', T.bg)}>
                      <Icon className={cn('h-4 w-4', T.fg)} />
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="truncate text-[13.5px] font-600 text-ink">{a.title}</h3>
                      <span className="shrink-0 rounded bg-mist px-1.5 py-0.5 text-[9.5px] font-600 text-ink-faint">{a.tag}</span>
                    </div>
                    <div className="mt-0.5 text-[11.5px] font-500 text-ink-faint">{a.ref}</div>
                    <p className="mt-1 text-[12.5px] leading-relaxed text-ink-soft">{a.detail}</p>
                  </div>
                  <button
                    onClick={() => navigate(alertRoute[a.kind])}
                    className="my-auto hidden shrink-0 items-center gap-1 rounded-lg border border-line bg-surface px-2.5 py-1.5 text-[11.5px] font-550 text-ink-soft transition group-hover:border-amber/50 group-hover:text-amber-deep sm:inline-flex"
                  >
                    {a.cta}
                    <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              )
            })}
          </div>
        </Card>

        {/* Branch operations */}
        <Card pad={false} className="h-fit overflow-hidden">
          <div className="flex items-center gap-2 border-b border-line px-5 py-3.5">
            <Users className="h-4 w-4 text-amber-deep" />
            <h2 className="font-display text-[16px] font-600 text-ink">Branch operations</h2>
          </div>
          <div className="divide-y divide-line">
            {BRANCHES.map((b) => (
              <div key={b.name} className="px-5 py-3.5">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-[13px] font-600 text-ink">{b.name}</span>
                  <Badge tone={b.baysActive / b.bays >= 0.85 ? 'warn' : 'go'}>
                    {b.baysActive}/{b.bays} bays
                  </Badge>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="rounded-lg bg-canvas px-2 py-1.5">
                    <div className="font-display text-[15px] font-700 tabular text-ink">{b.baysActive}</div>
                    <div className="text-[9px] uppercase tracking-wide text-ink-faint">In bay</div>
                  </div>
                  <div className="rounded-lg bg-canvas px-2 py-1.5">
                    <div className="font-display text-[15px] font-700 tabular text-ink">{b.techs}</div>
                    <div className="text-[9px] uppercase tracking-wide text-ink-faint">Techs</div>
                  </div>
                  <div className="rounded-lg bg-canvas px-2 py-1.5">
                    <div className="font-display text-[15px] font-700 tabular text-beacon-deep">{b.mobile}</div>
                    <div className="text-[9px] uppercase tracking-wide text-ink-faint">Mobile</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2 border-t border-line px-5 py-3 text-[11.5px] text-ink-soft">
            <Package className="h-3.5 w-3.5 shrink-0 text-amber-deep" />
            Parts fill rate 94% · same-day UPS &amp; SAIA
          </div>
        </Card>
      </div>
    </div>
  )
}
