import { ThermodynamicState, ThermodynamicCycle, CycleType, FluidProperties, ChartPoint } from '@/types/thermodynamics';
import { createMemoizedFunction, pvDiagramCache, tsDiagramCache, cycleCalculationCache } from '@/utils/calculation-cache';

// Standard fluids
export const FLUIDS: Record<string, FluidProperties> = {
  air: { name: 'Air', R: 0.287, gamma: 1.4, cp: 1.005, cv: 0.718 },
  nitrogen: { name: 'Nitrogen', R: 0.2968, gamma: 1.4, cp: 1.039, cv: 0.743 },
  helium: { name: 'Helium', R: 2.077, gamma: 1.667, cp: 5.193, cv: 3.116 },
  argon: { name: 'Argon', R: 0.2081, gamma: 1.667, cp: 0.5203, cv: 0.3122 },
};

// Calculate ideal gas properties
export function calculateIdealGasState(
  T: number,
  P: number,
  fluid: FluidProperties
): ThermodynamicState {
  const V = (fluid.R * T) / P;
  const H = fluid.cp * T;
  const U = fluid.cv * T;
  const S = fluid.cp * Math.log(T / 298) - fluid.R * Math.log(P / 101.325);
  
  return {
    id: crypto.randomUUID(),
    name: '',
    temperature: T,
    pressure: P,
    volume: V,
    enthalpy: H,
    entropy: S,
    internalEnergy: U,
  };
}

// Generate Otto cycle states
export function generateOttoCycle(
  T1: number,
  P1: number,
  compressionRatio: number,
  heatAddition: number,
  fluid: FluidProperties
): ThermodynamicCycle {
  const gamma = fluid.gamma;
  
  // State 1: Initial state (BDC, after intake)
  const V1 = (fluid.R * T1) / P1;
  const state1: ThermodynamicState = {
    id: '1',
    name: 'State 1',
    temperature: T1,
    pressure: P1,
    volume: V1,
    enthalpy: fluid.cp * T1,
    entropy: fluid.cp * Math.log(T1 / 298) - fluid.R * Math.log(P1 / 101.325),
    internalEnergy: fluid.cv * T1,
  };

  // State 2: After isentropic compression (TDC)
  const V2 = V1 / compressionRatio;
  const T2 = T1 * Math.pow(compressionRatio, gamma - 1);
  const P2 = P1 * Math.pow(compressionRatio, gamma);
  const state2: ThermodynamicState = {
    id: '2',
    name: 'State 2',
    temperature: T2,
    pressure: P2,
    volume: V2,
    enthalpy: fluid.cp * T2,
    entropy: state1.entropy, // Isentropic
    internalEnergy: fluid.cv * T2,
  };

  // State 3: After constant volume heat addition
  const T3 = T2 + heatAddition / fluid.cv;
  const P3 = P2 * (T3 / T2);
  const state3: ThermodynamicState = {
    id: '3',
    name: 'State 3',
    temperature: T3,
    pressure: P3,
    volume: V2,
    enthalpy: fluid.cp * T3,
    entropy: state2.entropy + fluid.cv * Math.log(T3 / T2),
    internalEnergy: fluid.cv * T3,
  };

  // State 4: After isentropic expansion (BDC)
  const V4 = V1;
  const T4 = T3 / Math.pow(compressionRatio, gamma - 1);
  const P4 = P3 / Math.pow(compressionRatio, gamma);
  const state4: ThermodynamicState = {
    id: '4',
    name: 'State 4',
    temperature: T4,
    pressure: P4,
    volume: V4,
    enthalpy: fluid.cp * T4,
    entropy: state3.entropy, // Isentropic
    internalEnergy: fluid.cv * T4,
  };

  // Calculate cycle performance
  const heatIn = fluid.cv * (T3 - T2);
  const heatOut = fluid.cv * (T4 - T1);
  const netWork = heatIn - heatOut;
  const efficiency = 1 - 1 / Math.pow(compressionRatio, gamma - 1);

  return {
    id: crypto.randomUUID(),
    name: 'Otto Cycle',
    type: 'otto',
    states: [state1, state2, state3, state4],
    processes: [],
    efficiency: efficiency * 100,
    netWork,
    heatIn,
    heatOut,
  };
}

