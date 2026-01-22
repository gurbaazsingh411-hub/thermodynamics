import { useState, useEffect } from 'react';
import { ThermodynamicCycle, ThermodynamicState } from '@/types/thermodynamics';
import { formatValue } from '@/lib/thermodynamics';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Play, Pause, RotateCcw, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface EducationalModeProps {
  cycle: ThermodynamicCycle;
  compressionRatio?: number;
  pressureRatio?: number;
  cutoffRatio?: number;
  gamma: number;
}

interface EquationStep {
  id: string;
  title: string;
  description: string;
  equation: string;
  variables: { symbol: string; value: string; unit: string; color: string }[];
  result: { symbol: string; value: string; unit: string };
  processType: string;
}

export function EducationalMode({ 
  cycle, 
  compressionRatio = 8, 
  pressureRatio = 10,
  cutoffRatio = 2,
  gamma 
}: EducationalModeProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showSubstitution, setShowSubstitution] = useState(false);

  const steps = generateSteps(cycle, compressionRatio, pressureRatio, cutoffRatio, gamma);

  useEffect(() => {
    if (isPlaying && currentStep < steps.length - 1) {
      const timer = setTimeout(() => {
        setCurrentStep(prev => prev + 1);
        setShowSubstitution(false);
      }, 4000);
      return () => clearTimeout(timer);
    } else if (currentStep >= steps.length - 1) {
      setIsPlaying(false);
    }
  }, [isPlaying, currentStep, steps.length]);

  useEffect(() => {
    if (currentStep >= 0) {
      const timer = setTimeout(() => setShowSubstitution(true), 1000);
      return () => clearTimeout(timer);
    }
  }, [currentStep]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
      setShowSubstitution(false);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
      setShowSubstitution(false);
    }
  };

  const handleReset = () => {
    setCurrentStep(0);
    setIsPlaying(false);
    setShowSubstitution(false);
  };

  const step = steps[currentStep];
  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-warning/20">
            <Lightbulb className="w-5 h-5 text-warning" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Educational Mode</h3>
            <p className="text-sm text-muted-foreground">Step-by-step {cycle.name} analysis</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={handleReset}
            className="border-border"
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setIsPlaying(!isPlaying)}
            className="border-border"
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      {/* Progress */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Step {currentStep + 1} of {steps.length}</span>
          <span>{Math.round(progress)}% complete</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Process Flow Indicator */}
      <ProcessFlowIndicator 
        cycle={cycle} 
        currentProcess={Math.floor(currentStep / 2)} 
      />

      {/* Step Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="panel"
        >
          <div className="panel-header">
            <div className="flex items-center gap-3">
              <span className={`process-tag ${getProcessTagClass(step.processType)}`}>
                {step.processType}
              </span>
              <span className="panel-title">{step.title}</span>
            </div>
          </div>
          <div className="panel-content space-y-6">
            {/* Description */}
            <p className="text-muted-foreground">{step.description}</p>

            {/* Equation Display */}
            <div className="bg-background/50 rounded-lg p-6 border border-border">
              <div className="text-center space-y-4">
                {/* Original Equation */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-2xl font-mono text-foreground"
                >
                  {step.equation}
                </motion.div>

                {/* Variable Substitution */}
                <AnimatePresence>
                  {showSubstitution && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="space-y-4"
                    >
                      {/* Variables */}
                      <div className="flex flex-wrap justify-center gap-4 pt-4 border-t border-border">
                        {step.variables.map((variable, i) => (
                          <motion.div
                            key={variable.symbol}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.15 }}
                            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/50"
                          >
                            <span 
                              className="font-mono font-semibold"
                              style={{ color: variable.color }}
                            >
                              {variable.symbol}
                            </span>
                            <span className="text-muted-foreground">=</span>
                            <span className="font-mono text-foreground">{variable.value}</span>
                            <span className="text-xs text-muted-foreground">{variable.unit}</span>
                          </motion.div>
                        ))}
                      </div>

                      {/* Result */}
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: step.variables.length * 0.15 + 0.2 }}
                        className="inline-flex items-center gap-3 px-6 py-3 rounded-lg bg-primary/10 border border-primary/30"
                      >
                        <span className="font-mono font-bold text-primary text-xl">
                          {step.result.symbol} = {step.result.value}
                        </span>
                        <span className="text-sm text-muted-foreground">{step.result.unit}</span>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* State Points Involved */}
            <StatePointsDisplay cycle={cycle} step={currentStep} />
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <Button
          variant="outline"
          onClick={handlePrev}
          disabled={currentStep === 0}
          className="border-border"
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Previous
        </Button>
        <div className="flex gap-1">
          {steps.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setCurrentStep(i);
                setShowSubstitution(false);
              }}
              className={`w-2 h-2 rounded-full transition-all ${
                i === currentStep 
                  ? 'bg-primary w-6' 
                  : i < currentStep 
                    ? 'bg-primary/50' 
                    : 'bg-muted'
              }`}
            />
          ))}
        </div>
        <Button
          variant="outline"
          onClick={handleNext}
          disabled={currentStep === steps.length - 1}
          className="border-border"
        >
          Next
          <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}

