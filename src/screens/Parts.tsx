import {
  Package,
  ArrowRight,
  Warehouse as WarehouseIcon,
  Truck,
  AlertTriangle,
  Sparkles,
  Boxes,
  ArrowLeftRight,
} from 'lucide-react'
import { Card, StatTile, Badge, AIBadge, Meter, usd, cn } from '../components/ui'
import { useToast } from '../components/Toast'
import {
  PARTS,
  WAREHOUSES,
  PART_ACTIONS,
  PSTATUS_META,
  totalOnHand,
  type Part,
  type PartAction,
} from '../data/parts'

const actionTone: Record<PartAction['tone'], { bg: string; fg: string; icon: typeof ArrowLeftRight }> = {
  beacon: { bg: 'bg-beacon-tint', fg: 'text-beacon', icon: ArrowLeftRight },
  risk: { bg: 'bg-risk-tint', fg: 'text-risk', icon: AlertTriangle },
  warn: { bg: 'bg-warn-tint', fg: 'text-warn-deep', icon: Truck },
}

function CoverageCell({ p }: { p: Part }) {
  const onHand = totalOnHand(p)
  const covered = onHand >= p.demand
  return (
    <div className="flex items-center gap-2">
      <div className="w-16">
        <Meter value={p.demand === 0 ? 100 : Math.min(100, (onHand / p.demand) * 100)} tone={covered ? 'go' : onHand > 0 ? 'warn' : 'risk'} />
      </div>
      <span className={cn('text-[11px] font-600 tabular', covered ? 'text-go-deep' : 'text-risk-deep')}>
        {onHand}/{p.demand}
      </span>
    </div>
  )
}

