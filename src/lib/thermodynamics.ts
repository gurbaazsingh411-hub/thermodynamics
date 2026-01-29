import { ThermodynamicState, ThermodynamicCycle, CycleType, FluidProperties, ChartPoint } from '@/types/thermodynamics';
import { createMemoizedFunction, pvDiagramCache, tsDiagramCache, cycleCalculationCache } from '@/utils/calculation-cache';

// Standard fluids
export const FLUIDS: Record<string, FluidProperties> = {
  air: { name: 'Air', R: 0.287, gamma: 1.4, cp: 1.005, cv: 0.718 },
  nitrogen: { name: 'Nitrogen', R: 0.2968, gamma: 1.4, cp: 1.039, cv: 0.743 },
  helium: { name: 'Helium', R: 2.077, gamma: 1.667, cp: 5.193, cv: 3.116 },
  argon: { name: 'Argon', R: 0.2081, gamma: 1.667, cp: 0.5203, cv: 0.3122 },
  water: { name: 'Water', R: 0.4615, gamma: 1.33, cp: 1.872, cv: 1.41 },
  r134a: { name: 'R134a', R: 0.08149, gamma: 1.12, cp: 0.852, cv: 0.771 },
};

// Steam property calculations
export function calculateSteamProperties(
  T: number,
  P: number,
  quality: number = 0
): ThermodynamicState {
  // Simplified steam table approximation
  // In a real implementation, this would use IAPWS-IF97 or similar
  let h, s, v, u;
  
  if (quality >= 0 && quality <= 1) {
    // Two-phase region
    const hf = 4.1868 * T; // Approximation for saturated liquid
    const hg = 2500 + 4.1868 * T; // Approximation for saturated vapor
    const sf = 0.01 * T; // Approximation
    const sg = 8.5 - 0.005 * T; // Approximation
    const vf = 0.001003; // m³/kg
    const vg = 4.433 * Math.exp(-0.0001 * P); // Approximation
    
    h = hf + quality * (hg - hf);
    s = sf + quality * (sg - sf);
    v = vf + quality * (vg - vf);
    u = h - P * v; // u = h - Pv
  } else {
    // Superheated vapor or subcooled liquid
    if (T > getSaturationTemp(P)) {
      // Superheated
      h = 1.872 * T + 2000; // Approximation
      s = 1.872 * Math.log(T / 273.15) + 0.1; // Approximation
      v = (0.4615 * T) / P; // Ideal gas approximation
      u = h - P * v;
    } else {
      // Subcooled liquid
      h = 4.1868 * T; // Sensible heat
      s = 4.1868 * Math.log(T / 273.15);
      v = 0.001003; // Incompressible liquid
      u = h - P * v;
    }
  }
  
  return {
    id: crypto.randomUUID(),
    name: '',
    temperature: T,
    pressure: P,
    volume: v,
    enthalpy: h,
    entropy: s,
    internalEnergy: u,
  };
}

// Helper function to get saturation temperature
function getSaturationTemp(P: number): number {
  // Simplified Antoine equation approximation
  // log10(P) = A - B/(T+C) where P is in kPa
  const A = 8.14019;
  const B = 1810.94;
  const C = 244.485;
  
  return B / (A - Math.log10(P)) - C;
}

// Real gas correction factor (simplified van der Waals)
export function calculateRealGasFactor(
  T: number,
  P: number,
  criticalTemp: number,
  criticalPress: number
): number {
  const reducedTemp = T / criticalTemp;
  const reducedPress = P / criticalPress;
  
  // Simplified compressibility factor approximation
  // Z = 1 + (B/VmRT) where B is second virial coefficient
  const B = 0.08664 * criticalPress * Math.pow(criticalTemp, 2.5) / Math.pow(T, 2.5);
  const Z = 1 + (B * P) / (0.08314 * T); // Using R in bar·L/(mol·K)
  
  return Math.max(0.5, Math.min(1.5, Z)); // Limit to reasonable range
}

