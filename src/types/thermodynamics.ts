export interface ThermodynamicState {
  id: string;
  name: string;
  temperature: number; // K
  pressure: number; // kPa
  volume: number; // m³/kg
  enthalpy: number; // kJ/kg
  entropy: number; // kJ/kg·K
  internalEnergy: number; // kJ/kg
}

export interface ThermodynamicProcess {
  id: string;
  name: string;
  type: ProcessType;
  startState: ThermodynamicState;
  endState: ThermodynamicState;
  work: number; // kJ/kg
  heat: number; // kJ/kg
  entropyChange: number; // kJ/kg·K
}

export type ProcessType = 'isothermal' | 'isobaric' | 'isochoric' | 'isentropic' | 'polytropic';

export type CycleType = 'otto' | 'diesel' | 'rankine' | 'brayton' | 'carnot' | 'refrigeration';

export interface ThermodynamicCycle {
  id: string;
  name: string;
  type: CycleType;
  states: ThermodynamicState[];
  processes: ThermodynamicProcess[];
  efficiency: number;
  netWork: number;
  heatIn: number;
  heatOut: number;
  entropyGeneration?: number;
  exergy?: number;
  quality?: number;
  gibbsFreeEnergy?: number;
  helmholtzFreeEnergy?: number;
}

export interface FluidProperties {
  name: string;
  R: number; // Gas constant kJ/kg·K
  gamma: number; // Specific heat ratio
  cp: number; // kJ/kg·K
  cv: number; // kJ/kg·K
}

export interface SimulationConfig {
  fluid: FluidProperties;
  cycle: CycleType;
  parameters: Record<string, number>;
}

export interface ChartPoint {
  x: number;
  y: number;
  state?: string;
}

export type DiagramType = 'pv' | 'ts' | 'ph';