export function Parts() {
  const toast = useToast()
  const backorders = PARTS.filter((p) => p.status === 'backorder').length
  const needsAction = PARTS.filter((p) => p.status !== 'healthy').length
  const onOrderValue = PARTS.reduce((a, p) => a + p.onOrder * p.unitPrice, 0)

  return (
    <div className="mx-auto max-w-[1180px] space-y-5">
      {/* Beacon banner */}
      <div className="animate-rise overflow-hidden rounded-card border border-amber/20 bg-gradient-to-br from-amber-wash via-surface to-beacon-wash p-5">
        <div className="flex items-start gap-4">
          <div className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-tint sm:flex">
            <Package className="h-6 w-6 text-amber-deep" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="mb-1.5 flex items-center gap-2">
              <AIBadge />
              <span className="text-[10.5px] font-600 uppercase tracking-[0.16em] text-ink-faint">
                Parts across 2 warehouses
              </span>
            </div>
            <h1 className="font-display text-[21px] font-600 leading-snug text-ink">
              Fill rate is a healthy <span className="text-go-deep">94%</span>, but two parts are blocking down buses.
              Beacon has a <span className="text-beacon-deep">same-day transfer</span> and a partner-dealer source ready
              to keep both promises.
            </h1>
          </div>
          <button
            onClick={() => toast('Transfer and partner-dealer source dispatched for both backorders', 'beacon')}
            className="btn-beacon hidden shrink-0 items-center gap-1.5 self-center rounded-lg px-3.5 py-2 text-[12.5px] font-550 text-white transition md:inline-flex"
          >
            Resolve backorders <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Stat row */}
      <div className="stagger grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatTile label="Same-day fill rate" value="94%" accent="go" icon={<Truck className="h-4 w-4" />} sub="UPS &amp; SAIA in-stock" />
        <StatTile label="Active SKUs" value="3,900" accent="ink" icon={<Boxes className="h-4 w-4" />} sub="across 2 warehouses" />
        <StatTile label="Backorders" value={String(backorders)} accent="risk" icon={<AlertTriangle className="h-4 w-4" />} sub={`${needsAction} need action`} />
        <StatTile label="Parts on order" value={usd(onOrderValue, { k: true })} accent="amber" sub="inbound to branches" />
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1.6fr_1fr]">
        {/* Availability matrix */}
        <Card pad={false} className="overflow-hidden">
          <div className="flex items-center justify-between border-b border-line px-5 py-3.5">
            <div className="flex items-center gap-2">
              <Boxes className="h-4 w-4 text-amber-deep" />
              <h2 className="font-display text-[16px] font-600 text-ink">Availability vs. open demand</h2>
            </div>
            <span className="text-[11px] text-ink-faint">TPA / PMP / on order</span>
          </div>
          <div className="grid grid-cols-[1.7fr_0.5fr_0.5fr_0.5fr_1fr_0.8fr] gap-2 border-b border-line bg-canvas px-5 py-2 text-[10px] uppercase tracking-wide text-ink-faint">
            <span>Part</span>
            <span className="text-center">TPA</span>
            <span className="text-center">PMP</span>
            <span className="text-center">Ord</span>
            <span>Coverage</span>
            <span className="text-right">Status</span>
          </div>
          <div className="divide-y divide-line">
            {PARTS.map((p) => {
              const st = PSTATUS_META[p.status]
              const flagged = p.status === 'transfer' || p.status === 'backorder'
              return (
                <div
                  key={p.number}
                  className={cn('grid grid-cols-[1.7fr_0.5fr_0.5fr_0.5fr_1fr_0.8fr] items-center gap-2 px-5 py-2.5 text-[12.5px]', flagged && 'bg-beacon-wash/60')}
                >
                  <div className="min-w-0">
                    <div className="truncate font-500 text-ink">{p.name}</div>
                    <div className="text-[10px] text-ink-faint">{p.category} · #{p.number}</div>
                  </div>
                  <span className={cn('text-center tabular', p.tampa === 0 ? 'text-risk-deep font-600' : 'text-ink-soft')}>{p.tampa}</span>
                  <span className={cn('text-center tabular', p.pompano === 0 ? 'text-ink-faint' : 'text-ink-soft')}>{p.pompano}</span>
                  <span className="text-center tabular text-ink-faint">{p.onOrder || '·'}</span>
                  <CoverageCell p={p} />
                  <span className="flex justify-end"><Badge tone={st.tone}>{st.label}</Badge></span>
                </div>
              )
            })}
          </div>
          <div className="flex items-center gap-2 border-t border-line px-5 py-2.5 text-[11px] text-ink-faint">
            Coverage bar compares on-hand across both warehouses to units required by open service orders.
          </div>
        </Card>

        {/* Warehouses + actions summary */}
        <div className="space-y-5">
          <Card pad={false} className="overflow-hidden">
            <div className="flex items-center gap-2 border-b border-line px-5 py-3.5">
              <WarehouseIcon className="h-4 w-4 text-amber-deep" />
              <h2 className="font-display text-[16px] font-600 text-ink">Warehouses</h2>
            </div>
            <div className="divide-y divide-line">
              {WAREHOUSES.map((w) => (
                <div key={w.name} className="px-5 py-3.5">
                  <div className="mb-1 flex items-center justify-between">
                    <span className="text-[13px] font-600 text-ink">{w.name}</span>
                    <Badge tone={w.fillRate >= 93 ? 'go' : 'warn'}>{w.fillRate}% fill</Badge>
                  </div>
                  <div className="mb-2 text-[10.5px] text-ink-faint">{w.skus.toLocaleString()} SKUs · {w.sqft}</div>
                  <div className="flex items-center justify-between text-[11.5px]">
                    <span className="text-ink-soft">Inventory value</span>
                    <span className="font-600 tabular text-ink">{usd(w.value, { k: true })}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Beacon parts actions */}
      <Card pad={false} className="overflow-hidden border-beacon/20">
        <div className="flex items-center justify-between border-b border-beacon/15 bg-beacon-wash px-5 py-3">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-beacon" />
            <h2 className="font-display text-[16px] font-600 text-ink">Beacon parts actions</h2>
          </div>
          <Badge tone="beacon">{PART_ACTIONS.length} recommended</Badge>
        </div>
        <div className="grid grid-cols-1 divide-y divide-line md:grid-cols-3 md:divide-x md:divide-y-0">
          {PART_ACTIONS.map((a) => {
            const t = actionTone[a.tone]
            const Icon = t.icon
            return (
              <div key={a.id} className="flex flex-col p-5">
                <div className={cn('mb-2.5 flex h-8 w-8 items-center justify-center rounded-lg', t.bg)}>
                  <Icon className={cn('h-4 w-4', t.fg)} />
                </div>
                <h3 className="text-[13px] font-600 leading-snug text-ink">{a.title}</h3>
                <p className="mt-1.5 flex-1 text-[12px] leading-relaxed text-ink-soft">{a.detail}</p>
                <div className="mt-3 flex items-center justify-between border-t border-line pt-2.5">
                  <div>
                    <div className="text-[11px] font-600 text-go-deep">{a.impact}</div>
                    <div className="text-[10px] text-ink-faint">{a.ref}</div>
                  </div>
                  <button onClick={() => toast(`Applied: ${a.title}`, 'go')} className="text-[11.5px] font-600 text-amber-deep transition hover:text-amber">Apply</button>
                </div>
              </div>
            )
          })}
        </div>
      </Card>
    </div>
  )
}
