import {
  Bus,
  MapPin,
  Building2,
  CalendarClock,
  ShieldCheck,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  Wrench,
  Package,
  CheckCircle2,
  Circle,
  User,
} from 'lucide-react'
import { Card, Badge, AIBadge, ReadyDot, usd, cn } from '../components/ui'
import { useToast } from '../components/Toast'
import {
  HERO,
  partsCost,
  laborCost,
  orderTotal,
  type Stage,
  type Part,
} from '../data/orders'

const stageIcon: Record<Stage['status'], { ring: string; dot: string; icon: typeof Circle }> = {
  done: { ring: 'border-go bg-go-tint', dot: 'text-go', icon: CheckCircle2 },
  active: { ring: 'border-amber bg-amber-tint', dot: 'text-amber-deep', icon: Wrench },
  atrisk: { ring: 'border-risk bg-risk-tint', dot: 'text-risk', icon: AlertTriangle },
  upcoming: { ring: 'border-line bg-canvas', dot: 'text-ink-faint', icon: Circle },
}

const partStatus: Record<Part['status'], { label: string; tone: 'go' | 'warn' | 'risk' | 'beacon' }> = {
  instock: { label: 'In stock', tone: 'go' },
  transfer: { label: 'Transfer', tone: 'beacon' },
  backorder: { label: 'Backorder', tone: 'risk' },
}

const readyBadge = { ready: 'go', atrisk: 'warn', down: 'risk' } as const

