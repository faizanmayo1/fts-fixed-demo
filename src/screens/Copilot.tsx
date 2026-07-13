import { useState } from 'react'
import {
  Sparkles,
  Send,
  Wrench,
  Package,
  ShieldCheck,
  Users,
  LayoutDashboard,
  ArrowUpRight,
  FileText,
  Copy,
  Check,
  Bus,
} from 'lucide-react'
import { Card, Badge, AIBadge, ReadyDot } from '../components/ui'
import { useToast } from '../components/Toast'

type Source = 'order' | 'parts' | 'warranty' | 'technicians' | 'command'
const SRC_META: Record<Source, { label: string; icon: typeof Wrench }> = {
  order: { label: 'Service Order Studio', icon: Wrench },
  parts: { label: 'Parts Intelligence', icon: Package },
  warranty: { label: 'Warranty & Repairs', icon: ShieldCheck },
  technicians: { label: 'Technicians & Scheduling', icon: Users },
  command: { label: 'Fixed Ops Command', icon: LayoutDashboard },
}

type Evidence = { source: Source; detail: string; value: string }
type Action = { label: string; to: string }
type Msg = { role: 'user' | 'beacon'; text: string; evidence?: Evidence[]; actions?: Action[] }
type Script = { q: string; a: Msg }

const SCRIPT: Script[] = [
  {
    q: 'How is Bus 118 tracking?',
    a: {
      role: 'beacon',
      text: 'Bus 118 is in warranty review and moving to parts. The A/C compressor is within Blue Bird coverage, so I drafted a claim to recover $1,420 instead of billing retail. The part is backordered in Tampa but in stock in Pompano, so a same-day transfer holds the Jul 24 ready date, 17 days ahead of first bell.',
      evidence: [
        { source: 'order', detail: 'Ready date', value: 'Jul 24' },
        { source: 'warranty', detail: 'Recoverable', value: '$1,420' },
        { source: 'parts', detail: 'Compressor', value: 'Transfer' },
      ],
      actions: [{ label: 'Open Service Order', to: '/order' }],
    },
  },
  {
    q: 'Which buses are at risk before back-to-school?',
    a: {
      role: 'beacon',
      text: 'Across the 5 districts, 18 buses are down and 34 more are at risk with 28 days to first bell. Broward is the sharpest, 5 down. I have sequenced the repairs and parts so all 5 clear by Aug 04 if they are scheduled this week.',
      evidence: [
        { source: 'command', detail: 'Buses down', value: '18' },
        { source: 'command', detail: 'At risk', value: '34' },
      ],
      actions: [{ label: 'Open Fixed Ops Command', to: '/' }],
    },
  },
  {
    q: 'Draft a readiness brief for Hillsborough',
    a: {
      role: 'beacon',
      text: 'Done. I built a readiness brief for Hillsborough covering the buses that are down or at risk, the action that clears each one, and the projected all-ready date. It is in the panel on the right to review before you send it to the district.',
      evidence: [
        { source: 'command', detail: 'Hillsborough fleet', value: '148 buses' },
        { source: 'order', detail: 'Buses needing work', value: '4' },
      ],
      actions: [{ label: 'Review the brief', to: '/copilot' }],
    },
  },
  {
    q: 'How much warranty are we leaving on the table?',
    a: {
      role: 'beacon',
      text: 'Right now $1,530 across 3 repairs is eligible under Blue Bird coverage but not yet claimed, and would be written off as retail if it ships. That is on top of $86k already recovered this month, up 22%.',
      evidence: [
        { source: 'warranty', detail: 'Eligible, unclaimed', value: '$1,530' },
        { source: 'warranty', detail: 'Recovered MTD', value: '$86k' },
      ],
      actions: [{ label: 'Open Warranty & Repairs', to: '/warranty' }],
    },
  },
  {
    q: 'Can we cover parts for the open orders?',
    a: {
      role: 'beacon',
      text: 'Fill rate is 94% and most open orders are covered. Two parts are the gap: the Bus 118 compressor, which a Pompano transfer solves, and the Bus 214 lift actuator, which I sourced from a partner dealer with next-day freight.',
      evidence: [
        { source: 'parts', detail: 'Same-day fill rate', value: '94%' },
        { source: 'parts', detail: 'Backorders', value: '2' },
      ],
      actions: [{ label: 'Open Parts Intelligence', to: '/parts' }],
    },
  },
]

