import { CycleType, FluidProperties } from '@/types/thermodynamics';
import { FLUIDS } from '@/lib/thermodynamics';

export interface CyclePreset {
  id: string;
  name: string;
  description: string;
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
  category: 'standard' | 'high-performance' | 'efficient' | 'custom';
  isDefault?: boolean;
}

export const DEFAULT_PRESETS: CyclePreset[] = [
  {
    id: 'otto-standard',
    name: 'Otto Cycle - Standard',
    description: 'Typical spark-ignition engine parameters',
    cycleType: 'otto',
    fluid: FLUIDS.air,
    parameters: {
      T1: 300,
      P1: 100,
      compressionRatio: 8,
      heatAddition: 1000,
      pressureRatio: 10,
      T3: 1200,
      cutoffRatio: 2
    },
    category: 'standard',
    isDefault: true
  },
  {
    id: 'otto-high-performance',
    name: 'Otto Cycle - High Performance',
    description: 'High compression ratio for maximum power',
    cycleType: 'otto',
    fluid: FLUIDS.air,
    parameters: {
      T1: 300,
      P1: 100,
      compressionRatio: 12,
      heatAddition: 1500,
      pressureRatio: 10,
      T3: 1500,
      cutoffRatio: 2
    },
    category: 'high-performance'
  },
  {
    id: 'otto-efficient',
    name: 'Otto Cycle - Fuel Efficient',
    description: 'Optimized for fuel economy',
    cycleType: 'otto',
    fluid: FLUIDS.air,
    parameters: {
      T1: 300,
      P1: 100,
      compressionRatio: 10,
      heatAddition: 800,
      pressureRatio: 10,
      T3: 1100,
      cutoffRatio: 2
    },
    category: 'efficient'
  },
  {
    id: 'diesel-standard',
    name: 'Diesel Cycle - Standard',
    description: 'Typical compression-ignition engine',
    cycleType: 'diesel',
    fluid: FLUIDS.air,
    parameters: {
      T1: 300,
      P1: 100,
      compressionRatio: 16,
      heatAddition: 1000,
      pressureRatio: 10,
      T3: 1200,
      cutoffRatio: 1.8
    },
    category: 'standard'
  },
  {
    id: 'diesel-heavy-duty',
    name: 'Diesel Cycle - Heavy Duty',
    description: 'High compression for truck/bus applications',
    cycleType: 'diesel',
    fluid: FLUIDS.air,
    parameters: {
      T1: 300,
      P1: 100,
      compressionRatio: 18,
      heatAddition: 1200,
      pressureRatio: 10,
      T3: 1300,
      cutoffRatio: 2.2
    },
    category: 'high-performance'
  },
  {
    id: 'brayton-standard',
    name: 'Brayton Cycle - Standard',
    description: 'Gas turbine power plant',
    cycleType: 'brayton',
    fluid: FLUIDS.air,
    parameters: {
      T1: 300,
      P1: 100,
      compressionRatio: 8,
      heatAddition: 1000,
      pressureRatio: 8,
      T3: 1200,
      cutoffRatio: 2
    },
    category: 'standard'
  },
  {
    id: 'brayton-jet-engine',
    name: 'Brayton Cycle - Jet Engine',
    description: 'Aircraft propulsion cycle',
    cycleType: 'brayton',
    fluid: FLUIDS.air,
    parameters: {
      T1: 250,
      P1: 25,
      compressionRatio: 8,
      heatAddition: 1000,
      pressureRatio: 12,
      T3: 1400,
      cutoffRatio: 2
    },
    category: 'high-performance'
  }
];

// Storage keys
const PRESET_STORAGE_KEY = 'thermoviz-presets';
const CUSTOM_PRESET_PREFIX = 'custom-';

// Load presets from localStorage
export function loadPresets(): CyclePreset[] {
  try {
    const stored = localStorage.getItem(PRESET_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Merge with defaults to ensure we have all default presets
      const defaultIds = new Set(DEFAULT_PRESETS.map(p => p.id));
      const customPresets = parsed.filter((p: CyclePreset) => 
        p.id.startsWith(CUSTOM_PRESET_PREFIX)
      );
      return [...DEFAULT_PRESETS, ...customPresets];
    }
  } catch (error) {
    console.error('Error loading presets:', error);
  }
  return DEFAULT_PRESETS;
}

// Save presets to localStorage
export function savePresets(presets: CyclePreset[]): void {
  try {
    localStorage.setItem(PRESET_STORAGE_KEY, JSON.stringify(presets));
  } catch (error) {
    console.error('Error saving presets:', error);
  }
}

// Save a custom preset
export function saveCustomPreset(name: string, description: string, presetData: Omit<CyclePreset, 'id' | 'name' | 'description' | 'isDefault'>): CyclePreset {
  const customPresets = loadPresets().filter(p => p.id.startsWith(CUSTOM_PRESET_PREFIX));
  const newId = `${CUSTOM_PRESET_PREFIX}${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  
  const newPreset: CyclePreset = {
    id: newId,
    name,
    description,
    ...presetData,
    category: 'custom'
  };

  const allPresets = [...DEFAULT_PRESETS, ...customPresets, newPreset];
  savePresets(allPresets);
  
  return newPreset;
}

// Delete a custom preset
export function deleteCustomPreset(presetId: string): void {
  const presets = loadPresets().filter(p => p.id !== presetId);
  savePresets(presets);
}

// Get presets by category
export function getPresetsByCategory(category: CyclePreset['category']): CyclePreset[] {
  return loadPresets().filter(p => p.category === category);
}

// Get all custom presets
export function getCustomPresets(): CyclePreset[] {
  return loadPresets().filter(p => p.category === 'custom');
}

// Find preset by ID
export function findPresetById(id: string): CyclePreset | undefined {
  return loadPresets().find(p => p.id === id);
}