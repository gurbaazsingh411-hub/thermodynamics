import { useState, useMemo, useEffect } from 'react';
import { useThermoStore } from '@/store/thermoStore';
import { useDebouncedCallback } from '@/hooks/use-debounce';
import { useKeyboardShortcuts } from '@/hooks/use-keyboard-shortcuts';
import { useToast } from '@/hooks/use-toast';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { BottomPanel } from '@/components/layout/BottomPanel';
import { PVDiagram } from '@/components/diagrams/PVDiagram';
import { TSDiagram } from '@/components/diagrams/TSDiagram';
import PHDiagram from '@/components/diagrams/PHDiagram';
import HSDiagram from '@/components/diagrams/HSDiagram';
import { MetricsPanel } from '@/components/panels/MetricsPanel';
import { EducationalMode } from '@/components/educational/EducationalMode';
import { AnimatedCycleDiagram } from '@/components/educational/AnimatedCycleDiagram';
import { ExportButtons } from '@/components/ExportButtons';
import { PresetSelector } from '@/components/PresetSelector';

import { CycleType, FluidProperties } from '@/types/thermodynamics';
import {
  FLUIDS,
  generateOttoCycle,
  generateDieselCycle,
  generateBraytonCycle,
  generateCarnotCycle,
  generateRankineCycle,
  generateRefrigerationCycle,
  calculateRealGasState,
  calculateSteamProperties
} from '@/lib/thermodynamics';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { GraduationCap, LineChart, Download, User, Settings } from 'lucide-react';
import { Input } from '@/components/ui/input';

