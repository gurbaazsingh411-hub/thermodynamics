import { useState } from 'react';
import { motion } from 'framer-motion';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import {
    Thermometer,
    ArrowRight,
    RotateCcw,
    GraduationCap,
    Info,
    Waves,
    Sun,
    Wind,
    ArrowLeftRight,
    Activity
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const HeatTransfer = () => {
    const [isStudyMode, setIsStudyMode] = useState(false);
    const [conductionParams, setConductionParams] = useState({
        temperatureLeft: 400,
        temperatureRight: 300,
        thickness: 0.1,
        conductivity: 50
    });

    const heatFlux = (conductionParams.conductivity * (conductionParams.temperatureLeft - conductionParams.temperatureRight)) / conductionParams.thickness;

    // Convection State
    const [convectionParams, setConvectionParams] = useState({
        tempSurface: 350,
        tempFluid: 293, // 20°C
        hCoeff: 25 // W/m²K
    });
    const qConvection = convectionParams.hCoeff * (convectionParams.tempSurface - convectionParams.tempFluid);

    // Radiation State
    const [radiationParams, setRadiationParams] = useState({
        tempSurface: 800,
        tempSurr: 300,
        emissivity: 0.85
    });
    const sigma = 5.67e-8;
    const qRadiation = radiationParams.emissivity * sigma * (Math.pow(radiationParams.tempSurface, 4) - Math.pow(radiationParams.tempSurr, 4));

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


    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Header />

            <div className="flex flex-1">
                <Sidebar />

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

                                                    {/* Flow Particles */}
                                                    {conductionParams.temperatureLeft > conductionParams.temperatureRight && (
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

                                                    <div className="z-10 text-center space-y-2">
                                                        <div className="text-3xl font-bold font-mono">
                                                            {Math.abs(heatFlux).toLocaleString(undefined, { maximumFractionDigits: 0 })} W/m²
                                                        </div>
                                                        <div className="text-sm text-muted-foreground font-medium uppercase tracking-widest">
                                                            Heat Flux
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
                                                    <CardTitle className="text-warning">The Theory: Fourier's Law</CardTitle>
                                                </CardHeader>
                                                <CardContent className="text-sm space-y-3">
                                                    <p>
                                                        Fourier's Law of Heat Conduction states that the rate of heat transfer through a material
                                                        is proportional to the negative gradient in the temperature and to the area.
                                                    </p>
                                                    <div className="bg-background/80 p-3 rounded font-mono text-center text-lg my-4">
                                                        Q = -k · A · (dT/dx)
                                                    </div>
                                                    <ul className="list-disc pl-5 space-y-1">
                                                        <li><strong>k:</strong> Thermal conductivity (W/m·K)</li>
                                                        <li><strong>A:</strong> Surface area</li>
                                                        <li><strong>dT/dx:</strong> Temperature gradient</li>
                                                    </ul>
                                                </CardContent>
                                            </Card>

                                            <Card className="border-warning/30 bg-warning/5">
                                                <CardHeader className="flex flex-row items-center gap-2">
                                                    <GraduationCap className="w-5 h-5 text-warning" />
                                                    <CardTitle className="text-warning">Key Concept: Thermal Resistance</CardTitle>
                                                </CardHeader>
                                                <CardContent className="text-sm space-y-3">
                                                    <p>
                                                        Similar to electrical resistance, thermal resistance is the ratio of temperature difference
                                                        to the rate of heat flow.
                                                    </p>
                                                    <div className="bg-background/80 p-3 rounded font-mono text-center text-lg my-4">
                                                        R_th = L / k
                                                    </div>
                                                    <p>
                                                        Increasing the thickness (L) or decreasing the conductivity (k) increases the resistance
                                                        to heat flow, which is how insulation works.
                                                    </p>
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
                                                        className="absolute bottom-0 left-0 right-0 h-16 transition-colors duration-500"
                                                        style={{
                                                            backgroundColor: `hsl(${200 - (Math.min(convectionParams.tempSurface - 273, 200) / 200) * 180}, 70%, 50%)`
                                                        }}
                                                    >
                                                        <div className="absolute top-2 left-4 text-xs font-bold text-white/80">Surface (Ts)</div>
                                                    </div>

                                                    {/* Fluid Particles */}
                                                    <div className="absolute inset-0 bottom-16 overflow-hidden">
                                                        {/* Wind indicators */}
                                                        {[...Array(3)].map((_, r) => (
                                                            <div key={`row-${r}`} className="absolute w-full h-12" style={{ top: `${r * 33}%` }}>
                                                                {[...Array(5)].map((_, i) => (
                                                                    <motion.div
                                                                        key={`p-${r}-${i}`}
                                                                        className="absolute w-8 h-1 rounded-full opacity-60"
                                                                        style={{
                                                                            backgroundColor: `hsl(${200 - (Math.min(convectionParams.tempFluid - 273, 200) / 200) * 180}, 70%, 60%)`,
                                                                            boxShadow: qConvection > 1000 && r === 2 ? '0 0 10px rgba(255,100,0,0.5)' : 'none'
                                                                        }}
                                                                        initial={{ x: -50 }}
                                                                        animate={{
                                                                            x: 600,
                                                                            y: r === 2 && qConvection > 0 ? [-10, -30, -50] : [0, 2, 0],
                                                                            opacity: r === 2 && qConvection > 0 ? [1, 0.5, 0] : 0.6,
                                                                            backgroundColor: r === 2 && qConvection > 0 ?
                                                                                [`hsl(${200 - (Math.min(convectionParams.tempSurface - 273, 200) / 200) * 180}, 70%, 60%)`, 'hsl(0, 100%, 50%)'] :
                                                                                `hsl(${200 - (Math.min(convectionParams.tempFluid - 273, 200) / 200) * 180}, 70%, 60%)`
                                                                        }}
                                                                        transition={{
                                                                            duration: r === 2 && qConvection > 0 ? 1 : 2,
                                                                            repeat: Infinity,
                                                                            delay: i * 0.4 + r * 0.2,
                                                                            ease: "linear"
                                                                        }}
                                                                    />
                                                                ))}
                                                            </div>
                                                        ))}
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
                                                    <CardTitle className="text-warning">Newton's Law of Cooling</CardTitle>
                                                </CardHeader>
                                                <CardContent className="text-sm space-y-3">
                                                    <p>
                                                        Convection determines how fast an object cools down (or heats up) when placed in a fluid (air, water).
                                                    </p>
                                                    <div className="bg-background/80 p-3 rounded font-mono text-center text-lg my-4">
                                                        q = h · (T_s - T_∞)
                                                    </div>
                                                    <p>
                                                        The heat transfer coefficient 'h' depends on fluid properties and flow speed. A fan increases 'h' (forced convection)!
                                                    </p>
                                                </CardContent>
                                            </Card>

                                            <Card className="border-warning/30 bg-warning/5">
                                                <CardHeader className="flex flex-row items-center gap-2">
                                                    <Wind className="w-5 h-5 text-warning" />
                                                    <CardTitle className="text-warning">Boundary Layer</CardTitle>
                                                </CardHeader>
                                                <CardContent className="text-sm space-y-3">
                                                    <p>
                                                        Right next to the surface, the fluid is stationary (no-slip condition). Heat moves through this thin layer by conduction before being carried away by the moving fluid.
                                                    </p>
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
                                                    <CardTitle className="text-warning">Why does it glow?</CardTitle>
                                                </CardHeader>
                                                <CardContent className="text-sm space-y-3">
                                                    <p>
                                                        As temperature increases, the wavelength of emitted radiation decreases.
                                                        Around 800K (525°C), objects start removing visible red light ("red hot"). At higher temps, they glow orange, yellow, and eventually "white hot".
                                                    </p>
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
                                                {/* Pipe Visualization */}
                                                <div className="relative w-full h-40 bg-slate-900 rounded-xl overflow-hidden border border-slate-700 shadow-inner p-4 flex flex-col justify-center gap-4">
                                                    {/* Hot Fluid (Outer/Top) Flowing Right */}
                                                    <div className="relative w-full h-12 bg-slate-800 rounded-full overflow-hidden flex items-center">
                                                        <div className="absolute left-2 text-xs font-bold text-white z-10">Hot Fluid →</div>
                                                        <div className="w-full h-full opacity-80"
                                                            style={{
                                                                background: `linear-gradient(to right, 
                                                                    hsl(${((exchangerParams.tHotIn - 273) / 227) * 40}, 100%, 50%), 
                                                                    hsl(${((tHotOut - 273) / 227) * 40}, 100%, 50%))`
                                                            }}
                                                        />
                                                        {[...Array(6)].map((_, i) => (
                                                            <motion.div
                                                                key={`h-${i}`}
                                                                className="absolute w-2 h-2 bg-white rounded-full blur-[1px]"
                                                                initial={{ x: 0, opacity: 0 }}
                                                                animate={{ x: 600, opacity: [0, 1, 0] }}
                                                                transition={{ duration: 3 / exchangerParams.mHot, repeat: Infinity, delay: i * 0.3 }}
                                                            />
                                                        ))}
                                                    </div>

                                                    {/* Cold Fluid (Inner/Bottom) Flowing Left */}
                                                    <div className="relative w-full h-12 bg-slate-800 rounded-full overflow-hidden flex items-center">
                                                        <div className="absolute right-2 text-xs font-bold text-white z-10">← Cold Fluid</div>
                                                        <div className="w-full h-full opacity-80"
                                                            style={{
                                                                background: `linear-gradient(to left, 
                                                                    hsl(200, 100%, ${30 + ((exchangerParams.tColdIn - 273) / 100) * 40}%), 
                                                                    hsl(200, 100%, ${30 + ((tColdOut - 273) / 100) * 40}%))`
                                                            }}
                                                        />
                                                        {[...Array(6)].map((_, i) => (
                                                            <motion.div
                                                                key={`c-${i}`}
                                                                className="absolute w-2 h-2 bg-white rounded-full blur-[1px]"
                                                                initial={{ x: 600, opacity: 0 }}
                                                                animate={{ x: 0, opacity: [0, 1, 0] }}
                                                                transition={{ duration: 3 / exchangerParams.mCold, repeat: Infinity, delay: i * 0.3 }}
                                                            />
                                                        ))}
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
                                                    <div className="bg-background/80 p-3 rounded font-mono text-center text-lg my-4">ε = Q_actual / Q_max</div>
                                                    <p>Effectiveness (ε) represents how close the heat exchanger is to the maximum possible heat transfer.</p>
                                                </CardContent>
                                            </Card>
                                            <Card className="border-warning/30 bg-warning/5">
                                                <CardHeader className="flex flex-row items-center gap-2">
                                                    <ArrowLeftRight className="w-5 h-5 text-warning" />
                                                    <CardTitle className="text-warning">Flow Arrangement</CardTitle>
                                                </CardHeader>
                                                <CardContent className="text-sm space-y-3">
                                                    <p>Counter-flow is generally more efficient than parallel flow because the outlet temperature of the cold fluid can exceed the outlet temperature of the hot fluid!</p>
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
