import { useState } from 'react';
import { motion } from 'framer-motion';
import { Header } from '@/components/layout/Header';
import {
    Thermometer,
    ArrowRight,
    ArrowLeft,
    RotateCcw,
    GraduationCap,
    Info,
    Waves,
    Sun,
    Wind,
    ArrowLeftRight,
    Activity,
    Lightbulb,
    Target
} from 'lucide-react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area,
    ReferenceLine
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const HeatTransfer = () => {
    const [isStudyMode, setIsStudyMode] = useState(false);

    // Conduction State
    const [showMicroscopic, setShowMicroscopic] = useState(false);
    const [conductionMaterial, setConductionMaterial] = useState('custom');
    const [conductionParams, setConductionParams] = useState({
        temperatureLeft: 400,
        temperatureRight: 300,
        thickness: 0.1,
        conductivity: 50
    });

    const materials = {
        custom: { name: 'Custom', k: 50 },
        copper: { name: 'Copper', k: 400 },
        aluminum: { name: 'Aluminum', k: 235 },
        iron: { name: 'Iron', k: 80 },
        glass: { name: 'Glass', k: 0.8 },
        wood: { name: 'Wood', k: 0.15 }
    };

    const handleMaterialChange = (material: string) => {
        setConductionMaterial(material);
        if (material !== 'custom') {
            setConductionParams(prev => ({ ...prev, conductivity: materials[material as keyof typeof materials].k }));
        }
    };

    const heatFlux = (conductionParams.conductivity * (conductionParams.temperatureLeft - conductionParams.temperatureRight)) / conductionParams.thickness;

    // Convection State
    const [convectionType, setConvectionType] = useState<'natural' | 'forced'>('natural');
    const [convectionParams, setConvectionParams] = useState({
        tempSurface: 350,
        tempFluid: 293, // 20°C
        hCoeff: 10 // W/m²K (Start with Natural)
    });

    const handleConvectionTypeChange = (type: 'natural' | 'forced') => {
        setConvectionType(type);
        // Set realistic defaults when switching
        if (type === 'natural') {
            setConvectionParams(prev => ({ ...prev, hCoeff: 10 }));
        } else {
            setConvectionParams(prev => ({ ...prev, hCoeff: 50 }));
        }
    };

    const qConvection = convectionParams.hCoeff * (convectionParams.tempSurface - convectionParams.tempFluid);

    // Radiation State
    const [radiationMaterial, setRadiationMaterial] = useState('custom');
    const [radiationParams, setRadiationParams] = useState({
        tempSurface: 800,
        tempSurr: 300,
        emissivity: 0.85
    });

    const radiationMaterials = {
        custom: { name: 'Custom', e: 0.85 },
        blackbody: { name: 'Black Body', e: 1.0 },
        concrete: { name: 'Concrete', e: 0.92 },
        ice: { name: 'Ice/Water', e: 0.96 },
        aluminum_polish: { name: 'Polished Al', e: 0.04 },
        iron_rusted: { name: 'Rusted Iron', e: 0.70 }
    };

    const handleRadiationMaterialChange = (mat: string) => {
        setRadiationMaterial(mat);
        if (mat !== 'custom') {
            setRadiationParams(prev => ({ ...prev, emissivity: radiationMaterials[mat as keyof typeof radiationMaterials].e }));
        }
    };

    const sigma = 5.67e-8;
    const qRadiation = radiationParams.emissivity * sigma * (Math.pow(radiationParams.tempSurface, 4) - Math.pow(radiationParams.tempSurr, 4));

    // Planck's Law Data (Spectral Distribution)
    // E(lambda) approx for visualization. Peak wavelength (Wien's Law) = 2898 / T (microns)
    const planckData = Array.from({ length: 50 }, (_, i) => {
        const lambda = 0.1 + (i * 0.2); // Wavelength in microns (0.1 to 10)
        const T = radiationParams.tempSurface;

        // Simplified Planck's distribution shape
        // c1/lambda^5 * (1 / (exp(c2/lambda*T) - 1))
        // We Use constants scaled for chart visibility
        const c1 = 3.74e8;
        const c2 = 1.44e4;
        const powerIndex = c1 / Math.pow(lambda, 5);
        const expTerm = Math.exp(c2 / (lambda * T)) - 1;
        const spectralPower = (radiationParams.emissivity * powerIndex) / expTerm;

        return {
            lambda, // microns
            power: spectralPower / 1e8 // Scaled down for chart y-axis
        };
    });








    // Heat Exchanger State (Double Pipe Counter-Flow)
    const [exchangerParams, setExchangerParams] = useState({
        mHot: 0.5, // kg/s
        mCold: 0.5, // kg/s
        tHotIn: 350, // K
        tColdIn: 290, // K // ~17°C
        length: 5 // m
    });

    // Effectiveness-NTU method calculations
    const cp = 4186; // Water J/kgK
    const U = 500; // Overall heat transfer coeff W/m2K (Water-Water)
    const area = Math.PI * 0.1 * exchangerParams.length; // Diameter 0.1m approx

    const C_hot = exchangerParams.mHot * cp;
    const C_cold = exchangerParams.mCold * cp;
    const C_min = Math.min(C_hot, C_cold);
    const C_max = Math.max(C_hot, C_cold);
    const C_r = C_min / C_max;
    const NTU = (U * area) / C_min;

    // Counter-flow effectiveness formula
    // e = (1 - exp(-NTU * (1 - Cr))) / (1 - Cr * exp(-NTU * (1 - Cr)))
    // Special case Cr = 1: e = NTU / (1 + NTU)
    let effectiveness = 0;
    if (Math.abs(1 - C_r) < 0.001) {
        effectiveness = NTU / (1 + NTU);
    } else {
        const expTerm = Math.exp(-NTU * (1 - C_r));
        effectiveness = (1 - expTerm) / (1 - C_r * expTerm);
    }

    const Q_max = C_min * (exchangerParams.tHotIn - exchangerParams.tColdIn);
    const Q_actual = effectiveness * Q_max;

    const tHotOut = exchangerParams.tHotIn - Q_actual / C_hot;
    const tColdOut = exchangerParams.tColdIn + Q_actual / C_cold;

    // LMTD Calculation
    const deltaT1 = exchangerParams.tHotIn - tColdOut; // At hot inlet / cold outlet end
    const deltaT2 = tHotOut - exchangerParams.tColdIn; // At hot outlet / cold inlet end
    const lmtd = (deltaT1 === deltaT2) ? deltaT1 : (deltaT1 - deltaT2) / Math.log(deltaT1 / deltaT2);

    // Graph Data
    const conductionData = [
        { x: 0, temp: conductionParams.temperatureLeft },
        { x: conductionParams.thickness / 2, temp: (conductionParams.temperatureLeft + conductionParams.temperatureRight) / 2 },
        { x: conductionParams.thickness, temp: conductionParams.temperatureRight },
    ];

    const convectionData = Array.from({ length: 20 }, (_, i) => {
        const dt = (100 * i) / 19;
        return {
            dt,
            q: convectionParams.hCoeff * dt
        };
    });

    const radiationData = Array.from({ length: 20 }, (_, i) => {
        const t = (3000 * i) / 19;
        return {
            temp: t,
            power: radiationParams.emissivity * 5.67e-8 * Math.pow(t, 4)
        };
    });

    const exchangerData = [
        { x: 0, tHot: exchangerParams.tHotIn, tCold: tColdOut },
        { x: exchangerParams.length, tHot: tHotOut, tCold: exchangerParams.tColdIn }
    ];


    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Header />

            <div className="flex flex-1">
                <main className="flex-1 flex flex-col min-h-0">
                    {/* Study Mode Toggle */}
                    <div className="px-6 py-3 border-b border-border bg-card/50 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <Thermometer className="w-4 h-4 text-primary" />
                                <span className="font-semibold">Heat Transfer Visualization</span>
                            </div>

                            <div className="flex items-center gap-2 ml-4">
                                <Switch
                                    id="study-mode"
                                    checked={isStudyMode}
                                    onCheckedChange={setIsStudyMode}
                                />
                                <Label
                                    htmlFor="study-mode"
                                    className={`text-sm cursor-pointer flex items-center gap-2 ${isStudyMode ? 'text-warning font-medium' : 'text-muted-foreground'}`}
                                >
                                    <GraduationCap className="w-4 h-4" />
                                    Study Mode
                                </Label>
                            </div>
                        </div>

                        {isStudyMode && (
                            <span className="text-xs text-warning bg-warning/10 px-3 py-1 rounded-full border border-warning/30 animate-pulse">
                                Educational context active
                            </span>
                        )}
                    </div>

                    <div className="flex-1 p-6 overflow-y-auto">
                        <div className="max-w-7xl mx-auto space-y-6">
                            <Tabs defaultValue="conduction" className="w-full">
                                <TabsList className="grid w-full grid-cols-4 mb-8">
                                    <TabsTrigger value="conduction" className="gap-2">
                                        <Thermometer className="w-4 h-4" /> Conduction
                                    </TabsTrigger>
                                    <TabsTrigger value="convection" className="gap-2">
                                        <Waves className="w-4 h-4" /> Convection
                                    </TabsTrigger>
                                    <TabsTrigger value="radiation" className="gap-2">
                                        <Sun className="w-4 h-4" /> Radiation
                                    </TabsTrigger>
                                    <TabsTrigger value="exchanger" className="gap-2">
                                        <ArrowLeftRight className="w-4 h-4" /> Heat Exchanger
                                    </TabsTrigger>
                                </TabsList>

                                <TabsContent value="conduction" className="space-y-6">
                                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                        {/* Controls */}
                                        <Card className="lg:col-span-1">
                                            <CardHeader>
                                                <CardTitle className="text-lg">Parameters</CardTitle>
                                                <CardDescription>Adjust variables to see real-time heat flow</CardDescription>
                                            </CardHeader>
                                            <CardContent className="space-y-6">
                                                <div className="space-y-4">
                                                    <div className="flex justify-between">
                                                        <Label>Left Temp (T1)</Label>
                                                        <span className="text-sm font-mono">{conductionParams.temperatureLeft} K</span>
                                                    </div>
                                                    <Slider
                                                        value={[conductionParams.temperatureLeft]}
                                                        onValueChange={([v]) => setConductionParams(p => ({ ...p, temperatureLeft: v }))}
                                                        min={273}
                                                        max={1000}
                                                        step={1}
                                                    />
                                                </div>

                                                <div className="space-y-4">
                                                    <div className="flex justify-between">
                                                        <Label>Right Temp (T2)</Label>
                                                        <span className="text-sm font-mono">{conductionParams.temperatureRight} K</span>
                                                    </div>
                                                    <Slider
                                                        value={[conductionParams.temperatureRight]}
                                                        onValueChange={([v]) => setConductionParams(p => ({ ...p, temperatureRight: v }))}
                                                        min={273}
                                                        max={1000}
                                                        step={1}
                                                    />
                                                </div>

                                                <div className="space-y-4">
                                                    <div className="flex justify-between items-center">
                                                        <Label>Material</Label>
                                                        <select
                                                            className="text-sm bg-background border border-input rounded px-2 py-1"
                                                            value={conductionMaterial}
                                                            onChange={(e) => handleMaterialChange(e.target.value)}
                                                        >
                                                            {Object.entries(materials).map(([key, mat]) => (
                                                                <option key={key} value={key}>{mat.name}</option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                </div>

                                                <div className="space-y-4">
                                                    <div className="flex justify-between">
                                                        <Label>Conductivity (k)</Label>
                                                        <span className="text-sm font-mono">{conductionParams.conductivity} W/m·K</span>
                                                    </div>
                                                    <Slider
                                                        disabled={conductionMaterial !== 'custom'}
                                                        value={[conductionParams.conductivity]}
                                                        onValueChange={([v]) => {
                                                            setConductionParams(p => ({ ...p, conductivity: v }));
                                                            setConductionMaterial('custom');
                                                        }}
                                                        min={0.1}
                                                        max={400}
                                                        step={0.1}
                                                        className={conductionMaterial !== 'custom' ? 'opacity-50' : ''}
                                                    />
                                                </div>

                                                <div className="space-y-4">
                                                    <div className="flex justify-between">
                                                        <Label>Wall Thickness (L)</Label>
                                                        <span className="text-sm font-mono">{conductionParams.thickness} m</span>
                                                    </div>
                                                    <Slider
                                                        value={[conductionParams.thickness * 100]}
                                                        onValueChange={([v]) => setConductionParams(p => ({ ...p, thickness: v / 100 }))}
                                                        min={1}
                                                        max={50}
                                                        step={1}
                                                    />
                                                </div>
                                            </CardContent>
                                        </Card>

                                        {/* Visualization */}
                                        <Card className="lg:col-span-2">
                                            <CardHeader>
                                                <CardTitle>Conduction Visualization</CardTitle>
                                                <CardDescription>Fourier's Law: Q = -kA * (dT/dx)</CardDescription>
                                            </CardHeader>
                                            <CardContent className="flex flex-col items-center justify-center min-h-[400px]">
                                                <div className="relative w-full max-w-lg h-64 bg-muted/20 border-x-8 border-border flex items-center justify-center overflow-hidden rounded-md">
                                                    {/* Heat Gradient Visualization */}
                                                    <div
                                                        className="absolute inset-0 opacity-40 transition-all duration-500"
                                                        style={{
                                                            background: `linear-gradient(to right, 
                                hsl(${((conductionParams.temperatureLeft - 273) / 727) * 240}, 100%, 50%), 
                                hsl(${((conductionParams.temperatureRight - 273) / 727) * 240}, 100%, 50%))`
                                                        }}
                                                    />

                                                    {/* Standard View: Flow Particles */}
                                                    {!showMicroscopic && conductionParams.temperatureLeft > conductionParams.temperatureRight && (
                                                        <div className="absolute inset-0 flex items-center justify-around overflow-hidden">
                                                            {[...Array(5)].map((_, i) => (
                                                                <motion.div
                                                                    key={i}
                                                                    initial={{ x: -100, opacity: 0 }}
                                                                    animate={{ x: 500, opacity: [0, 1, 0] }}
                                                                    transition={{
                                                                        duration: Math.max(0.5, 5 / (heatFlux / 10000)),
                                                                        repeat: Infinity,
                                                                        delay: i * 0.4
                                                                    }}
                                                                    className="w-4 h-1 bg-white/60 rounded-full blur-[1px]"
                                                                />
                                                            ))}
                                                        </div>
                                                    )}

                                                    {/* Microscopic View: Atomic Vibration */}
                                                    {showMicroscopic && (
                                                        <div className="absolute inset-0 grid grid-cols-10 gap-1 p-2">
                                                            {[...Array(50)].map((_, i) => {
                                                                const col = i % 10;
                                                                const xPos = col / 9; // 0 to 1
                                                                const localTemp = conductionParams.temperatureLeft - xPos * (conductionParams.temperatureLeft - conductionParams.temperatureRight);
                                                                const vibrationSpeed = (localTemp / 1000) * 0.5; // Base speed
                                                                // High k = tighter bonds = faster transmission but potentially lower amplitude depending on model. 
                                                                // For visual simplicity: Hotter = faster, wider vibration.

                                                                return (
                                                                    <motion.div
                                                                        key={i}
                                                                        className="w-2 h-2 rounded-full mx-auto my-auto"
                                                                        style={{
                                                                            backgroundColor: `hsl(${((localTemp - 273) / 727) * 240}, 100%, 50%)`,
                                                                            boxShadow: `0 0 ${localTemp / 100}px currentColor`
                                                                        }}
                                                                        animate={{
                                                                            x: [Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1],
                                                                            y: [Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1],
                                                                        }}
                                                                        transition={{
                                                                            duration: Math.max(0.05, 0.5 - (localTemp / 2000)),
                                                                            repeat: Infinity,
                                                                            repeatType: "mirror"
                                                                        }}
                                                                    />
                                                                );
                                                            })}
                                                        </div>
                                                    )}

                                                    <div className="z-10 text-center space-y-2 pointer-events-none">
                                                        <div className="text-3xl font-bold font-mono text-white drop-shadow-md">
                                                            {Math.abs(heatFlux).toLocaleString(undefined, { maximumFractionDigits: 0 })} W/m²
                                                        </div>
                                                        <div className="text-sm text-white/80 font-medium uppercase tracking-widest drop-shadow-sm">
                                                            Heat Flux
                                                        </div>
                                                    </div>

                                                    {/* View Toggle */}
                                                    <div className="absolute bottom-2 right-2 pointer-events-auto">
                                                        <div className="flex items-center space-x-2 bg-black/40 backdrop-blur-sm p-1 rounded-full border border-white/10">
                                                            <Switch
                                                                id="micro-view"
                                                                checked={showMicroscopic}
                                                                onCheckedChange={setShowMicroscopic}
                                                                className="scale-75"
                                                            />
                                                            <Label htmlFor="micro-view" className="text-[10px] text-white pr-2 cursor-pointer">Microscopic</Label>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Summary Metrics */}
                                                <div className="grid grid-cols-2 gap-4 w-full mt-8">
                                                    <div className="p-4 rounded-lg bg-orange-500/10 border border-orange-500/20 text-center">
                                                        <div className="text-2xl font-bold text-orange-600">{conductionParams.temperatureLeft - conductionParams.temperatureRight} K</div>
                                                        <div className="text-xs text-muted-foreground uppercase font-semibold">Temp Difference</div>
                                                    </div>
                                                    <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20 text-center">
                                                        <div className="text-2xl font-bold text-blue-600">{(conductionParams.thickness / conductionParams.conductivity).toFixed(4)}</div>
                                                        <div className="text-xs text-muted-foreground uppercase font-semibold">Thermal Resistance</div>
                                                    </div>
                                                </div>

                                                {/* Graph */}
                                                <div className="mt-6 h-64 w-full bg-card border rounded-lg p-4">
                                                    <div className="text-sm font-semibold mb-2">Temperature Gradient</div>
                                                    <ResponsiveContainer width="100%" height="100%">
                                                        <AreaChart data={conductionData}>
                                                            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                                                            <XAxis dataKey="x" label={{ value: 'Distance (m)', position: 'insideBottom', offset: -5 }} />
                                                            <YAxis domain={['auto', 'auto']} label={{ value: 'Temp (K)', angle: -90, position: 'insideLeft' }} />
                                                            <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }} />
                                                            <Area type="monotone" dataKey="temp" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.2} />
                                                        </AreaChart>
                                                    </ResponsiveContainer>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </div>

                                    {/* Study Mode Content */}
                                    {isStudyMode && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="grid grid-cols-1 md:grid-cols-2 gap-6"
                                        >
                                            {/* Fourier's Law */}
                                            <Card className="border-warning/30 bg-warning/5">
                                                <CardHeader className="flex flex-row items-center gap-2">
                                                    <Info className="w-5 h-5 text-warning" />
                                                    <CardTitle className="text-warning">Fourier's Law of Conduction</CardTitle>
                                                </CardHeader>
                                                <CardContent className="text-sm space-y-3">
                                                    <p>
                                                        Heat flows through solids via molecular vibrations and free electron movement.
                                                        The fundamental equation is:
                                                    </p>
                                                    <div className="bg-background/80 p-3 rounded font-mono text-center text-lg my-2">
                                                        q = -k · (dT/dx)
                                                    </div>
                                                    <p><strong>Variables explained:</strong></p>
                                                    <ul className="list-disc pl-5 text-xs space-y-1 text-muted-foreground">
                                                        <li><strong>q:</strong> Heat flux (W/m²) — heat flow per unit area</li>
                                                        <li><strong>k:</strong> Thermal conductivity (W/m·K) — material property</li>
                                                        <li><strong>dT/dx:</strong> Temperature gradient (K/m)</li>
                                                    </ul>
                                                    <div className="bg-background/80 p-2 rounded text-xs border border-warning/10">
                                                        <strong>The negative sign:</strong> Heat naturally flows from hot to cold
                                                        (opposite to the temperature gradient direction).
                                                    </div>
                                                </CardContent>
                                            </Card>

                                            {/* Thermal Resistance */}
                                            <Card className="border-warning/30 bg-warning/5">
                                                <CardHeader className="flex flex-row items-center gap-2">
                                                    <GraduationCap className="w-5 h-5 text-warning" />
                                                    <CardTitle className="text-warning">Thermal Resistance (R)</CardTitle>
                                                </CardHeader>
                                                <CardContent className="text-sm space-y-3">
                                                    <p>
                                                        Analogous to electrical resistance (Ohm's Law):
                                                    </p>
                                                    <div className="grid grid-cols-2 gap-2 text-xs font-mono bg-background/50 p-2 rounded">
                                                        <div className="text-center border-r border-warning/10 pr-2">
                                                            <p className="font-bold">Electrical</p>
                                                            <p>V = I × R</p>
                                                            <p className="text-muted-foreground">Voltage = Current × Resistance</p>
                                                        </div>
                                                        <div className="text-center pl-2">
                                                            <p className="font-bold">Thermal</p>
                                                            <p>ΔT = Q × R_th</p>
                                                            <p className="text-muted-foreground">Temp diff = Heat flow × Resistance</p>
                                                        </div>
                                                    </div>
                                                    <div className="bg-background/80 p-2 rounded font-mono text-center text-sm my-2">
                                                        R_th = L / (k · A) [K/W]
                                                    </div>
                                                    <p className="text-xs text-muted-foreground">
                                                        <strong>Key insight:</strong> Thicker (large L) or less conductive (small k)
                                                        materials have higher thermal resistance.
                                                    </p>
                                                </CardContent>
                                            </Card>

                                            {/* Conductivity Values */}
                                            <Card className="border-warning/30 bg-warning/5">
                                                <CardHeader className="flex flex-row items-center gap-2">
                                                    <Target className="w-5 h-5 text-warning" />
                                                    <CardTitle className="text-warning">Thermal Conductivity Values</CardTitle>
                                                </CardHeader>
                                                <CardContent className="text-sm space-y-3">
                                                    <div className="grid grid-cols-3 gap-1 text-xs font-mono">
                                                        <div className="bg-background/50 p-1 text-center font-bold">Material</div>
                                                        <div className="bg-background/50 p-1 text-center font-bold">k (W/m·K)</div>
                                                        <div className="bg-background/50 p-1 text-center font-bold">Type</div>
                                                        <div className="p-1 text-center">Diamond</div><div className="p-1 text-center text-emerald-400">2000+</div><div className="p-1 text-center text-emerald-400">Excellent</div>
                                                        <div className="p-1 text-center">Copper</div><div className="p-1 text-center text-green-400">400</div><div className="p-1 text-center text-green-400">Great</div>
                                                        <div className="p-1 text-center">Aluminum</div><div className="p-1 text-center text-green-400">235</div><div className="p-1 text-center text-green-400">Great</div>
                                                        <div className="p-1 text-center">Steel</div><div className="p-1 text-center text-yellow-400">50</div><div className="p-1 text-center text-yellow-400">Good</div>
                                                        <div className="p-1 text-center">Glass</div><div className="p-1 text-center text-orange-400">0.8</div><div className="p-1 text-center text-orange-400">Poor</div>
                                                        <div className="p-1 text-center">Wood</div><div className="p-1 text-center text-red-400">0.15</div><div className="p-1 text-center text-red-400">Insulator</div>
                                                        <div className="p-1 text-center">Air</div><div className="p-1 text-center text-red-400">0.026</div><div className="p-1 text-center text-red-400">Insulator</div>
                                                        <div className="p-1 text-center">Aerogel</div><div className="p-1 text-center text-red-400">0.015</div><div className="p-1 text-center text-red-400">Best Ins.</div>
                                                    </div>
                                                    <p className="text-xs text-muted-foreground">
                                                        <strong>Why metals conduct well:</strong> Free electrons move easily,
                                                        carrying thermal energy quickly through the lattice.
                                                    </p>
                                                </CardContent>
                                            </Card>

                                            {/* Composite Walls */}
                                            <Card className="border-warning/30 bg-warning/5">
                                                <CardHeader className="flex flex-row items-center gap-2">
                                                    <Thermometer className="w-5 h-5 text-warning" />
                                                    <CardTitle className="text-warning">Composite Walls & Layers</CardTitle>
                                                </CardHeader>
                                                <CardContent className="text-sm space-y-3">
                                                    <p>
                                                        Multiple layers (like building walls) add resistance in series:
                                                    </p>
                                                    <div className="bg-background/80 p-2 rounded font-mono text-center text-sm my-2">
                                                        R_total = R₁ + R₂ + R₃ + ...
                                                    </div>
                                                    <p><strong>Example: Building Wall</strong></p>
                                                    <ul className="list-disc pl-5 text-xs space-y-1 text-muted-foreground">
                                                        <li>Drywall (12mm): R = 0.08 K/W</li>
                                                        <li>Insulation (100mm): R = 2.5 K/W</li>
                                                        <li>Brick (100mm): R = 0.15 K/W</li>
                                                    </ul>
                                                    <div className="bg-background/80 p-2 rounded text-xs border border-warning/10">
                                                        <strong>Key insight:</strong> The insulation dominates!
                                                        It provides ~92% of total thermal resistance.
                                                    </div>
                                                </CardContent>
                                            </Card>

                                            {/* Steady vs Transient */}
                                            <Card className="border-warning/30 bg-warning/5">
                                                <CardHeader className="flex flex-row items-center gap-2">
                                                    <Activity className="w-5 h-5 text-warning" />
                                                    <CardTitle className="text-warning">Steady vs Transient Conduction</CardTitle>
                                                </CardHeader>
                                                <CardContent className="text-sm space-y-3">
                                                    <p><strong>Steady State:</strong></p>
                                                    <p className="text-xs text-muted-foreground">
                                                        Temperature doesn't change with time. Heat in = Heat out everywhere.
                                                        Example: A wall after equilibrium is reached.
                                                    </p>
                                                    <p className="mt-2"><strong>Transient (Unsteady):</strong></p>
                                                    <p className="text-xs text-muted-foreground">
                                                        Temperature changes with time. Heat is being stored or released.
                                                        Example: Heating a cold metal rod.
                                                    </p>
                                                    <div className="bg-background/80 p-2 rounded text-xs border border-warning/10 mt-2">
                                                        <strong>Biot Number (Bi):</strong> Ratio of internal to surface resistance.
                                                        <p className="mt-1">Bi &lt; 0.1: Use lumped capacitance (uniform T inside)</p>
                                                        <p>Bi &gt; 0.1: Temperature varies inside the object</p>
                                                    </div>
                                                </CardContent>
                                            </Card>

                                            {/* Did You Know */}
                                            <Card className="border-warning/30 bg-warning/5">
                                                <CardHeader className="flex flex-row items-center gap-2">
                                                    <Lightbulb className="w-5 h-5 text-warning" />
                                                    <CardTitle className="text-warning">Did You Know?</CardTitle>
                                                </CardHeader>
                                                <CardContent className="text-sm space-y-3">
                                                    <div className="space-y-3">
                                                        <div className="flex gap-2">
                                                            <span className="text-warning font-bold">💎</span>
                                                            <p className="text-xs">
                                                                <strong>Diamond Heatsinks:</strong> Diamond has 5× the thermal conductivity
                                                                of copper! Used in high-power lasers and electronics.
                                                            </p>
                                                        </div>
                                                        <div className="flex gap-2">
                                                            <span className="text-warning font-bold">🏠</span>
                                                            <p className="text-xs">
                                                                <strong>Trapped Air:</strong> Insulation materials work by trapping tiny
                                                                pockets of air. Air's low conductivity does the insulating!
                                                            </p>
                                                        </div>
                                                        <div className="flex gap-2">
                                                            <span className="text-warning font-bold">🍳</span>
                                                            <p className="text-xs">
                                                                <strong>Cooking Pans:</strong> Copper-bottom pans heat evenly because
                                                                high k distributes heat quickly, preventing hot spots.
                                                            </p>
                                                        </div>
                                                        <div className="flex gap-2">
                                                            <span className="text-warning font-bold">🚀</span>
                                                            <p className="text-xs">
                                                                <strong>Space Tiles:</strong> Space shuttle tiles could be 1200°C on
                                                                outside, cool enough to touch on inside — extreme low conductivity!
                                                            </p>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </motion.div>
                                    )}
                                </TabsContent>

                                <TabsContent value="convection" className="space-y-6">
                                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                        {/* Controls */}
                                        <Card className="lg:col-span-1">
                                            <CardHeader>
                                                <CardTitle className="text-lg">Convection Parameters</CardTitle>
                                                <CardDescription>Newton's Law of Cooling</CardDescription>
                                            </CardHeader>
                                            <CardContent className="space-y-6">
                                                <div className="space-y-4">
                                                    <Label>Convection Mode</Label>
                                                    <div className="flex gap-2">
                                                        <Button
                                                            variant={convectionType === 'natural' ? 'default' : 'outline'}
                                                            className="flex-1"
                                                            onClick={() => handleConvectionTypeChange('natural')}
                                                        >
                                                            Natural
                                                        </Button>
                                                        <Button
                                                            variant={convectionType === 'forced' ? 'default' : 'outline'}
                                                            className="flex-1"
                                                            onClick={() => handleConvectionTypeChange('forced')}
                                                        >
                                                            Forced
                                                        </Button>
                                                    </div>
                                                </div>

                                                <div className="space-y-4">
                                                    <div className="flex justify-between">
                                                        <Label>Surface Temp (Ts)</Label>
                                                        <span className="text-sm font-mono">{convectionParams.tempSurface} K</span>
                                                    </div>
                                                    <Slider
                                                        value={[convectionParams.tempSurface]}
                                                        onValueChange={([v]) => setConvectionParams(p => ({ ...p, tempSurface: v }))}
                                                        min={273}
                                                        max={500}
                                                        step={1}
                                                    />
                                                </div>

                                                <div className="space-y-4">
                                                    <div className="flex justify-between">
                                                        <Label>Fluid Temp (T∞)</Label>
                                                        <span className="text-sm font-mono">{convectionParams.tempFluid} K</span>
                                                    </div>
                                                    <Slider
                                                        value={[convectionParams.tempFluid]}
                                                        onValueChange={([v]) => setConvectionParams(p => ({ ...p, tempFluid: v }))}
                                                        min={250}
                                                        max={400}
                                                        step={1}
                                                    />
                                                </div>

                                                <div className="space-y-4">
                                                    <div className="flex justify-between">
                                                        <Label>Heat Transfer Coeff (h)</Label>
                                                        <span className="text-sm font-mono">{convectionParams.hCoeff} W/m²K</span>
                                                    </div>
                                                    <Slider
                                                        value={[convectionParams.hCoeff]}
                                                        onValueChange={([v]) => setConvectionParams(p => ({ ...p, hCoeff: v }))}
                                                        min={5}
                                                        max={100}
                                                        step={1}
                                                    />
                                                </div>
                                            </CardContent>
                                        </Card>

                                        {/* Visualization */}
                                        <Card className="lg:col-span-2">
                                            <CardHeader>
                                                <CardTitle>Convection Visualization</CardTitle>
                                                <CardDescription>Fluid flow over a heated surface</CardDescription>
                                            </CardHeader>
                                            <CardContent className="flex flex-col items-center justify-center min-h-[400px]">
                                                <div className="relative w-full max-w-lg h-64 bg-slate-100 rounded-lg overflow-hidden border border-border">
                                                    {/* Surface */}
                                                    <div
                                                        className="absolute bottom-0 left-0 right-0 h-16 transition-colors duration-500 z-20"
                                                        style={{
                                                            backgroundColor: `hsl(${200 - (Math.min(convectionParams.tempSurface - 273, 200) / 200) * 180}, 70%, 50%)`
                                                        }}
                                                    >
                                                        <div className="absolute top-2 left-4 text-xs font-bold text-white/80">Surface (Ts)</div>
                                                        {/* Heat Shimmer Effect */}
                                                        {convectionParams.tempSurface > 350 && (
                                                            <div className="absolute -top-6 left-0 right-0 h-6 bg-white/10 blur-md animate-pulse pointer-events-none" />
                                                        )}
                                                    </div>

                                                    {/* Fluid Particles */}
                                                    {/* Fluid Particles & Boundary Layer */}
                                                    <div className="absolute inset-0 bottom-16 overflow-hidden bg-sky-50/50">
                                                        {/* Boundary Layer Gradient */}
                                                        {isStudyMode && (
                                                            <motion.div
                                                                className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-orange-500/30 to-transparent pointer-events-none z-10"
                                                                animate={{
                                                                    height: convectionType === 'natural' ? 80 : 30, // Thicker BL for natural
                                                                    opacity: convectionType === 'natural' ? 0.6 : 0.4
                                                                }}
                                                                transition={{ duration: 1 }}
                                                            >
                                                                <span className="absolute right-2 top-0 -translate-y-full text-[10px] text-white/70 italic border-b border-white/50 pr-2">
                                                                    Boundary Layer
                                                                </span>
                                                            </motion.div>
                                                        )}

                                                        {/* NATURAL CONVECTION: Rising Plumes */}
                                                        {convectionType === 'natural' && (
                                                            <>
                                                                {[...Array(15)].map((_, i) => (
                                                                    <motion.div
                                                                        key={`nat-${i}`}
                                                                        className="absolute w-4 h-4 rounded-full blur-[4px]"
                                                                        style={{
                                                                            backgroundColor: `hsl(${200 - (Math.min(convectionParams.tempSurface - 273, 200) / 200) * 180}, 70%, 50%)`,
                                                                            left: `${Math.random() * 100}%`,
                                                                        }}
                                                                        initial={{ y: 0, opacity: 0, scale: 0.5 }}
                                                                        animate={{
                                                                            y: [-20, -200], // Rise vertically
                                                                            x: [0, Math.sin(i) * 30], // Meander
                                                                            opacity: [0, 0.6, 0],
                                                                            scale: [0.5, 1.5]
                                                                        }}
                                                                        transition={{
                                                                            duration: 2 + Math.random() * 2, // Varies
                                                                            repeat: Infinity,
                                                                            delay: Math.random() * 2,
                                                                            ease: "easeOut"
                                                                        }}
                                                                    />
                                                                ))}
                                                                {/* Buoyancy Arrow */}
                                                                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center opacity-50 z-20">
                                                                    <div className="text-[10px] uppercase font-bold text-slate-500 mb-1">Buoyancy</div>
                                                                    <motion.div animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
                                                                        <Wind className="rotate-[-90deg] text-slate-400 w-6 h-6" />
                                                                    </motion.div>
                                                                </div>
                                                            </>
                                                        )}

                                                        {/* FORCED CONVECTION: Horizontal Streamlines with Profile */}
                                                        {convectionType === 'forced' && (
                                                            <>
                                                                {[...Array(20)].map((_, i) => {
                                                                    const pRow = i % 5; // 0 (bottom) to 4 (top)
                                                                    // Velocity Profile: Slower at bottom (pRow=0), faster at top
                                                                    const speedFactor = 0.5 + (pRow * 0.4);

                                                                    return (
                                                                        <motion.div
                                                                            key={`forced-${i}`}
                                                                            className="absolute h-[2px] rounded-full bg-slate-400/60"
                                                                            style={{
                                                                                top: `${80 - (pRow * 20)}%`, // Distribute vertically
                                                                                width: `${20 + Math.random() * 40}px`,
                                                                            }}
                                                                            initial={{ x: -60, opacity: 0 }}
                                                                            animate={{
                                                                                x: 600,
                                                                                opacity: [0, 1, 1, 0],
                                                                                // Turbulence: Jitter for bottom rows
                                                                                y: pRow < 2 ? [0, Math.random() * 4 - 2, 0] : 0
                                                                            }}
                                                                            transition={{
                                                                                duration: 5 / (speedFactor * (convectionParams.hCoeff / 20)), // Scale speed with hCoeff
                                                                                repeat: Infinity,
                                                                                delay: Math.random() * 2,
                                                                                ease: "linear"
                                                                            }}
                                                                        />
                                                                    );
                                                                })}
                                                                {/* Flow Arrow */}
                                                                <div className="absolute top-1/2 left-4 -translate-y-1/2 flex items-center opacity-50 z-20">
                                                                    <div className="text-[10px] uppercase font-bold text-slate-500 mr-1 rotate-[-90deg]">Flow</div>
                                                                    <Wind className="text-slate-400 w-6 h-6" />
                                                                </div>
                                                            </>
                                                        )}
                                                    </div>

                                                    {/* Heat Transfer Arrow */}
                                                    <motion.div
                                                        className="absolute bottom-20 left-1/2 -translate-x-1/2 flex flex-col items-center"
                                                        animate={{ y: [0, -10, 0] }}
                                                        transition={{ repeat: Infinity, duration: 1.5 }}
                                                    >
                                                        {Math.abs(qConvection) > 50 && (
                                                            <>
                                                                <div className={`text-xs font-bold ${qConvection > 0 ? 'text-red-500' : 'text-blue-500'}`}>
                                                                    {qConvection > 0 ? 'Heat Loss' : 'Heat Gain'}
                                                                </div>
                                                                <div className={`w-0 h-0 border-l-[6px] border-r-[6px] border-l-transparent border-r-transparent ${qConvection > 0 ? 'border-b-[12px] border-b-red-500 rotate-0' : 'border-b-[12px] border-b-blue-500 rotate-180'}`} />
                                                            </>
                                                        )}
                                                    </motion.div>
                                                </div>

                                                {/* Summary Metrics */}
                                                <div className="grid grid-cols-2 gap-4 w-full mt-8">
                                                    <div className="p-4 rounded-lg bg-orange-500/10 border border-orange-500/20 text-center">
                                                        <div className="text-2xl font-bold text-orange-600">{convectionParams.tempSurface - convectionParams.tempFluid} K</div>
                                                        <div className="text-xs text-muted-foreground uppercase font-semibold">ΔT (Surface - Fluid)</div>
                                                    </div>
                                                    <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20 text-center">
                                                        <div className="text-2xl font-bold text-blue-600">{qConvection.toFixed(0)} W/m²</div>
                                                        <div className="text-xs text-muted-foreground uppercase font-semibold">Heat Flux (q)</div>
                                                    </div>
                                                </div>

                                                {/* Graph */}
                                                <div className="mt-6 h-64 w-full bg-card border rounded-lg p-4">
                                                    <div className="text-sm font-semibold mb-2">Heat Transfer Rate vs ΔT</div>
                                                    <ResponsiveContainer width="100%" height="100%">
                                                        <LineChart data={convectionData}>
                                                            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                                                            <XAxis dataKey="dt" label={{ value: 'Delta T (K)', position: 'insideBottom', offset: -5 }} />
                                                            <YAxis label={{ value: 'Heat Flux (W/m²)', angle: -90, position: 'insideLeft' }} />
                                                            <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }} />
                                                            <Line type="monotone" dataKey="q" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
                                                            <ReferenceLine x={convectionParams.tempSurface - convectionParams.tempFluid} stroke="red" strokeDasharray="3 3" />
                                                        </LineChart>
                                                    </ResponsiveContainer>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </div>

                                    {/* Study Mode Content */}
                                    {isStudyMode && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="grid grid-cols-1 md:grid-cols-2 gap-6"
                                        >
                                            {/* Newton's Law */}
                                            <Card className="border-warning/30 bg-warning/5">
                                                <CardHeader className="flex flex-row items-center gap-2">
                                                    <Info className="w-5 h-5 text-warning" />
                                                    <CardTitle className="text-warning">Newton's Law of Cooling</CardTitle>
                                                </CardHeader>
                                                <CardContent className="text-sm space-y-3">
                                                    <p>
                                                        Heat transfer between a surface and a moving fluid is governed by:
                                                    </p>
                                                    <div className="bg-background/80 p-3 rounded font-mono text-center text-lg my-2">
                                                        q = h · (T_s - T_∞)
                                                    </div>
                                                    <p><strong>Variables:</strong></p>
                                                    <ul className="list-disc pl-5 text-xs space-y-1 text-muted-foreground">
                                                        <li><strong>q:</strong> Heat flux (W/m²)</li>
                                                        <li><strong>h:</strong> Convection heat transfer coefficient (W/m²·K)</li>
                                                        <li><strong>T_s:</strong> Surface temperature</li>
                                                        <li><strong>T_∞:</strong> Bulk fluid temperature (far from surface)</li>
                                                    </ul>
                                                    <div className="bg-background/80 p-2 rounded text-xs border border-warning/10">
                                                        <strong>Key insight:</strong> 'h' is NOT a material property — it depends on
                                                        fluid motion, geometry, and flow conditions!
                                                    </div>
                                                </CardContent>
                                            </Card>

                                            {/* Boundary Layer */}
                                            <Card className="border-warning/30 bg-warning/5">
                                                <CardHeader className="flex flex-row items-center gap-2">
                                                    <Wind className="w-5 h-5 text-warning" />
                                                    <CardTitle className="text-warning">The Boundary Layer</CardTitle>
                                                </CardHeader>
                                                <CardContent className="text-sm space-y-3">
                                                    <p>
                                                        At the surface, fluid velocity is zero (<strong>no-slip condition</strong>).
                                                        A thin "boundary layer" forms where velocity transitions from 0 to free stream.
                                                    </p>
                                                    <p><strong>Thermal boundary layer:</strong></p>
                                                    <ul className="list-disc pl-5 text-xs space-y-1 text-muted-foreground">
                                                        <li>Temperature also transitions across this layer</li>
                                                        <li>Heat must conduct through this layer first!</li>
                                                        <li>Thinner layer = easier heat transfer = higher h</li>
                                                    </ul>
                                                    <div className="bg-background/80 p-2 rounded text-xs border border-warning/10">
                                                        <strong>Turbulence helps:</strong> Turbulent flow mixes the fluid,
                                                        disrupting the boundary layer and increasing h by 2-10×!
                                                    </div>
                                                </CardContent>
                                            </Card>

                                            {/* Natural vs Forced */}
                                            <Card className="border-warning/30 bg-warning/5">
                                                <CardHeader className="flex flex-row items-center gap-2">
                                                    <Target className="w-5 h-5 text-warning" />
                                                    <CardTitle className="text-warning">Natural vs Forced Convection</CardTitle>
                                                </CardHeader>
                                                <CardContent className="text-sm space-y-3">
                                                    <p><strong>Natural (Free) Convection:</strong></p>
                                                    <p className="text-xs text-muted-foreground">
                                                        Driven by buoyancy — hot fluid rises, cold fluid sinks.
                                                        Example: Radiator heating a room, rising smoke.
                                                    </p>
                                                    <p className="mt-2"><strong>Forced Convection:</strong></p>
                                                    <p className="text-xs text-muted-foreground">
                                                        External force moves the fluid — fans, pumps, wind.
                                                        Much higher h values = faster heat transfer.
                                                    </p>
                                                    <div className="grid grid-cols-2 gap-1 text-xs font-mono mt-2">
                                                        <div className="bg-background/50 p-1 text-center font-bold">Scenario</div>
                                                        <div className="bg-background/50 p-1 text-center font-bold">h (W/m²·K)</div>
                                                        <div className="p-1 text-center">Natural (air)</div><div className="p-1 text-center text-yellow-400">5-25</div>
                                                        <div className="p-1 text-center">Forced (air)</div><div className="p-1 text-center text-green-400">25-250</div>
                                                        <div className="p-1 text-center">Forced (water)</div><div className="p-1 text-center text-emerald-400">100-15,000</div>
                                                        <div className="p-1 text-center">Boiling water</div><div className="p-1 text-center text-blue-400">2,500-100,000</div>
                                                    </div>
                                                </CardContent>
                                            </Card>

                                            {/* Dimensionless Numbers */}
                                            <Card className="border-warning/30 bg-warning/5">
                                                <CardHeader className="flex flex-row items-center gap-2">
                                                    <GraduationCap className="w-5 h-5 text-warning" />
                                                    <CardTitle className="text-warning">Key Dimensionless Numbers</CardTitle>
                                                </CardHeader>
                                                <CardContent className="text-sm space-y-3">
                                                    <ul className="space-y-2 text-xs">
                                                        <li>
                                                            <strong>Reynolds (Re):</strong> Inertia / Viscosity
                                                            <p className="text-muted-foreground">Predicts laminar (Re &lt; 2300) vs turbulent (Re &gt; 4000) flow</p>
                                                        </li>
                                                        <li>
                                                            <strong>Nusselt (Nu):</strong> Convection / Conduction
                                                            <p className="text-muted-foreground">Nu = hL/k — higher Nu means convection dominates</p>
                                                        </li>
                                                        <li>
                                                            <strong>Prandtl (Pr):</strong> Momentum diffusivity / Thermal diffusivity
                                                            <p className="text-muted-foreground">Air: Pr ≈ 0.7, Water: Pr ≈ 7, Oil: Pr ≈ 100+</p>
                                                        </li>
                                                        <li>
                                                            <strong>Grashof (Gr):</strong> Buoyancy / Viscosity
                                                            <p className="text-muted-foreground">For natural convection; large Gr = strong buoyancy</p>
                                                        </li>
                                                    </ul>
                                                </CardContent>
                                            </Card>

                                            {/* Applications */}
                                            <Card className="border-warning/30 bg-warning/5">
                                                <CardHeader className="flex flex-row items-center gap-2">
                                                    <Waves className="w-5 h-5 text-warning" />
                                                    <CardTitle className="text-warning">Engineering Applications</CardTitle>
                                                </CardHeader>
                                                <CardContent className="text-sm space-y-3">
                                                    <ul className="list-disc pl-5 text-xs space-y-1">
                                                        <li><strong>Electronics Cooling:</strong> CPU heatsinks with fans use forced convection to dissipate ~100W+</li>
                                                        <li><strong>HVAC Systems:</strong> Air handlers force air over coils for efficient cooling/heating</li>
                                                        <li><strong>Automotive Radiators:</strong> Water cooling + fan = forced convection of engine heat</li>
                                                        <li><strong>Power Plants:</strong> Cooling towers use evaporative convection to reject waste heat</li>
                                                        <li><strong>Cooking:</strong> Convection ovens circulate hot air for even baking</li>
                                                    </ul>
                                                    <div className="bg-background/80 p-2 rounded text-xs border border-warning/10">
                                                        <strong>Design tip:</strong> Add fins to increase surface area A, or increase
                                                        flow speed to boost h. Both increase total heat transfer Q = hAΔT.
                                                    </div>
                                                </CardContent>
                                            </Card>

                                            {/* Did You Know */}
                                            <Card className="border-warning/30 bg-warning/5">
                                                <CardHeader className="flex flex-row items-center gap-2">
                                                    <Lightbulb className="w-5 h-5 text-warning" />
                                                    <CardTitle className="text-warning">Did You Know?</CardTitle>
                                                </CardHeader>
                                                <CardContent className="text-sm space-y-3">
                                                    <div className="space-y-3">
                                                        <div className="flex gap-2">
                                                            <span className="text-warning font-bold">💨</span>
                                                            <p className="text-xs">
                                                                <strong>Wind Chill:</strong> On a windy day, forced convection
                                                                increases h on your skin, making it feel colder than the air temperature!
                                                            </p>
                                                        </div>
                                                        <div className="flex gap-2">
                                                            <span className="text-warning font-bold">🍲</span>
                                                            <p className="text-xs">
                                                                <strong>Blowing on Soup:</strong> You instinctively increase h by
                                                                forced convection when you blow on hot food to cool it faster!
                                                            </p>
                                                        </div>
                                                        <div className="flex gap-2">
                                                            <span className="text-warning font-bold">🌡️</span>
                                                            <p className="text-xs">
                                                                <strong>Wet Bulb Temperature:</strong> Evaporative cooling (convection +
                                                                phase change) can cool water below air temperature — how swamp coolers work!
                                                            </p>
                                                        </div>
                                                        <div className="flex gap-2">
                                                            <span className="text-warning font-bold">🖥️</span>
                                                            <p className="text-xs">
                                                                <strong>Liquid Cooling:</strong> Water has ~25× higher h than air,
                                                                which is why liquid-cooled PCs can handle more heat than air-cooled!
                                                            </p>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </motion.div>
                                    )}
                                </TabsContent>

                                <TabsContent value="radiation" className="space-y-6">
                                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                        {/* Controls */}
                                        <Card className="lg:col-span-1">
                                            <CardHeader>
                                                <CardTitle className="text-lg">Radiation Parameters</CardTitle>
                                                <CardDescription>Stefan-Boltzmann Law</CardDescription>
                                            </CardHeader>
                                            <CardContent className="space-y-6">
                                                <div className="space-y-4">
                                                    <div className="flex justify-between items-center">
                                                        <Label>Material</Label>
                                                        <select
                                                            className="text-sm bg-background border border-input rounded px-2 py-1"
                                                            value={radiationMaterial}
                                                            onChange={(e) => handleRadiationMaterialChange(e.target.value)}
                                                        >
                                                            {Object.entries(radiationMaterials).map(([key, mat]) => (
                                                                <option key={key} value={key}>{mat.name}</option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                </div>

                                                <div className="space-y-4">
                                                    <div className="flex justify-between">
                                                        <Label>Surface Temp (Ts)</Label>
                                                        <span className="text-sm font-mono">{radiationParams.tempSurface} K</span>
                                                    </div>
                                                    <Slider
                                                        value={[radiationParams.tempSurface]}
                                                        onValueChange={([v]) => setRadiationParams(p => ({ ...p, tempSurface: v }))}
                                                        min={300}
                                                        max={2000}
                                                        step={10}
                                                    />
                                                </div>

                                                <div className="space-y-4">
                                                    <div className="flex justify-between">
                                                        <Label>Surroundings (Tsurr)</Label>
                                                        <span className="text-sm font-mono">{radiationParams.tempSurr} K</span>
                                                    </div>
                                                    <Slider
                                                        value={[radiationParams.tempSurr]}
                                                        onValueChange={([v]) => setRadiationParams(p => ({ ...p, tempSurr: v }))}
                                                        min={0}
                                                        max={1000}
                                                        step={10}
                                                    />
                                                </div>

                                                <div className="space-y-4">
                                                    <div className="flex justify-between">
                                                        <Label>Emissivity (ε)</Label>
                                                        <span className="text-sm font-mono">{radiationParams.emissivity}</span>
                                                    </div>
                                                    <Slider
                                                        value={[radiationParams.emissivity * 100]}
                                                        onValueChange={([v]) => setRadiationParams(p => ({ ...p, emissivity: v / 100 }))}
                                                        min={1}
                                                        max={100}
                                                        step={1}
                                                    />
                                                </div>
                                            </CardContent>
                                        </Card>

                                        {/* Visualization */}
                                        <Card className="lg:col-span-2">
                                            <CardHeader>
                                                <CardTitle>Thermal Radiation</CardTitle>
                                                <CardDescription>Electromagnetic energy emission</CardDescription>
                                            </CardHeader>
                                            <CardContent className="flex flex-col items-center justify-center min-h-[400px] bg-slate-950 rounded-lg relative overflow-hidden">

                                                {/* Background Surroundings */}
                                                <div
                                                    className="absolute inset-0 transition-colors duration-1000"
                                                    style={{
                                                        background: `radial-gradient(circle at center, hsl(260, 30%, ${Math.min(radiationParams.tempSurr / 15, 20)}%), hsl(260, 20%, ${Math.min(radiationParams.tempSurr / 20, 10)}%))`
                                                    }}
                                                />

                                                {/* Radiating Body */}
                                                <div className="relative z-10">
                                                    <motion.div
                                                        className="w-32 h-32 rounded-full blur-sm"
                                                        style={{
                                                            backgroundColor: `hsl(${Math.max(0, 60 - (radiationParams.tempSurface - 500) / 20)}, 100%, 50%)`,
                                                            opacity: Math.min((radiationParams.tempSurface - 300) / 1000, 1),
                                                            boxShadow: `0 0 ${radiationParams.tempSurface / 10}px ${radiationParams.tempSurface / 20}px rgba(255, ${Math.min(255, (radiationParams.tempSurface - 500) / 2)}, 0, ${radiationParams.emissivity})`
                                                        }}
                                                    >
                                                        {/* Core */}
                                                        <div
                                                            className="absolute inset-0 rounded-full"
                                                            style={{
                                                                background: `radial-gradient(circle, #fff 0%, transparent 70%)`,
                                                                opacity: Math.max(0, (radiationParams.tempSurface - 800) / 1000)
                                                            }}
                                                        />
                                                    </motion.div>

                                                    {/* Emitted Waves */}
                                                    {[...Array(3)].map((_, i) => (
                                                        <motion.div
                                                            key={i}
                                                            className="absolute inset-0 rounded-full border border-white/30"
                                                            initial={{ scale: 1, opacity: 0.8 }}
                                                            animate={{ scale: 2.5, opacity: 0 }}
                                                            transition={{
                                                                duration: 2,
                                                                repeat: Infinity,
                                                                delay: i * 0.6,
                                                                ease: "easeOut"
                                                            }}
                                                        />
                                                    ))}
                                                </div>

                                                <div className="absolute bottom-8 text-center z-10">
                                                    <div className="text-4xl font-mono font-bold text-white mb-2">
                                                        {Math.abs(qRadiation).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                                                    </div>
                                                    <div className="text-xs uppercase tracking-widest text-white/60">Net Radiation (W/m²)</div>
                                                </div>

                                                {/* Graph */}
                                                <div className="w-full mt-8 h-64 bg-slate-900 border border-slate-800 rounded-lg p-4 z-10">
                                                    <div className="flex justify-between items-center mb-2">
                                                        <div className="text-sm font-semibold text-slate-100">
                                                            {isStudyMode ? "spectral Distribution (Planck's Law)" : "Emissive Power vs Temp"}
                                                        </div>
                                                        {isStudyMode && <div className="text-xs text-slate-400">Peak λ shifts left as T increases</div>}
                                                    </div>
                                                    <ResponsiveContainer width="100%" height="100%">
                                                        {isStudyMode ? (
                                                            <AreaChart data={planckData}>
                                                                <CartesianGrid strokeDasharray="3 3" opacity={0.1} stroke="#fff" />
                                                                <XAxis
                                                                    dataKey="lambda"
                                                                    stroke="#94a3b8"
                                                                    label={{ value: 'Wavelength (μm)', position: 'insideBottom', offset: -5, fill: '#94a3b8' }}
                                                                />
                                                                <YAxis
                                                                    stroke="#94a3b8"
                                                                    label={{ value: 'Spectral Power', angle: -90, position: 'insideLeft', fill: '#94a3b8' }}
                                                                    tickFormatter={(val) => val.toFixed(0)}
                                                                />
                                                                <Tooltip
                                                                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
                                                                    formatter={(value: number) => [value.toFixed(2), 'Power']}
                                                                    labelFormatter={(label) => `${Number(label).toFixed(1)} μm`}
                                                                />
                                                                <Area type="monotone" dataKey="power" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.2} />
                                                                <ReferenceLine x={2898 / radiationParams.tempSurface} stroke="#f59e0b" strokeDasharray="3 3" label={{ value: 'Peak', fill: '#f59e0b', fontSize: 10 }} />
                                                            </AreaChart>
                                                        ) : (
                                                            <AreaChart data={radiationData}>
                                                                <CartesianGrid strokeDasharray="3 3" opacity={0.1} stroke="#fff" />
                                                                <XAxis dataKey="temp" stroke="#94a3b8" label={{ value: 'Temp (K)', position: 'insideBottom', offset: -5, fill: '#94a3b8' }} />
                                                                <YAxis stroke="#94a3b8" label={{ value: 'Power (W/m²)', angle: -90, position: 'insideLeft', fill: '#94a3b8' }} />
                                                                <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }} />
                                                                <Area type="monotone" dataKey="power" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.2} />
                                                            </AreaChart>
                                                        )}
                                                    </ResponsiveContainer>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </div>

                                    {/* Study Mode Content */}
                                    {isStudyMode && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="grid grid-cols-1 md:grid-cols-2 gap-6"
                                        >
                                            <Card className="border-warning/30 bg-warning/5">
                                                <CardHeader className="flex flex-row items-center gap-2">
                                                    <Info className="w-5 h-5 text-warning" />
                                                    <CardTitle className="text-warning">Stefan-Boltzmann Law</CardTitle>
                                                </CardHeader>
                                                <CardContent className="text-sm space-y-3">
                                                    <p>
                                                        Everything above absolute zero emits thermal radiation. The power emitted increases drastically with temperature (T to the power of 4!).
                                                    </p>
                                                    <div className="bg-background/80 p-3 rounded font-mono text-center text-lg my-4">
                                                        q = ε · σ · (T_s⁴ - T_surr⁴)
                                                    </div>
                                                    <p>
                                                        ε (Epsilon) is emissivity, a measure of how good a surface is at radiating energy (0 to 1). A perfect radiator (ε=1) is called a Black Body.
                                                    </p>
                                                </CardContent>
                                            </Card>

                                            <Card className="border-warning/30 bg-warning/5">
                                                <CardHeader className="flex flex-row items-center gap-2">
                                                    <Sun className="w-5 h-5 text-warning" />
                                                    <CardTitle className="text-warning">Emissivity & Grey Bodies</CardTitle>
                                                </CardHeader>
                                                <CardContent className="text-sm space-y-3">
                                                    <p>
                                                        As temperature increases, wavelength decreases. Objects glow red → white.
                                                    </p>
                                                    <p>
                                                        <strong>Real Surfaces:</strong> No real surface is a perfect Black Body (ε=1). Most engineering materials are "Grey Bodies" where ε is less than 1.
                                                    </p>
                                                    <div className="grid grid-cols-2 gap-2 text-xs font-mono bg-background/50 p-2 rounded border border-warning/20">
                                                        <div className="flex justify-between"><span>Polished Silver:</span> <span className="text-emerald-500">0.02</span></div>
                                                        <div className="flex justify-between"><span>Matte Black:</span> <span className="text-emerald-500">0.95</span></div>
                                                        <div className="flex justify-between"><span>Rough Iron:</span> <span className="text-orange-500">0.70</span></div>
                                                        <div className="flex justify-between"><span>Water/Ice:</span> <span className="text-orange-500">0.96</span></div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </motion.div>
                                    )}
                                </TabsContent>

                                <TabsContent value="exchanger" className="space-y-6">
                                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                        {/* Controls */}
                                        <Card className="lg:col-span-1">
                                            <CardHeader>
                                                <CardTitle className="text-lg">Counter-Flow Parameters</CardTitle>
                                                <CardDescription>Double Pipe Heat Exchanger</CardDescription>
                                            </CardHeader>
                                            <CardContent className="space-y-6">
                                                <div className="space-y-4">
                                                    <div className="flex justify-between">
                                                        <Label>Hot Inlet Temp (Th,in)</Label>
                                                        <span className="text-sm font-mono">{exchangerParams.tHotIn} K</span>
                                                    </div>
                                                    <Slider
                                                        value={[exchangerParams.tHotIn]}
                                                        min={300} max={500}
                                                        onValueChange={([v]) => setExchangerParams(p => ({ ...p, tHotIn: v }))}
                                                    />
                                                </div>
                                                <div className="space-y-4">
                                                    <div className="flex justify-between">
                                                        <Label>Cold Inlet Temp (Tc,in)</Label>
                                                        <span className="text-sm font-mono">{exchangerParams.tColdIn} K</span>
                                                    </div>
                                                    <Slider
                                                        value={[exchangerParams.tColdIn]}
                                                        min={273} max={350}
                                                        onValueChange={([v]) => setExchangerParams(p => ({ ...p, tColdIn: v }))}
                                                    />
                                                </div>
                                                <div className="space-y-4">
                                                    <div className="flex justify-between">
                                                        <Label>Mass Flow Hot (mh)</Label>
                                                        <span className="text-sm font-mono">{exchangerParams.mHot} kg/s</span>
                                                    </div>
                                                    <Slider
                                                        value={[exchangerParams.mHot]}
                                                        min={0.1} max={2.0} step={0.1}
                                                        onValueChange={([v]) => setExchangerParams(p => ({ ...p, mHot: v }))}
                                                    />
                                                </div>
                                                <div className="space-y-4">
                                                    <div className="flex justify-between">
                                                        <Label>Mass Flow Cold (mc)</Label>
                                                        <span className="text-sm font-mono">{exchangerParams.mCold} kg/s</span>
                                                    </div>
                                                    <Slider
                                                        value={[exchangerParams.mCold]}
                                                        min={0.1} max={2.0} step={0.1}
                                                        onValueChange={([v]) => setExchangerParams(p => ({ ...p, mCold: v }))}
                                                    />
                                                </div>
                                                <div className="space-y-4">
                                                    <div className="flex justify-between">
                                                        <Label>Pipe Length (L)</Label>
                                                        <span className="text-sm font-mono">{exchangerParams.length} m</span>
                                                    </div>
                                                    <Slider
                                                        value={[exchangerParams.length]}
                                                        min={1} max={10} step={0.5}
                                                        onValueChange={([v]) => setExchangerParams(p => ({ ...p, length: v }))}
                                                    />
                                                </div>
                                            </CardContent>
                                        </Card>

                                        {/* Visualization */}
                                        <Card className="lg:col-span-2">
                                            <CardHeader>
                                                <CardTitle>Temperature Profile</CardTitle>
                                                <CardDescription>Counter-Flow Heat Exchange</CardDescription>
                                            </CardHeader>
                                            <CardContent className="flex flex-col items-center justify-center min-h-[400px] space-y-8">

                                                {/* Pipe Visualization (Concentric Cutaway) */}
                                                <div className="relative w-full bg-slate-900 rounded-xl overflow-hidden border border-slate-700 shadow-inner p-6 flex flex-col justify-center gap-2">

                                                    {/* Legend / Flow Indicators */}
                                                    <div className="absolute top-2 left-4 right-4 flex justify-between text-[10px] text-slate-400 font-mono tracking-widest uppercase">
                                                        <span>Cold Left (In)</span>
                                                        <span>Hot Right (In)</span>
                                                    </div>

                                                    {/* OUTER ANNULUS (TOP) - HOT FLUID (Right -> Left) */}
                                                    <div className="relative w-full h-8 bg-slate-800 rounded-t-sm flex items-center border-b border-white/10">
                                                        <div className="absolute right-2 text-[10px] font-bold text-red-400 z-10 flex items-center">
                                                            <ArrowLeft className="w-3 h-3 mr-1" /> Hot In
                                                        </div>
                                                        <div className="w-full h-full opacity-90"
                                                            style={{
                                                                background: `linear-gradient(to left, 
                                                                    hsl(${((exchangerParams.tHotIn - 273) / 227) * 40}, 100%, 50%), 
                                                                    hsl(${((tHotOut - 273) / 227) * 40}, 100%, 50%))`
                                                            }}
                                                        />
                                                        {/* Particles Moving Left */}
                                                        {[...Array(6)].map((_, i) => (
                                                            <motion.div
                                                                key={`h-top-${i}`}
                                                                className="absolute w-1.5 h-1.5 bg-white/70 rounded-full blur-[0.5px]"
                                                                initial={{ x: 600, opacity: 0 }}
                                                                animate={{ x: 0, opacity: [0, 1, 0] }}
                                                                transition={{ duration: 4 / exchangerParams.mHot, repeat: Infinity, delay: i * 0.4, ease: "linear" }}
                                                            />
                                                        ))}
                                                    </div>

                                                    {/* INNER PIPE - COLD FLUID (Left -> Right) */}
                                                    <div className="relative w-full h-16 bg-slate-800 my-1 rounded-sm flex items-center shadow-lg z-10 border-y border-white/20">
                                                        <div className="absolute left-2 text-[10px] font-bold text-cyan-300 z-10 flex items-center">
                                                            Cold In <ArrowRight className="w-3 h-3 ml-1" />
                                                        </div>
                                                        <div className="absolute right-2 text-[10px] font-bold text-cyan-300 z-10 flex items-center">
                                                            <ArrowRight className="w-3 h-3 mr-1" /> Cold Out
                                                        </div>

                                                        <div className="w-full h-full opacity-90"
                                                            style={{
                                                                background: `linear-gradient(to right, 
                                                                    hsl(200, 100%, ${30 + ((exchangerParams.tColdIn - 273) / 100) * 40}%), 
                                                                    hsl(200, 100%, ${30 + ((tColdOut - 273) / 100) * 40}%))`
                                                            }}
                                                        />

                                                        {/* Particles Moving Right */}
                                                        {[...Array(8)].map((_, i) => (
                                                            <motion.div
                                                                key={`c-mid-${i}`}
                                                                className="absolute top-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full blur-[1px]"
                                                                initial={{ x: 0, opacity: 0 }}
                                                                animate={{ x: 600, opacity: [0, 1, 0] }}
                                                                transition={{ duration: 4 / exchangerParams.mCold, repeat: Infinity, delay: i * 0.3, ease: "linear" }}
                                                            />
                                                        ))}
                                                    </div>

                                                    {/* OUTER ANNULUS (BOTTOM) - HOT FLUID (Right -> Left) */}
                                                    <div className="relative w-full h-8 bg-slate-800 rounded-b-sm flex items-center border-t border-white/10">
                                                        <div className="absolute left-2 text-[10px] font-bold text-red-400 z-10 flex items-center">
                                                            Hot Out <ArrowLeft className="w-3 h-3 ml-1" />
                                                        </div>
                                                        <div className="w-full h-full opacity-90"
                                                            style={{
                                                                background: `linear-gradient(to left, 
                                                                    hsl(${((exchangerParams.tHotIn - 273) / 227) * 40}, 100%, 50%), 
                                                                    hsl(${((tHotOut - 273) / 227) * 40}, 100%, 50%))`
                                                            }}
                                                        />
                                                        {/* Particles Moving Left */}
                                                        {[...Array(6)].map((_, i) => (
                                                            <motion.div
                                                                key={`h-bot-${i}`}
                                                                className="absolute w-1.5 h-1.5 bg-white/70 rounded-full blur-[0.5px]"
                                                                initial={{ x: 600, opacity: 0 }}
                                                                animate={{ x: 0, opacity: [0, 1, 0] }}
                                                                transition={{ duration: 4 / exchangerParams.mHot, repeat: Infinity, delay: i * 0.4, ease: "linear" }}
                                                            />
                                                        ))}
                                                    </div>

                                                    {/* Labels for Structure */}
                                                    <div className="absolute -right-8 top-1/2 -translate-y-1/2 flex flex-col items-center gap-1">
                                                        <div className="h-20 w-[1px] bg-slate-500 absolute left-[-10px] top-[-10px]"></div>
                                                        <span className="text-[9px] text-slate-500 rotate-90 whitespace-nowrap origin-center translate-y-8">Annulus (Hot)</span>
                                                        <span className="text-[9px] text-slate-500 rotate-90 whitespace-nowrap origin-center translate-y-[-20px]">Inner (Cold)</span>
                                                    </div>
                                                </div>

                                                {/* Results */}
                                                <div className="grid grid-cols-3 gap-4 w-full">
                                                    <div className="p-4 rounded bg-red-500/10 border border-red-500/20 text-center">
                                                        <div className="text-2xl font-bold text-red-500">{tHotOut.toFixed(1)} K</div>
                                                        <div className="text-xs text-muted-foreground uppercase">Th,out (Exit)</div>
                                                    </div>
                                                    <div className="p-4 rounded bg-emerald-500/10 border border-emerald-500/20 text-center">
                                                        <div className="text-2xl font-bold text-emerald-500">{(Q_actual / 1000).toFixed(1)} kW</div>
                                                        <div className="text-xs text-muted-foreground uppercase">Heat Transfer (Q)</div>
                                                    </div>
                                                    <div className="p-4 rounded bg-cyan-500/10 border border-cyan-500/20 text-center">
                                                        <div className="text-2xl font-bold text-cyan-500">{tColdOut.toFixed(1)} K</div>
                                                        <div className="text-xs text-muted-foreground uppercase">Tc,out (Exit)</div>
                                                    </div>
                                                </div>

                                                {/* Graph */}
                                                <div className="w-full mt-6 h-64 bg-slate-900 border border-slate-800 rounded-lg p-4 relative">
                                                    <div className="flex justify-between items-center mb-2">
                                                        <div className="text-sm font-semibold text-slate-100">Temperature Profile</div>
                                                        {isStudyMode && (
                                                            <div className="text-xs font-mono text-warning">
                                                                LMTD: {lmtd.toFixed(1)} K
                                                            </div>
                                                        )}
                                                    </div>
                                                    <ResponsiveContainer width="100%" height="100%">
                                                        <LineChart data={exchangerData}>
                                                            <CartesianGrid strokeDasharray="3 3" opacity={0.1} stroke="#fff" />
                                                            <XAxis dataKey="x" stroke="#94a3b8" label={{ value: 'Length (m)', position: 'insideBottom', offset: -5, fill: '#94a3b8' }} />
                                                            <YAxis stroke="#94a3b8" domain={[270, 'auto']} label={{ value: 'Temp (K)', angle: -90, position: 'insideLeft', fill: '#94a3b8' }} />
                                                            <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }} formatter={(value) => Number(value).toFixed(1)} />
                                                            <Line type="monotone" dataKey="tHot" name="Hot Fluid" stroke="#ef4444" strokeWidth={3} dot={{ r: 4 }} />
                                                            <Line type="monotone" dataKey="tCold" name="Cold Fluid" stroke="#06b6d4" strokeWidth={3} dot={{ r: 4 }} />

                                                            {isStudyMode && (
                                                                <>
                                                                    {/* Annotations for Delta T */}
                                                                    <ReferenceLine x={0} stroke="#ffffff" strokeDasharray="3 3" opacity={0.3} />
                                                                    <ReferenceLine x={exchangerParams.length} stroke="#ffffff" strokeDasharray="3 3" opacity={0.3} />
                                                                </>
                                                            )}
                                                        </LineChart>
                                                    </ResponsiveContainer>

                                                    {isStudyMode && (
                                                        <>
                                                            <div className="absolute top-1/2 left-16 -translate-y-1/2 flex flex-col items-center pointer-events-none">
                                                                <span className="text-[10px] text-white/50 border-l border-white/30 pl-1">ΔT1: {deltaT1.toFixed(0)}K</span>
                                                            </div>
                                                            <div className="absolute top-1/2 right-4 -translate-y-1/2 flex flex-col items-center pointer-events-none">
                                                                <span className="text-[10px] text-white/50 border-r border-white/30 pr-1">ΔT2: {deltaT2.toFixed(0)}K</span>
                                                            </div>
                                                        </>
                                                    )}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </div>

                                    {isStudyMode && (
                                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <Card className="border-warning/30 bg-warning/5">
                                                <CardHeader className="flex flex-row items-center gap-2">
                                                    <Activity className="w-5 h-5 text-warning" />
                                                    <CardTitle className="text-warning">Effectiveness-NTU Method</CardTitle>
                                                </CardHeader>
                                                <CardContent className="text-sm space-y-3">
                                                    <p>In a counter-flow heat exchanger, the fluids flow in opposite directions, maintaining a more uniform temperature difference.</p>
                                                    <div className="bg-background/80 p-3 rounded font-mono text-center text-lg my-4">ε = {effectiveness.toFixed(3)} (= Q_actual / Q_max)</div>
                                                    <p>Effectiveness (ε) represents how close the heat exchanger is to the maximum possible heat transfer.</p>
                                                </CardContent>
                                            </Card>
                                            <Card className="border-warning/30 bg-warning/5">
                                                <CardHeader className="flex flex-row items-center gap-2">
                                                    <ArrowLeftRight className="w-5 h-5 text-warning" />
                                                    <CardTitle className="text-warning">LMTD vs ε-NTU</CardTitle>
                                                </CardHeader>
                                                <CardContent className="text-sm space-y-3">
                                                    <p>LMTD is the logarithmic average of the temperature differences at the ends:</p>
                                                    <div className="bg-background/80 p-2 rounded font-mono text-center text-xs my-1">
                                                        ΔT_lm = ({deltaT1.toFixed(0)} - {deltaT2.toFixed(0)}) / ln({deltaT1.toFixed(0)}/{deltaT2.toFixed(0)}) = {lmtd.toFixed(1)} K
                                                    </div>
                                                    <p className="text-xs">Counter-flow is more efficient because it maintains a larger, more consistent ΔT across the entire length.</p>
                                                </CardContent>
                                            </Card>
                                        </motion.div>
                                    )}
                                </TabsContent>
                            </Tabs>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default HeatTransfer;
