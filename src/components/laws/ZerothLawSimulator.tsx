import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Thermometer, ArrowRight, RotateCcw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ThermalSystem {
  id: string;
  name: string;
  temperature: number;
  color: string;
}

export function ZerothLawSimulator() {
  const [systems, setSystems] = useState<ThermalSystem[]>([
    { id: 'A', name: 'System A', temperature: 300, color: 'bg-red-500' },
    { id: 'B', name: 'System B', temperature: 400, color: 'bg-blue-500' },
    { id: 'C', name: 'System C', temperature: 350, color: 'bg-green-500' }
  ]);
  
  const [isEquilibrating, setIsEquilibrating] = useState(false);
  const [equilibriumReached, setEquilibriumReached] = useState(false);
  const { toast } = useToast();

  const handleTemperatureChange = (systemId: string, value: number[]) => {
    setSystems(prev => prev.map(sys => 
      sys.id === systemId ? { ...sys, temperature: value[0] } : sys
    ));
    setEquilibriumReached(false);
  };

  const simulateEquilibrium = () => {
    if (isEquilibrating) return;
    
    setIsEquilibrating(true);
    setEquilibriumReached(false);
    
    // Simulate heat transfer process
    setTimeout(() => {
      const avgTemp = systems.reduce((sum, sys) => sum + sys.temperature, 0) / systems.length;
      
      setSystems(prev => prev.map(sys => ({
        ...sys,
        temperature: avgTemp
      })));
      
      setIsEquilibrating(false);
      setEquilibriumReached(true);
      
      toast({
        title: "Thermal Equilibrium Reached!",
        description: `All systems now at ${avgTemp.toFixed(1)} K`,
      });
    }, 2000);
  };

  const resetSystems = () => {
    setSystems([
      { id: 'A', name: 'System A', temperature: 300, color: 'bg-red-500' },
      { id: 'B', name: 'System B', temperature: 400, color: 'bg-blue-500' },
      { id: 'C', name: 'System C', temperature: 350, color: 'bg-green-500' }
    ]);
    setEquilibriumReached(false);
    setIsEquilibrating(false);
  };

  const getTempColor = (temp: number) => {
    const hue = ((temp - 200) / 400) * 240; // Blue (cold) to Red (hot)
    return `hsl(${hue}, 70%, 50%)`;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Thermometer className="w-5 h-5" />
              Zeroth Law of Thermodynamics
            </CardTitle>
            <CardDescription>
              If two systems are each in thermal equilibrium with a third system, they are in thermal equilibrium with each other
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={resetSystems}
              disabled={isEquilibrating}
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
            <Button 
              onClick={simulateEquilibrium}
              disabled={isEquilibrating || equilibriumReached}
              className="gap-2"
            >
              {isEquilibrating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Equilibrating...
                </>
              ) : (
                <>
                  <ArrowRight className="w-4 h-4" />
                  Reach Equilibrium
                </>
              )}
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* System Visualization */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {systems.map((system) => (
            <Card key={system.id} className="overflow-hidden">
              <div 
                className="h-32 flex items-center justify-center"
                style={{ backgroundColor: getTempColor(system.temperature) }}
              >
                <div className="text-white text-center">
                  <div className="text-2xl font-bold">{system.temperature.toFixed(0)} K</div>
                  <div className="text-sm opacity-90">{system.name}</div>
                </div>
              </div>
              <div className="p-4">
                <Slider
                  value={[system.temperature]}
                  onValueChange={(value) => handleTemperatureChange(system.id, value)}
                  max={600}
                  min={200}
                  step={1}
                  disabled={isEquilibrating}
                  className="mt-4"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-2">
                  <span>200K</span>
                  <span>600K</span>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Equilibrium Status */}
        {equilibriumReached && (
          <div className="text-center p-4 bg-green-500/10 rounded-lg border border-green-500/30">
            <Badge variant="secondary" className="gap-2 mb-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              Thermal Equilibrium Achieved
            </Badge>
            <p className="text-sm text-muted-foreground">
              All systems are now in thermal equilibrium - they have the same temperature
            </p>
          </div>
        )}

        {/* Explanation */}
        <div className="bg-muted/50 p-4 rounded-lg">
          <h4 className="font-semibold mb-2">Scientific Principle:</h4>
          <p className="text-sm text-muted-foreground">
            The Zeroth Law establishes temperature as a fundamental property. When systems A and B are each in thermal 
            equilibrium with system C, then A and B must be in thermal equilibrium with each other. This allows us 
            to define temperature scales and use thermometers.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}