const Index = () => {
  const {
    cycleType,
    fluid,
    parameters,
    cycle,
    isLoading,
    useRealGas,
    steamQuality,
    setCycleType,
    setFluid,
    setParameter,
    setCycle,
    setLoading,
    setUseRealGas,
    setSteamQuality,
    resetParameters
  } = useThermoStore();

  const { toast } = useToast();
  const [isEducationalMode, setIsEducationalMode] = useState(false);

  // Additional parameters for Rankine and Refrigeration cycles
  const [rankineParams, setRankineParams] = useState({
    boilerPressure: 3000, // kPa
    condenserPressure: 10, // kPa
    turbineInletTemp: 800, // K
    pumpEfficiency: 0.8,
    turbineEfficiency: 0.85,
  });

  const [refrigerationParams, setRefrigerationParams] = useState({
    evaporatorTemp: 273.15, // K
    condenserTemp: 313.15, // K
    superheat: 5,
    subcool: 5,
    compressorEfficiency: 0.8,
  });



  // Keyboard shortcuts
  useKeyboardShortcuts({
    onToggleEducationalMode: () => setIsEducationalMode(!isEducationalMode),
    onSaveConfiguration: () => {
      toast({
        title: "Configuration Saved",
        description: "Current settings have been saved to browser storage",
      });
    }
  });

  // Debounced parameter change handler
  const debouncedParameterChange = useDebouncedCallback(
    (key: string, value: number) => {
      setParameter(key, value);
    },
    300 // 300ms debounce delay
  );

  const handleParameterChange = (key: string, value: number) => {
    debouncedParameterChange(key, value);
  };

  // Calculate cycle when parameters change
  useEffect(() => {
    const calculateCycle = () => {
      setLoading(true);
      try {
        let calculatedCycle;
        switch (cycleType) {
          case 'otto':
            calculatedCycle = generateOttoCycle(
              parameters.T1,
              parameters.P1,
              parameters.compressionRatio,
              parameters.heatAddition,
              fluid,
              useRealGas
            );
            break;
          case 'diesel':
            calculatedCycle = generateDieselCycle(
              parameters.T1,
              parameters.P1,
              parameters.compressionRatio,
              parameters.cutoffRatio,
              fluid,
              useRealGas
            );
            break;
          case 'brayton':
            calculatedCycle = generateBraytonCycle(
              parameters.T1,
              parameters.P1,
              parameters.pressureRatio,
              parameters.T3,
              fluid,
              useRealGas
            );
            break;
          case 'carnot':
            calculatedCycle = generateCarnotCycle(
              parameters.T3,
              parameters.T1,
              parameters.P1,
              fluid,
              useRealGas
            );
            break;
          case 'rankine':
            calculatedCycle = generateRankineCycle(
              rankineParams.boilerPressure,
              rankineParams.condenserPressure,
              rankineParams.turbineInletTemp,
              rankineParams.pumpEfficiency,
              rankineParams.turbineEfficiency,
              fluid,
              useRealGas
            );
            break;
          case 'refrigeration':
            calculatedCycle = generateRefrigerationCycle(
              refrigerationParams.evaporatorTemp,
              refrigerationParams.condenserTemp,
              refrigerationParams.superheat,
              refrigerationParams.subcool,
              refrigerationParams.compressorEfficiency,
              fluid,
              useRealGas
            );
            break;
          default:
            calculatedCycle = generateOttoCycle(
              parameters.T1,
              parameters.P1,
              parameters.compressionRatio,
              parameters.heatAddition,
              fluid,
              useRealGas
            );
        }
        setCycle(calculatedCycle);
      } catch (error) {
        console.error('Error calculating cycle:', error);
        // Set a default/fallback cycle
        const defaultCycle = generateOttoCycle(
          parameters.T1,
          parameters.P1,
          parameters.compressionRatio,
          parameters.heatAddition,
          fluid
        );
        setCycle(defaultCycle);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(calculateCycle, 100);
    return () => clearTimeout(timer);
  }, [cycleType, fluid, parameters, generateOttoCycle, generateDieselCycle, generateBraytonCycle, generateCarnotCycle, generateRankineCycle, generateRefrigerationCycle, setCycle, setLoading]);

  // Ensure we always have a valid cycle to render
  const displayCycle = cycle || (() => {
    const defaultCycle = generateOttoCycle(
      parameters.T1,
      parameters.P1,
      parameters.compressionRatio,
      parameters.heatAddition,
      fluid
    );
    setCycle(defaultCycle);
    return defaultCycle;
  })();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <div className="flex flex-1">
        <Sidebar />

        <main className="flex-1 flex flex-col min-h-0">
          {/* Mode Toggle */}
          <div className="px-6 py-3 border-b border-border bg-card/50 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <LineChart className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Simulation</span>
              </div>
              <PresetSelector />
              <ExportButtons cycle={displayCycle} pvDiagramId="pv-diagram" tsDiagramId="ts-diagram" />

              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  // Removed authentication - just show a demo profile or settings
                  alert('Authentication removed - profile feature coming soon');
                }}
                className="gap-2"
              >
                <User className="w-4 h-4" />
                Profile
              </Button>

              {/* Real Gas and Steam Quality Controls */}
              <div className="flex items-center gap-2">
                <Switch
                  id="real-gas"
                  checked={useRealGas}
                  onCheckedChange={setUseRealGas}
                />
                <Label
                  htmlFor="real-gas"
                  className="text-sm cursor-pointer"
                >
                  Real Gas Behavior
                </Label>
              </div>

              {fluid.name === 'Water' && (
                <div className="flex items-center gap-2">
                  <Label htmlFor="steam-quality" className="text-sm">
                    Steam Quality:
                  </Label>
                  <Input
                    id="steam-quality"
                    type="number"
                    min="0"
                    max="1"
                    step="0.01"
                    value={steamQuality}
                    onChange={(e) => setSteamQuality(parseFloat(e.target.value) || 0)}
                    className="w-20"
                  />
                </div>
              )}

              {/* Rankine Cycle Parameters */}
              {cycleType === 'rankine' && (
                <div className="flex items-center gap-4 ml-4">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="boiler-pressure" className="text-sm">
                      Boiler Pressure (kPa):
                    </Label>
                    <Input
                      id="boiler-pressure"
                      type="number"
                      min="1"
                      max="10000"
                      step="10"
                      value={rankineParams.boilerPressure}
                      onChange={(e) => setRankineParams({ ...rankineParams, boilerPressure: parseFloat(e.target.value) || 3000 })}
                      className="w-24"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Label htmlFor="turbine-temp" className="text-sm">
                      Turbine Temp (K):
                    </Label>
                    <Input
                      id="turbine-temp"
                      type="number"
                      min="300"
                      max="1000"
                      step="10"
                      value={rankineParams.turbineInletTemp}
                      onChange={(e) => setRankineParams({ ...rankineParams, turbineInletTemp: parseFloat(e.target.value) || 800 })}
                      className="w-24"
                    />
                  </div>
                </div>
              )}

              {/* Refrigeration Cycle Parameters */}
              {cycleType === 'refrigeration' && (
                <div className="flex items-center gap-4 ml-4">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="evap-temp" className="text-sm">
                      Evaporator Temp (K):
                    </Label>
                    <Input
                      id="evap-temp"
                      type="number"
                      min="200"
                      max="300"
                      step="1"
                      value={refrigerationParams.evaporatorTemp}
                      onChange={(e) => setRefrigerationParams({ ...refrigerationParams, evaporatorTemp: parseFloat(e.target.value) || 273.15 })}
                      className="w-24"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Label htmlFor="cond-temp" className="text-sm">
                      Condenser Temp (K):
                    </Label>
                    <Input
                      id="cond-temp"
                      type="number"
                      min="300"
                      max="400"
                      step="1"
                      value={refrigerationParams.condenserTemp}
                      onChange={(e) => setRefrigerationParams({ ...refrigerationParams, condenserTemp: parseFloat(e.target.value) || 313.15 })}
                      className="w-24"
                    />
                  </div>
                </div>
              )}
              <Switch
                id="educational-mode"
                checked={isEducationalMode}
                onCheckedChange={setIsEducationalMode}
              />
              <div className="flex items-center gap-2">
                <GraduationCap className={`w-4 h-4 ${isEducationalMode ? 'text-warning' : 'text-muted-foreground'}`} />
                <Label
                  htmlFor="educational-mode"
                  className={`text-sm cursor-pointer ${isEducationalMode ? 'text-warning font-medium' : 'text-muted-foreground'}`}
                >
                  Educational Mode
                </Label>
              </div>
            </div>
            {isEducationalMode && (
              <span className="text-xs text-warning bg-warning/10 px-3 py-1 rounded-full border border-warning/30">
                Step-by-step learning enabled
              </span>
            )}
          </div>

          {/* Main Content Area - Now allows vertical scrolling */}
          <div className="flex-1 p-6 overflow-y-auto">
            {isEducationalMode ? (
              <div className="space-y-6 max-w-7xl mx-auto">
                {/* Educational Mode Content */}
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                  <div className="xl:col-span-2">
                    <EducationalMode
                      cycle={displayCycle}
                      compressionRatio={parameters.compressionRatio}
                      pressureRatio={parameters.pressureRatio}
                      cutoffRatio={parameters.cutoffRatio}
                      gamma={fluid.gamma}
                    />
                  </div>
                  <div>
                    <AnimatedCycleDiagram cycle={displayCycle} currentProcess={0} />
                  </div>
                </div>

                {/* Diagrams in Educational Mode */}
                <div className="grid grid-cols-2 gap-6">
                  <div id="pv-diagram">
                    <PVDiagram cycle={displayCycle} />
                  </div>
                  <div id="ts-diagram">
                    <TSDiagram cycle={displayCycle} />
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6 max-w-7xl mx-auto">
                {/* Metrics */}
                <div className="animate-fade-in">
                  <MetricsPanel cycle={displayCycle} />
                </div>

                {/* Diagrams */}
                <div className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
                  <Tabs defaultValue="both" className="w-full">
                    <TabsList className="bg-muted/50 mb-4">
                      <TabsTrigger value="both">Both Diagrams</TabsTrigger>
                      <TabsTrigger value="pv">P-V Only</TabsTrigger>
                      <TabsTrigger value="ts">T-S Only</TabsTrigger>
                      <TabsTrigger value="ph">P-H Only</TabsTrigger>
                      <TabsTrigger value="hs">H-S Only</TabsTrigger>
                    </TabsList>

                    <TabsContent value="both">
                      <div className="grid grid-cols-2 gap-6">
                        <div id="pv-diagram">
                          <PVDiagram cycle={displayCycle} />
                        </div>
                        <div id="ts-diagram">
                          <TSDiagram cycle={displayCycle} />
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="pv">
                      <div id="pv-diagram">
                        <PVDiagram cycle={displayCycle} className="max-w-3xl mx-auto" />
                      </div>
                    </TabsContent>

                    <TabsContent value="ts">
                      <div id="ts-diagram">
                        <TSDiagram cycle={displayCycle} className="max-w-3xl mx-auto" />
                      </div>
                    </TabsContent>

                    <TabsContent value="ph">
                      <div id="ph-diagram">
                        <PHDiagram cycle={displayCycle} className="max-w-3xl mx-auto" />
                      </div>
                    </TabsContent>

                    <TabsContent value="hs">
                      <div id="hs-diagram">
                        <HSDiagram cycle={displayCycle} className="max-w-3xl mx-auto" />
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Panel - Will now scroll with the rest of the content */}
          <div className="mt-auto">
            <BottomPanel cycle={displayCycle} />
          </div>
        </main>
      </div>


    </div>
  );
};

export default Index;
