import {
  Users,
  ArrowRight,
  Wrench,
  Truck,
  Sparkles,
  MapPin,
  Gauge,
  Clock,
  CheckCircle2,
} from 'lucide-react'
import { Card, StatTile, Badge, AIBadge, Meter, cn } from '../components/ui'
import { useToast } from '../components/Toast'
import {
  TECHS,
  TAMPA_BAYS,
  POMPANO_BAYS,
  MOBILE_RUNS,
  TECH_ACTIONS,
  type Bay,
  type Tech,
  type MobileRun,
  type TechAction,
} from '../data/technicians'

function BayGrid({ title, bays }: { title: string; bays: Bay[] }) {
  const active = bays.filter((b) => b.unit).length
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <span className="text-[12.5px] font-600 text-ink">{title}</span>
        <Badge tone={active / bays.length >= 0.85 ? 'warn' : 'go'}>{active}/{bays.length} bays</Badge>
      </div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {bays.map((b) => (
          <div
            key={b.bay}
            className={cn(
              'rounded-lg border px-2.5 py-2',
              b.unit ? 'border-amber/30 bg-amber-wash' : 'border-dashed border-line bg-canvas',
            )}
          >
            <div className="flex items-center justify-between">
              <span className="text-[9.5px] font-600 uppercase tracking-wide text-ink-faint">Bay {b.bay}</span>
              {b.unit ? <Wrench className="h-3 w-3 text-amber-deep" /> : <span className="text-[9px] text-ink-faint">open</span>}
            </div>
            {b.unit ? (
              <div className="mt-0.5">
                <div className="text-[12px] font-600 text-ink">{b.unit}</div>
                <div className="text-[9.5px] text-ink-faint">{b.job} · {b.tech}</div>
              </div>
            ) : (
              <div className="mt-0.5 text-[11px] text-ink-faint">Available</div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export function Technicians() {
  const toast = useToast()
  return (
    <div className="mx-auto max-w-[1180px] space-y-5">
      {/* Beacon banner */}
      <div className="animate-rise overflow-hidden rounded-card border border-beacon/20 bg-gradient-to-br from-beacon-wash via-surface to-amber-wash p-5">
        <div className="flex items-start gap-4">
          <div className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-beacon-tint sm:flex">
            <Users className="h-6 w-6 text-beacon" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="mb-1.5 flex items-center gap-2">
              <AIBadge />
              <span className="text-[10.5px] font-600 uppercase tracking-[0.16em] text-ink-faint">
                Technician coordination · 2 branches
              </span>
            </div>
            <h1 className="font-display text-[21px] font-600 leading-snug text-ink">
              Beacon batched <span className="text-beacon-deep">3 Dade City requests into one mobile run</span> and
              skill-matched every open job, saving about{' '}
              <span className="text-go-deep">2.5 hours of drive time</span> this week.
            </h1>
          </div>
          <button
            onClick={() => toast('Optimized schedule applied · Dade City mobile run booked for Thursday', 'beacon')}
            className="btn-beacon hidden shrink-0 items-center gap-1.5 self-center rounded-lg px-3.5 py-2 text-[12.5px] font-550 text-white transition md:inline-flex"
          >
            Apply schedule <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Stat row */}
      <div className="stagger grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatTile label="Technicians on shift" value="19" accent="amber" icon={<Users className="h-4 w-4" />} sub="14 shop · 5 mobile" />
        <StatTile label="Bay utilization" value="86%" accent="warn" icon={<Gauge className="h-4 w-4" />} sub="12 of 14 bays active" />
        <StatTile label="Mobile runs today" value="2" accent="beacon" icon={<Truck className="h-4 w-4" />} sub="5 stops across 2 areas" />
        <StatTile label="On-time completion" value="94%" accent="go" icon={<CheckCircle2 className="h-4 w-4" />} sub="promised dates met" />
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1.5fr_1fr]">
        {/* Bay board */}
        <Card pad={false} className="overflow-hidden">
          <div className="flex items-center gap-2 border-b border-line px-5 py-3.5">
            <Wrench className="h-4 w-4 text-amber-deep" />
            <h2 className="font-display text-[16px] font-600 text-ink">Bay board</h2>
          </div>
          <div className="space-y-4 px-5 py-4">
            <BayGrid title="Tampa" bays={TAMPA_BAYS} />
            <BayGrid title="Pompano Beach" bays={POMPANO_BAYS} />
          </div>
        </Card>

        {/* Mobile dispatch */}
        <Card pad={false} className="h-fit overflow-hidden">
          <div className="flex items-center gap-2 border-b border-line px-5 py-3.5">
            <Truck className="h-4 w-4 text-beacon" />
            <h2 className="font-display text-[16px] font-600 text-ink">Mobile dispatch</h2>
          </div>
          <div className="divide-y divide-line">
            {MOBILE_RUNS.map((r: MobileRun) => (
              <div key={r.tech} className={cn('px-5 py-3.5', r.status === 'proposed' && 'bg-beacon-wash/60')}>
                <div className="mb-1 flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 text-[12.5px] font-600 text-ink">
                    <MapPin className="h-3.5 w-3.5 text-beacon" /> {r.area}
                  </span>
                  <Badge tone={r.status === 'proposed' ? 'beacon' : 'go'}>{r.status === 'proposed' ? 'Beacon proposed' : 'In progress'}</Badge>
                </div>
                <div className="text-[11px] text-ink-faint">{r.tech} · {r.stops} stops · {r.miles} mi</div>
                <p className="mt-1 text-[12px] leading-relaxed text-ink-soft">{r.note}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Technician roster */}
      <Card pad={false} className="overflow-hidden">
        <div className="flex items-center justify-between border-b border-line px-5 py-3.5">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-amber-deep" />
            <h2 className="font-display text-[16px] font-600 text-ink">Technician roster</h2>
          </div>
          <span className="text-[11px] text-ink-faint">{TECHS.length} on shift</span>
        </div>
        <div className="grid grid-cols-[1.4fr_1fr_1.3fr_1fr] gap-2 border-b border-line bg-canvas px-5 py-2 text-[10px] uppercase tracking-wide text-ink-faint">
          <span>Technician</span>
          <span>Skills</span>
          <span>Current job</span>
          <span>Utilization</span>
        </div>
        <div className="divide-y divide-line">
          {TECHS.map((t: Tech) => (
            <div key={t.name} className="grid grid-cols-[1.4fr_1fr_1.3fr_1fr] items-center gap-2 px-5 py-3">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-ink text-[11px] font-700 text-amber">{t.initials}</div>
                <div className="min-w-0">
                  <div className="truncate text-[13px] font-600 text-ink">{t.name}</div>
                  <div className="flex items-center gap-1 text-[10px] text-ink-faint">
                    {t.mode === 'mobile' ? <Truck className="h-3 w-3" /> : <Wrench className="h-3 w-3" />}
                    {t.branch}
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-1">
                {t.certs.map((c) => (
                  <span key={c} className="rounded bg-mist px-1.5 py-0.5 text-[10px] font-550 text-ink-soft">{c}</span>
                ))}
              </div>
              <div className="text-[12px]">
                {t.assignment === 'Available' ? (
                  <span className="inline-flex items-center gap-1 text-go-deep"><span className="h-1.5 w-1.5 rounded-full bg-go" /> Available</span>
                ) : (
                  <span className="text-ink-soft">{t.assignment}</span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Meter value={t.utilization} tone={t.utilization >= 90 ? 'risk' : t.utilization >= 80 ? 'warn' : 'go'} className="flex-1" />
                <span className="w-9 text-right text-[11px] tabular text-ink-soft">{t.utilization}%</span>
              </div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 divide-line md:grid-cols-2 md:divide-x">
          {TECH_ACTIONS.map((a: TechAction, i) => (
            <div key={a.id} className={cn('flex items-start gap-3 px-5 py-3.5', i === 1 && 'border-t border-line md:border-t-0')}>
              <Sparkles className={cn('mt-0.5 h-4 w-4 shrink-0', a.tone === 'beacon' ? 'text-beacon' : 'text-warn-deep')} />
              <div className="min-w-0 flex-1">
                <div className="text-[12.5px] font-600 text-ink">{a.title}</div>
                <p className="mt-0.5 text-[11.5px] leading-relaxed text-ink-soft">{a.detail}</p>
                <div className="mt-1 inline-flex items-center gap-1 text-[11px] font-600 text-go-deep">
                  <Clock className="h-3 w-3" /> {a.impact}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
