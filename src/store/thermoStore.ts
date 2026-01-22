import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CycleType, FluidProperties, ThermodynamicCycle } from '@/types/thermodynamics';
import { FLUIDS } from '@/lib/thermodynamics';

interface ThermoState {
  // Core parameters
  cycleType: CycleType;
  fluid: FluidProperties;
  parameters: {
    T1: number;
    P1: number;
    compressionRatio: number;
    heatAddition: number;
    pressureRatio: number;
    T3: number;
    cutoffRatio: number;
  };
  
  // Derived state
  cycle: ThermodynamicCycle | null;
  isLoading: boolean;
  
  // Actions
  setCycleType: (cycleType: CycleType) => void;
  setFluid: (fluid: FluidProperties) => void;
  setParameter: (key: string, value: number) => void;
  setParameters: (params: Partial<typeof initialState.parameters>) => void;
  setCycle: (cycle: ThermodynamicCycle) => void;
  setLoading: (loading: boolean) => void;
  resetParameters: () => void;
}

const initialState = {
  cycleType: 'otto' as CycleType,
  fluid: FLUIDS.air,
  parameters: {
    T1: 300,
    P1: 100,
    compressionRatio: 8,
    heatAddition: 1000,
    pressureRatio: 10,
    T3: 1200,
    cutoffRatio: 2,
  },
  cycle: null,
  isLoading: false,
};

export const useThermoStore = create<ThermoState>()(
  persist(
    (set, get) => ({
      ...initialState,
      
      setCycleType: (cycleType) => set({ cycleType }),
      
      setFluid: (fluid) => set({ fluid }),
      
      setParameter: (key, value) => 
        set((state) => ({
          parameters: { ...state.parameters, [key]: value }
        })),
      
      setParameters: (newParams) =>
        set((state) => ({
          parameters: { ...state.parameters, ...newParams }
        })),
      
      setCycle: (cycle) => set({ cycle }),
      
      setLoading: (isLoading) => set({ isLoading }),
      
      resetParameters: () => set({ parameters: initialState.parameters }),
    }),
    {
      name: 'thermoviz-storage',
      partialize: (state) => ({ 
        cycleType: state.cycleType,
        fluid: state.fluid,
        parameters: state.parameters 
      }),
    }
  )
);