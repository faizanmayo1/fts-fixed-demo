// Organization + command-center data for FTS Fixed Operations Intelligence.

export const CLIENT = {
  name: 'FTS',
  full: 'Florida Transportation Systems',
  rep: 'Adnan',
  since: 1983,
  backToSchool: 'Aug 10, 2026',
  daysToBTS: 28,
}

export type Kpi = {
  label: string
  value: string
  sub: string
  accent: 'ink' | 'amber' | 'beacon' | 'steel' | 'go' | 'warn' | 'risk'
  trend?: string
}
export const KPIS: Kpi[] = [
  { label: 'Open service orders', value: '63', sub: '14 urgent · 2 branches', accent: 'amber' },
  { label: 'Avg days to ready', value: '4.8', sub: 'cycle time, down from 6.2', accent: 'go', trend: '-1.4 d' },
  { label: 'Parts fill rate', value: '94%', sub: 'same-day, in-stock', accent: 'steel', trend: '+3 pts' },
  { label: 'Warranty recovery · MTD', value: '$86k', sub: 'Beacon-flagged claims', accent: 'beacon', trend: '+22%' },
]

// Fleet readiness by district (buses FTS services), ahead of back-to-school.
export type District = {
  name: string
  fleet: number
  ready: number
  atrisk: number
  down: number
}
export const READINESS: District[] = [
  { name: 'Hillsborough County', fleet: 148, ready: 131, atrisk: 11, down: 6 },
  { name: 'Broward County', fleet: 110, ready: 97, atrisk: 8, down: 5 },
  { name: 'Pinellas County', fleet: 96, ready: 88, atrisk: 5, down: 3 },
  { name: 'Polk County', fleet: 84, ready: 79, atrisk: 4, down: 1 },
  { name: 'Pasco County', fleet: 72, ready: 63, atrisk: 6, down: 3 },
]

export type Branch = { name: string; bays: number; baysActive: number; techs: number; mobile: number }
export const BRANCHES: Branch[] = [
  { name: 'Tampa', bays: 8, baysActive: 7, techs: 11, mobile: 3 },
  { name: 'Pompano Beach', bays: 6, baysActive: 5, techs: 8, mobile: 2 },
]

export type Alert = {
  id: string
  kind: 'warranty' | 'parts' | 'readiness' | 'mobile'
  ref: string
  title: string
  detail: string
  tag: string
  tone: 'beacon' | 'risk' | 'warn' | 'amber'
  cta: string
}
export const ALERTS: Alert[] = [
  {
    id: 'AL-1',
    kind: 'warranty',
    ref: 'Bus 118 · RO-4471',
    title: 'Warranty recovery ready to submit',
    detail: 'A/C compressor is within Blue Bird coverage. Beacon drafted the claim to recover $1,420 in parts and labor before it is written off as retail.',
    tag: '$1,420',
    tone: 'beacon',
    cta: 'Open service order',
  },
  {
    id: 'AL-2',
    kind: 'parts',
    ref: 'Bus 214 · RO-4459',
    title: 'Backordered part blocks a down bus',
    detail: 'Braun lift actuator is on backorder and Pasco Bus 214 is down. Beacon found one at a partner dealer with next-day freight to hold the Jul 16 promise.',
    tag: 'Down bus',
    tone: 'risk',
    cta: 'Review sourcing',
  },
  {
    id: 'AL-3',
    kind: 'readiness',
    ref: 'Broward County',
    title: 'Back-to-school readiness at risk',
    detail: '5 Broward buses are down with 28 days to first bell. Beacon sequenced the repairs and parts to clear all 5 by Aug 04 if scheduled this week.',
    tag: '28 days',
    tone: 'amber',
    cta: 'Open readiness',
  },
  {
    id: 'AL-4',
    kind: 'mobile',
    ref: 'Pasco County · Dade City',
    title: 'Batch 3 requests into one mobile run',
    detail: 'Three open requests sit within 6 miles near Dade City. Beacon suggests a single mobile dispatch Thursday, saving about 2.5 hours of drive time.',
    tag: 'Efficiency',
    tone: 'warn',
    cta: 'Plan mobile run',
  },
]
