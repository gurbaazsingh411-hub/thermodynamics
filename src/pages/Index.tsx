import { useState, useMemo, useEffect } from 'react';
import { useThermoStore } from '@/store/thermoStore';
import { useDebouncedCallback } from '@/hooks/use-debounce';
import { useKeyboardShortcuts } from '@/hooks/use-keyboard-shortcuts';
import { useToast } from '@/hooks/use-toast';
import { useAuthStore } from '@/store/authStore';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { BottomPanel } from '@/components/layout/BottomPanel';
import { PVDiagram } from '@/components/diagrams/PVDiagram';
import { TSDiagram } from '@/components/diagrams/TSDiagram';
import { MetricsPanel } from '@/components/panels/MetricsPanel';
import { EducationalMode } from '@/components/educational/EducationalMode';
import { AnimatedCycleDiagram } from '@/components/educational/AnimatedCycleDiagram';
import { ExportButtons } from '@/components/ExportButtons';
import { PresetSelector } from '@/components/PresetSelector';
import { TestCaseManager } from '@/components/TestCaseManager';
import { AuthForm } from '@/components/AuthForm';
import { UserProfile } from '@/components/UserProfile';
import { CycleType, FluidProperties } from '@/types/thermodynamics';
import { 
  FLUIDS, 
  generateOttoCycle, 
  generateDieselCycle, 
  generateBraytonCycle 
} from '@/lib/thermodynamics';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { GraduationCap, LineChart, Download, User } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';

const Index = () => {
  const {
    cycleType,
    fluid,
    parameters,
    cycle,
    isLoading,
    setCycleType,
    setFluid,
    setParameter,
    setCycle,
    setLoading,
    resetParameters
  } = useThermoStore();

  const { isAuthenticated, initializeAuth, isLoading: authLoading } = useAuthStore();
  const { toast } = useToast();
  const [isEducationalMode, setIsEducationalMode] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  // Initialize auth on mount
  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

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
              fluid
            );
            break;
          case 'diesel':
            calculatedCycle = generateDieselCycle(
              parameters.T1,
              parameters.P1,
              parameters.compressionRatio,
              parameters.cutoffRatio,
              fluid
            );
            break;
          case 'brayton':
            calculatedCycle = generateBraytonCycle(
              parameters.T1,
              parameters.P1,
              parameters.pressureRatio,
              parameters.T3,
              fluid
            );
            break;
          default:
            calculatedCycle = generateOttoCycle(
              parameters.T1,
              parameters.P1,
              parameters.compressionRatio,
              parameters.heatAddition,
              fluid
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
  }, [cycleType, fluid, parameters, generateOttoCycle, generateDieselCycle, generateBraytonCycle, setCycle, setLoading]);

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
              
              {isAuthenticated ? (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setShowProfile(true)}
                  className="gap-2"
                >
                  <User className="w-4 h-4" />
                  Profile
                </Button>
              ) : (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setShowAuthDialog(true)}
                  className="gap-2"
                >
                  <User className="w-4 h-4" />
                  Sign In
                </Button>
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
      
      {/* Authentication Dialog */}
      <Dialog open={showAuthDialog} onOpenChange={setShowAuthDialog}>
        <DialogContent className="sm:max-w-md">
          <AuthForm mode={authMode} onModeChange={setAuthMode} />
        </DialogContent>
      </Dialog>
      
      {/* User Profile Dialog */}
      <Dialog open={showProfile} onOpenChange={setShowProfile}>
        <DialogContent className="sm:max-w-md">
          <UserProfile />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;
