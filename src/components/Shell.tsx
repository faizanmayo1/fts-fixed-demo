import { type ReactNode, useState, useEffect } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  Wrench,
  Package,
  ShieldCheck,
  Users,
  MessageSquareText,
  Search,
  CalendarClock,
} from 'lucide-react'
import { cn, BusMark } from './ui'
import { CommandPalette } from './CommandPalette'
import { CLIENT } from '../data/ops'

const NAV: {
  to: string
  label: string
  icon: typeof LayoutDashboard
  end?: boolean
  ai?: boolean
  hero?: boolean
}[] = [
  { to: '/', label: 'Fixed Ops Command', icon: LayoutDashboard, end: true },
  { to: '/order', label: 'Service Order Studio', icon: Wrench, hero: true },
  { to: '/parts', label: 'Parts Intelligence', icon: Package },
  { to: '/warranty', label: 'Warranty & Repairs', icon: ShieldCheck },
  { to: '/technicians', label: 'Technicians & Scheduling', icon: Users },
  { to: '/copilot', label: 'Beacon Copilot', icon: MessageSquareText, ai: true },
]

export function Shell({ children }: { children: ReactNode }) {
  const loc = useLocation()
  const current = NAV.find((n) => (n.end ? loc.pathname === n.to : loc.pathname.startsWith(n.to)))
  const [paletteOpen, setPaletteOpen] = useState(false)

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setPaletteOpen((o) => !o)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <div className="flex h-screen w-full overflow-hidden bg-canvas text-ink">
      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />
      {/* Sidebar */}
      <aside className="flex w-[248px] shrink-0 flex-col border-r border-line bg-surface">
        <div className="flex items-center gap-2.5 px-5 py-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-ink">
            <BusMark size={22} tone="amber" />
          </div>
          <div className="leading-tight">
            <div className="font-display text-[16px] font-700 tracking-tight text-ink">FTS</div>
            <div className="text-[10.5px] text-ink-faint">Fixed Operations Intelligence</div>
          </div>
        </div>

        <div className="px-3 pb-1">
          <button
            onClick={() => setPaletteOpen(true)}
            className="flex w-full items-center gap-2 rounded-lg border border-line bg-canvas px-3 py-2 text-[12.5px] text-ink-faint transition hover:border-amber/40 hover:text-ink"
          >
            <Search className="h-3.5 w-3.5" />
            <span>Search buses, orders…</span>
            <span className="ml-auto text-[10px] tabular text-ink-faint">⌘K</span>
          </button>
        </div>

        <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-3">
          {NAV.map((n) => {
            const Icon = n.icon
            return (
              <NavLink
                key={n.to}
                to={n.to}
                end={n.end}
                className={({ isActive }) =>
                  cn(
                    'group flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] font-450 transition',
                    isActive ? 'bg-amber-tint text-amber-deep' : 'text-ink-soft hover:bg-mist hover:text-ink',
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon className={cn('h-4 w-4 shrink-0', isActive ? 'text-amber-deep' : 'text-ink-faint')} strokeWidth={2} />
                    <span className="truncate">{n.label}</span>
                    {n.hero && (
                      <span className="ml-auto rounded bg-amber-tint px-1 py-0.5 text-[9px] font-600 uppercase tracking-wide text-amber-deep">
                        Hero
                      </span>
                    )}
                    {n.ai && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-beacon" title="AI" />}
                  </>
                )}
              </NavLink>
            )
          })}
        </nav>

        <div className="mx-3 mb-3 rounded-lg border border-line bg-canvas p-3">
          <div className="flex items-center gap-2 text-[11.5px] font-550 text-ink">
            <CalendarClock className="h-3.5 w-3.5 text-amber-deep" />
            Back-to-school · {CLIENT.daysToBTS} days
          </div>
          <div className="mt-1 flex items-center gap-1.5 text-[10.5px] text-ink-faint">
            <span className="h-1.5 w-1.5 animate-pulse-soft rounded-full bg-go" />
            Blue Bird dealer since {CLIENT.since}
          </div>
        </div>

        <div className="border-t border-line px-4 py-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-amber text-[11px] font-700 text-white">AM</div>
            <div className="leading-tight">
              <div className="text-[12px] font-550 text-ink">{CLIENT.rep} · CodeUpscale</div>
              <div className="text-[10px] text-ink-faint">Solutions partner</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-14 shrink-0 items-center gap-4 border-b border-line bg-surface/80 px-6 backdrop-blur">
          <div className="font-display text-[16px] font-600 leading-none text-ink">
            {current ? current.label : 'Fixed Ops Command'}
          </div>
          <div className="ml-auto flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-full border border-line bg-canvas px-3 py-1.5">
              <span className="text-[11px] text-ink-faint">Dealer</span>
              <span className="text-[12px] font-550 text-ink">{CLIENT.full}</span>
              <span className="rounded bg-amber-tint px-1.5 py-0.5 text-[10px] font-600 text-amber-deep">FL</span>
            </div>
          </div>
        </header>

        <main className="roadgrid flex-1 overflow-y-auto px-6 py-5">{children}</main>
      </div>
    </div>
  )
}
