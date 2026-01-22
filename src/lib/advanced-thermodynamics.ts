import { ThermodynamicState, ThermodynamicCycle } from '@/types/thermodynamics';
import { FluidProperties } from '@/types/thermodynamics';

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

// Calculate state properties based on real gas behavior
export function calculateStateWithRealGasEffect(
  T: number,
  P: number,
  fluid: FluidProperties
): ThermodynamicState {
  const isRealGas = fluid.name.toLowerCase().includes('real');
  if (isRealGas) {
    return calculateRealGasState(T, P, fluid);
  }
  return calculateIdealGasState(T, P, fluid);
}

// Calculate quality for two-phase mixtures
export function calculateQuality(
  state: ThermodynamicState,
  saturatedLiquid: ThermodynamicState,
  saturatedVapor: ThermodynamicState
): number {
  if (state.enthalpy <= saturatedLiquid.enthalpy) {
    return 0; // Subcooled liquid
  } else if (state.enthalpy >= saturatedVapor.enthalpy) {
    return 1; // Superheated vapor
  } else {
    // Two-phase region
    return (state.enthalpy - saturatedLiquid.enthalpy) / 
           (saturatedVapor.enthalpy - saturatedLiquid.enthalpy);
  }
}