function EvidenceRow({ e }: { e: Evidence }) {
  const m = SRC_META[e.source]
  const Icon = m.icon
  return (
    <div className="flex items-center gap-2 rounded-lg border border-line bg-surface px-2.5 py-1.5">
      <Icon className="h-3.5 w-3.5 shrink-0 text-amber-deep" />
      <span className="min-w-0 flex-1 truncate text-[11px] text-ink-soft">
        <span className="font-600 text-ink">{m.label}</span> · {e.detail}
      </span>
      <span className="shrink-0 rounded bg-amber-tint px-1.5 py-0.5 text-[10.5px] font-600 tabular text-amber-deep">{e.value}</span>
    </div>
  )
}

function ChatMsg({ m, onAction }: { m: Msg; onAction: (to: string) => void }) {
  if (m.role === 'user') {
    return (
      <div className="flex justify-end">
        <div className="max-w-[80%] rounded-2xl rounded-br-sm bg-amber px-3.5 py-2 text-[13px] text-white">{m.text}</div>
      </div>
    )
  }
  return (
    <div className="flex gap-2.5">
      <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-beacon-tint">
        <Sparkles className="h-3.5 w-3.5 text-beacon" />
      </div>
      <div className="min-w-0 flex-1 space-y-2.5">
        <div className="rounded-2xl rounded-tl-sm border border-line bg-surface px-3.5 py-2.5 text-[13px] leading-relaxed text-ink">
          {m.text}
        </div>
        {m.evidence && (
          <div className="space-y-1.5">
            <div className="px-1 text-[9.5px] font-600 uppercase tracking-[0.16em] text-ink-faint">Grounded in</div>
            {m.evidence.map((e, i) => <EvidenceRow key={i} e={e} />)}
          </div>
        )}
        {m.actions && (
          <div className="flex flex-wrap gap-2">
            {m.actions.map((a) => (
              <button
                key={a.label}
                onClick={() => onAction(a.to)}
                className="inline-flex items-center gap-1 rounded-lg border border-amber/40 bg-amber-wash px-2.5 py-1 text-[11.5px] font-600 text-amber-deep transition hover:bg-amber-tint"
              >
                {a.label}
                <ArrowUpRight className="h-3.5 w-3.5" />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export function Copilot({ onNavigate }: { onNavigate?: (to: string) => void }) {
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: 'beacon',
      text: "Hi Chris, I'm Beacon. Ask me anything across service orders, parts, warranty, technicians, and fleet readiness. I answer with the evidence I used, and I can draft readiness briefs and repair plans.",
    },
    { role: 'user', text: SCRIPT[0].q },
    SCRIPT[0].a,
  ])
  const [asked, setAsked] = useState<number[]>([0])
  const [input, setInput] = useState('')
  const remaining = SCRIPT.map((s, i) => ({ s, i })).filter((x) => !asked.includes(x.i))

  function ask(i: number) {
    setMessages((prev) => [...prev, { role: 'user', text: SCRIPT[i].q }, SCRIPT[i].a])
    setAsked((prev) => [...prev, i])
  }
  function submitFree() {
    if (!input.trim()) return
    setMessages((prev) => [
      ...prev,
      { role: 'user', text: input.trim() },
      {
        role: 'beacon',
        text: 'I can answer that from your connected orders, parts, warranty, and technician data, and cite exactly what I used. Try one of the suggested questions to see a grounded response.',
      },
    ])
    setInput('')
  }

  return (
    <div className="mx-auto grid h-full max-w-[1180px] grid-cols-1 gap-5 lg:grid-cols-[1.35fr_1fr]">
      {/* Chat */}
      <Card pad={false} className="flex min-h-[72vh] flex-col overflow-hidden">
        <div className="flex items-center justify-between border-b border-line px-5 py-3.5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-beacon-tint">
              <Sparkles className="h-4 w-4 text-beacon" />
            </div>
            <div className="leading-tight">
              <div className="font-display text-[15px] font-600 text-ink">Beacon Copilot</div>
              <div className="text-[10.5px] text-ink-faint">Grounded in orders · parts · warranty · techs</div>
            </div>
          </div>
          <AIBadge label="Beacon AI" />
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto px-5 py-4">
          {messages.map((m, i) => (
            <ChatMsg key={i} m={m} onAction={(to) => onNavigate?.(to)} />
          ))}
        </div>

        {remaining.length > 0 && (
          <div className="flex flex-wrap gap-2 border-t border-line px-5 pt-3">
            {remaining.map(({ s, i }) => (
              <button
                key={i}
                onClick={() => ask(i)}
                className="rounded-full border border-line bg-canvas px-3 py-1.5 text-[11.5px] font-500 text-ink-soft transition hover:border-beacon/40 hover:text-beacon-deep"
              >
                {s.q}
              </button>
            ))}
          </div>
        )}

        <div className="flex items-center gap-2 px-5 py-3">
          <div className="flex flex-1 items-center gap-2 rounded-lg border border-line bg-canvas px-3 py-2">
            <Sparkles className="h-4 w-4 text-beacon" />
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && submitFree()}
              placeholder="Ask about a bus, a part, or readiness…"
              className="flex-1 bg-transparent text-[13px] text-ink outline-none placeholder:text-ink-faint"
            />
          </div>
          <button onClick={submitFree} className="btn-amber flex h-9 w-9 items-center justify-center rounded-lg text-white transition">
            <Send className="h-4 w-4" />
          </button>
        </div>
      </Card>

      {/* Readiness brief artifact */}
      <ReadinessBrief />
    </div>
  )
}

const BRIEF_BUSES = [
  { unit: 'Bus 118', state: 'atrisk' as const, issue: 'A/C compressor', action: 'Warranty + Pompano transfer', ready: 'Jul 24' },
  { unit: 'Bus 145', state: 'atrisk' as const, issue: 'Door actuator motor', action: 'Warranty claim, Bay 5', ready: 'Jul 22' },
  { unit: 'Bus 09', state: 'down' as const, issue: 'Coolant leak', action: 'Parts in stock, schedule Bay 4', ready: 'Jul 25' },
  { unit: 'Bus 133', state: 'down' as const, issue: 'Brake actuator', action: 'Mobile tech, Tue', ready: 'Jul 21' },
]

function ReadinessBrief() {
  const [copied, setCopied] = useState(false)
  const toast = useToast()
  return (
    <Card pad={false} className="flex h-fit flex-col overflow-hidden border-beacon/20">
      <div className="flex items-center justify-between border-b border-beacon/15 bg-beacon-wash px-5 py-3">
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-beacon" />
          <h2 className="font-display text-[15px] font-600 text-ink">Fleet Readiness Brief</h2>
        </div>
        <Badge tone="beacon">Generated · just now</Badge>
      </div>

      <div className="space-y-4 px-5 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-ink"><Bus className="h-5 w-5 text-amber" /></div>
            <div>
              <div className="font-display text-[16px] font-600 text-ink">Hillsborough County</div>
              <div className="text-[10.5px] tabular text-ink-faint">148 buses serviced · 28 days to first bell</div>
            </div>
          </div>
          <Badge tone="warn">89% ready</Badge>
        </div>

        {/* readiness summary bar */}
        <div>
          <div className="flex h-3 w-full overflow-hidden rounded-full bg-mist">
            <div className="bg-go" style={{ width: '88%' }} />
            <div className="bg-amber" style={{ width: '8%' }} />
            <div className="bg-risk" style={{ width: '4%' }} />
          </div>
          <div className="mt-1.5 flex justify-between text-[10.5px] text-ink-faint">
            <span className="inline-flex items-center gap-1"><ReadyDot state="ready" /> 131 ready</span>
            <span className="inline-flex items-center gap-1"><ReadyDot state="atrisk" /> 11 at risk</span>
            <span className="inline-flex items-center gap-1"><ReadyDot state="down" /> 6 down</span>
          </div>
        </div>

        <div>
          <div className="mb-1.5 text-[9.5px] font-600 uppercase tracking-[0.16em] text-ink-faint">Buses needing work</div>
          <div className="space-y-1.5">
            {BRIEF_BUSES.map((b) => (
              <div key={b.unit} className="flex items-center gap-2 rounded-lg border border-line px-3 py-2">
                <ReadyDot state={b.state} />
                <div className="min-w-0 flex-1">
                  <div className="text-[12px] font-600 text-ink">{b.unit} · {b.issue}</div>
                  <div className="text-[10px] text-ink-faint">{b.action}</div>
                </div>
                <span className="shrink-0 text-[11px] font-600 tabular text-go-deep">{b.ready}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg bg-beacon-wash px-3 py-2 text-[11.5px] leading-relaxed text-ink-soft">
          Scheduled this week, all 4 clear by <span className="font-600 text-ink">Jul 25</span>, putting Hillsborough at
          100% ready 16 days before first bell.
        </div>
      </div>

      <div className="flex items-center gap-2 border-t border-line px-5 py-3">
        <button
          onClick={() => {
            setCopied(true)
            toast('Readiness brief copied to clipboard', 'go')
          }}
          className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-line bg-surface px-3 py-2 text-[12px] font-600 text-ink-soft transition hover:border-amber/50 hover:text-amber-deep"
        >
          {copied ? <Check className="h-3.5 w-3.5 text-go" /> : <Copy className="h-3.5 w-3.5" />}
          {copied ? 'Copied' : 'Copy'}
        </button>
        <button
          onClick={() => toast('Readiness brief sent to Hillsborough County transportation', 'beacon')}
          className="btn-beacon inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-[12px] font-600 text-white transition"
        >
          <FileText className="h-3.5 w-3.5" /> Send to district
        </button>
      </div>
    </Card>
  )
}
