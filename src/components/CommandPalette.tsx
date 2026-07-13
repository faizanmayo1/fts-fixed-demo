import { useState, useEffect, useMemo, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  Wrench,
  Package,
  ShieldCheck,
  Users,
  MessageSquareText,
  Bus,
  Search,
  CornerDownLeft,
} from 'lucide-react'
import { cn } from './ui'

type Item = { label: string; sub: string; to: string; icon: typeof Bus; keywords: string }
const ITEMS: Item[] = [
  { label: 'Fixed Ops Command', sub: 'Fleet readiness & KPIs', to: '/', icon: LayoutDashboard, keywords: 'home dashboard readiness overview' },
  { label: 'Service Order Studio', sub: 'Repair order pipeline', to: '/order', icon: Wrench, keywords: 'ro repair order service' },
  { label: 'Parts Intelligence', sub: 'Availability across warehouses', to: '/parts', icon: Package, keywords: 'parts inventory backorder transfer' },
  { label: 'Warranty & Repairs', sub: 'Blue Bird claim recovery', to: '/warranty', icon: ShieldCheck, keywords: 'warranty claim recovery blue bird' },
  { label: 'Technicians & Scheduling', sub: 'Bays & mobile dispatch', to: '/technicians', icon: Users, keywords: 'technician tech bay mobile schedule' },
  { label: 'Beacon Copilot', sub: 'Ask across your operation', to: '/copilot', icon: MessageSquareText, keywords: 'ai copilot beacon ask chat' },
  { label: 'Bus 118 · RO-4471', sub: 'A/C compressor · Hillsborough', to: '/order', icon: Bus, keywords: 'bus 118 hillsborough ac compressor hero' },
  { label: 'Warranty recovery queue', sub: '$1,530 eligible, unclaimed', to: '/warranty', icon: ShieldCheck, keywords: 'recovery eligible unclaimed money' },
  { label: 'Parts backorders', sub: 'Compressor & lift actuator', to: '/parts', icon: Package, keywords: 'backorder compressor actuator down bus' },
  { label: 'Dade City mobile run', sub: 'Beacon-batched, 3 stops', to: '/technicians', icon: Users, keywords: 'dade city mobile pasco batch dispatch' },
]

export function CommandPalette({ open, onClose }: { open: boolean; onClose: () => void }) {
  const navigate = useNavigate()
  const [q, setQ] = useState('')
  const [idx, setIdx] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  const results = useMemo(() => {
    const s = q.trim().toLowerCase()
    if (!s) return ITEMS
    return ITEMS.filter((it) => (it.label + ' ' + it.sub + ' ' + it.keywords).toLowerCase().includes(s))
  }, [q])

  useEffect(() => {
    if (open) {
      setQ('')
      setIdx(0)
      setTimeout(() => inputRef.current?.focus(), 20)
    }
  }, [open])

  useEffect(() => {
    setIdx(0)
  }, [q])

  if (!open) return null

  function go(to: string) {
    navigate(to)
    onClose()
  }

  function onKey(e: React.KeyboardEvent) {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setIdx((i) => Math.min(results.length - 1, i + 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setIdx((i) => Math.max(0, i - 1))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (results[idx]) go(results[idx].to)
    } else if (e.key === 'Escape') {
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 z-[90] flex items-start justify-center bg-ink/30 px-4 pt-[12vh] backdrop-blur-sm" onClick={onClose}>
      <div
        className="w-full max-w-[560px] overflow-hidden rounded-2xl border border-line bg-surface shadow-pop"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2.5 border-b border-line px-4 py-3">
          <Search className="h-4 w-4 text-ink-faint" />
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={onKey}
            placeholder="Search screens, buses, orders…"
            className="flex-1 bg-transparent text-[14px] text-ink outline-none placeholder:text-ink-faint"
          />
          <span className="rounded border border-line px-1.5 py-0.5 text-[10px] font-600 text-ink-faint">ESC</span>
        </div>
        <div className="max-h-[52vh] overflow-y-auto p-2">
          {results.length === 0 && <div className="px-3 py-6 text-center text-[13px] text-ink-faint">No matches</div>}
          {results.map((it, i) => {
            const Icon = it.icon
            return (
              <button
                key={it.label}
                onMouseEnter={() => setIdx(i)}
                onClick={() => go(it.to)}
                className={cn(
                  'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition',
                  i === idx ? 'bg-amber-tint' : 'hover:bg-canvas',
                )}
              >
                <span className={cn('flex h-8 w-8 shrink-0 items-center justify-center rounded-lg', i === idx ? 'bg-surface' : 'bg-canvas')}>
                  <Icon className={cn('h-4 w-4', i === idx ? 'text-amber-deep' : 'text-ink-faint')} />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[13px] font-600 text-ink">{it.label}</div>
                  <div className="truncate text-[11px] text-ink-faint">{it.sub}</div>
                </div>
                {i === idx && <CornerDownLeft className="h-3.5 w-3.5 text-ink-faint" />}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
