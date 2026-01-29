import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Flame, Droplets, Wind, RotateCcw, Snowflake, Zap, Database, BookOpen, Thermometer, ArrowRightLeft } from 'lucide-react';
import { CycleType, ThermodynamicCycle } from '@/types/thermodynamics';
import { 
  FLUIDS,
  generateOttoCycle,
  generateDieselCycle,
  generateBraytonCycle,
  generateCarnotCycle,
  generateRankineCycle,
  generateRefrigerationCycle
} from '@/lib/thermodynamics';
import { useThermoStore } from '@/store/thermoStore';
import { useNavigate } from 'react-router-dom';
import { ZerothLawSimulator } from '@/components/laws/ZerothLawSimulator';
import { FirstLawSimulator } from '@/components/laws/FirstLawSimulator';
import { SecondLawSimulator } from '@/components/laws/SecondLawSimulator';


interface CycleInfo {
  id: string;
  name: string;
  type: CycleType;
  description: string;
  icon: React.ReactNode;
  category: string;
  applications: string[];
  typicalEfficiency: string;
  parameters: Record<string, any>;
}

const CYCLE_INFO: CycleInfo[] = [
  {
    id: 'otto',
    name: 'Otto Cycle',
    type: 'otto',
    description: 'Spark-ignition internal combustion engine cycle with constant volume heat addition',
    icon: <Flame className="w-6 h-6" />,
    category: 'Internal Combustion',
    applications: ['Automotive engines', 'Motorcycles', 'Small aircraft engines'],
    typicalEfficiency: '25-35%',
    parameters: {
      T1: 300,
      P1: 100,
      compressionRatio: 8,
      heatAddition: 1000
    }
  },
  {
    id: 'diesel',
    name: 'Diesel Cycle',
    type: 'diesel',
    description: 'Compression-ignition engine cycle with constant pressure heat addition',
    icon: <Droplets className="w-6 h-6" />,
    category: 'Internal Combustion',
    applications: ['Truck engines', 'Ship engines', 'Heavy machinery'],
    typicalEfficiency: '35-45%',
    parameters: {
      T1: 300,
      P1: 100,
      compressionRatio: 16,
      cutoffRatio: 1.8
    }
  },
  {
    id: 'brayton',
    name: 'Brayton Cycle',
    type: 'brayton',
    description: 'Gas turbine power cycle with constant pressure heat addition',
    icon: <Wind className="w-6 h-6" />,
    category: 'Gas Turbine',
    applications: ['Jet engines', 'Power plants', 'Helicopter engines'],
    typicalEfficiency: '40-60%',
    parameters: {
      T1: 300,
      P1: 100,
      pressureRatio: 8,
      T3: 1200
    }
  },
  {
    id: 'carnot',
    name: 'Carnot Cycle',
    type: 'carnot',
    description: 'Theoretical reversible cycle with maximum possible efficiency',
    icon: <RotateCcw className="w-6 h-6" />,
    category: 'Theoretical',
    applications: ['Thermodynamic analysis', 'Efficiency benchmarking'],
    typicalEfficiency: '60-80% (theoretical)',
    parameters: {
      T1: 300,
      T3: 1200,
      P1: 100
    }
  },
  {
    id: 'rankine',
    name: 'Rankine Cycle',
    type: 'rankine',
    description: 'Steam power cycle used in thermal power plants',
    icon: <Zap className="w-6 h-6" />,
    category: 'Steam Power',
    applications: ['Coal power plants', 'Nuclear reactors', 'Geothermal plants'],
    typicalEfficiency: '30-45%',
    parameters: {
      boilerPressure: 3000,
      condenserPressure: 10,
      turbineInletTemp: 800
    }
  },
  {
    id: 'refrigeration',
    name: 'Vapor Compression Cycle',
    type: 'refrigeration',
    description: 'Refrigeration and air conditioning cycle',
    icon: <Snowflake className="w-6 h-6" />,
    category: 'Refrigeration',
    applications: ['Home refrigerators', 'Air conditioners', 'Industrial cooling'],
    typicalEfficiency: 'COP: 2-4',
    parameters: {
      evaporatorTemp: 273.15,
      condenserTemp: 313.15,
      superheat: 5,
      subcool: 5
    }
  }
];

