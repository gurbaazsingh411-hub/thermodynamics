import { useState } from 'react';
import { motion } from 'framer-motion';
import { Header } from '@/components/layout/Header';
import {
    Wind,
    ArrowRight,
    RotateCcw,
    GraduationCap,
    Info,
    Sun,
    Battery,
    CloudSun,
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

const RenewableEnergy = () => {
    const [isStudyMode, setIsStudyMode] = useState(false);
    const [solarParams, setSolarParams] = useState({
        irradiance: 800,  // W/m2
        area: 10,        // m2
        efficiency: 0.2  // 20%
    });

    const powerOutput = solarParams.irradiance * solarParams.area * solarParams.efficiency;

    // Wind Turbine State
    const [windParams, setWindParams] = useState({
        velocity: 10,       // m/s
        diameter: 40,       // m
        efficiency: 0.4     // Cp (Max ~0.59)
    });
    const airDensity = 1.225; // kg/m^3
    const sweptArea = Math.PI * Math.pow(windParams.diameter / 2, 2);
    // P = 0.5 * rho * A * v^3 * Cp
    const windPower = 0.5 * airDensity * sweptArea * Math.pow(windParams.velocity, 3) * windParams.efficiency;

    // Solar Graph Data (Daily Production Profile)
    const solarDayData = Array.from({ length: 13 }, (_, i) => {
        const hour = i + 6; // 6 AM to 6 PM
        // Simple bell curve approximation for sun angle
        const sunFactor = Math.sin(((hour - 6) / 12) * Math.PI);
        const irradianceAtHour = solarParams.irradiance * sunFactor;
        const powerAtHour = irradianceAtHour * solarParams.area * solarParams.efficiency;
        return { hour: `${hour}:00`, power: powerAtHour };
    });

    // Wind Graph Data (Power Curve)
    const windCurveData = Array.from({ length: 26 }, (_, i) => {
        const v = i; // 0 to 25 m/s
        const p = 0.5 * airDensity * sweptArea * Math.pow(v, 3) * windParams.efficiency;
        return { velocity: v, power: p / 1000 }; // kW
    });

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Header />

            <div className="flex flex-1">
                <main className="flex-1 flex flex-col min-h-0">
                    {/* Study Mode Toggle */}
                    <div className="px-6 py-3 border-b border-border bg-card/50 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <Wind className="w-4 h-4 text-primary" />
                                <span className="font-semibold">Renewable Energy Systems</span>
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
                            <Tabs defaultValue="solar" className="w-full">
                                <TabsList className="grid w-full grid-cols-2 mb-8">
                                    <TabsTrigger value="solar" className="gap-2">
                                        <Sun className="w-4 h-4" /> Solar PV
                                    </TabsTrigger>
                                    <TabsTrigger value="wind" className="gap-2">
                                        <Wind className="w-4 h-4" /> Wind Turbine
                                    </TabsTrigger>
                                </TabsList>

                                <TabsContent value="solar" className="space-y-6">
                                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                        {/* Controls */}
                                        <Card className="lg:col-span-1">
                                            <CardHeader>
                                                <CardTitle className="text-lg">Environmental Conditions</CardTitle>
                                                <CardDescription>Adjust sunlight and panel settings</CardDescription>
                                            </CardHeader>
                                            <CardContent className="space-y-6">
                                                <div className="space-y-4">
                                                    <div className="flex justify-between">
                                                        <Label>Solar Irradiance (G)</Label>
                                                        <span className="text-sm font-mono">{solarParams.irradiance} W/m²</span>
                                                    </div>
                                                    <Slider
                                                        value={[solarParams.irradiance]}
                                                        onValueChange={([v]) => setSolarParams(p => ({ ...p, irradiance: v }))}
                                                        min={0}
                                                        max={1200}
                                                        step={10}
                                                    />
                                                </div>

                                                <div className="space-y-4">
                                                    <div className="flex justify-between">
                                                        <Label>Panel Area (A)</Label>
                                                        <span className="text-sm font-mono">{solarParams.area} m²</span>
                                                    </div>
                                                    <Slider
                                                        value={[solarParams.area]}
                                                        onValueChange={([v]) => setSolarParams(p => ({ ...p, area: v }))}
                                                        min={1}
                                                        max={100}
                                                        step={1}
                                                    />
                                                </div>

                                                <div className="space-y-4">
                                                    <div className="flex justify-between">
                                                        <Label>Efficiency (η)</Label>
                                                        <span className="text-sm font-mono">{(solarParams.efficiency * 100).toFixed(0)}%</span>
                                                    </div>
                                                    <Slider
                                                        value={[solarParams.efficiency * 100]}
                                                        onValueChange={([v]) => setSolarParams(p => ({ ...p, efficiency: v / 100 }))}
                                                        min={5}
                                                        max={40}
                                                        step={1}
                                                    />
                                                </div>
                                            </CardContent>
                                        </Card>

                                        {/* Visualization */}
                                        <Card className="lg:col-span-2">
                                            <CardHeader>
                                                <CardTitle>Solar Power Output</CardTitle>
                                                <CardDescription>Visualizing photovoltaic conversion</CardDescription>
                                            </CardHeader>
                                            <CardContent className="flex flex-col items-center justify-center min-h-[400px]">
                                                <div className="relative w-full aspect-video bg-gradient-to-b from-blue-400/20 to-blue-600/20 rounded-xl flex items-center justify-center overflow-hidden">
                                                    {/* Sun */}
                                                    <motion.div
                                                        className="absolute top-10 right-10 bg-yellow-400 rounded-full w-20 h-20 blur-sm shadow-[0_0_50px_rgba(250,204,21,0.5)]"
                                                        animate={{ scale: [1, 1.1, 1] }}
                                                        transition={{ repeat: Infinity, duration: 4 }}
                                                    />

                                                    {/* Solar Panel */}
                                                    <div className="relative w-64 h-40 bg-slate-800 rounded-lg border-2 border-slate-700 grid grid-cols-4 grid-rows-4 gap-1 p-1 transform skew-x-12">
                                                        {[...Array(16)].map((_, i) => (
                                                            <div key={i} className="bg-slate-900/80 rounded-[1px] relative overflow-hidden">
                                                                {solarParams.irradiance > 200 && (
                                                                    <motion.div
                                                                        className="absolute inset-0 bg-yellow-400"
                                                                        initial={{ opacity: 0 }}
                                                                        animate={{ opacity: (solarParams.irradiance / 1200) * 0.3 }}
                                                                    />
                                                                )}
                                                            </div>
                                                        ))}
                                                    </div>

                                                    <div className="absolute bottom-4 right-4 bg-background/80 backdrop-blur-md px-6 py-4 rounded-xl shadow-xl border border-border">
                                                        <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Power Output</div>
                                                        <div className="text-3xl font-black font-mono text-primary">
                                                            {powerOutput >= 1000 ? (powerOutput / 1000).toFixed(2) + ' kW' : powerOutput.toFixed(0) + ' W'}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Summary Metrics */}
                                                <div className="grid grid-cols-2 gap-4 w-full mt-12">
                                                    <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-center">
                                                        <div className="text-2xl font-bold text-yellow-600">{solarParams.irradiance} W/m²</div>
                                                        <div className="text-xs text-muted-foreground uppercase font-semibold">Incident Flux</div>
                                                    </div>
                                                    <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20 text-center">
                                                        <div className="text-2xl font-bold text-green-600">{(powerOutput / (solarParams.irradiance * solarParams.area || 1) * 100).toFixed(0)}%</div>
                                                        <div className="text-xs text-muted-foreground uppercase font-semibold">System Efficiency</div>
                                                    </div>
                                                </div>

                                                {/* Graph */}
                                                <div className="w-full mt-6 h-64 bg-slate-900 border border-slate-800 rounded-lg p-4">
                                                    <div className="text-sm font-semibold mb-2 text-slate-100">Daily Power Profile (Simulated)</div>
                                                    <ResponsiveContainer width="100%" height="100%">
                                                        <AreaChart data={solarDayData}>
                                                            <CartesianGrid strokeDasharray="3 3" opacity={0.1} stroke="#fff" />
                                                            <XAxis dataKey="hour" stroke="#94a3b8" label={{ value: 'Time of Day', position: 'insideBottom', offset: -5, fill: '#94a3b8' }} />
                                                            <YAxis stroke="#94a3b8" label={{ value: 'Power (W)', angle: -90, position: 'insideLeft', fill: '#94a3b8' }} />
                                                            <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }} />
                                                            <Area type="monotone" dataKey="power" stroke="#facc15" fill="#facc15" fillOpacity={0.3} />
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
                                            {/* Photovoltaic Effect */}
                                            <Card className="border-warning/30 bg-warning/5">
                                                <CardHeader className="flex flex-row items-center gap-2">
                                                    <Sun className="w-5 h-5 text-warning" />
                                                    <CardTitle className="text-warning">The Photovoltaic Effect</CardTitle>
                                                </CardHeader>
                                                <CardContent className="text-sm space-y-3">
                                                    <p>
                                                        Solar cells convert light directly into electricity through the <strong>photovoltaic effect</strong>:
                                                    </p>
                                                    <ol className="list-decimal pl-5 text-xs space-y-1">
                                                        <li>Photons strike the semiconductor material (usually silicon)</li>
                                                        <li>Photon energy frees electrons from their atomic bonds</li>
                                                        <li>A p-n junction creates an electric field</li>
                                                        <li>Freed electrons flow through the circuit as DC current</li>
                                                    </ol>
                                                    <div className="bg-background/80 p-2 rounded font-mono text-center text-sm my-2">
                                                        P = A · G · η
                                                    </div>
                                                    <p className="text-xs text-muted-foreground">
                                                        Where A = area (m²), G = irradiance (W/m²), η = efficiency
                                                    </p>
                                                </CardContent>
                                            </Card>

                                            {/* Shockley-Queisser Limit */}
                                            <Card className="border-warning/30 bg-warning/5">
                                                <CardHeader className="flex flex-row items-center gap-2">
                                                    <GraduationCap className="w-5 h-5 text-warning" />
                                                    <CardTitle className="text-warning">Shockley-Queisser Limit (33.7%)</CardTitle>
                                                </CardHeader>
                                                <CardContent className="text-sm space-y-3">
                                                    <p>
                                                        The maximum theoretical efficiency for a single p-n junction solar cell is <strong>~33.7%</strong>.
                                                    </p>
                                                    <p><strong>Sources of Energy Loss:</strong></p>
                                                    <ul className="list-disc pl-5 text-xs space-y-1">
                                                        <li><strong>Spectrum losses (~48%):</strong> Photons below bandgap can't excite electrons; excess energy above bandgap becomes heat</li>
                                                        <li><strong>Blackbody radiation (~7%):</strong> Hot cells emit infrared radiation</li>
                                                        <li><strong>Recombination (~10%):</strong> Some electron-hole pairs recombine before collection</li>
                                                    </ul>
                                                    <div className="bg-background/80 p-2 rounded text-xs border border-warning/10">
                                                        <strong>Breaking the limit:</strong> Multi-junction cells stack semiconductors with different bandgaps
                                                        to capture more of the spectrum. Record efficiency: <strong>47.6%</strong> (6-junction cell, concentrated light)!
                                                    </div>
                                                </CardContent>
                                            </Card>

                                            {/* Panel Technologies */}
                                            <Card className="border-warning/30 bg-warning/5">
                                                <CardHeader className="flex flex-row items-center gap-2">
                                                    <Target className="w-5 h-5 text-warning" />
                                                    <CardTitle className="text-warning">Panel Technologies Compared</CardTitle>
                                                </CardHeader>
                                                <CardContent className="text-sm space-y-3">
                                                    <div className="grid grid-cols-3 gap-1 text-xs font-mono">
                                                        <div className="bg-background/50 p-1 text-center font-bold">Type</div>
                                                        <div className="bg-background/50 p-1 text-center font-bold">Efficiency</div>
                                                        <div className="bg-background/50 p-1 text-center font-bold">Cost</div>
                                                        <div className="p-1 text-center">Mono-Si</div><div className="p-1 text-center text-green-400">20-24%</div><div className="p-1 text-center text-red-400">$$$</div>
                                                        <div className="p-1 text-center">Poly-Si</div><div className="p-1 text-center text-yellow-400">15-18%</div><div className="p-1 text-center text-yellow-400">$$</div>
                                                        <div className="p-1 text-center">Thin-film</div><div className="p-1 text-center text-orange-400">10-14%</div><div className="p-1 text-center text-green-400">$</div>
                                                        <div className="p-1 text-center">Perovskite</div><div className="p-1 text-center text-green-400">25%+</div><div className="p-1 text-center text-muted-foreground">Lab</div>
                                                    </div>
                                                    <p className="text-xs text-muted-foreground">
                                                        <strong>Monocrystalline:</strong> Single crystal, highest efficiency but expensive.<br />
                                                        <strong>Polycrystalline:</strong> Multiple crystals, good balance.<br />
                                                        <strong>Thin-film:</strong> Flexible, lightweight, works in low light.<br />
                                                        <strong>Perovskite:</strong> Emerging technology with rapid efficiency gains!
                                                    </p>
                                                </CardContent>
                                            </Card>

                                            {/* Temperature Effects */}
                                            <Card className="border-warning/30 bg-warning/5">
                                                <CardHeader className="flex flex-row items-center gap-2">
                                                    <Info className="w-5 h-5 text-warning" />
                                                    <CardTitle className="text-warning">Temperature & Efficiency</CardTitle>
                                                </CardHeader>
                                                <CardContent className="text-sm space-y-3">
                                                    <p>
                                                        Counter-intuitively, solar panels perform <strong>worse</strong> when hot:
                                                    </p>
                                                    <div className="bg-background/80 p-2 rounded font-mono text-center text-sm my-2">
                                                        η_actual = η_STC × [1 - β(T_cell - 25°C)]
                                                    </div>
                                                    <p className="text-xs text-muted-foreground">
                                                        <strong>β (temperature coefficient):</strong> Typically -0.3% to -0.5% per °C
                                                    </p>
                                                    <p><strong>Example:</strong></p>
                                                    <p className="text-xs text-muted-foreground">
                                                        At 65°C (40°C above STC), a panel with β = -0.4%/°C loses:<br />
                                                        40 × 0.4% = <strong>16% of rated power!</strong>
                                                    </p>
                                                    <div className="bg-background/80 p-2 rounded text-xs border border-warning/10">
                                                        <strong>Tip:</strong> Good ventilation and mounting gaps help panels stay cooler and
                                                        produce more power on hot days.
                                                    </div>
                                                </CardContent>
                                            </Card>

                                            {/* System Losses */}
                                            <Card className="border-warning/30 bg-warning/5">
                                                <CardHeader className="flex flex-row items-center gap-2">
                                                    <Battery className="w-5 h-5 text-warning" />
                                                    <CardTitle className="text-warning">Real-World System Losses</CardTitle>
                                                </CardHeader>
                                                <CardContent className="text-sm space-y-3">
                                                    <p>A solar system's actual output is affected by many factors:</p>
                                                    <ul className="list-disc pl-5 text-xs space-y-1 text-muted-foreground">
                                                        <li><strong>Inverter losses:</strong> 2-4% (DC to AC conversion)</li>
                                                        <li><strong>Wiring losses:</strong> 1-3%</li>
                                                        <li><strong>Soiling (dust/dirt):</strong> 2-5% annually</li>
                                                        <li><strong>Shading:</strong> Variable (even partial shade significantly impacts output)</li>
                                                        <li><strong>Mismatch:</strong> 1-3% (panels with slightly different outputs)</li>
                                                        <li><strong>Degradation:</strong> 0.5-1% per year</li>
                                                    </ul>
                                                    <div className="bg-background/80 p-2 rounded text-xs border border-warning/10">
                                                        <strong>Performance Ratio:</strong> Real systems typically achieve 75-85% of
                                                        their theoretical maximum output.
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
                                                            <span className="text-warning font-bold">☀️</span>
                                                            <p className="text-xs">
                                                                <strong>Energy Abundance:</strong> The Sun delivers more energy to Earth
                                                                in one hour than humanity uses in an entire year!
                                                            </p>
                                                        </div>
                                                        <div className="flex gap-2">
                                                            <span className="text-warning font-bold">🛰️</span>
                                                            <p className="text-xs">
                                                                <strong>Space Applications:</strong> The first practical use of solar cells
                                                                was on the Vanguard 1 satellite in 1958 — it's still orbiting!
                                                            </p>
                                                        </div>
                                                        <div className="flex gap-2">
                                                            <span className="text-warning font-bold">📉</span>
                                                            <p className="text-xs">
                                                                <strong>Price Drop:</strong> Solar panel costs have fallen by 99% since 1976,
                                                                from $76/watt to less than $0.20/watt today.
                                                            </p>
                                                        </div>
                                                        <div className="flex gap-2">
                                                            <span className="text-warning font-bold">🌍</span>
                                                            <p className="text-xs">
                                                                <strong>Global Growth:</strong> Solar capacity doubles approximately every
                                                                2-3 years. By 2030, solar could be the world's largest electricity source!
                                                            </p>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </motion.div>
                                    )}
                                </TabsContent>

                                <TabsContent value="wind" className="space-y-6">
                                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                        {/* Controls */}
                                        <Card className="lg:col-span-1">
                                            <CardHeader>
                                                <CardTitle className="text-lg">Turbine Specs</CardTitle>
                                                <CardDescription>Wind Power Parameters</CardDescription>
                                            </CardHeader>
                                            <CardContent className="space-y-6">
                                                <div className="space-y-4">
                                                    <div className="flex justify-between">
                                                        <Label>Wind Speed (v)</Label>
                                                        <span className="text-sm font-mono">{windParams.velocity} m/s</span>
                                                    </div>
                                                    <Slider
                                                        value={[windParams.velocity]}
                                                        onValueChange={([v]) => setWindParams(p => ({ ...p, velocity: v }))}
                                                        min={0}
                                                        max={25}
                                                        step={1}
                                                    />
                                                </div>

                                                <div className="space-y-4">
                                                    <div className="flex justify-between">
                                                        <Label>Blade Diameter (D)</Label>
                                                        <span className="text-sm font-mono">{windParams.diameter} m</span>
                                                    </div>
                                                    <Slider
                                                        value={[windParams.diameter]}
                                                        onValueChange={([v]) => setWindParams(p => ({ ...p, diameter: v }))}
                                                        min={10}
                                                        max={150}
                                                        step={5}
                                                    />
                                                </div>

                                                <div className="space-y-4">
                                                    <div className="flex justify-between">
                                                        <Label>Efficiency (Cp)</Label>
                                                        <span className="text-sm font-mono">{(windParams.efficiency * 100).toFixed(0)}%</span>
                                                    </div>
                                                    <Slider
                                                        value={[windParams.efficiency * 100]}
                                                        onValueChange={([v]) => setWindParams(p => ({ ...p, efficiency: v / 100 }))}
                                                        min={10}
                                                        max={59}
                                                        step={1}
                                                    />
                                                    <div className="text-xs text-muted-foreground">Betz Limit is 59.3%</div>
                                                </div>
                                            </CardContent>
                                        </Card>

                                        {/* Visualization */}
                                        <Card className="lg:col-span-2">
                                            <CardHeader>
                                                <CardTitle>Power Generation Visualization</CardTitle>
                                                <CardDescription>Cubic relationship with wind speed</CardDescription>
                                            </CardHeader>
                                            <CardContent className="flex flex-col items-center justify-center min-h-[400px]">
                                                <div className="relative w-full h-80 bg-sky-200 rounded-lg overflow-hidden border border-sky-300 flex items-end justify-center">

                                                    {/* Clouds */}
                                                    <motion.div
                                                        className="absolute top-10 left-10 w-20 h-10 bg-white rounded-full opacity-80 blur-md"
                                                        animate={{ x: [0, 200, 0] }}
                                                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                                    />

                                                    {/* Ground */}
                                                    <div className="absolute bottom-0 left-0 right-0 h-12 bg-green-600" />

                                                    {/* Turbine Pole */}
                                                    <div className="w-4 h-48 bg-slate-400 z-10" />

                                                    {/* Rotating Blades */}
                                                    <motion.div
                                                        className="absolute bottom-56 z-20"
                                                        style={{
                                                            originX: 0.5,
                                                            originY: 0.5,
                                                        }}
                                                        animate={{ rotate: 360 }}
                                                        transition={{
                                                            duration: windParams.velocity > 0 ? 10 / Math.max(1, windParams.velocity) : 0,
                                                            repeat: Infinity,
                                                            ease: "linear"
                                                        }}
                                                    >
                                                        {/* Hub */}
                                                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-slate-600 z-30 shadow-md" />

                                                        {/* Blade 1 */}
                                                        <div className="absolute top-1/2 left-1/2 w-2 bg-slate-100 rounded-full border border-slate-300"
                                                            style={{
                                                                height: `${windParams.diameter}px`,
                                                                transformOrigin: 'bottom center',
                                                                transform: 'translate(-50%, -100%) rotate(0deg)'
                                                            }}
                                                        />
                                                        {/* Blade 2 */}
                                                        <div className="absolute top-1/2 left-1/2 w-2 bg-slate-100 rounded-full border border-slate-300"
                                                            style={{
                                                                height: `${windParams.diameter}px`,
                                                                transformOrigin: 'bottom center',
                                                                transform: 'translate(-50%, -100%) rotate(120deg)'
                                                            }}
                                                        />
                                                        {/* Blade 3 */}
                                                        <div className="absolute top-1/2 left-1/2 w-2 bg-slate-100 rounded-full border border-slate-300"
                                                            style={{
                                                                height: `${windParams.diameter}px`,
                                                                transformOrigin: 'bottom center',
                                                                transform: 'translate(-50%, -100%) rotate(240deg)'
                                                            }}
                                                        />
                                                    </motion.div>

                                                    {/* Stats Overlay */}
                                                    <div className="absolute top-4 right-4 bg-white/90 p-4 rounded-lg shadow-lg border z-30">
                                                        <div className="text-3xl font-bold text-slate-800 font-mono">
                                                            {(windPower / 1000).toFixed(1)} kW
                                                        </div>
                                                        <div className="text-xs text-muted-foreground uppercase font-semibold">Power Output</div>
                                                    </div>
                                                </div>

                                                {/* Physics Note */}
                                                <div className="mt-6 w-full text-center">
                                                    <div className="text-sm font-medium text-slate-600">
                                                        Doubling wind speed increases power by <span className="font-bold text-primary">8x</span> (2³ = 8)!
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </div>

                                    {/* Graph */}
                                    <div className="w-full mt-6 h-64 bg-slate-900 border border-slate-800 rounded-lg p-4">
                                        <div className="text-sm font-semibold mb-2 text-slate-100">Power Curve (P ∝ v³)</div>
                                        <ResponsiveContainer width="100%" height="100%">
                                            <AreaChart data={windCurveData}>
                                                <CartesianGrid strokeDasharray="3 3" opacity={0.1} stroke="#fff" />
                                                <XAxis dataKey="velocity" stroke="#94a3b8" label={{ value: 'Wind Speed (m/s)', position: 'insideBottom', offset: -5, fill: '#94a3b8' }} />
                                                <YAxis stroke="#94a3b8" label={{ value: 'Power (kW)', angle: -90, position: 'insideLeft', fill: '#94a3b8' }} />
                                                <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }} />
                                                <ReferenceLine x={windParams.velocity} stroke="#0ea5e9" strokeDasharray="3 3" label="Current" />
                                                <Area type="monotone" dataKey="power" stroke="#0ea5e9" fill="#0ea5e9" fillOpacity={0.3} />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    </div>

                                    {/* Study Mode Content */}
                                    {isStudyMode && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="grid grid-cols-1 md:grid-cols-2 gap-6"
                                        >
                                            {/* Wind Power Equation */}
                                            <Card className="border-warning/30 bg-warning/5">
                                                <CardHeader className="flex flex-row items-center gap-2">
                                                    <Battery className="w-5 h-5 text-warning" />
                                                    <CardTitle className="text-warning">Wind Power Equation</CardTitle>
                                                </CardHeader>
                                                <CardContent className="text-sm space-y-3">
                                                    <p>
                                                        The power available in wind is determined by the kinetic energy flux:
                                                    </p>
                                                    <div className="bg-background/80 p-2 rounded font-mono text-center text-sm my-2">
                                                        P = ½ρAv³
                                                    </div>
                                                    <p><strong>Why v³ matters:</strong></p>
                                                    <ul className="list-disc pl-5 text-xs space-y-1 text-muted-foreground">
                                                        <li>Double wind speed → <strong>8× power</strong></li>
                                                        <li>Triple wind speed → <strong>27× power</strong></li>
                                                        <li>This is why turbine siting is critical!</li>
                                                    </ul>
                                                    <p><strong>Variables:</strong></p>
                                                    <ul className="list-disc pl-5 text-xs space-y-1 text-muted-foreground">
                                                        <li><strong>ρ:</strong> Air density (1.225 kg/m³ at sea level, decreases with altitude)</li>
                                                        <li><strong>A:</strong> Swept area (πr²) — double blade length = 4× power</li>
                                                        <li><strong>v:</strong> Wind velocity (most critical factor)</li>
                                                    </ul>
                                                </CardContent>
                                            </Card>

                                            {/* Betz Limit */}
                                            <Card className="border-warning/30 bg-warning/5">
                                                <CardHeader className="flex flex-row items-center gap-2">
                                                    <Wind className="w-5 h-5 text-warning" />
                                                    <CardTitle className="text-warning">The Betz Limit (59.3%)</CardTitle>
                                                </CardHeader>
                                                <CardContent className="text-sm space-y-3">
                                                    <p>
                                                        Derived by Albert Betz in 1919, no turbine can capture more than <strong>59.3%</strong> (16/27) of wind energy.
                                                    </p>
                                                    <p><strong>Physical insight:</strong></p>
                                                    <p className="text-xs text-muted-foreground">
                                                        If a turbine extracted 100% of energy, air would stop completely behind it.
                                                        But new air must flow through, so some energy must remain to move air away!
                                                    </p>
                                                    <div className="bg-background/80 p-2 rounded font-mono text-center text-xs my-2">
                                                        C_p = P_turbine / P_available ≤ 16/27 ≈ 0.593
                                                    </div>
                                                    <p className="text-xs text-muted-foreground">
                                                        <strong>Modern turbines:</strong> Achieve C_p ≈ 0.45-0.50, or about 75-85% of the theoretical max.
                                                    </p>
                                                </CardContent>
                                            </Card>

                                            {/* Turbine Types */}
                                            <Card className="border-warning/30 bg-warning/5">
                                                <CardHeader className="flex flex-row items-center gap-2">
                                                    <Target className="w-5 h-5 text-warning" />
                                                    <CardTitle className="text-warning">Turbine Types Compared</CardTitle>
                                                </CardHeader>
                                                <CardContent className="text-sm space-y-3">
                                                    <p><strong>Horizontal Axis (HAWT):</strong></p>
                                                    <ul className="list-disc pl-5 text-xs space-y-1 text-muted-foreground">
                                                        <li>Most common design (99% of utility-scale)</li>
                                                        <li>2-3 blades, faces into wind</li>
                                                        <li>Higher efficiency (C_p up to 0.50)</li>
                                                        <li>Requires yaw mechanism to track wind direction</li>
                                                    </ul>
                                                    <p className="mt-2"><strong>Vertical Axis (VAWT):</strong></p>
                                                    <ul className="list-disc pl-5 text-xs space-y-1 text-muted-foreground">
                                                        <li>Works from any wind direction</li>
                                                        <li>Lower efficiency (C_p ≈ 0.30-0.35)</li>
                                                        <li>Simpler design, lower maintenance</li>
                                                        <li>Better for turbulent urban environments</li>
                                                    </ul>
                                                </CardContent>
                                            </Card>

                                            {/* Wind Classes */}
                                            <Card className="border-warning/30 bg-warning/5">
                                                <CardHeader className="flex flex-row items-center gap-2">
                                                    <CloudSun className="w-5 h-5 text-warning" />
                                                    <CardTitle className="text-warning">Wind Resource Classes</CardTitle>
                                                </CardHeader>
                                                <CardContent className="text-sm space-y-3">
                                                    <p>Wind sites are classified by average wind speed at hub height:</p>
                                                    <div className="grid grid-cols-3 gap-1 text-xs font-mono">
                                                        <div className="bg-background/50 p-1 text-center font-bold">Class</div>
                                                        <div className="bg-background/50 p-1 text-center font-bold">Speed (m/s)</div>
                                                        <div className="bg-background/50 p-1 text-center font-bold">Rating</div>
                                                        <div className="p-1 text-center">1</div><div className="p-1 text-center">&lt;5.6</div><div className="p-1 text-center text-red-400">Poor</div>
                                                        <div className="p-1 text-center">2</div><div className="p-1 text-center">5.6-6.4</div><div className="p-1 text-center text-orange-400">Marginal</div>
                                                        <div className="p-1 text-center">3</div><div className="p-1 text-center">6.4-7.0</div><div className="p-1 text-center text-yellow-400">Fair</div>
                                                        <div className="p-1 text-center">4-5</div><div className="p-1 text-center">7.0-8.0</div><div className="p-1 text-center text-green-400">Good</div>
                                                        <div className="p-1 text-center">6-7</div><div className="p-1 text-center">&gt;8.0</div><div className="p-1 text-center text-emerald-400">Excellent</div>
                                                    </div>
                                                    <p className="text-xs text-muted-foreground mt-2">
                                                        <strong>Height matters:</strong> Wind speed increases with height due to reduced surface friction.
                                                        Modern turbines have hub heights of 80-140m!
                                                    </p>
                                                </CardContent>
                                            </Card>

                                            {/* Capacity Factor */}
                                            <Card className="border-warning/30 bg-warning/5">
                                                <CardHeader className="flex flex-row items-center gap-2">
                                                    <GraduationCap className="w-5 h-5 text-warning" />
                                                    <CardTitle className="text-warning">Capacity Factor</CardTitle>
                                                </CardHeader>
                                                <CardContent className="text-sm space-y-3">
                                                    <p>
                                                        Wind turbines don't run at full power all the time. <strong>Capacity Factor (CF)</strong>
                                                        measures actual vs. rated output:
                                                    </p>
                                                    <div className="bg-background/80 p-2 rounded font-mono text-center text-xs my-2">
                                                        CF = Actual Energy / (Rated Power × Time)
                                                    </div>
                                                    <p><strong>Typical values:</strong></p>
                                                    <ul className="list-disc pl-5 text-xs space-y-1 text-muted-foreground">
                                                        <li><strong>Onshore wind:</strong> 25-40%</li>
                                                        <li><strong>Offshore wind:</strong> 40-55%</li>
                                                        <li><strong>Best sites:</strong> Can exceed 60%</li>
                                                    </ul>
                                                    <div className="bg-background/80 p-2 rounded text-xs border border-warning/10">
                                                        <strong>Why not 100%?</strong> Wind varies, turbines need maintenance, and they shut down
                                                        in extreme weather (too calm or too stormy).
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
                                                            <span className="text-warning font-bold">🌊</span>
                                                            <p className="text-xs">
                                                                <strong>Offshore Giants:</strong> The largest wind turbines have blades
                                                                over 100m long — longer than a football field! They can power 15,000+ homes each.
                                                            </p>
                                                        </div>
                                                        <div className="flex gap-2">
                                                            <span className="text-warning font-bold">🦅</span>
                                                            <p className="text-xs">
                                                                <strong>Blade Tips:</strong> Despite appearing slow, blade tips travel at
                                                                200+ mph (over 300 km/h)! This is why bird collisions are a concern.
                                                            </p>
                                                        </div>
                                                        <div className="flex gap-2">
                                                            <span className="text-warning font-bold">🏛️</span>
                                                            <p className="text-xs">
                                                                <strong>Ancient Technology:</strong> Windmills have been used for over
                                                                1,000 years. Persia had vertical-axis windmills in 500-900 AD!
                                                            </p>
                                                        </div>
                                                        <div className="flex gap-2">
                                                            <span className="text-warning font-bold">⚡</span>
                                                            <p className="text-xs">
                                                                <strong>Grid Leader:</strong> Denmark generates over 50% of its electricity
                                                                from wind — the highest percentage of any country!
                                                            </p>
                                                        </div>
                                                    </div>
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

export default RenewableEnergy;
