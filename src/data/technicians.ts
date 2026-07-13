// Technician roster, shop-bay board, and mobile dispatch across both branches.

export type Tech = {
  name: string
  initials: string
  branch: 'Tampa' | 'Pompano Beach'
  mode: 'shop' | 'mobile'
  certs: string[]
  assignment: string
  utilization: number
}
export const TECHS: Tech[] = [
  { name: 'Marcus Delgado', initials: 'MD', branch: 'Tampa', mode: 'shop', certs: ['HVAC', 'Lift systems'], assignment: 'Bus 118 · Bay 3', utilization: 88 },
  { name: 'Renee Ford', initials: 'RF', branch: 'Tampa', mode: 'shop', certs: ['Brakes', 'DOT inspector'], assignment: 'Bus 07 · Bay 1', utilization: 82 },
  { name: 'Hector Ramos', initials: 'HR', branch: 'Pompano Beach', mode: 'shop', certs: ['Powertrain'], assignment: 'Bus 61 · Bay 2', utilization: 91 },
  { name: 'Tyrell Owens', initials: 'TO', branch: 'Tampa', mode: 'mobile', certs: ['Electrical', 'Mobile'], assignment: 'Mobile · Brandon', utilization: 74 },
  { name: 'Sofia Nunez', initials: 'SN', branch: 'Tampa', mode: 'mobile', certs: ['Lift systems', 'Mobile'], assignment: 'Available', utilization: 61 },
  { name: 'Dwayne Pierce', initials: 'DP', branch: 'Pompano Beach', mode: 'shop', certs: ['HVAC', 'Brakes'], assignment: 'Bus 44 · Bay 4', utilization: 79 },
]

export type Bay = { bay: number; unit?: string; ro?: string; tech?: string; job?: string }
export const TAMPA_BAYS: Bay[] = [
  { bay: 1, unit: 'Bus 07', ro: 'RO-4468', tech: 'R. Ford', job: 'Brakes' },
  { bay: 2, unit: 'Bus 302', ro: 'RO-4455', tech: 'R. Ford', job: 'PM inspect' },
  { bay: 3, unit: 'Bus 118', ro: 'RO-4471', tech: 'M. Delgado', job: 'A/C' },
  { bay: 4 },
  { bay: 5, unit: 'Bus 145', ro: 'RO-4472', tech: 'M. Delgado', job: 'Door motor' },
  { bay: 6, unit: 'Bus 203', ro: 'RO-4470', tech: 'T. Owens', job: 'Wiper' },
  { bay: 7, unit: 'Bus 91', ro: 'RO-4463', tech: 'R. Ford', job: 'Sensor' },
  { bay: 8 },
]
export const POMPANO_BAYS: Bay[] = [
  { bay: 1, unit: 'Bus 61', ro: 'RO-4450', tech: 'H. Ramos', job: 'DPF' },
  { bay: 2, unit: 'Bus 44', ro: 'RO-4461', tech: 'D. Pierce', job: 'HVAC' },
  { bay: 3, unit: 'Bus 129', ro: 'RO-4457', tech: 'H. Ramos', job: 'Brakes' },
  { bay: 4 },
  { bay: 5, unit: 'Bus 210', ro: 'RO-4452', tech: 'D. Pierce', job: 'Glass' },
  { bay: 6 },
]

export type MobileRun = {
  tech: string
  area: string
  stops: number
  miles: number
  status: 'in progress' | 'proposed'
  note: string
}
export const MOBILE_RUNS: MobileRun[] = [
  { tech: 'Tyrell Owens', area: 'Brandon', stops: 2, miles: 24, status: 'in progress', note: 'Electrical + PM at 2 Hillsborough depots.' },
  { tech: 'Sofia Nunez', area: 'Dade City', stops: 3, miles: 42, status: 'proposed', note: 'Beacon batched 3 Pasco requests into one Thursday run.' },
]

export type TechAction = {
  id: string
  title: string
  detail: string
  tone: 'beacon' | 'warn'
  impact: string
}
export const TECH_ACTIONS: TechAction[] = [
  {
    id: 'TA-1',
    title: 'Batch 3 Dade City requests into one mobile run',
    detail: 'Three Pasco requests sit within 6 miles. One dispatch with Sofia (lift-certified) Thursday covers all three.',
    tone: 'beacon',
    impact: 'Saves 2.5 hrs drive time',
  },
  {
    id: 'TA-2',
    title: 'Rebalance Pompano load off Hector',
    detail: 'Hector is at 91% with two powertrain jobs stacked. Move the Bus 129 brake job to Dwayne to protect the promise.',
    tone: 'warn',
    impact: 'Prevents a Pompano bottleneck',
  },
]