// Generate Brayton cycle states
export function generateBraytonCycle(
  T1: number,
  P1: number,
  pressureRatio: number,
  T3: number,
  fluid: FluidProperties
): ThermodynamicCycle {
  const gamma = fluid.gamma;
  
  // State 1: Compressor inlet
  const state1: ThermodynamicState = calculateIdealGasState(T1, P1, fluid);
  state1.id = '1';
  state1.name = 'State 1';

  // State 2: After isentropic compression
  const P2 = P1 * pressureRatio;
  const T2 = T1 * Math.pow(pressureRatio, (gamma - 1) / gamma);
  const state2: ThermodynamicState = calculateIdealGasState(T2, P2, fluid);
  state2.id = '2';
  state2.name = 'State 2';
  state2.entropy = state1.entropy;

  // State 3: After combustion (turbine inlet)
  const P3 = P2;
  const state3: ThermodynamicState = calculateIdealGasState(T3, P3, fluid);
  state3.id = '3';
  state3.name = 'State 3';

  // State 4: After isentropic expansion
  const P4 = P1;
  const T4 = T3 / Math.pow(pressureRatio, (gamma - 1) / gamma);
  const state4: ThermodynamicState = calculateIdealGasState(T4, P4, fluid);
  state4.id = '4';
  state4.name = 'State 4';
  state4.entropy = state3.entropy;

  // Calculate cycle performance
  const heatIn = fluid.cp * (T3 - T2);
  const heatOut = fluid.cp * (T4 - T1);
  const netWork = heatIn - heatOut;
  const efficiency = 1 - Math.pow(1 / pressureRatio, (gamma - 1) / gamma);

  return {
    id: crypto.randomUUID(),
    name: 'Brayton Cycle',
    type: 'brayton',
    states: [state1, state2, state3, state4],
    processes: [],
    efficiency: efficiency * 100,
    netWork,
    heatIn,
    heatOut,
  };
}

// Generate Diesel cycle states
export function generateDieselCycle(
  T1: number,
  P1: number,
  compressionRatio: number,
  cutoffRatio: number,
  fluid: FluidProperties
): ThermodynamicCycle {
  const gamma = fluid.gamma;
  
  const V1 = (fluid.R * T1) / P1;
  
  // State 1
  const state1: ThermodynamicState = {
    id: '1',
    name: 'State 1',
    temperature: T1,
    pressure: P1,
    volume: V1,
    enthalpy: fluid.cp * T1,
    entropy: fluid.cp * Math.log(T1 / 298) - fluid.R * Math.log(P1 / 101.325),
    internalEnergy: fluid.cv * T1,
  };

  // State 2: After isentropic compression
  const V2 = V1 / compressionRatio;
  const T2 = T1 * Math.pow(compressionRatio, gamma - 1);
  const P2 = P1 * Math.pow(compressionRatio, gamma);
  const state2: ThermodynamicState = {
    id: '2',
    name: 'State 2',
    temperature: T2,
    pressure: P2,
    volume: V2,
    enthalpy: fluid.cp * T2,
    entropy: state1.entropy,
    internalEnergy: fluid.cv * T2,
  };

  // State 3: After constant pressure heat addition
  const V3 = V2 * cutoffRatio;
  const T3 = T2 * cutoffRatio;
  const P3 = P2;
  const state3: ThermodynamicState = {
    id: '3',
    name: 'State 3',
    temperature: T3,
    pressure: P3,
    volume: V3,
    enthalpy: fluid.cp * T3,
    entropy: state2.entropy + fluid.cp * Math.log(cutoffRatio),
    internalEnergy: fluid.cv * T3,
  };

  // State 4: After isentropic expansion
  const expansionRatio = compressionRatio / cutoffRatio;
  const V4 = V1;
  const T4 = T3 / Math.pow(expansionRatio, gamma - 1);
  const P4 = P3 / Math.pow(expansionRatio, gamma);
  const state4: ThermodynamicState = {
    id: '4',
    name: 'State 4',
    temperature: T4,
    pressure: P4,
    volume: V4,
    enthalpy: fluid.cp * T4,
    entropy: state3.entropy,
    internalEnergy: fluid.cv * T4,
  };

  const heatIn = fluid.cp * (T3 - T2);
  const heatOut = fluid.cv * (T4 - T1);
  const netWork = heatIn - heatOut;
  const efficiency = 1 - (1 / Math.pow(compressionRatio, gamma - 1)) * 
    ((Math.pow(cutoffRatio, gamma) - 1) / (gamma * (cutoffRatio - 1)));

  return {
    id: crypto.randomUUID(),
    name: 'Diesel Cycle',
    type: 'diesel',
    states: [state1, state2, state3, state4],
    processes: [],
    efficiency: efficiency * 100,
    netWork,
    heatIn,
    heatOut,
  };
}

