import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import {
  ShieldCheck,
  ArrowRight,
  DollarSign,
  AlertTriangle,
  Sparkles,
  CheckCircle2,
  Clock,
} from 'lucide-react'
import { Card, StatTile, Badge, AIBadge, usd, cn } from '../components/ui'
import { useToast } from '../components/Toast'
import { CLAIMS, PIPELINE, RECOVERY_TREND, CLAIM_META, type Claim } from '../data/warranty'

const atRisk = CLAIMS.filter((c) => c.status === 'eligible').reduce((a, c) => a + c.amount, 0)
const inFlight = CLAIMS.filter((c) => ['pending', 'submitted', 'approved'].includes(c.status)).reduce((a, c) => a + c.amount, 0)
const active = CLAIMS.filter((c) => c.status !== 'paid')

function RecoveryTrend() {
  return (
    <ResponsiveContainer width="100%" height={150}>
      <AreaChart data={RECOVERY_TREND} margin={{ top: 6, right: 12, bottom: 0, left: 4 }}>
        <defs>
          <linearGradient id="wFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2563EB" stopOpacity={0.22} />
            <stop offset="100%" stopColor="#2563EB" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke="#EDEFF2" vertical={false} />
        <XAxis dataKey="month" tick={{ fontSize: 10.5, fill: '#6E7784' }} axisLine={{ stroke: '#E3E6EA' }} tickLine={false} />
        <YAxis tickFormatter={(v) => `$${v}k`} tick={{ fontSize: 10.5, fill: '#6E7784' }} axisLine={false} tickLine={false} width={40} domain={[40, 90]} />
        <Tooltip
          contentStyle={{ borderRadius: 10, border: '1px solid #E3E6EA', boxShadow: '0 12px 40px -12px rgba(23,27,36,0.22)', fontSize: 12 }}
          formatter={(v) => [`$${v}k`, 'Recovered']}
        />
        <Area type="monotone" dataKey="amount" stroke="#2563EB" strokeWidth={2.5} fill="url(#wFill)" isAnimationActive={false} />
      </AreaChart>
    </ResponsiveContainer>
  )
}

