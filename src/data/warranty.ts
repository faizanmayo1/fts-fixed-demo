// Blue Bird warranty claim tracking + recovery.

export type ClaimStatus = 'eligible' | 'pending' | 'submitted' | 'approved' | 'paid'
export const CLAIM_META: Record<ClaimStatus, { label: string; tone: 'beacon' | 'warn' | 'steel' | 'amber' | 'go' }> = {
  eligible: { label: 'Eligible', tone: 'beacon' },
  pending: { label: 'Pending', tone: 'warn' },
  submitted: { label: 'Submitted', tone: 'steel' },
  approved: { label: 'Approved', tone: 'amber' },
  paid: { label: 'Paid', tone: 'go' },
}

export type Claim = {
  id: string
  unit: string
  customer: string
  component: string
  amount: number
  status: ClaimStatus
  agedDays: number
  branch: 'Tampa' | 'Pompano Beach'
  flagged?: boolean // Beacon caught this before retail billing
}

export const CLAIMS: Claim[] = [
  // Recovery opportunities Beacon caught before they were billed retail
  { id: 'WC-2210', unit: 'Bus 88', customer: 'Broward County', component: 'Alternator', amount: 680, status: 'eligible', agedDays: 3, branch: 'Pompano Beach', flagged: true },
  { id: 'WC-2208', unit: 'Bus 145', customer: 'Hillsborough County', component: 'Door actuator motor', amount: 540, status: 'eligible', agedDays: 5, branch: 'Tampa', flagged: true },
  { id: 'WC-2205', unit: 'Bus 203', customer: 'Pinellas County', component: 'Wiper motor', amount: 310, status: 'eligible', agedDays: 2, branch: 'Tampa', flagged: true },
  // In-flight
  { id: 'WC-2214', unit: 'Bus 118', customer: 'Hillsborough County', component: 'A/C compressor assembly', amount: 1420, status: 'pending', agedDays: 1, branch: 'Tampa', flagged: true },
  { id: 'WC-2201', unit: 'Bus 214', customer: 'Pasco County', component: 'Braun lift actuator', amount: 890, status: 'submitted', agedDays: 4, branch: 'Tampa' },
  { id: 'WC-2196', unit: 'Bus 61', customer: 'Broward County', component: 'DPF / emissions', amount: 2140, status: 'approved', agedDays: 6, branch: 'Pompano Beach' },
  // Recently paid
  { id: 'WC-2182', unit: 'Bus 12', customer: 'Polk County', component: 'Fuel injector set', amount: 1980, status: 'paid', agedDays: 12, branch: 'Tampa' },
  { id: 'WC-2177', unit: 'Bus 77', customer: 'Hillsborough County', component: 'Turbocharger', amount: 2450, status: 'paid', agedDays: 15, branch: 'Tampa' },
]

export const PIPELINE: { status: ClaimStatus; count: number; value: number }[] = [
  { status: 'eligible', count: 3, value: 1530 },
  { status: 'pending', count: 1, value: 1420 },
  { status: 'submitted', count: 1, value: 890 },
  { status: 'approved', count: 1, value: 2140 },
  { status: 'paid', count: 24, value: 86000 },
]

export type RecoveryPoint = { month: string; amount: number }
export const RECOVERY_TREND: RecoveryPoint[] = [
  { month: 'Feb', amount: 52 },
  { month: 'Mar', amount: 58 },
  { month: 'Apr', amount: 64 },
  { month: 'May', amount: 71 },
  { month: 'Jun', amount: 79 },
  { month: 'Jul', amount: 86 },
]