// Generate Carnot cycle
export function generateCarnotCycle(
  TH: number,
  TL: number,
  P1: number,
  fluid: FluidProperties
): ThermodynamicCycle {
  const efficiency = (1 - TL / TH) * 100;
  
  const state1 = calculateIdealGasState(TL, P1, fluid);
  state1.id = '1';
  state1.name = 'State 1';
  
  const state2 = calculateIdealGasState(TL, P1 * 2, fluid);
  state2.id = '2';
  state2.name = 'State 2';
  
  const state3 = calculateIdealGasState(TH, P1 * 4, fluid);
  state3.id = '3';
  state3.name = 'State 3';
  
  const state4 = calculateIdealGasState(TH, P1 * 2, fluid);
  state4.id = '4';
  state4.name = 'State 4';

  return {
    id: crypto.randomUUID(),
    name: 'Carnot Cycle',
    type: 'carnot',
    states: [state1, state2, state3, state4],
    processes: [],
    efficiency,
    netWork: 0,
    heatIn: 0,
    heatOut: 0,
  };
}

// Generate P-V diagram points
export const generatePVPoints = createMemoizedFunction(
  (cycle: ThermodynamicCycle): ChartPoint[] => {
    if (!cycle || !cycle.states || cycle.states.length === 0) {
      return [];
    }
    
    const points: ChartPoint[] = [];
    const states = cycle.states;
    
    for (let i = 0; i < states.length; i++) {
      const current = states[i];
      const next = states[(i + 1) % states.length];
      
      points.push({ x: current.volume, y: current.pressure, state: current.name });
      
      // Generate intermediate points for curved processes
      const numPoints = 20;
      for (let j = 1; j < numPoints; j++) {
        const t = j / numPoints;
        
        if (cycle.type === 'otto' || cycle.type === 'diesel') {
          if (i === 0 || i === 2) {
            // Isentropic process
            const gamma = 1.4;
            const V = current.volume * Math.pow(current.pressure / 
              (current.pressure + t * (next.pressure - current.pressure)), 1 / gamma);
            const P = current.pressure * Math.pow(current.volume / V, gamma);
            points.push({ x: V, y: P });
          } else {
            // Linear interpolation for isochoric/isobaric
            points.push({
              x: current.volume + t * (next.volume - current.volume),
              y: current.pressure + t * (next.pressure - current.pressure),
            });
          }
        } else {
          // Default linear interpolation
          points.push({
            x: current.volume + t * (next.volume - current.volume),
            y: current.pressure + t * (next.pressure - current.pressure),
          });
        }
      }
    }
    
    // Close the cycle
    points.push({ x: states[0].volume, y: states[0].pressure, state: states[0].name });
    
    return points;
  },
  pvDiagramCache
);

// Generate T-S diagram points
export const generateTSPoints = createMemoizedFunction(
  (cycle: ThermodynamicCycle): ChartPoint[] => {
    if (!cycle || !cycle.states || cycle.states.length === 0) {
      return [];
    }
    
    const points: ChartPoint[] = [];
    const states = cycle.states;
    
    for (let i = 0; i < states.length; i++) {
      const current = states[i];
      const next = states[(i + 1) % states.length];
      
      points.push({ x: current.entropy, y: current.temperature, state: current.name });
      
      const numPoints = 20;
      for (let j = 1; j < numPoints; j++) {
        const t = j / numPoints;
        points.push({
          x: current.entropy + t * (next.entropy - current.entropy),
          y: current.temperature + t * (next.temperature - current.temperature),
        });
      }
    }
    
    points.push({ x: states[0].entropy, y: states[0].temperature, state: states[0].name });
    
    return points;
  },
  tsDiagramCache
);

export function formatValue(value: number, decimals: number = 2): string {
  if (Math.abs(value) >= 1000) {
    return value.toExponential(decimals);
  }
  return value.toFixed(decimals);
}