export function Warranty() {
  const toast = useToast()
  return (
    <div className="mx-auto max-w-[1180px] space-y-5">
      {/* Beacon banner */}
      <div className="animate-rise overflow-hidden rounded-card border border-beacon/20 bg-gradient-to-br from-beacon-wash via-surface to-amber-wash p-5">
        <div className="flex items-start gap-4">
          <div className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-beacon-tint sm:flex">
            <ShieldCheck className="h-6 w-6 text-beacon" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="mb-1.5 flex items-center gap-2">
              <AIBadge />
              <span className="text-[10.5px] font-600 uppercase tracking-[0.16em] text-ink-faint">
                Blue Bird warranty recovery
              </span>
            </div>
            <h1 className="font-display text-[21px] font-600 leading-snug text-ink">
              Beacon caught <span className="text-beacon-deep">{usd(atRisk)} in repairs</span> about to be billed retail
              that are actually under Blue Bird coverage, on top of{' '}
              <span className="text-go-deep">$86k recovered</span> this month.
            </h1>
          </div>
          <button
            onClick={() => toast(`3 eligible claims submitted to Blue Bird · ${usd(atRisk)} recovery`, 'go')}
            className="btn-beacon hidden shrink-0 items-center gap-1.5 self-center rounded-lg px-3.5 py-2 text-[12.5px] font-550 text-white transition md:inline-flex"
          >
            Submit 3 claims <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Stat row */}
      <div className="stagger grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatTile label="Recovered · MTD" value="$86k" accent="go" icon={<DollarSign className="h-4 w-4" />} sub="+22% vs. last month" />
        <StatTile label="In-flight claims" value={usd(inFlight)} accent="amber" icon={<Clock className="h-4 w-4" />} sub="pending to approved" />
        <StatTile label="At risk of retail write-off" value={usd(atRisk)} accent="beacon" icon={<AlertTriangle className="h-4 w-4" />} sub="3 eligible, not yet claimed" />
        <StatTile label="Approval rate" value="96%" accent="steel" icon={<CheckCircle2 className="h-4 w-4" />} sub="trailing 90 days" />
      </div>

      {/* Claim pipeline */}
      <Card pad={false} className="overflow-hidden">
        <div className="flex items-center justify-between border-b border-line px-5 py-3.5">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-beacon" />
            <h2 className="font-display text-[16px] font-600 text-ink">Claim pipeline</h2>
          </div>
          <span className="text-[11px] text-ink-faint">eligible to paid</span>
        </div>
        <div className="grid grid-cols-2 divide-line md:grid-cols-5 md:divide-x">
          {PIPELINE.map((p, i) => {
            const m = CLAIM_META[p.status]
            const dot: Record<string, string> = { beacon: 'bg-beacon', warn: 'bg-warn', steel: 'bg-steel', amber: 'bg-amber', go: 'bg-go' }
            return (
              <div key={p.status} className={cn('p-4', i >= 3 && 'border-t border-line md:border-t-0')}>
                <div className="mb-1 flex items-center gap-1.5">
                  <span className={cn('h-2 w-2 rounded-full', dot[m.tone])} />
                  <span className="text-[11.5px] font-600 text-ink">{m.label}</span>
                </div>
                <div className="font-display text-[20px] font-700 tabular text-ink">{usd(p.value, { k: true })}</div>
                <div className="text-[11px] text-ink-faint">{p.count} {p.count === 1 ? 'claim' : 'claims'}</div>
              </div>
            )
          })}
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1.6fr_1fr]">
        {/* Active claims */}
        <Card pad={false} className="overflow-hidden">
          <div className="flex items-center justify-between border-b border-line px-5 py-3.5">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-amber-deep" />
              <h2 className="font-display text-[16px] font-600 text-ink">Active warranty claims</h2>
            </div>
            <span className="text-[11px] text-ink-faint">{active.length} open</span>
          </div>
          <div className="grid grid-cols-[1.4fr_1.4fr_0.8fr_0.9fr] gap-2 border-b border-line bg-canvas px-5 py-2 text-[10px] uppercase tracking-wide text-ink-faint">
            <span>Bus</span>
            <span>Component</span>
            <span className="text-right">Recover</span>
            <span className="text-right">Status</span>
          </div>
          <div className="divide-y divide-line">
            {active.map((c: Claim) => {
              const m = CLAIM_META[c.status]
              return (
                <div
                  key={c.id}
                  className={cn('grid grid-cols-[1.4fr_1.4fr_0.8fr_0.9fr] items-center gap-2 px-5 py-2.5 text-[12.5px]', c.flagged && 'bg-beacon-wash/60')}
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 font-600 text-ink">
                      {c.flagged && <Sparkles className="h-3.5 w-3.5 shrink-0 text-beacon" />}
                      {c.unit}
                    </div>
                    <div className="text-[10px] text-ink-faint">{c.customer}</div>
                  </div>
                  <div className="min-w-0">
                    <div className="truncate text-ink-soft">{c.component}</div>
                    <div className="text-[10px] text-ink-faint">{c.branch} · {c.agedDays}d old</div>
                  </div>
                  <span className="text-right font-600 tabular text-go-deep">{usd(c.amount)}</span>
                  <span className="flex justify-end"><Badge tone={m.tone}>{m.label}</Badge></span>
                </div>
              )
            })}
          </div>
          <div className="flex items-center gap-2 border-t border-line px-5 py-2.5 text-[11.5px] text-ink-soft">
            <Sparkles className="h-3.5 w-3.5 shrink-0 text-beacon" />
            <span><span className="font-600 text-ink">Beacon:</span> the 3 flagged claims are eligible under coverage. Submit before they are written off as retail.</span>
          </div>
        </Card>

        {/* Recovery trend */}
        <Card pad={false} className="h-fit overflow-hidden">
          <div className="border-b border-line px-5 py-3.5">
            <h2 className="font-display text-[16px] font-600 text-ink">Recovery trend</h2>
            <p className="mt-0.5 text-[11px] text-ink-faint">Warranty dollars recovered per month</p>
          </div>
          <div className="px-2 py-3">
            <RecoveryTrend />
          </div>
          <div className="mx-3 mb-3 flex items-center gap-2 rounded-lg bg-beacon-wash px-3 py-2 text-[11.5px] text-ink-soft">
            <Sparkles className="h-3.5 w-3.5 shrink-0 text-beacon" />
            Recovery is up <span className="font-600 text-ink">$34k</span> since February as Beacon catches more eligible repairs.
          </div>
        </Card>
      </div>
    </div>
  )
}
