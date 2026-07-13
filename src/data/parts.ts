// Parts availability across the Tampa and Pompano Beach warehouses.
// Demand is aggregated from open service orders; status is Beacon-derived.

export type PartStatus = 'healthy' | 'reorder' | 'transfer' | 'backorder'
export const PSTATUS_META: Record<PartStatus, { label: string; tone: 'go' | 'warn' | 'beacon' | 'risk' }> = {
  healthy: { label: 'Healthy', tone: 'go' },
  reorder: { label: 'Reorder', tone: 'warn' },
  transfer: { label: 'Transfer', tone: 'beacon' },
  backorder: { label: 'Backorder', tone: 'risk' },
}

export type Part = {
  number: string
  name: string
  category: string
  tampa: number
  pompano: number
  onOrder: number
  reorder: number
  demand: number // units required by open orders
  unitPrice: number
  status: PartStatus
}

export const PARTS: Part[] = [
  { number: '10054321', name: 'A/C compressor assembly', category: 'A/C', tampa: 0, pompano: 2, onOrder: 2, reorder: 2, demand: 3, unitPrice: 940, status: 'transfer' },
  { number: '10061140', name: 'Braun lift actuator', category: 'Lift systems', tampa: 0, pompano: 0, onOrder: 1, reorder: 1, demand: 2, unitPrice: 640, status: 'backorder' },
  { number: '10044390', name: 'DPF filter', category: 'Emissions', tampa: 1, pompano: 2, onOrder: 0, reorder: 1, demand: 2, unitPrice: 1180, status: 'healthy' },
  { number: '10077881', name: 'Brake shoe set', category: 'Brakes', tampa: 8, pompano: 5, onOrder: 0, reorder: 4, demand: 4, unitPrice: 186, status: 'healthy' },
  { number: '10033215', name: 'DEF quality sensor', category: 'Emissions', tampa: 3, pompano: 1, onOrder: 0, reorder: 3, demand: 2, unitPrice: 312, status: 'reorder' },
  { number: '10021884', name: 'Warning light / lens', category: 'Electrical', tampa: 46, pompano: 38, onOrder: 0, reorder: 20, demand: 9, unitPrice: 58, status: 'healthy' },
  { number: '10030770', name: 'Windshield glass', category: 'Glass', tampa: 6, pompano: 4, onOrder: 0, reorder: 3, demand: 2, unitPrice: 410, status: 'healthy' },
  { number: '10014520', name: 'Door control switch', category: 'Electrical', tampa: 2, pompano: 9, onOrder: 0, reorder: 6, demand: 5, unitPrice: 74, status: 'reorder' },
]

export function totalOnHand(p: Part) {
  return p.tampa + p.pompano
}

export type Warehouse = { name: string; skus: number; fillRate: number; value: number; sqft: string }
export const WAREHOUSES: Warehouse[] = [
  { name: 'Tampa', skus: 2140, fillRate: 94, value: 1180000, sqft: '~4,000 sqft' },
  { name: 'Pompano Beach', skus: 1760, fillRate: 91, value: 862000, sqft: 'branch stock' },
]

export type PartAction = {
  id: string
  title: string
  detail: string
  ref: string
  tone: 'beacon' | 'risk' | 'warn'
  impact: string
}
export const PART_ACTIONS: PartAction[] = [
  {
    id: 'PA-1',
    title: 'Transfer A/C compressor, Pompano to Tampa',
    detail: 'Same-day SAIA freight covers Bus 118. Tampa is at zero with 3 units of open demand.',
    ref: 'Bus 118 · RO-4471',
    tone: 'beacon',
    impact: 'Holds Jul 24 ready date',
  },
  {
    id: 'PA-2',
    title: 'Source Braun lift actuator from partner dealer',
    detail: 'Zero on hand at both branches and one down bus waiting. Next-day freight beats the supplier backorder.',
    ref: 'Bus 214 · RO-4459',
    tone: 'risk',
    impact: 'Recovers a down bus',
  },
  {
    id: 'PA-3',
    title: 'Pre-order A/C and filter stock for back-to-school',
    detail: 'Beacon forecasts a demand spike in the next 3 weeks. Raising POs now avoids a mid-August stockout.',
    ref: 'Seasonal forecast',
    tone: 'warn',
    impact: 'Protects fill rate through peak',
  },
]
