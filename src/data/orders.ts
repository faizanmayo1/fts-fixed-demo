// Core fixed-operations data model for FTS. A "service order" (repair order)
// threads scheduling, warranty, parts, and technician coordination.
// The HERO order runs through Service Order Studio, Parts, Warranty, and Techs.

export type StageStatus = 'done' | 'active' | 'atrisk' | 'upcoming'
export type Stage = {
  key: string
  name: string
  status: StageStatus
  when: string
  note?: string
}

export type PartStatus = 'instock' | 'transfer' | 'backorder'
export type Part = {
  number: string
  name: string
  qty: number
  unitPrice: number
  status: PartStatus
  location: string
  flagged?: boolean
}

export type ReadyState = 'ready' | 'atrisk' | 'down'

export type Order = {
  id: string
  unit: string // bus fleet number
  model: string
  year: number
  busType: string // Type A/C/D
  customer: string // school district
  branch: 'Tampa' | 'Pompano Beach'
  complaint: string
  priority: 'routine' | 'high' | 'urgent'
  opened: string
  promised: string
  readyState: ReadyState
  serviceType: 'Warranty' | 'Retail' | 'PDI' | 'Recall'
  laborHours: number
  laborRate: number
  warranty: { eligible: boolean; component: string; recover: number; status: 'approved' | 'pending' | 'submitted' | 'none' }
  tech: { name: string; assignment: string; cert: string }
  stages: Stage[]
  parts: Part[]
}

export function partsCost(o: Order) {
  return o.parts.reduce((a, p) => a + p.unitPrice * p.qty, 0)
}
export function laborCost(o: Order) {
  return Math.round(o.laborHours * o.laborRate)
}
export function orderTotal(o: Order) {
  return partsCost(o) + laborCost(o)
}

// ── HERO ORDER - Hillsborough Bus 118, A/C failure before back-to-school ────
export const HERO: Order = {
  id: 'RO-4471',
  unit: 'Bus 118',
  model: 'Blue Bird Vision',
  year: 2022,
  busType: 'Type C',
  customer: 'Hillsborough County Public Schools',
  branch: 'Tampa',
  complaint: 'A/C not cooling, cabin over-temp; intermittent DEF warning lamp.',
  priority: 'urgent',
  opened: 'Jul 09, 2026',
  promised: 'Jul 24, 2026',
  readyState: 'atrisk',
  serviceType: 'Warranty',
  laborHours: 6.5,
  laborRate: 142,
  warranty: { eligible: true, component: 'A/C compressor assembly', recover: 1420, status: 'pending' },
  tech: { name: 'Marcus Delgado', assignment: 'Tampa · Bay 3', cert: 'HVAC certified' },
  stages: [
    { key: 's1', name: 'Request received', status: 'done', when: 'Jul 09', note: 'District portal request from Hillsborough transportation.' },
    { key: 's2', name: 'Triage & diagnosis', status: 'done', when: 'Jul 10', note: 'Compressor seized; DEF sensor fault code SPN 3364.' },
    { key: 's3', name: 'Warranty review', status: 'active', when: 'Jul 13', note: 'Beacon: compressor within Blue Bird coverage, recover $1,420.' },
    { key: 's4', name: 'Parts', status: 'atrisk', when: 'Jul 14', note: 'Compressor backordered in Tampa; available in Pompano.' },
    { key: 's5', name: 'Technician & repair', status: 'upcoming', when: 'Jul 16' },
    { key: 's6', name: 'QA & road test', status: 'upcoming', when: 'Jul 23' },
    { key: 's7', name: 'Ready for route', status: 'upcoming', when: 'Jul 24' },
  ],
  parts: [
    { number: '10054321', name: 'A/C compressor assembly', qty: 1, unitPrice: 940, status: 'transfer', location: 'Pompano Beach', flagged: true },
    { number: '10098776', name: 'Receiver-drier', qty: 1, unitPrice: 128, status: 'instock', location: 'Tampa' },
    { number: '10033215', name: 'DEF quality sensor', qty: 1, unitPrice: 312, status: 'instock', location: 'Tampa' },
    { number: '10011002', name: 'Refrigerant R-134a', qty: 3, unitPrice: 42, status: 'instock', location: 'Tampa' },
  ],
}

