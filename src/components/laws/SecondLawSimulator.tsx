import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRightLeft, RotateCcw, Play, Pause, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface EntropySystem {
  hotReservoir: {
    temperature: number;
    entropy: number;
  };
  coldReservoir: {
    temperature: number;
    entropy: number;
  };
  entropyGenerated: number;
}

export function SecondLawSimulator() {
  const [system, setSystem] = useState<EntropySystem>({
    hotReservoir: {
      temperature: 800,
      entropy: 100
    },
    coldReservoir: {
      temperature: 300,
      entropy: 50
    },
    entropyGenerated: 0
  });
  
  const [heatTransfer, setHeatTransfer] = useState(100);
  const [isRunning, setIsRunning] = useState(false);
  const [processStep, setProcessStep] = useState(0);
  const { toast } = useToast();

  // Animation for heat transfer process
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRunning && processStep < 3) {
      interval = setInterval(() => {
        setProcessStep(prev => prev + 1);
      }, 1000);
    } else if (processStep >= 3) {
      setIsRunning(false);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, processStep]);

  const calculateEntropyChange = () => {
    const deltaSHot = -heatTransfer / system.hotReservoir.temperature;
    const deltaSCold = heatTransfer / system.coldReservoir.temperature;
    const totalEntropyChange = deltaSCold + deltaSHot;
    
    return {
      deltaSHot,
      deltaSCold,
      totalEntropyChange
    };
  };

  const simulateHeatTransfer = () => {
    if (isRunning) return;
    
    const { deltaSHot, deltaSCold, totalEntropyChange } = calculateEntropyChange();
    
    setSystem(prev => ({
      ...prev,
      hotReservoir: {
        ...prev.hotReservoir,
        entropy: prev.hotReservoir.entropy + deltaSHot
      },
      coldReservoir: {
        ...prev.coldReservoir,
        entropy: prev.coldReservoir.entropy + deltaSCold
      },
      entropyGenerated: prev.entropyGenerated + totalEntropyChange
    }));
    
    setProcessStep(0);
    setIsRunning(true);
    
    toast({
      title: "Heat Transfer Process",
      description: `Entropy generated: ${totalEntropyChange.toFixed(3)} J/K`,
    });
  };

  const resetSystem = () => {
    setSystem({
      hotReservoir: {
        temperature: 800,
        entropy: 100
      },
      coldReservoir: {
        temperature: 300,
        entropy: 50
      },
      entropyGenerated: 0
    });
    setHeatTransfer(100);
    setIsRunning(false);
    setProcessStep(0);
  };

  const handleHotTempChange = (value: number[]) => {
    setSystem(prev => ({
      ...prev,
      hotReservoir: {
        ...prev.hotReservoir,
        temperature: value[0]
      }
    }));
  };

  const handleColdTempChange = (value: number[]) => {
    setSystem(prev => ({
      ...prev,
      coldReservoir: {
        ...prev.coldReservoir,
        temperature: value[0]
      }
    }));
  };

  const handleHeatChange = (value: number[]) => {
    setHeatTransfer(value[0]);
  };

  const { deltaSHot, deltaSCold, totalEntropyChange } = calculateEntropyChange();
  const isValidProcess = totalEntropyChange >= 0;

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <ArrowRightLeft className="w-5 h-5" />
              Second Law of Thermodynamics
            </CardTitle>
            <CardDescription>
              Entropy of an isolated system never decreases (ΔS ≥ 0)
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
              onClick={simulateHeatTransfer}
              disabled={isRunning}
              className="gap-2"
            >
              {isRunning ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  Transfer Heat
                </>
              )}
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Reservoir Visualization */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Hot Reservoir */}
          <Card className="overflow-hidden">
            <div className="h-32 flex items-center justify-center bg-red-500">
              <div className="text-white text-center">
                <div className="text-2xl font-bold">{system.hotReservoir.temperature} K</div>
                <div className="text-sm opacity-90">Hot Reservoir</div>
                <div className="text-xs mt-1">S = {system.hotReservoir.entropy.toFixed(1)} J/K</div>
              </div>
            </div>
            <div className="p-4">
              <Slider
                value={[system.hotReservoir.temperature]}
                onValueChange={handleHotTempChange}
                max={1000}
                min={400}
                step={10}
                className="mt-4"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-2">
                <span>400K</span>
                <span>1000K</span>
              </div>
            </div>
          </Card>

          {/* Cold Reservoir */}
          <Card className="overflow-hidden">
            <div className="h-32 flex items-center justify-center bg-blue-500">
              <div className="text-white text-center">
                <div className="text-2xl font-bold">{system.coldReservoir.temperature} K</div>
                <div className="text-sm opacity-90">Cold Reservoir</div>
                <div className="text-xs mt-1">S = {system.coldReservoir.entropy.toFixed(1)} J/K</div>
              </div>
            </div>
            <div className="p-4">
              <Slider
                value={[system.coldReservoir.temperature]}
                onValueChange={handleColdTempChange}
                max={600}
                min={200}
                step={10}
                className="mt-4"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-2">
                <span>200K</span>
                <span>600K</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Heat Transfer Control */}
        <Card className="bg-muted/30">
          <CardContent className="p-4">
            <div className="text-center mb-4">
              <div className="text-lg font-semibold">Heat Transfer Amount</div>
              <div className="text-2xl font-bold text-primary">{heatTransfer} J</div>
            </div>
            <Slider
              value={[heatTransfer]}
              onValueChange={handleHeatChange}
              max={500}
              min={10}
              step={10}
              className="mt-4"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-2">
              <span>10J</span>
              <span>500J</span>
            </div>
          </CardContent>
        </Card>

        {/* Entropy Analysis */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className={isValidProcess ? "border-green-500/50" : "border-red-500/50"}>
            <CardContent className="p-4 text-center">
              <div className="text-sm text-muted-foreground mb-1">Hot Reservoir</div>
              <div className={`text-xl font-bold ${deltaSHot <= 0 ? 'text-red-500' : 'text-green-500'}`}>
                ΔS = {deltaSHot.toFixed(3)} J/K
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {deltaSHot <= 0 ? 'Entropy decreases (loses heat)' : 'Entropy increases'}
              </div>
            </CardContent>
          </Card>

          <Card className={isValidProcess ? "border-green-500/50" : "border-red-500/50"}>
            <CardContent className="p-4 text-center">
              <div className="text-sm text-muted-foreground mb-1">Cold Reservoir</div>
              <div className={`text-xl font-bold ${deltaSCold >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                ΔS = +{deltaSCold.toFixed(3)} J/K
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {deltaSCold >= 0 ? 'Entropy increases (gains heat)' : 'Entropy decreases'}
              </div>
            </CardContent>
          </Card>

          <Card className={isValidProcess ? "border-green-500/50 bg-green-500/10" : "border-red-500/50 bg-red-500/10"}>
            <CardContent className="p-4 text-center">
              <div className="text-sm text-muted-foreground mb-1">Total Entropy Change</div>
              <div className={`text-xl font-bold ${isValidProcess ? 'text-green-500' : 'text-red-500'}`}>
                ΔS<sub>total</sub> = {totalEntropyChange.toFixed(3)} J/K
              </div>
              <div className="text-xs mt-1">
                {isValidProcess ? (
                  <span className="text-green-500">✓ Valid Process</span>
                ) : (
                  <span className="text-red-500 flex items-center justify-center gap-1">
                    <AlertTriangle className="w-3 h-3" />
                    Impossible Process
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Process Animation */}
        {isRunning && (
          <div className="text-center p-4 bg-primary/10 rounded-lg border border-primary/30">
            <Badge variant="secondary" className="gap-2 mb-2">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
              Process Steps: {processStep}/3
            </Badge>
            <div className="flex justify-center gap-4 mt-2">
              {[1, 2, 3].map(step => (
                <div 
                  key={step}
                  className={`w-3 h-3 rounded-full ${
                    processStep >= step ? 'bg-primary' : 'bg-muted'
                  }`}
                />
              ))}
            </div>
          </div>
        )}

        {/* Accumulated Entropy */}
        <Card className="bg-gradient-to-r from-purple-500/10 to-pink-500/10">
          <CardContent className="p-4 text-center">
            <div className="text-sm text-muted-foreground mb-1">Total Entropy Generated</div>
            <div className="text-3xl font-bold text-purple-500">
              S<sub>gen</sub> = {system.entropyGenerated.toFixed(3)} J/K
            </div>
            <div className="text-sm text-muted-foreground mt-1">
              Cumulative irreversibility measure
            </div>
          </CardContent>
        </Card>

        {/* Explanation */}
        <div className="bg-muted/50 p-4 rounded-lg">
          <h4 className="font-semibold mb-2">Scientific Principle:</h4>
          <p className="text-sm text-muted-foreground">
            The Second Law states that the total entropy of an isolated system can never decrease over time. 
            In any real process, entropy is generated due to irreversibilities like friction, heat transfer 
            across finite temperature differences, and mixing.
          </p>
          <div className="mt-2 text-xs font-mono bg-background/50 p-2 rounded">
            ΔS<sub>total</sub> = ΔS<sub>hot</sub> + ΔS<sub>cold</sub> ≥ 0
          </div>
        </div>
      </CardContent>
    </Card>
  );
}