export function ServiceOrder() {
  const o = HERO
  const total = orderTotal(o)
  const toast = useToast()

  return (
    <div className="mx-auto max-w-[1180px] space-y-5">
      {/* Order header */}
      <Card className="animate-rise">
        <div className="flex flex-wrap items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-ink">
            <Bus className="h-6 w-6 text-amber" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="font-display text-[22px] font-700 leading-none text-ink">{o.unit}</h1>
              <span className="text-[11px] tabular text-ink-faint">{o.id}</span>
              <Badge tone="amber" solid>{o.serviceType}</Badge>
              <Badge tone={o.priority === 'urgent' ? 'risk' : 'warn'}>{o.priority}</Badge>
              <span className="inline-flex items-center gap-1 rounded-full bg-mist px-2 py-0.5 text-[11px] font-550 text-ink-soft">
                <ReadyDot state={o.readyState} /> {o.readyState === 'atrisk' ? 'At risk' : o.readyState}
              </span>
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-1 text-[12px] text-ink-soft">
              <span className="inline-flex items-center gap-1.5"><Bus className="h-3.5 w-3.5 text-ink-faint" /> {o.year} {o.model} · {o.busType}</span>
              <span className="inline-flex items-center gap-1.5"><Building2 className="h-3.5 w-3.5 text-ink-faint" /> {o.customer}</span>
              <span className="inline-flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 text-ink-faint" /> {o.branch}</span>
            </div>
            <p className="mt-2 text-[12.5px] text-ink-soft"><span className="font-600 text-ink">Complaint:</span> {o.complaint}</p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <div className="rounded-lg border border-line bg-canvas px-3 py-1.5 text-center">
              <div className="text-[10px] uppercase tracking-wide text-ink-faint">Promised</div>
              <div className="font-display text-[15px] font-700 tabular text-amber-deep">{o.promised}</div>
            </div>
            <div className="rounded-lg border border-line bg-canvas px-3 py-1.5 text-center">
              <div className="text-[10px] uppercase tracking-wide text-ink-faint">Order total</div>
              <div className="font-display text-[15px] font-700 tabular text-ink">{usd(total)}</div>
            </div>
          </div>
        </div>
      </Card>

      {/* Beacon banner */}
      <div className="animate-rise overflow-hidden rounded-card border border-beacon/20 bg-gradient-to-br from-beacon-wash via-surface to-amber-wash p-4">
        <div className="flex items-start gap-3.5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-beacon-tint">
            <Sparkles className="h-5 w-5 text-beacon" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="mb-1 flex items-center gap-2">
              <AIBadge />
              <span className="text-[10px] font-600 uppercase tracking-[0.16em] text-ink-faint">Two moves to protect this order</span>
            </div>
            <p className="text-[13px] leading-relaxed text-ink">
              The A/C compressor is <span className="font-600 text-beacon-deep">within Blue Bird coverage</span>, so
              Beacon drafted a warranty claim to recover <span className="font-600">{usd(o.warranty.recover)}</span>{' '}
              instead of billing it retail. The part is <span className="font-600 text-risk-deep">backordered in Tampa</span>{' '}
              but in stock in Pompano, so a same-day transfer holds the Jul 24 ready date.
            </p>
          </div>
          <button
            onClick={() => toast('Warranty claim drafted and Pompano transfer requested for Bus 118', 'beacon')}
            className="btn-beacon my-auto hidden shrink-0 items-center gap-1.5 rounded-lg px-3.5 py-2 text-[12.5px] font-550 text-white transition sm:inline-flex"
          >
            Apply both <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1.6fr_1fr]">
        {/* Service pipeline */}
        <Card pad={false} className="overflow-hidden">
          <div className="flex items-center justify-between border-b border-line px-5 py-3.5">
            <div className="flex items-center gap-2">
              <Wrench className="h-4 w-4 text-amber-deep" />
              <h2 className="font-display text-[16px] font-600 text-ink">Service pipeline</h2>
            </div>
            <span className="text-[11px] text-ink-faint">request to ready-for-route</span>
          </div>
          <div className="px-5 py-4">
            <div className="relative">
              {o.stages.map((s, i) => {
                const c = stageIcon[s.status]
                const Icon = c.icon
                const last = i === o.stages.length - 1
                return (
                  <div key={s.key} className="flex gap-3.5">
                    <div className="flex flex-col items-center">
                      <span className={cn('flex h-8 w-8 items-center justify-center rounded-full border-2', c.ring)}>
                        <Icon className={cn('h-4 w-4', c.dot)} strokeWidth={2} />
                      </span>
                      {!last && <span className={cn('my-1 w-0.5 flex-1', s.status === 'done' ? 'bg-go/40' : 'bg-line')} />}
                    </div>
                    <div className={cn('pb-5', last && 'pb-0')}>
                      <div className="flex items-center gap-2">
                        <span className="text-[13.5px] font-600 text-ink">{s.name}</span>
                        <span className="text-[10.5px] tabular text-ink-faint">{s.when}</span>
                        {s.status === 'active' && <Badge tone="amber">In progress</Badge>}
                        {s.status === 'atrisk' && <Badge tone="risk">At risk</Badge>}
                      </div>
                      {s.note && (
                        <p className={cn('mt-1 text-[12px] leading-relaxed', s.note.startsWith('Beacon') ? 'text-beacon-deep' : 'text-ink-soft')}>
                          {s.note}
                        </p>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </Card>

        {/* Warranty + ready */}
        <div className="space-y-5">
          <Card className="border-beacon/20">
            <div className="mb-1 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-beacon" />
                <h2 className="font-display text-[16px] font-600 text-ink">Warranty recovery</h2>
              </div>
              <Badge tone="beacon">Eligible</Badge>
            </div>
            <p className="mb-3 text-[11.5px] text-ink-faint">{o.warranty.component} · within Blue Bird coverage</p>
            <div className="flex items-end justify-between">
              <div>
                <div className="text-[10px] uppercase tracking-wide text-ink-faint">Recoverable</div>
                <div className="font-display text-[28px] font-700 tabular text-beacon-deep">{usd(o.warranty.recover)}</div>
              </div>
              <Badge tone="warn">Claim {o.warranty.status}</Badge>
            </div>
            <div className="mt-3 rounded-lg bg-beacon-wash px-3 py-2 text-[11.5px] leading-relaxed text-ink-soft">
              Beacon caught this before it was billed retail. Submitting recovers parts and labor from the manufacturer.
            </div>
            <button
              onClick={() => toast(`Warranty claim submitted to Blue Bird · ${usd(o.warranty.recover)} recovery`, 'go')}
              className="btn-beacon mt-3 inline-flex w-full items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-[12.5px] font-550 text-white transition"
            >
              Submit warranty claim <ArrowRight className="h-4 w-4" />
            </button>
          </Card>

          <Card>
            <div className="mb-3 flex items-center gap-2">
              <CalendarClock className="h-4 w-4 text-amber-deep" />
              <h2 className="font-display text-[16px] font-600 text-ink">Ready for route</h2>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-amber-tint">
                <Bus className="h-6 w-6 text-amber-deep" />
              </div>
              <div>
                <div className="font-display text-[17px] font-700 text-ink">{o.promised}</div>
                <div className="text-[11.5px] text-ink-faint">1 of 6 Hillsborough buses down</div>
              </div>
              <Badge tone={readyBadge[o.readyState]} className="ml-auto">
                {o.readyState === 'atrisk' ? 'At risk' : 'Ready'}
              </Badge>
            </div>
            <div className="mt-3 flex items-center gap-2 rounded-lg bg-canvas px-3 py-2 text-[11.5px] text-ink-soft">
              <AlertTriangle className="h-3.5 w-3.5 shrink-0 text-amber-deep" />
              Ready 17 days ahead of first bell. The Pompano transfer keeps this bus on schedule.
            </div>
          </Card>
        </div>
      </div>

      {/* Parts + technician */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1.6fr_1fr]">
        <Card pad={false} className="overflow-hidden">
          <div className="flex items-center justify-between border-b border-line px-5 py-3.5">
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4 text-amber-deep" />
              <h2 className="font-display text-[16px] font-600 text-ink">Parts on this order</h2>
            </div>
            <span className="text-[11px] text-ink-faint">{usd(partsCost(o))} parts · {usd(laborCost(o))} labor</span>
          </div>
          <div className="grid grid-cols-[1.7fr_0.9fr_0.6fr_0.9fr] gap-2 border-b border-line bg-canvas px-5 py-2 text-[10px] uppercase tracking-wide text-ink-faint">
            <span>Part</span>
            <span>Location</span>
            <span className="text-right">Qty</span>
            <span className="text-right">Status</span>
          </div>
          <div className="divide-y divide-line">
            {o.parts.map((p) => {
              const st = partStatus[p.status]
              return (
                <div
                  key={p.number}
                  className={cn('grid grid-cols-[1.7fr_0.9fr_0.6fr_0.9fr] items-center gap-2 px-5 py-2.5 text-[12.5px]', p.flagged && 'bg-beacon-wash')}
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 font-500 text-ink">
                      {p.flagged && <Sparkles className="h-3.5 w-3.5 shrink-0 text-beacon" />}
                      {p.name}
                    </div>
                    <div className="text-[10px] tabular text-ink-faint">#{p.number}</div>
                  </div>
                  <span className="text-[11.5px] text-ink-soft">{p.location}</span>
                  <span className="text-right tabular text-ink-soft">{p.qty}</span>
                  <span className="flex justify-end"><Badge tone={st.tone}>{st.label}</Badge></span>
                </div>
              )
            })}
          </div>
          <div className="flex items-center gap-2 border-t border-line px-5 py-2.5 text-[11.5px] text-ink-soft">
            <Sparkles className="h-3.5 w-3.5 shrink-0 text-beacon" />
            <span><span className="font-600 text-ink">Beacon:</span> transfer the compressor from Pompano today for same-day arrival in Tampa.</span>
          </div>
        </Card>

        <Card>
          <div className="mb-3 flex items-center gap-2">
            <User className="h-4 w-4 text-amber-deep" />
            <h2 className="font-display text-[16px] font-600 text-ink">Technician</h2>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-ink text-[13px] font-700 text-amber">MD</div>
            <div>
              <div className="text-[13.5px] font-600 text-ink">{o.tech.name}</div>
              <div className="text-[11.5px] text-ink-faint">{o.tech.assignment}</div>
            </div>
          </div>
          <div className="mt-3 space-y-2">
            <div className="flex items-center justify-between rounded-lg bg-canvas px-3 py-2 text-[12px]">
              <span className="text-ink-soft">Certification</span>
              <Badge tone="steel">{o.tech.cert}</Badge>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-canvas px-3 py-2 text-[12px]">
              <span className="text-ink-soft">Labor estimate</span>
              <span className="font-600 tabular text-ink">{o.laborHours} hrs</span>
            </div>
          </div>
          <div className="mt-3 flex items-center gap-2 rounded-lg bg-beacon-wash px-3 py-2 text-[11.5px] text-ink-soft">
            <Sparkles className="h-3.5 w-3.5 shrink-0 text-beacon" />
            HVAC-certified and free from Jul 16. Beacon matched the skill to the job.
          </div>
        </Card>
      </div>
    </div>
  )
}