export const ORDERS: Order[] = [
  HERO,
  {
    id: 'RO-4468',
    unit: 'Bus 07',
    model: 'Blue Bird Vision',
    year: 2021,
    busType: 'Type C',
    customer: 'Pinellas County Schools',
    branch: 'Tampa',
    complaint: 'Brake warning lamp, spongy pedal at PM inspection.',
    priority: 'high',
    opened: 'Jul 08, 2026',
    promised: 'Jul 18, 2026',
    readyState: 'atrisk',
    serviceType: 'Retail',
    laborHours: 4,
    laborRate: 142,
    warranty: { eligible: false, component: 'Brake service', recover: 0, status: 'none' },
    tech: { name: 'Renee Ford', assignment: 'Tampa · Bay 1', cert: 'Brakes' },
    stages: [
      { key: 'a1', name: 'Request received', status: 'done', when: 'Jul 08' },
      { key: 'a2', name: 'Triage & diagnosis', status: 'done', when: 'Jul 09' },
      { key: 'a3', name: 'Parts', status: 'done', when: 'Jul 10' },
      { key: 'a4', name: 'Technician & repair', status: 'active', when: 'Jul 14' },
      { key: 'a5', name: 'QA & road test', status: 'upcoming', when: 'Jul 17' },
      { key: 'a6', name: 'Ready for route', status: 'upcoming', when: 'Jul 18' },
    ],
    parts: [{ number: '10077881', name: 'Brake shoe set', qty: 2, unitPrice: 186, status: 'instock', location: 'Tampa' }],
  },
  {
    id: 'RO-4459',
    unit: 'Bus 214',
    model: 'Micro Bird G5',
    year: 2023,
    busType: 'Type A',
    customer: 'Pasco County Schools',
    branch: 'Tampa',
    complaint: 'Wheelchair lift inoperative; hydraulic fault.',
    priority: 'high',
    opened: 'Jul 07, 2026',
    promised: 'Jul 16, 2026',
    readyState: 'down',
    serviceType: 'Warranty',
    laborHours: 5,
    laborRate: 142,
    warranty: { eligible: true, component: 'Braun lift actuator', recover: 890, status: 'submitted' },
    tech: { name: 'Marcus Delgado', assignment: 'Mobile · Dade City', cert: 'Lift systems' },
    stages: [
      { key: 'l1', name: 'Request received', status: 'done', when: 'Jul 07' },
      { key: 'l2', name: 'Triage & diagnosis', status: 'done', when: 'Jul 08' },
      { key: 'l3', name: 'Warranty review', status: 'done', when: 'Jul 09' },
      { key: 'l4', name: 'Parts', status: 'active', when: 'Jul 14' },
      { key: 'l5', name: 'Technician & repair', status: 'upcoming', when: 'Jul 15' },
      { key: 'l6', name: 'Ready for route', status: 'upcoming', when: 'Jul 16' },
    ],
    parts: [{ number: '10061140', name: 'Lift actuator', qty: 1, unitPrice: 640, status: 'backorder', location: 'Supplier', flagged: true }],
  },
  {
    id: 'RO-4455',
    unit: 'Bus 302',
    model: 'Blue Bird All American',
    year: 2020,
    busType: 'Type D',
    customer: 'Polk County Public Schools',
    branch: 'Tampa',
    complaint: 'Annual PM inspection + DOT safety.',
    priority: 'routine',
    opened: 'Jul 06, 2026',
    promised: 'Jul 15, 2026',
    readyState: 'ready',
    serviceType: 'PDI',
    laborHours: 3,
    laborRate: 142,
    warranty: { eligible: false, component: 'Inspection', recover: 0, status: 'none' },
    tech: { name: 'Renee Ford', assignment: 'Tampa · Bay 2', cert: 'DOT inspector' },
    stages: [
      { key: 'p1', name: 'Request received', status: 'done', when: 'Jul 06' },
      { key: 'p2', name: 'Inspection', status: 'done', when: 'Jul 12' },
      { key: 'p3', name: 'Ready for route', status: 'done', when: 'Jul 13' },
    ],
    parts: [{ number: '10020115', name: 'Wiper + filter kit', qty: 1, unitPrice: 74, status: 'instock', location: 'Tampa' }],
  },
  {
    id: 'RO-4450',
    unit: 'Bus 61',
    model: 'Blue Bird Vision',
    year: 2019,
    busType: 'Type C',
    customer: 'Broward County Public Schools',
    branch: 'Pompano Beach',
    complaint: 'Engine derate, DPF regeneration fault.',
    priority: 'urgent',
    opened: 'Jul 05, 2026',
    promised: 'Jul 17, 2026',
    readyState: 'down',
    serviceType: 'Warranty',
    laborHours: 8,
    laborRate: 142,
    warranty: { eligible: true, component: 'DPF / emissions', recover: 2140, status: 'approved' },
    tech: { name: 'Hector Ramos', assignment: 'Pompano · Bay 2', cert: 'Powertrain' },
    stages: [
      { key: 'e1', name: 'Request received', status: 'done', when: 'Jul 05' },
      { key: 'e2', name: 'Triage & diagnosis', status: 'done', when: 'Jul 06' },
      { key: 'e3', name: 'Warranty review', status: 'done', when: 'Jul 08' },
      { key: 'e4', name: 'Parts', status: 'done', when: 'Jul 10' },
      { key: 'e5', name: 'Technician & repair', status: 'active', when: 'Jul 14' },
      { key: 'e6', name: 'Ready for route', status: 'upcoming', when: 'Jul 17' },
    ],
    parts: [{ number: '10044390', name: 'DPF filter', qty: 1, unitPrice: 1180, status: 'instock', location: 'Pompano Beach' }],
  },
]