function ProcessFlowIndicator({ cycle, currentProcess }: { cycle: ThermodynamicCycle; currentProcess: number }) {
  const processes = getProcessNames(cycle.type);
  
  return (
    <div className="flex items-center justify-center gap-2 py-4">
      {processes.map((process, i) => (
        <div key={i} className="flex items-center">
          <motion.div
            animate={{
              scale: i === currentProcess ? 1.1 : 1,
              opacity: i <= currentProcess ? 1 : 0.5,
            }}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors ${
              i === currentProcess 
                ? 'bg-primary/20 border-primary text-primary' 
                : i < currentProcess
                  ? 'bg-efficiency/10 border-efficiency/30 text-efficiency'
                  : 'bg-muted/30 border-border text-muted-foreground'
            }`}
          >
            <span className="w-5 h-5 rounded-full bg-current/20 flex items-center justify-center text-xs font-mono">
              {i + 1}
            </span>
            <span className="text-xs font-medium hidden sm:inline">{process}</span>
          </motion.div>
          {i < processes.length - 1 && (
            <motion.div 
              className="w-8 h-0.5 mx-1"
              animate={{
                backgroundColor: i < currentProcess 
                  ? 'hsl(var(--efficiency))' 
                  : 'hsl(var(--border))'
              }}
            />
          )}
        </div>
      ))}
    </div>
  );
}

function StatePointsDisplay({ cycle, step }: { cycle: ThermodynamicCycle; step: number }) {
  const processIndex = Math.floor(step / 2);
  const startState = cycle.states[processIndex];
  const endState = cycle.states[(processIndex + 1) % cycle.states.length];
  
  return (
    <div className="grid grid-cols-2 gap-4">
      <motion.div 
        className="p-4 rounded-lg bg-muted/30 border border-border"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <div className="flex items-center gap-2 mb-3">
          <div className="w-3 h-3 rounded-full bg-cold" style={{ boxShadow: '0 0 8px hsl(var(--cold))' }} />
          <span className="text-sm font-semibold text-foreground">State {processIndex + 1}</span>
        </div>
        <div className="space-y-1 font-mono text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">T</span>
            <span className="text-heat">{formatValue(startState.temperature, 1)} K</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">P</span>
            <span className="text-cold">{formatValue(startState.pressure, 1)} kPa</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">V</span>
            <span>{formatValue(startState.volume, 4)} m³/kg</span>
          </div>
        </div>
      </motion.div>
      
      <motion.div 
        className="p-4 rounded-lg bg-muted/30 border border-border"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex items-center gap-2 mb-3">
          <div className="w-3 h-3 rounded-full bg-heat" style={{ boxShadow: '0 0 8px hsl(var(--heat))' }} />
          <span className="text-sm font-semibold text-foreground">State {(processIndex + 1) % cycle.states.length + 1}</span>
        </div>
        <div className="space-y-1 font-mono text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">T</span>
            <span className="text-heat">{formatValue(endState.temperature, 1)} K</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">P</span>
            <span className="text-cold">{formatValue(endState.pressure, 1)} kPa</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">V</span>
            <span>{formatValue(endState.volume, 4)} m³/kg</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function getProcessNames(cycleType: string): string[] {
  switch (cycleType) {
    case 'otto':
      return ['Compression', 'Heat Add', 'Expansion', 'Heat Reject'];
    case 'diesel':
      return ['Compression', 'Heat Add', 'Expansion', 'Heat Reject'];
    case 'brayton':
      return ['Compression', 'Combustion', 'Expansion', 'Exhaust'];
    default:
      return ['Process 1', 'Process 2', 'Process 3', 'Process 4'];
  }
}

function getProcessTagClass(processType: string): string {
  if (processType.toLowerCase().includes('isentropic')) return 'process-isentropic';
  if (processType.toLowerCase().includes('isochoric')) return 'process-isochoric';
  if (processType.toLowerCase().includes('isobaric')) return 'process-isobaric';
  if (processType.toLowerCase().includes('isothermal')) return 'process-isothermal';
  return 'process-isentropic';
}

function generateSteps(
  cycle: ThermodynamicCycle,
  compressionRatio: number,
  pressureRatio: number,
  cutoffRatio: number,
  gamma: number
): EquationStep[] {
  const states = cycle.states;
  
  if (cycle.type === 'otto') {
    return [
      {
        id: '1',
        title: 'Isentropic Compression (1→2)',
        description: 'Air is compressed adiabatically from state 1 to state 2. No heat transfer occurs during this process.',
        equation: 'T₂ = T₁ × r^(γ-1)',
        processType: 'Isentropic',
        variables: [
          { symbol: 'T₁', value: formatValue(states[0].temperature, 1), unit: 'K', color: 'hsl(var(--heat))' },
          { symbol: 'r', value: String(compressionRatio), unit: '', color: 'hsl(var(--primary))' },
          { symbol: 'γ', value: gamma.toFixed(2), unit: '', color: 'hsl(var(--entropy))' },
        ],
        result: { symbol: 'T₂', value: formatValue(states[1].temperature, 1), unit: 'K' },
      },
      {
        id: '2',
        title: 'Compression Pressure Calculation',
        description: 'Using the isentropic relation, we calculate the pressure after compression.',
        equation: 'P₂ = P₁ × r^γ',
        processType: 'Isentropic',
        variables: [
          { symbol: 'P₁', value: formatValue(states[0].pressure, 1), unit: 'kPa', color: 'hsl(var(--cold))' },
          { symbol: 'r', value: String(compressionRatio), unit: '', color: 'hsl(var(--primary))' },
          { symbol: 'γ', value: gamma.toFixed(2), unit: '', color: 'hsl(var(--entropy))' },
        ],
        result: { symbol: 'P₂', value: formatValue(states[1].pressure, 1), unit: 'kPa' },
      },
      {
        id: '3',
        title: 'Constant Volume Heat Addition (2→3)',
        description: 'Heat is added at constant volume. This represents the rapid combustion in a spark-ignition engine.',
        equation: 'Q_in = cv × (T₃ - T₂)',
        processType: 'Isochoric',
        variables: [
          { symbol: 'cv', value: '0.718', unit: 'kJ/kg·K', color: 'hsl(var(--primary))' },
          { symbol: 'T₃', value: formatValue(states[2].temperature, 1), unit: 'K', color: 'hsl(var(--heat))' },
          { symbol: 'T₂', value: formatValue(states[1].temperature, 1), unit: 'K', color: 'hsl(var(--heat))' },
        ],
        result: { symbol: 'Q_in', value: formatValue(cycle.heatIn, 1), unit: 'kJ/kg' },
      },
      {
        id: '4',
        title: 'Peak Pressure Calculation',
        description: 'At constant volume, pressure increases proportionally with temperature.',
        equation: 'P₃ = P₂ × (T₃/T₂)',
        processType: 'Isochoric',
        variables: [
          { symbol: 'P₂', value: formatValue(states[1].pressure, 1), unit: 'kPa', color: 'hsl(var(--cold))' },
          { symbol: 'T₃', value: formatValue(states[2].temperature, 1), unit: 'K', color: 'hsl(var(--heat))' },
          { symbol: 'T₂', value: formatValue(states[1].temperature, 1), unit: 'K', color: 'hsl(var(--heat))' },
        ],
        result: { symbol: 'P₃', value: formatValue(states[2].pressure, 1), unit: 'kPa' },
      },
      {
        id: '5',
        title: 'Isentropic Expansion (3→4)',
        description: 'The hot gases expand adiabatically, doing work on the piston.',
        equation: 'T₄ = T₃ / r^(γ-1)',
        processType: 'Isentropic',
        variables: [
          { symbol: 'T₃', value: formatValue(states[2].temperature, 1), unit: 'K', color: 'hsl(var(--heat))' },
          { symbol: 'r', value: String(compressionRatio), unit: '', color: 'hsl(var(--primary))' },
          { symbol: 'γ', value: gamma.toFixed(2), unit: '', color: 'hsl(var(--entropy))' },
        ],
        result: { symbol: 'T₄', value: formatValue(states[3].temperature, 1), unit: 'K' },
      },
      {
        id: '6',
        title: 'Constant Volume Heat Rejection (4→1)',
        description: 'Heat is rejected at constant volume as exhaust gases are expelled.',
        equation: 'Q_out = cv × (T₄ - T₁)',
        processType: 'Isochoric',
        variables: [
          { symbol: 'cv', value: '0.718', unit: 'kJ/kg·K', color: 'hsl(var(--primary))' },
          { symbol: 'T₄', value: formatValue(states[3].temperature, 1), unit: 'K', color: 'hsl(var(--heat))' },
          { symbol: 'T₁', value: formatValue(states[0].temperature, 1), unit: 'K', color: 'hsl(var(--heat))' },
        ],
        result: { symbol: 'Q_out', value: formatValue(cycle.heatOut, 1), unit: 'kJ/kg' },
      },
      {
        id: '7',
        title: 'Thermal Efficiency Calculation',
        description: 'The thermal efficiency of the Otto cycle depends only on the compression ratio.',
        equation: 'η = 1 - (1/r^(γ-1))',
        processType: 'Efficiency',
        variables: [
          { symbol: 'r', value: String(compressionRatio), unit: '', color: 'hsl(var(--primary))' },
          { symbol: 'γ', value: gamma.toFixed(2), unit: '', color: 'hsl(var(--entropy))' },
        ],
        result: { symbol: 'η', value: formatValue(cycle.efficiency, 1), unit: '%' },
      },
      {
        id: '8',
        title: 'Net Work Output',
        description: 'The net work is the difference between heat added and heat rejected.',
        equation: 'W_net = Q_in - Q_out',
        processType: 'Work',
        variables: [
          { symbol: 'Q_in', value: formatValue(cycle.heatIn, 1), unit: 'kJ/kg', color: 'hsl(var(--heat))' },
          { symbol: 'Q_out', value: formatValue(cycle.heatOut, 1), unit: 'kJ/kg', color: 'hsl(var(--cold))' },
        ],
        result: { symbol: 'W_net', value: formatValue(cycle.netWork, 1), unit: 'kJ/kg' },
      },
    ];
  }
  
  // Default/Brayton cycle steps
  return [
    {
      id: '1',
      title: 'Isentropic Compression (1→2)',
      description: 'Air is compressed in the compressor. Temperature and pressure increase.',
      equation: 'T₂ = T₁ × rp^((γ-1)/γ)',
      processType: 'Isentropic',
      variables: [
        { symbol: 'T₁', value: formatValue(states[0].temperature, 1), unit: 'K', color: 'hsl(var(--heat))' },
        { symbol: 'rp', value: String(pressureRatio), unit: '', color: 'hsl(var(--primary))' },
        { symbol: 'γ', value: gamma.toFixed(2), unit: '', color: 'hsl(var(--entropy))' },
      ],
      result: { symbol: 'T₂', value: formatValue(states[1].temperature, 1), unit: 'K' },
    },
    {
      id: '2',
      title: 'Compressor Work',
      description: 'Work required to compress the air in the compressor.',
      equation: 'W_comp = cp × (T₂ - T₁)',
      processType: 'Isentropic',
      variables: [
        { symbol: 'cp', value: '1.005', unit: 'kJ/kg·K', color: 'hsl(var(--primary))' },
        { symbol: 'T₂', value: formatValue(states[1].temperature, 1), unit: 'K', color: 'hsl(var(--heat))' },
        { symbol: 'T₁', value: formatValue(states[0].temperature, 1), unit: 'K', color: 'hsl(var(--heat))' },
      ],
      result: { symbol: 'W_comp', value: formatValue((states[1].temperature - states[0].temperature) * 1.005, 1), unit: 'kJ/kg' },
    },
    {
      id: '3',
      title: 'Constant Pressure Heat Addition (2→3)',
      description: 'Fuel is burned in the combustion chamber at constant pressure.',
      equation: 'Q_in = cp × (T₃ - T₂)',
      processType: 'Isobaric',
      variables: [
        { symbol: 'cp', value: '1.005', unit: 'kJ/kg·K', color: 'hsl(var(--primary))' },
        { symbol: 'T₃', value: formatValue(states[2].temperature, 1), unit: 'K', color: 'hsl(var(--heat))' },
        { symbol: 'T₂', value: formatValue(states[1].temperature, 1), unit: 'K', color: 'hsl(var(--heat))' },
      ],
      result: { symbol: 'Q_in', value: formatValue(cycle.heatIn, 1), unit: 'kJ/kg' },
    },
    {
      id: '4',
      title: 'Isentropic Expansion (3→4)',
      description: 'Hot gases expand through the turbine, producing work.',
      equation: 'T₄ = T₃ / rp^((γ-1)/γ)',
      processType: 'Isentropic',
      variables: [
        { symbol: 'T₃', value: formatValue(states[2].temperature, 1), unit: 'K', color: 'hsl(var(--heat))' },
        { symbol: 'rp', value: String(pressureRatio), unit: '', color: 'hsl(var(--primary))' },
        { symbol: 'γ', value: gamma.toFixed(2), unit: '', color: 'hsl(var(--entropy))' },
      ],
      result: { symbol: 'T₄', value: formatValue(states[3].temperature, 1), unit: 'K' },
    },
    {
      id: '5',
      title: 'Thermal Efficiency',
      description: 'The Brayton cycle efficiency depends on the pressure ratio.',
      equation: 'η = 1 - (1/rp)^((γ-1)/γ)',
      processType: 'Efficiency',
      variables: [
        { symbol: 'rp', value: String(pressureRatio), unit: '', color: 'hsl(var(--primary))' },
        { symbol: 'γ', value: gamma.toFixed(2), unit: '', color: 'hsl(var(--entropy))' },
      ],
      result: { symbol: 'η', value: formatValue(cycle.efficiency, 1), unit: '%' },
    },
    {
      id: '6',
      title: 'Net Work Output',
      description: 'Net work equals turbine work minus compressor work.',
      equation: 'W_net = Q_in - Q_out',
      processType: 'Work',
      variables: [
        { symbol: 'Q_in', value: formatValue(cycle.heatIn, 1), unit: 'kJ/kg', color: 'hsl(var(--heat))' },
        { symbol: 'Q_out', value: formatValue(cycle.heatOut, 1), unit: 'kJ/kg', color: 'hsl(var(--cold))' },
      ],
      result: { symbol: 'W_net', value: formatValue(cycle.netWork, 1), unit: 'kJ/kg' },
    },
  ];
}
