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
    CloudSun
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
                                            <Card className="border-warning/30 bg-warning/5">
                                                <CardHeader className="flex flex-row items-center gap-2">
                                                    <Sun className="w-5 h-5 text-warning" />
                                                    <CardTitle className="text-warning">The Solar Equation & Loss</CardTitle>
                                                </CardHeader>
                                                <CardContent className="text-sm space-y-3">
                                                    <p>
                                                        The electrical power generated is: <strong>P = A · G · η</strong>.
                                                    </p>
                                                    <ul className="list-disc pl-5 text-xs space-y-1">
                                                        <li><strong>Irradiance (G):</strong> Solar power per unit area. 1000 W/m² is standard test condition (STC).</li>
                                                        <li><strong>Temperature Loss:</strong> Counter-intuitively, solar panels perform <em>worse</em> as they get hotter (approx -0.4%/°C).</li>
                                                        <li><strong>Fill Factor:</strong> A measure of the "squareness" of the I-V curve, indicating cell quality.</li>
                                                    </ul>
                                                </CardContent>
                                            </Card>

                                            <Card className="border-warning/30 bg-warning/5">
                                                <CardHeader className="flex flex-row items-center gap-2">
                                                    <GraduationCap className="w-5 h-5 text-warning" />
                                                    <CardTitle className="text-warning">Shockley-Queisser Limit</CardTitle>
                                                </CardHeader>
                                                <CardContent className="text-sm space-y-3">
                                                    <p>
                                                        The ultimate efficiency for a single p-n junction solar cell is ~33.7%.
                                                    </p>
                                                    <div className="space-y-1 text-xs outline outline-1 outline-warning/20 p-2 rounded bg-background/50">
                                                        <p><strong>Why is it limited?</strong></p>
                                                        <p>1. Blackbody radiation loss.</p>
                                                        <p>2. Recombination (electrons escaping).</p>
                                                        <p>3. Spectrum mismatch (some photons have too little/too much energy).</p>
                                                    </div>
                                                    <p className="text-xs italic text-muted-foreground">
                                                        Multi-junction cells can exceed this, reaching over 47%!
                                                    </p>
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
                                                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-slate-600 z-30" />

                                                        {/* Blade 1 */}
                                                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-full w-2 bg-slate-100 rounded-full border border-slate-300 origin-bottom" style={{ height: `${windParams.diameter}px` }} />
                                                        {/* Blade 2 (Rotated 120) */}
                                                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-full w-2 bg-slate-100 rounded-full border border-slate-300 origin-bottom" style={{ height: `${windParams.diameter}px`, rotate: '120deg' }} />
                                                        {/* Blade 3 (Rotated 240) */}
                                                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-full w-2 bg-slate-100 rounded-full border border-slate-300 origin-bottom" style={{ height: `${windParams.diameter}px`, rotate: '240deg' }} />
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
                                            <Card className="border-warning/30 bg-warning/5">
                                                <CardHeader className="flex flex-row items-center gap-2">
                                                    <Battery className="w-5 h-5 text-warning" />
                                                    <CardTitle className="text-warning">Sweep Area & Density</CardTitle>
                                                </CardHeader>
                                                <CardContent className="text-sm space-y-3">
                                                    <p>
                                                        Available Power: <strong>P = ½ρAv³</strong>
                                                    </p>
                                                    <p>
                                                        Notice <strong>v³</strong>: Doubling wind speed gives <strong>8x the power</strong>. Area (A) depends on the square of the blade length. Large turbines are exponentially more powerful than small ones.
                                                    </p>
                                                    <p className="text-xs text-muted-foreground italic border-t border-warning/10 pt-2">
                                                        Air Density (ρ) decreases at high altitudes, slightly reducing power.
                                                    </p>
                                                </CardContent>
                                            </Card>

                                            <Card className="border-warning/30 bg-warning/5">
                                                <CardHeader className="flex flex-row items-center gap-2">
                                                    <Wind className="w-5 h-5 text-warning" />
                                                    <CardTitle className="text-warning">The Betz Limit (59.3%)</CardTitle>
                                                </CardHeader>
                                                <CardContent className="text-sm space-y-3">
                                                    <p>
                                                        Derived by Albert Betz in 1919. A turbine cannot capture 100% of energy because the wind must keep moving to leave the turbine.
                                                    </p>
                                                    <ul className="list-disc pl-5 text-xs space-y-1">
                                                        <li><strong>Theoretical Max:</strong> 16/27 or 59.3%.</li>
                                                        <li><strong>Modern HAWTs:</strong> Reach 75-80% of this limit (Cp ≈ 0.45).</li>
                                                        <li><strong>TSR:</strong> Tip Speed Ratio. Blades must spin at specific speeds relative to wind to maintain high Cp.</li>
                                                    </ul>
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
