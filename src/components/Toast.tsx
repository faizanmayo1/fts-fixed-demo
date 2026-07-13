import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import { CheckCircle2, Sparkles, Info, X } from 'lucide-react'
import { cn } from './ui'

export type ToastTone = 'go' | 'beacon' | 'amber'
type Toast = { id: number; msg: string; tone: ToastTone }

let counter = 0
const ToastCtx = createContext<(msg: string, tone?: ToastTone) => void>(() => {})

export function useToast() {
  return useContext(ToastCtx)
}

const toneStyle: Record<ToastTone, { icon: typeof CheckCircle2; ring: string; fg: string }> = {
  go: { icon: CheckCircle2, ring: 'border-go/30', fg: 'text-go' },
  beacon: { icon: Sparkles, ring: 'border-beacon/30', fg: 'text-beacon' },
  amber: { icon: Info, ring: 'border-amber/40', fg: 'text-amber-deep' },
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const push = useCallback((msg: string, tone: ToastTone = 'go') => {
    const id = ++counter
    setToasts((t) => [...t, { id, msg, tone }])
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3400)
  }, [])

  const dismiss = (id: number) => setToasts((t) => t.filter((x) => x.id !== id))

  return (
    <ToastCtx.Provider value={push}>
      {children}
      <div className="pointer-events-none fixed bottom-5 right-5 z-[100] flex w-[340px] max-w-[calc(100vw-2.5rem)] flex-col gap-2">
        {toasts.map((t) => {
          const s = toneStyle[t.tone]
          const Icon = s.icon
          return (
            <div
              key={t.id}
              className={cn(
                'animate-rise pointer-events-auto flex items-start gap-2.5 rounded-xl border bg-surface px-3.5 py-3 shadow-pop',
                s.ring,
              )}
            >
              <Icon className={cn('mt-0.5 h-4 w-4 shrink-0', s.fg)} />
              <span className="flex-1 text-[12.5px] leading-snug text-ink">{t.msg}</span>
              <button onClick={() => dismiss(t.id)} className="shrink-0 text-ink-faint transition hover:text-ink">
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          )
        })}
      </div>
    </ToastCtx.Provider>
  )
}