export const CycleDashboard = () => {
  const [cyclesData, setCyclesData] = useState<{[key: string]: ThermodynamicCycle | null}>({});
  const [loading, setLoading] = useState(true);
  const { setCycleType, setParameter, setFluid, setCycle } = useThermoStore();
  const navigate = useNavigate();

  useEffect(() => {
    const calculateAllCycles = async () => {
      setLoading(true);
      const results: {[key: string]: ThermodynamicCycle | null} = {};
      
      try {
        // Calculate Otto cycle
        results['otto'] = generateOttoCycle(
          300, 100, 8, 1000, FLUIDS.air
        );
        
        // Calculate Diesel cycle
        results['diesel'] = generateDieselCycle(
          300, 100, 16, 1.8, FLUIDS.air
        );
        
        // Calculate Brayton cycle
        results['brayton'] = generateBraytonCycle(
          300, 100, 8, 1200, FLUIDS.air
        );
        
        // Calculate Carnot cycle
        results['carnot'] = generateCarnotCycle(
          1200, 300, 100, FLUIDS.air
        );
        
        // Calculate Rankine cycle (basic calculation)
        results['rankine'] = generateRankineCycle(
          3000, 10, 800, 0.8, 0.85, FLUIDS.water
        );
        
        // Calculate Refrigeration cycle (basic calculation)
        results['refrigeration'] = generateRefrigerationCycle(
          273.15, 313.15, 5, 5, 0.8, FLUIDS.r134a
        );
      } catch (error) {
        console.error('Error calculating cycles:', error);
      }
      
      setCyclesData(results);
      setLoading(false);
    };

    calculateAllCycles();
  }, []);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Internal Combustion': return 'bg-orange-500/10 text-orange-500 border-orange-500/30';
      case 'Gas Turbine': return 'bg-blue-500/10 text-blue-500 border-blue-500/30';
      case 'Theoretical': return 'bg-purple-500/10 text-purple-500 border-purple-500/30';
      case 'Steam Power': return 'bg-red-500/10 text-red-500 border-red-500/30';
      case 'Refrigeration': return 'bg-cyan-500/10 text-cyan-500 border-cyan-500/30';
      default: return 'bg-gray-500/10 text-gray-500 border-gray-500/30';
    }
  };

  const getEfficiencyColor = (efficiency: number) => {
    if (efficiency >= 50) return 'text-green-500';
    if (efficiency >= 30) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent mb-2">
            Thermodynamic Cycles Dashboard
          </h1>
          <p className="text-muted-foreground text-lg">
            Explore and compare different thermodynamic cycles used in engineering applications
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {CYCLE_INFO.map((_, index) => (
              <Card key={index} className="animate-pulse">
                <CardHeader>
                  <div className="h-6 bg-muted rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-muted rounded w-1/2"></div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="h-4 bg-muted rounded"></div>
                    <div className="h-4 bg-muted rounded w-5/6"></div>
                    <div className="h-8 bg-muted rounded mt-4"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Cycles Grid */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {CYCLE_INFO.map((cycle) => {
              const cycleData = cyclesData[cycle.id];
              
              return (
                <Card 
                  key={cycle.id} 
                  className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-border/50"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-primary/10 text-primary">
                          {cycle.icon}
                        </div>
                        <div>
                          <CardTitle className="text-xl">{cycle.name}</CardTitle>
                          <Badge className={`${getCategoryColor(cycle.category)} mt-1`}>
                            {cycle.category}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <CardDescription className="mt-3">
                      {cycle.description}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    {/* Applications */}
                    <div>
                      <h4 className="font-semibold text-sm text-muted-foreground mb-2">Applications:</h4>
                      <ul className="text-sm space-y-1">
                        {cycle.applications.map((app, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-primary mt-1">•</span>
                            <span>{app}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Efficiency */}
                    <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                      <span className="text-sm font-medium">Typical Efficiency:</span>
                      <span className={`font-bold ${getEfficiencyColor(
                        parseFloat(cycle.typicalEfficiency.replace('%', '').split('-')[0])
                      )}`}>
                        {cycle.typicalEfficiency}
                      </span>
                    </div>

                    {/* Calculated Data (if available) */}
                    {cycleData && (
                      <div className="space-y-2 p-3 bg-secondary/20 rounded-lg">
                        <div className="flex justify-between text-sm">
                          <span>Calculated Efficiency:</span>
                          <span className={`font-semibold ${getEfficiencyColor(cycleData.efficiency)}`}>
                            {cycleData.efficiency.toFixed(1)}%
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Net Work Output:</span>
                          <span className="font-semibold">
                            {cycleData.netWork.toFixed(1)} kJ/kg
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Heat Input:</span>
                          <span className="font-semibold">
                            {cycleData.heatIn.toFixed(1)} kJ/kg
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Action Button */}
                    <Button 
                      className="w-full group"
                      variant="outline"
                      onClick={() => {
                        // Set the cycle type in the store
                        setCycleType(cycle.type as CycleType);
                        
                        // Set initial parameters based on the cycle type
                        Object.entries(cycle.parameters).forEach(([key, value]) => {
                          setParameter(key, value);
                        });
                        
                        // Set a default fluid based on the cycle
                        if (cycle.type === 'refrigeration') {
                          setFluid(FLUIDS.r134a);
                        } else if (cycle.type === 'rankine') {
                          setFluid(FLUIDS.water);
                        } else {
                          setFluid(FLUIDS.air);
                        }
                        
                        // Set the calculated cycle data if available
                        if (cycleData) {
                          setCycle(cycleData);
                        }
                        
                        // Navigate to the simulator
                        navigate('/');
                      }}
                    >
                      <span>Explore Cycle</span>
                      <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Summary Statistics */}
        {!loading && (
          <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-primary">{CYCLE_INFO.length}</div>
                <div className="text-sm text-muted-foreground">Total Cycles</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-orange-500">
                  {CYCLE_INFO.filter(c => c.category === 'Internal Combustion').length}
                </div>
                <div className="text-sm text-muted-foreground">IC Engines</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-500">
                  {CYCLE_INFO.filter(c => c.category === 'Gas Turbine').length +
                   CYCLE_INFO.filter(c => c.category === 'Steam Power').length}
                </div>
                <div className="text-sm text-muted-foreground">Power Cycles</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-cyan-500">
                  {CYCLE_INFO.filter(c => c.category === 'Refrigeration').length}
                </div>
                <div className="text-sm text-muted-foreground">Cooling Cycles</div>
              </CardContent>
            </Card>
          </div>
        )}
        
        {/* Thermodynamic Laws Section */}
        <div className="mt-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent mb-2">
              Fundamental Laws of Thermodynamics
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Interactive visualizations of the foundational principles governing energy and entropy
            </p>
          </div>
          
          <div className="space-y-8">
            <ZerothLawSimulator />
            <FirstLawSimulator />
            <SecondLawSimulator />
          </div>
        </div>
        

      </div>
    </div>
  );
};