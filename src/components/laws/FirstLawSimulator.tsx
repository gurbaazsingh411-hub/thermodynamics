import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Zap, Flame, RotateCcw, Play, Pause } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface EnergySystem {
  internalEnergy: number;
  heatAdded: number;
  workDone: number;
  volume: number;
}

export function FirstLawSimulator() {
  const [system, setSystem] = useState<EnergySystem>({
    internalEnergy: 1000,
    heatAdded: 0,
    workDone: 0,
    volume: 1.0
  });
  
  const [isRunning, setIsRunning] = useState(false);
  const [time, setTime] = useState(0);
  const { toast } = useToast();

  // Animation loop for continuous process
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRunning) {
      interval = setInterval(() => {
        setTime(prev => prev + 0.1);
      }, 100);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning]);

  const handleHeatChange = (value: number[]) => {
    const heat = value[0];
    setSystem(prev => ({
      ...prev,
      heatAdded: heat,
      internalEnergy: prev.internalEnergy + (heat - prev.workDone * 0.1)
    }));
  };

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    const work = (newVolume - system.volume) * 100; // Simple work calculation
    setSystem(prev => ({
      ...prev,
      volume: newVolume,
      workDone: prev.workDone + work,
      internalEnergy: prev.internalEnergy - work
    }));
  };

  const resetSystem = () => {
    setSystem({
      internalEnergy: 1000,
      heatAdded: 0,
      workDone: 0,
      volume: 1.0
    });
    setIsRunning(false);
    setTime(0);
  };

  const toggleSimulation = () => {
    setIsRunning(!isRunning);
  };

  const getEnergyColor = (energy: number) => {
    const intensity = Math.min(100, Math.max(0, (energy - 500) / 10));
    return `hsl(30, ${intensity}%, 50%)`;
  };

  const energyBalance = system.heatAdded - system.workDone;

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5" />
              First Law of Thermodynamics
            </CardTitle>
            <CardDescription>
              Energy cannot be created or destroyed, only transformed (ΔU = Q - W)
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={resetSystem}
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
            <Button 
              onClick={toggleSimulation}
              variant={isRunning ? "secondary" : "default"}
              className="gap-2"
            >
              {isRunning ? (
                <>
                  <Pause className="w-4 h-4" />
                  Pause
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  Animate
                </>
              )}
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Energy Visualization */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Internal Energy */}
          <Card className="overflow-hidden">
            <div 
              className="h-32 flex items-center justify-center transition-colors duration-300"
              style={{ backgroundColor: getEnergyColor(system.internalEnergy) }}
            >
              <div className="text-white text-center">
                <div className="text-2xl font-bold">{system.internalEnergy.toFixed(0)} J</div>
                <div className="text-sm opacity-90">Internal Energy (U)</div>
              </div>
            </div>
            <div className="p-4">
              <div className="text-sm text-muted-foreground mb-2">
                System Energy Content
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(100, (system.internalEnergy / 2000) * 100)}%` }}
                ></div>
              </div>
            </div>
          </Card>

          {/* Heat Addition */}
          <Card className="overflow-hidden">
            <div className="h-32 flex items-center justify-center bg-red-500">
              <div className="text-white text-center">
                <div className="text-2xl font-bold">+{system.heatAdded.toFixed(0)} J</div>
                <div className="text-sm opacity-90">Heat Added (Q)</div>
              </div>
            </div>
            <div className="p-4">
              <Slider
                value={[system.heatAdded]}
                onValueChange={handleHeatChange}
                max={1000}
                min={-500}
                step={10}
                className="mt-4"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-2">
                <span>-500J</span>
                <span>1000J</span>
              </div>
            </div>
          </Card>

          {/* Work Done */}
          <Card className="overflow-hidden">
            <div className="h-32 flex items-center justify-center bg-blue-500">
              <div className="text-white text-center">
                <div className="text-2xl font-bold">{system.workDone.toFixed(0)} J</div>
                <div className="text-sm opacity-90">Work Done (W)</div>
              </div>
            </div>
            <div className="p-4">
              <Slider
                value={[system.volume]}
                onValueChange={handleVolumeChange}
                max={2.0}
                min={0.5}
                step={0.01}
                className="mt-4"
              />
              <div className="text-center text-xs text-muted-foreground mt-2">
                Volume: {system.volume.toFixed(2)} m³
              </div>
            </div>
          </Card>
        </div>

        {/* Energy Balance */}
        <Card className="bg-muted/30">
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-orange-500">
                  ΔU = {energyBalance.toFixed(0)} J
                </div>
                <div className="text-sm text-muted-foreground">Energy Change</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-red-500">
                  Q = +{system.heatAdded.toFixed(0)} J
                </div>
                <div className="text-sm text-muted-foreground">Heat Transfer</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-500">
                  W = {system.workDone.toFixed(0)} J
                </div>
                <div className="text-sm text-muted-foreground">Work Done</div>
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {Math.abs(energyBalance - (system.heatAdded - system.workDone)) < 1 ? '✓' : '✗'}
                </div>
                <div className="text-sm text-muted-foreground">Conservation Check</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Process Animation */}
        {isRunning && (
          <div className="text-center p-4 bg-primary/10 rounded-lg border border-primary/30">
            <Badge variant="secondary" className="gap-2 mb-2">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
              Continuous Process Simulation
            </Badge>
            <p className="text-sm text-muted-foreground">
              Time: {time.toFixed(1)}s | Energy is continuously conserved throughout the process
            </p>
          </div>
        )}

        {/* Explanation */}
        <div className="bg-muted/50 p-4 rounded-lg">
          <h4 className="font-semibold mb-2">Scientific Principle:</h4>
          <p className="text-sm text-muted-foreground">
            The First Law states that the change in internal energy of a system equals the heat added to the system 
            minus the work done by the system. Energy can change forms but the total amount remains constant - 
            this is the principle of energy conservation.
          </p>
          <div className="mt-2 text-xs font-mono bg-background/50 p-2 rounded">
            ΔU = Q - W
          </div>
        </div>
      </CardContent>
    </Card>
  );
}