// Calculate entropy generation for irreversible processes
export function calculateEntropyGeneration(
  states: ThermodynamicState[],
  heatTransfers: number[],
  ambientTemp: number
): number {
  let totalEntropyGen = 0;
  
  for (let i = 0; i < states.length - 1; i++) {
    const deltaS = states[i + 1].entropy - states[i].entropy;
    const heatTransfer = heatTransfers[i] || 0;
    const entropyTransfer = heatTransfer / ambientTemp;
    
    // Entropy generation = entropy change - entropy transfer
    const entropyGen = deltaS - entropyTransfer;
    totalEntropyGen += Math.max(0, entropyGen); // Only positive for irreversible
  }
  
  return totalEntropyGen;
}

// Exergy analysis functions
export function calculateExergy(
  state: ThermodynamicState,
  envTemp: number,
  envPress: number
): number {
  const R = state.volume * state.pressure / state.temperature; // Gas constant
  
  // Physical exergy: [h - h0 - T0(s - s0)]
  const envState = calculateIdealGasState(envTemp, envPress, {
    name: 'air', R, gamma: 1.4, cp: state.enthalpy/state.temperature, cv: state.internalEnergy/state.temperature
  });
  
  const physicalExergy = (state.enthalpy - envState.enthalpy) - 
                        envTemp * (state.entropy - envState.entropy);
  
  return Math.max(0, physicalExergy);
}

