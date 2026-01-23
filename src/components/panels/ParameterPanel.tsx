import { useState, useCallback, memo } from 'react';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CycleType, FluidProperties } from '@/types/thermodynamics';
import { FLUIDS } from '@/lib/thermodynamics';
import { Thermometer, Gauge, Flame, Droplets, Wind } from 'lucide-react';
import { motion } from 'framer-motion';

interface ParameterPanelProps {
  cycleType: CycleType;
  onCycleChange: (cycle: CycleType) => void;
  fluid: FluidProperties;
  onFluidChange: (fluid: FluidProperties) => void;
  parameters: {
    T1: number;
    P1: number;
    compressionRatio: number;
    heatAddition: number;
    pressureRatio: number;
    T3: number;
    cutoffRatio: number;
  };
  onParameterChange: (key: string, value: number) => void;
}

export const ParameterPanel = memo(function ParameterPanel({
  cycleType,
  onCycleChange,
  fluid,
  onFluidChange,
  parameters,
  onParameterChange,
}: ParameterPanelProps) {
  const cycles: { value: CycleType; label: string; icon: React.ReactNode }[] = [
    { value: 'otto', label: 'Otto Cycle', icon: <Flame className="w-4 h-4" /> },
    { value: 'diesel', label: 'Diesel Cycle', icon: <Droplets className="w-4 h-4" /> },
    { value: 'brayton', label: 'Brayton Cycle', icon: <Wind className="w-4 h-4" /> },
  ];

  const handleCycleChange = useCallback((cycle: CycleType) => {
    onCycleChange(cycle);
  }, [onCycleChange]);

  const handleFluidChange = useCallback((fluid: FluidProperties) => {
    onFluidChange(fluid);
  }, [onFluidChange]);

  const handleParameterChange = useCallback((key: string, value: number) => {
    onParameterChange(key, value);
  }, [onParameterChange]);

  return (
    <motion.div 
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Cycle Selection */}
      <div className="panel">
        <div className="panel-header">
          <span className="panel-title">Cycle Type</span>
        </div>
        <div className="panel-content">
          <div className="grid grid-cols-1 gap-2">
            {cycles.map((cycle, index) => (
              <motion.div
                key={cycle.value}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.05, duration: 0.3 }}
              >
                <button
                  onClick={() => handleCycleChange(cycle.value)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg border transition-all duration-200 ${
                    cycleType === cycle.value
                      ? 'bg-primary/10 border-primary text-primary glow-primary'
                      : 'bg-secondary/50 border-border text-muted-foreground hover:border-primary/50 hover:text-foreground'
                  }`}
                >
                  {cycle.icon}
                  <span className="text-sm font-medium">{cycle.label}</span>
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Working Fluid */}
      <div className="panel">
        <div className="panel-header">
          <span className="panel-title">Working Fluid</span>
        </div>
        <div className="panel-content">
          <Select
            value={fluid.name.toLowerCase()}
            onValueChange={(value) => handleFluidChange(FLUIDS[value])}
          >
            <SelectTrigger className="w-full bg-input border-border">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(FLUIDS).map(([key, f]) => (
                <SelectItem key={key} value={key}>
                  {f.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <motion.div 
            className="mt-4 data-grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.3 }}
          >
            <div className="data-row">
              <span className="data-label">R</span>
              <span className="data-value">
                {fluid.R.toFixed(4)}
                <span className="data-unit">kJ/kg·K</span>
              </span>
            </div>
            <div className="data-row">
              <span className="data-label">γ</span>
              <span className="data-value">{fluid.gamma.toFixed(3)}</span>
            </div>
            <div className="data-row">
              <span className="data-label">cp</span>
              <span className="data-value">
                {fluid.cp.toFixed(4)}
                <span className="data-unit">kJ/kg·K</span>
              </span>
            </div>
            <div className="data-row">
              <span className="data-label">cv</span>
              <span className="data-value">
                {fluid.cv.toFixed(4)}
                <span className="data-unit">kJ/kg·K</span>
              </span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Initial Conditions */}
      <div className="panel">
        <div className="panel-header">
          <span className="panel-title">Initial Conditions</span>
        </div>
        <div className="panel-content space-y-5">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.3 }}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="flex items-center gap-2 text-muted-foreground">
                  <Thermometer className="w-4 h-4 text-heat" />
                  T₁ (Temperature)
                </Label>
                <span className="font-mono text-sm text-foreground">{parameters.T1} K</span>
              </div>
              <Slider
                value={[parameters.T1]}
                onValueChange={([v]) => handleParameterChange('T1', v)}
                min={250}
                max={400}
                step={5}
                className="[&_[role=slider]]:bg-heat [&_[role=slider]]:border-heat"
              />
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.3 }}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="flex items-center gap-2 text-muted-foreground">
                  <Gauge className="w-4 h-4 text-cold" />
                  P₁ (Pressure)
                </Label>
                <span className="font-mono text-sm text-foreground">{parameters.P1} kPa</span>
              </div>
              <Slider
                value={[parameters.P1]}
                onValueChange={([v]) => handleParameterChange('P1', v)}
                min={50}
                max={200}
                step={5}
                className="[&_[role=slider]]:bg-cold [&_[role=slider]]:border-cold"
              />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Cycle Parameters */}
      <div className="panel">
        <div className="panel-header">
          <span className="panel-title">Cycle Parameters</span>
        </div>
        <div className="panel-content space-y-5">
          {(cycleType === 'otto' || cycleType === 'diesel') && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.3 }}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-muted-foreground">Compression Ratio (r)</Label>
                  <span className="font-mono text-sm text-foreground">{parameters.compressionRatio}:1</span>
                </div>
                <Slider
                  value={[parameters.compressionRatio]}
                  onValueChange={([v]) => handleParameterChange('compressionRatio', v)}
                  min={4}
                  max={20}
                  step={0.5}
                  className="[&_[role=slider]]:bg-primary [&_[role=slider]]:border-primary"
                />
              </div>
            </motion.div>
          )}

          {cycleType === 'otto' && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.3 }}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-muted-foreground">Heat Addition (Q_in)</Label>
                  <span className="font-mono text-sm text-foreground">{parameters.heatAddition} kJ/kg</span>
                </div>
                <Slider
                  value={[parameters.heatAddition]}
                  onValueChange={([v]) => handleParameterChange('heatAddition', v)}
                  min={500}
                  max={2000}
                  step={50}
                  className="[&_[role=slider]]:bg-heat [&_[role=slider]]:border-heat"
                />
              </div>
            </motion.div>
          )}

          {cycleType === 'diesel' && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.3 }}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-muted-foreground">Cutoff Ratio (ρ)</Label>
                  <span className="font-mono text-sm text-foreground">{parameters.cutoffRatio}</span>
                </div>
                <Slider
                  value={[parameters.cutoffRatio]}
                  onValueChange={([v]) => handleParameterChange('cutoffRatio', v)}
                  min={1.5}
                  max={4}
                  step={0.1}
                  className="[&_[role=slider]]:bg-heat [&_[role=slider]]:border-heat"
                />
              </div>
            </motion.div>
          )}

          {cycleType === 'brayton' && (
            <>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.3 }}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-muted-foreground">Pressure Ratio (rp)</Label>
                    <span className="font-mono text-sm text-foreground">{parameters.pressureRatio}:1</span>
                  </div>
                  <Slider
                    value={[parameters.pressureRatio]}
                    onValueChange={([v]) => handleParameterChange('pressureRatio', v)}
                    min={4}
                    max={20}
                    step={0.5}
                    className="[&_[role=slider]]:bg-primary [&_[role=slider]]:border-primary"
                  />
                </div>
              </motion.div>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.3 }}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-muted-foreground">Turbine Inlet Temp (T₃)</Label>
                    <span className="font-mono text-sm text-foreground">{parameters.T3} K</span>
                  </div>
                  <Slider
                    value={[parameters.T3]}
                    onValueChange={([v]) => handleParameterChange('T3', v)}
                    min={800}
                    max={1600}
                    step={25}
                    className="[&_[role=slider]]:bg-heat [&_[role=slider]]:border-heat"
                  />
                </div>
              </motion.div>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
});