// Calculate state properties with real gas correction
export function calculateRealGasState(
  T: number,
  P: number,
  fluid: FluidProperties
): ThermodynamicState {
  // Apply real gas correction
  const Z = calculateRealGasFactor(T, P, 132.5, 37.7); // Critical properties for air
  const V = (Z * fluid.R * T) / P; // V = ZRT/P
  
  // Adjust other properties based on real gas behavior
  const H = fluid.cp * T; // Enthalpy is weakly dependent on pressure
  const U = fluid.cv * T; // Internal energy depends on temperature
  const S = fluid.cp * Math.log(T / 298) - fluid.R * Math.log(P / 101.325) + 
        fluid.R * Math.log(Z); // Include compressibility effect
  
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

// Calculate state properties with ideal gas
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

// Calculate Gibbs free energy
export function calculateGibbsFreeEnergy(state: ThermodynamicState): number {
  // G = H - TS
  return state.enthalpy - state.temperature * state.entropy;
}
// Calculate Helmholtz free energy
export function calculateHelmholtzFreeEnergy(state: ThermodynamicState): number {
  // A = U - TS
  return state.internalEnergy - state.temperature * state.entropy;
}

// Generate Otto cycle states
export function generateOttoCycle(
  T1: number,
  P1: number,
  compressionRatio: number,
  heatAddition: number,
  fluid: FluidProperties,
  useRealGas: boolean = false
): ThermodynamicCycle {
  const gamma = fluid.gamma;
  
  // State 1: Initial state (BDC, after intake)
  const calcState = useRealGas ? calculateRealGasState : calculateIdealGasState;
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

  // Calculate entropy generation
  const entropyGen = calculateEntropyGeneration(
    [state1, state2, state3, state4],
    [0, heatIn, 0, -heatOut],
    298 // Ambient temp in K
  );

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
  fluid: FluidProperties,
  useRealGas: boolean = false
): ThermodynamicCycle {
  const gamma = fluid.gamma;
  
  const calcState = useRealGas ? calculateRealGasState : calculateIdealGasState;
  
  // State 1: Compressor inlet
  const state1: ThermodynamicState = calcState(T1, P1, fluid);
  state1.id = '1';
  state1.name = 'State 1';

  // State 2: After isentropic compression
  const P2 = P1 * pressureRatio;
  const T2 = T1 * Math.pow(pressureRatio, (gamma - 1) / gamma);
  const state2: ThermodynamicState = calcState(T2, P2, fluid);
  state2.id = '2';
  state2.name = 'State 2';
  state2.entropy = state1.entropy;

  // State 3: After combustion (turbine inlet)
  const P3 = P2;
  const state3: ThermodynamicState = calcState(T3, P3, fluid);
  state3.id = '3';
  state3.name = 'State 3';

  // State 4: After isentropic expansion
  const P4 = P1;
  const T4 = T3 / Math.pow(pressureRatio, (gamma - 1) / gamma);
  const state4: ThermodynamicState = calcState(T4, P4, fluid);
  state4.id = '4';
  state4.name = 'State 4';
  state4.entropy = state3.entropy;

  // Calculate cycle performance
  const heatIn = fluid.cp * (T3 - T2);
  const heatOut = fluid.cp * (T4 - T1);
  const netWork = heatIn - heatOut;
  const efficiency = 1 - Math.pow(1 / pressureRatio, (gamma - 1) / gamma);

  // Calculate entropy generation
  const entropyGen = calculateEntropyGeneration(
    [state1, state2, state3, state4],
    [0, 0, heatIn, -heatOut],
    298 // Ambient temp in K
  );

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
  fluid: FluidProperties,
  useRealGas: boolean = false
): ThermodynamicCycle {
  const gamma = fluid.gamma;
  
  const calcState = useRealGas ? calculateRealGasState : calculateIdealGasState;
  
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

  // Calculate entropy generation
  const entropyGen = calculateEntropyGeneration(
    [state1, state2, state3, state4],
    [0, 0, heatIn, -heatOut],
    298 // Ambient temp in K
  );

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
  fluid: FluidProperties,
  useRealGas: boolean = false
): ThermodynamicCycle {
  const efficiency = (1 - TL / TH) * 100;
  
  const calcState = useRealGas ? calculateRealGasState : calculateIdealGasState;
  
  const state1 = calcState(TL, P1, fluid);
  state1.id = '1';
  state1.name = 'State 1';
  
  // Calculate adiabatic compression to TH
  const P2 = P1 * Math.pow(TH/TL, fluid.gamma/(fluid.gamma-1));
  const state2 = calcState(TH, P2, fluid);
  state2.id = '2';
  state2.name = 'State 2';
  
  // Adiabatic expansion back to P1
  const P4 = P1;
  const state4 = calcState(TL, P4, fluid);
  state4.id = '4';
  state4.name = 'State 4';
  
  // Calculate state 3 from isothermal heat addition at TH
  const P3 = P2 * Math.exp(-(state2.entropy - state1.entropy) / (fluid.R)); // Isentropic relation corrected
  const state3 = calcState(TH, P3, fluid);
  state3.entropy = state2.entropy + fluid.R * Math.log(P2/P3);
  state3.id = '3';
  state3.name = 'State 3';

  // Calculate entropy generation
  const carnotHeatIn = TH * (state3.entropy - state2.entropy); // Heat added at TH
  const carnotHeatOut = TL * (state1.entropy - state4.entropy); // Heat rejected at TL
  const entropyGen = calculateEntropyGeneration(
    [state1, state2, state3, state4],
    [-carnotHeatOut, 0, carnotHeatIn, 0], // Heat transfers in each process
    298 // Ambient temp in K
  );

  // Calculate work and heat for Carnot cycle
  const carnotNetWork = carnotHeatIn - carnotHeatOut;
  
  return {
    id: crypto.randomUUID(),
    name: 'Carnot Cycle',
    type: 'carnot',
    states: [state1, state2, state3, state4],
    processes: [],
    efficiency,
    netWork: carnotNetWork,
    heatIn: carnotHeatIn,
    heatOut: carnotHeatOut,
  };
}

// Generate Rankine cycle
export function generateRankineCycle(
  boilerPressure: number,
  condenserPressure: number,
  turbineInletTemp: number,
  pumpEfficiency: number = 0.8,
  turbineEfficiency: number = 0.85,
  fluid: FluidProperties = FLUIDS.water,
  useRealGas: boolean = false
): ThermodynamicCycle {
  // State 1: Saturated liquid at condenser pressure
  const T_sat_cond = getSaturationTemp(condenserPressure);
  const state1 = calculateSteamProperties(T_sat_cond, condenserPressure, 0);
  state1.id = '1';
  state1.name = 'Condensate Exit';
  
  // State 2: Compressed liquid after pump (real)
  const workPumpIdeal = (boilerPressure - condenserPressure) * state1.volume;
  const workPumpActual = workPumpIdeal / pumpEfficiency;
  const h2 = state1.enthalpy + workPumpActual;
  
  // Assuming incompressible liquid, v2 ≈ v1
  const state2 = { ...state1 };
  state2.id = '2';
  state2.name = 'Boiler Inlet';
  state2.enthalpy = h2;
  state2.pressure = boilerPressure;
  
  // State 3: Superheated steam at turbine inlet
  const state3 = calculateSteamProperties(turbineInletTemp, boilerPressure);
  state3.id = '3';
  state3.name = 'Turbine Inlet';
  
  // State 4: After isentropic expansion in turbine (real)
  // First calculate isentropic state
  const s_isen = state3.entropy;
  
  // Find quality at condenser pressure with same entropy
  const T_sat_boil = getSaturationTemp(boilerPressure);
  const s_f = 0.01 * T_sat_cond;  // Saturated liquid entropy
  const s_g = 8.5 - 0.005 * condenserPressure;  // Saturated vapor entropy
  
  let quality_out = (s_isen - s_f) / (s_g - s_f);
  quality_out = Math.max(0, Math.min(1, quality_out));
  
  const state4_isen = calculateSteamProperties(T_sat_cond, condenserPressure, quality_out);
  
  // Actual state considering turbine efficiency
  const h_isen = state4_isen.enthalpy;
  const h4_actual = state3.enthalpy - turbineEfficiency * (state3.enthalpy - h_isen);
  
  // Find actual quality at exit
  const h_f = 4.1868 * T_sat_cond;
  const h_g = 2500 + 4.1868 * T_sat_cond;
  const quality_actual = (h4_actual - h_f) / (h_g - h_f);
  
  const state4 = calculateSteamProperties(T_sat_cond, condenserPressure, quality_actual);
  state4.id = '4';
  state4.name = 'Condenser Inlet';
  state4.enthalpy = h4_actual;
  
  // Calculate cycle performance
  const heatIn = state3.enthalpy - state2.enthalpy;
  const workTurbine = turbineEfficiency * (state3.enthalpy - state4.enthalpy); // Account for turbine efficiency
  const workPump = state2.enthalpy - state1.enthalpy;
  const netWork = workTurbine - workPump;
  const efficiency = (netWork / heatIn) * 100;
  
  // Calculate entropy generation
  const entropyGen = calculateEntropyGeneration(
    [state1, state2, state3, state4],
    [0, 0, heatIn, -(state4.enthalpy - state1.enthalpy)],
    298 // Ambient temp in K
  );

  return {
    id: crypto.randomUUID(),
    name: 'Rankine Cycle',
    type: 'rankine',
    states: [state1, state2, state3, state4],
    processes: [],
    efficiency,
    netWork,
    heatIn,
    heatOut: state4.enthalpy - state1.enthalpy,
  };
}

// Generate Vapor Compression Refrigeration cycle
export function generateRefrigerationCycle(
  evaporatorTemp: number,
  condenserTemp: number,
  superheat: number = 5,
  subcool: number = 5,
  compressorEfficiency: number = 0.8,
  fluid: FluidProperties = FLUIDS.argon, // Using argon as refrigerant substitute
  useRealGas: boolean = false
): ThermodynamicCycle {
  const evaporatorPressure = Math.pow(10, (8.14019 - 1810.94 / (evaporatorTemp + 244.485))) * 100; // Converting from kPa to Pa
  const condenserPressure = Math.pow(10, (8.14019 - 1810.94 / (condenserTemp + 244.485))) * 100;
  
  // State 1: Saturated vapor at evaporator
  const state1 = calculateSteamProperties(evaporatorTemp, evaporatorPressure, 1);
  state1.id = '1';
  state1.name = 'Compressor Inlet';
  
  // State 2: After compression (actual)
  const T2_isen = condenserTemp + 20; // Estimate for isentropic discharge temp
  const state2_isen = calculateSteamProperties(T2_isen, condenserPressure, 0.9); // Superheated
  
  const workCompIdeal = state2_isen.enthalpy - state1.enthalpy;
  const workCompActual = workCompIdeal / compressorEfficiency;
  const h2_actual = state1.enthalpy + workCompActual;
  
  // Estimate T for given enthalpy
  const T2_actual = (h2_actual - 2000) / 1.872; // Reversing our approximation
  const state2 = calculateSteamProperties(T2_actual, condenserPressure);
  state2.id = '2';
  state2.name = 'Condenser Inlet';
  
  // State 3: Subcooled liquid at condenser
  const state3 = calculateSteamProperties(condenserTemp - subcool, condenserPressure, 0);
  state3.id = '3';
  state3.name = 'Expansion Valve Inlet';
  
  // State 4: After throttling (constant enthalpy)
  const state4 = { ...state3 };
  state4.id = '4';
  state4.name = 'Evaporator Inlet';
  state4.pressure = evaporatorPressure;
  
  // Calculate quality after expansion
  const hf = 4.1868 * evaporatorTemp;
  const hg = 2500 + 4.1868 * evaporatorTemp;
  const quality_after_expansion = (state3.enthalpy - hf) / (hg - hf);
  
  const state4_quality = Math.max(0, Math.min(1, quality_after_expansion));
  Object.assign(state4, calculateSteamProperties(evaporatorTemp, evaporatorPressure, state4_quality));
  
  // Calculate cycle performance
  const heatAbsorbed = state1.enthalpy - state4.enthalpy;
  const workInput = workCompActual;
  const COP = heatAbsorbed / workInput;
  
  // Calculate entropy generation
  const entropyGen = calculateEntropyGeneration(
    [state1, state2, state3, state4],
    [heatAbsorbed, 0, -(state2.enthalpy - state3.enthalpy), 0],
    298 // Ambient temp in K
  );

  return {
    id: crypto.randomUUID(),
    name: 'Vapor Compression Refrigeration Cycle',
    type: 'refrigeration',
    states: [state1, state2, state3, state4],
    processes: [],
    efficiency: COP, // COP for refrigeration cycle
    netWork: workInput,
    heatIn: heatAbsorbed, // Heat absorbed in evaporator
    heatOut: state2.enthalpy - state3.enthalpy, // Heat rejected in condenser
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

// Efficiency calculations for different cycles
export const calculateOttoEfficiency = (compressionRatio: number, gamma: number): number => {
  return (1 - 1 / Math.pow(compressionRatio, gamma - 1)) * 100;
};

export const calculateDieselEfficiency = (compressionRatio: number, cutoffRatio: number, gamma: number): number => {
  const term = Math.pow(compressionRatio, gamma - 1);
  return (1 - (1 / term) * (Math.pow(cutoffRatio, gamma) - 1) / (gamma * (cutoffRatio - 1))) * 100;
};

export const calculateBraytonEfficiency = (pressureRatio: number, gamma: number): number => {
  return (1 - 1 / Math.pow(pressureRatio, (gamma - 1) / gamma)) * 100;
};

export const calculateCarnotEfficiency = (th: number, tc: number): number => {
  return (1 - tc / th) * 100;
};

export const calculateRankineEfficiency = (
  turbineInletTemp: number, 
  condenserTemp: number, 
  turbineEfficiency: number = 0.85
): number => {
  // Simplified Rankine efficiency calculation
  // In reality, this would involve calculating all states
  const T_hot = turbineInletTemp;
  const T_cold = condenserTemp;
  
  // Theoretical Carnot efficiency
  const carnotEfficiency = (1 - T_cold / T_hot) * 100;
  
  // Actual Rankine is typically lower due to irreversibilities
  // This is a simplified approximation
  return carnotEfficiency * 0.6; // Typical Rankine is ~60% of Carnot
};

export const calculateRefrigerationCOP = (evaporatorTemp: number, condenserTemp: number): number => {
  // COP for ideal refrigeration cycle
  // Note: temperatures in Kelvin
  const tk_evap = evaporatorTemp + 273.15;
  const tk_cond = condenserTemp + 273.15;
  
  // Ideal COP for refrigeration cycle
  const idealCOP = tk_evap / (tk_cond - tk_evap);
  
  // Actual COP is typically lower due to irreversibilities
  return idealCOP * 0.7; // Assume 70% of ideal COP
};

// Calculate efficiency for different cycles
export const calculateEfficiency = (cycleType: string, params: any): number => {
  switch (cycleType) {
    case 'Otto':
      return calculateOttoEfficiency(params.compressionRatio, params.gamma);
    case 'Diesel':
      return calculateDieselEfficiency(params.compressionRatio, params.cutoffRatio, params.gamma);
    case 'Brayton':
      return calculateBraytonEfficiency(params.pressureRatio, params.gamma);
    case 'Carnot':
      return calculateCarnotEfficiency(params.th, params.tc);
    case 'Rankine':
      return calculateRankineEfficiency(params.turbineInletTemp, params.condenserTemp, params.turbineEfficiency);
    case 'Refrigeration':
      return calculateRefrigerationCOP(params.evaporatorTemp, params.condenserTemp);
    default:
      return 0;
  }
};
