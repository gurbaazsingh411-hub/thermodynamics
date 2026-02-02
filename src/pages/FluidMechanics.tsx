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

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Header } from '@/components/layout/Header';
import {
    Droplets,
    Waves,
    ArrowRight,
    RotateCcw,
    GraduationCap,
    Info,
    Activity,
    Navigation,
    Lightbulb
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const FluidMechanics = () => {
    // ... State ...
    const [isStudyMode, setIsStudyMode] = useState(false);
    const [bernoulliParams, setBernoulliParams] = useState({
        pressure1: 200, // kPa
        velocity1: 2,   // m/s
        height1: 5,     // m
        height2: 0,     // m
        area2: 0.5      // scaling factor for velocity 2
    });

    // Simplified Bernoulli calculation: P1 + 0.5*rho*v1^2 + rho*g*h1 = P2 + 0.5*rho*v2^2 + rho*g*h2
    // Let rho = 1000 kg/m^3 (water), g = 9.81 m/s^2
    const rho = 1000;
    const g = 9.81;
    const velocity2 = bernoulliParams.velocity1 / bernoulliParams.area2;
    const pressure2 = (bernoulliParams.pressure1 * 1000 + 0.5 * rho * (Math.pow(bernoulliParams.velocity1, 2) - Math.pow(velocity2, 2)) + rho * g * (bernoulliParams.height1 - bernoulliParams.height2)) / 1000;

    // Bernoulli Graph Data
    const bernoulliData = Array.from({ length: 50 }, (_, i) => {
        const x = i / 49; // 0 to 1 position along pipe
        // Simulate constriction at simplified center x=0.5
        const areaRatio = 1 - (1 - bernoulliParams.area2) * Math.exp(-Math.pow(x - 0.5, 2) / 0.02);
        const v = bernoulliParams.velocity1 / areaRatio;
        const p = (bernoulliParams.pressure1 * 1000 + 0.5 * rho * (Math.pow(bernoulliParams.velocity1, 2) - Math.pow(v, 2))) / 1000;
        return { x: x * 100, p, v };
    });

    // Pipe Flow State (Reynolds)
    const [pipeParams, setPipeParams] = useState({
        velocity: 2, // m/s
        diameter: 0.05, // m
        viscosity: 0.001 // Pa·s (Dynamic Viscosity of water)
    });
    // Re = (rho * v * D) / mu. Assuming rho=1000 for water.
    const reynoldsNumber = (1000 * pipeParams.velocity * pipeParams.diameter) / pipeParams.viscosity;

    // Pipe Profile Graph Data
    const pipeProfileData = Array.from({ length: 41 }, (_, i) => {
        const rRatio = (i - 20) / 20; // -1 to 1
        const rAbs = Math.abs(rRatio);
        let vRatio = 0;
        if (reynoldsNumber < 2300) {
            vRatio = 1 - Math.pow(rAbs, 2); // Laminar
        } else {
            vRatio = Math.pow(1 - rAbs, 1 / 7); // Turbulent (Power Law)
        }
        return { r: rRatio, v: vRatio * pipeParams.velocity };
    });

    // Continuity State
    const [continuityParams, setContinuityParams] = useState({
        diameter1: 0.1, // m
        velocity1: 2,   // m/s
        diameter2: 0.05 // m
    });
    const area1 = Math.PI * Math.pow(continuityParams.diameter1 / 2, 2);
    const area2 = Math.PI * Math.pow(continuityParams.diameter2 / 2, 2);
    const continuityVelocity2 = (area1 * continuityParams.velocity1) / area2;

    // Continuity Graph Data (Velocity vs Diameter Curve)
    const continuityData = Array.from({ length: 30 }, (_, i) => {
        const d = 0.02 + (i / 29) * 0.18; // 0.02m to 0.20m range
        const a = Math.PI * Math.pow(d / 2, 2);
        const v = (area1 * continuityParams.velocity1) / a;
        return { d: d * 100, v };
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
                                <Droplets className="w-4 h-4 text-primary" />
                                <span className="font-semibold">Fluid Mechanics Visualization</span>
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
                            <Tabs defaultValue="bernoulli" className="w-full">
                                <TabsList className="grid w-full grid-cols-3 mb-8">
                                    <TabsTrigger value="bernoulli" className="gap-2">
                                        <Activity className="w-4 h-4" /> Bernoulli
                                    </TabsTrigger>
                                    <TabsTrigger value="pipe-flow" className="gap-2">
                                        <Navigation className="w-4 h-4" /> Pipe Flow
                                    </TabsTrigger>
                                    <TabsTrigger value="continuity" className="gap-2">
                                        <Waves className="w-4 h-4" /> Continuity
                                    </TabsTrigger>
                                </TabsList>

                                <TabsContent value="bernoulli" className="space-y-6">
                                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                        {/* Controls */}
                                        <Card className="lg:col-span-1">
                                            <CardHeader>
                                                <CardTitle className="text-lg">Inlet Parameters</CardTitle>
                                                <CardDescription>Adjust inlet conditions to see outlet response</CardDescription>
                                            </CardHeader>
                                            <CardContent className="space-y-6">
                                                <div className="space-y-4">
                                                    <div className="flex justify-between">
                                                        <Label>Inlet Pressure (P1)</Label>
                                                        <span className="text-sm font-mono">{bernoulliParams.pressure1} kPa</span>
                                                    </div>
                                                    <Slider
                                                        value={[bernoulliParams.pressure1]}
                                                        onValueChange={([v]) => setBernoulliParams(p => ({ ...p, pressure1: v }))}
                                                        min={100}
                                                        max={500}
                                                        step={1}
                                                    />
                                                </div>

                                                <div className="space-y-4">
                                                    <div className="flex justify-between">
                                                        <Label>Inlet Velocity (v1)</Label>
                                                        <span className="text-sm font-mono">{bernoulliParams.velocity1} m/s</span>
                                                    </div>
                                                    <Slider
                                                        value={[bernoulliParams.velocity1]}
                                                        onValueChange={([v]) => setBernoulliParams(p => ({ ...p, velocity1: v }))}
                                                        min={0.5}
                                                        max={10}
                                                        step={0.1}
                                                    />
                                                </div>

                                                <div className="space-y-4">
                                                    <div className="flex justify-between">
                                                        <Label>Inlet Height (h1)</Label>
                                                        <span className="text-sm font-mono">{bernoulliParams.height1} m</span>
                                                    </div>
                                                    <Slider
                                                        value={[bernoulliParams.height1]}
                                                        onValueChange={([v]) => setBernoulliParams(p => ({ ...p, height1: v }))}
                                                        min={0}
                                                        max={20}
                                                        step={0.5}
                                                    />
                                                </div>

                                                <div className="space-y-4 pt-4 border-t border-border">
                                                    <div className="flex justify-between">
                                                        <Label>Exit Area Ratio</Label>
                                                        <span className="text-sm font-mono">{(bernoulliParams.area2 * 100).toFixed(0)}%</span>
                                                    </div>
                                                    <Slider
                                                        value={[bernoulliParams.area2 * 100]}
                                                        onValueChange={([v]) => setBernoulliParams(p => ({ ...p, area2: v / 100 }))}
                                                        min={20}
                                                        max={150}
                                                        step={1}
                                                    />
                                                </div>
                                            </CardContent>
                                        </Card>

                                        {/* Visualization */}
                                        <Card className="lg:col-span-2">
                                            <CardHeader className="flex flex-row items-center justify-between">
                                                <div>
                                                    <CardTitle>Venturi Effect Visualization</CardTitle>
                                                    <CardDescription>Conservation of energy in fluid flow</CardDescription>
                                                </div>
                                            </CardHeader>
                                            <CardContent className="flex flex-col items-center justify-center min-h-[400px]">
                                                <div className="relative w-full h-48 flex items-center justify-center">
                                                    {/* Pipe Shape */}
                                                    <svg viewBox="0 0 400 200" className="w-full h-full">
                                                        <path
                                                            d={`M 0,50 L 150,50 L 250,${50 + (1 - bernoulliParams.area2) * 50} L 400,${50 + (1 - bernoulliParams.area2) * 50} L 400,${150 - (1 - bernoulliParams.area2) * 50} L 250,${150 - (1 - bernoulliParams.area2) * 50} L 150,150 L 0,150 Z`}
                                                            className="fill-blue-500/20 stroke-blue-500/50"
                                                            strokeWidth="2"
                                                        />

                                                        {/* Flow Particles */}
                                                        {[...Array(10)].map((_, i) => (
                                                            <motion.circle
                                                                key={i}
                                                                r="4"
                                                                className="fill-blue-400/60 blur-[1px]"
                                                                initial={{ cx: 0, cy: 100 }}
                                                                animate={{
                                                                    cx: 400,
                                                                    cy: [100, 100, 100],
                                                                }}
                                                                transition={{
                                                                    duration: 2 / (bernoulliParams.velocity1 / 2),
                                                                    repeat: Infinity,
                                                                    delay: i * 0.3,
                                                                    ease: "linear"
                                                                }}
                                                            />
                                                        ))}
                                                    </svg>

                                                    <div className="absolute left-8 top-1/2 -translate-y-1/2 text-center">
                                                        <div className="text-xs font-bold uppercase text-muted-foreground mb-1">Inlet</div>
                                                        <div className="text-sm font-mono text-blue-500">{bernoulliParams.velocity1} m/s</div>
                                                    </div>

                                                    <div className="absolute right-8 top-1/2 -translate-y-1/2 text-center">
                                                        <div className="text-xs font-bold uppercase text-muted-foreground mb-1">Exit</div>
                                                        <div className="text-sm font-mono text-blue-600 font-bold">{velocity2.toFixed(1)} m/s</div>
                                                    </div>
                                                </div>

                                                {/* Graph */}
                                                <div className="w-full mt-6 h-64 bg-slate-900 border border-slate-800 rounded-lg p-4">
                                                    <div className="text-sm font-semibold mb-2 text-slate-100">Pressure vs Velocity along Pipe</div>
                                                    <ResponsiveContainer width="100%" height="100%">
                                                        <LineChart data={bernoulliData}>
                                                            <CartesianGrid strokeDasharray="3 3" opacity={0.1} stroke="#fff" />
                                                            <XAxis dataKey="x" stroke="#94a3b8" label={{ value: 'Position (%)', position: 'insideBottom', offset: -5, fill: '#94a3b8' }} />
                                                            <YAxis yAxisId="left" stroke="#ef4444" label={{ value: 'Pressure (kPa)', angle: -90, position: 'insideLeft', fill: '#ef4444' }} domain={['auto', 'auto']} />
                                                            <YAxis yAxisId="right" orientation="right" stroke="#3b82f6" label={{ value: 'Velocity (m/s)', angle: 90, position: 'insideRight', fill: '#3b82f6' }} domain={['auto', 'auto']} />
                                                            <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }} />
                                                            <Line yAxisId="left" type="monotone" dataKey="p" name="Pressure" stroke="#ef4444" strokeWidth={3} dot={false} />
                                                            <Line yAxisId="right" type="monotone" dataKey="v" name="Velocity" stroke="#3b82f6" strokeWidth={3} dot={false} />
                                                        </LineChart>
                                                    </ResponsiveContainer>
                                                </div>

                                                {/* Summary Metrics */}
                                                <div className="grid grid-cols-2 gap-4 w-full mt-12">
                                                    <Card className="bg-secondary/10 border-none shadow-none">
                                                        <CardHeader className="py-2 px-4">
                                                            <CardDescription className="text-[10px] uppercase font-bold">Outlet Pressure</CardDescription>
                                                        </CardHeader>
                                                        <CardContent className="py-2 px-4">
                                                            <div className={`text-xl font-bold font-mono ${pressure2 < bernoulliParams.pressure1 ? 'text-red-500' : 'text-green-500'}`}>
                                                                {pressure2.toFixed(1)} kPa
                                                            </div>
                                                        </CardContent>
                                                    </Card>
                                                    <Card className="bg-secondary/10 border-none shadow-none">
                                                        <CardHeader className="py-2 px-4">
                                                            <CardDescription className="text-[10px] uppercase font-bold">Velocity Change</CardDescription>
                                                        </CardHeader>
                                                        <CardContent className="py-2 px-4">
                                                            <div className="text-xl font-bold font-mono text-primary">
                                                                {(velocity2 / bernoulliParams.velocity1).toFixed(2)}x
                                                            </div>
                                                        </CardContent>
                                                    </Card>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </div>

                                    {/* Study Mode Content - In Depth */}
                                    {isStudyMode && (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.98 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className="space-y-6"
                                        >
                                            {/* What is Bernoulli's Principle? */}
                                            <Card className="border-primary/30 bg-primary/5">
                                                <CardHeader>
                                                    <CardTitle className="text-primary flex items-center gap-2">
                                                        <Activity className="w-5 h-5" />
                                                        What is Bernoulli's Principle?
                                                    </CardTitle>
                                                </CardHeader>
                                                <CardContent className="text-sm space-y-4">
                                                    <p>
                                                        <strong>Bernoulli's Principle</strong> (1738) describes the behavior of a moving fluid. It states that
                                                        as the <span className="text-blue-400 font-semibold">speed of a fluid increases</span>, its
                                                        <span className="text-red-400 font-semibold"> static pressure decreases</span>, and vice versa.
                                                    </p>
                                                    <div className="bg-background/80 p-4 rounded-lg border border-primary/20 text-center">
                                                        <div className="font-mono text-xl mb-2">P + ½ρv² + ρgh = constant</div>
                                                        <p className="text-xs text-muted-foreground">Along any streamline in an ideal fluid</p>
                                                    </div>
                                                    <p className="text-xs text-muted-foreground italic border-l-2 border-primary/50 pl-3">
                                                        Named after Swiss mathematician <strong>Daniel Bernoulli</strong>, this is essentially
                                                        the <strong>conservation of mechanical energy</strong> applied to flowing fluids.
                                                    </p>
                                                </CardContent>
                                            </Card>

                                            {/* The Three Energy Terms */}
                                            <Card className="border-secondary/30 bg-secondary/5">
                                                <CardHeader>
                                                    <CardTitle className="text-secondary">Understanding the Energy Terms</CardTitle>
                                                </CardHeader>
                                                <CardContent className="text-sm space-y-4">
                                                    <p>Bernoulli's equation represents <strong>three forms of energy per unit volume</strong>:</p>
                                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                        <div className="bg-red-500/10 p-4 rounded-lg border border-red-500/20">
                                                            <div className="font-mono text-lg text-red-400 mb-2">P</div>
                                                            <div className="font-semibold text-red-400 mb-1">Pressure Energy</div>
                                                            <p className="text-xs text-muted-foreground">
                                                                The potential energy stored in the fluid due to pressure.
                                                                Think of it as the "push" the fluid exerts.
                                                            </p>
                                                        </div>
                                                        <div className="bg-blue-500/10 p-4 rounded-lg border border-blue-500/20">
                                                            <div className="font-mono text-lg text-blue-400 mb-2">½ρv²</div>
                                                            <div className="font-semibold text-blue-400 mb-1">Kinetic Energy</div>
                                                            <p className="text-xs text-muted-foreground">
                                                                Energy due to motion. Faster flow = higher kinetic energy.
                                                                (Dynamic pressure)
                                                            </p>
                                                        </div>
                                                        <div className="bg-green-500/10 p-4 rounded-lg border border-green-500/20">
                                                            <div className="font-mono text-lg text-green-400 mb-2">ρgh</div>
                                                            <div className="font-semibold text-green-400 mb-1">Potential Energy</div>
                                                            <p className="text-xs text-muted-foreground">
                                                                Gravitational potential energy based on height.
                                                                Higher elevation = more stored energy.
                                                            </p>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>

                                            {/* Venturi Effect & Applications */}
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <Card className="border-warning/30 bg-warning/5">
                                                    <CardHeader className="pb-2">
                                                        <CardTitle className="text-warning text-base flex items-center gap-2">
                                                            <Navigation className="w-4 h-4" />
                                                            The Venturi Effect
                                                        </CardTitle>
                                                    </CardHeader>
                                                    <CardContent className="text-sm space-y-3">
                                                        <p>
                                                            When fluid flows through a <strong>constriction</strong> (narrower pipe),
                                                            its velocity must increase (continuity). By Bernoulli's principle,
                                                            this causes <strong>pressure to drop</strong>.
                                                        </p>
                                                        <div className="bg-background/80 p-3 rounded text-center text-xs">
                                                            <span className="text-muted-foreground">Wide pipe: </span>
                                                            <span className="text-green-400">Low v, High P</span>
                                                            <span className="mx-2">→</span>
                                                            <span className="text-muted-foreground">Narrow: </span>
                                                            <span className="text-red-400">High v, Low P</span>
                                                        </div>
                                                        <p className="text-xs text-muted-foreground">
                                                            This low-pressure zone creates "suction" that can draw in other fluids or particles.
                                                        </p>
                                                    </CardContent>
                                                </Card>

                                                <Card className="border-green-500/30 bg-green-500/5">
                                                    <CardHeader className="pb-2">
                                                        <CardTitle className="text-green-400 text-base">Real-World Applications</CardTitle>
                                                    </CardHeader>
                                                    <CardContent className="text-sm space-y-2">
                                                        <div className="flex items-start gap-2">
                                                            <span className="text-green-400 font-bold">✈️</span>
                                                            <span><strong>Airplane Wings:</strong> Air flows faster over the curved top, creating lower pressure → lift!</span>
                                                        </div>
                                                        <div className="flex items-start gap-2">
                                                            <span className="text-green-400 font-bold">🚗</span>
                                                            <span><strong>Carburetors:</strong> Venturi draws fuel into the air stream for combustion.</span>
                                                        </div>
                                                        <div className="flex items-start gap-2">
                                                            <span className="text-green-400 font-bold">🩺</span>
                                                            <span><strong>Blood Flow:</strong> Arterial stenosis → high velocity → low pressure → potential collapse.</span>
                                                        </div>
                                                        <div className="flex items-start gap-2">
                                                            <span className="text-green-400 font-bold">📏</span>
                                                            <span><strong>Venturi Meters:</strong> Measure flow rate by pressure drop.</span>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            </div>

                                            {/* Assumptions & Limitations */}
                                            <Card className="border-orange-500/30 bg-orange-500/5">
                                                <CardHeader className="pb-2">
                                                    <CardTitle className="text-orange-400 text-base">Assumptions & Limitations</CardTitle>
                                                </CardHeader>
                                                <CardContent className="text-sm">
                                                    <p className="mb-3">Bernoulli's equation is an <strong>idealization</strong>. It assumes:</p>
                                                    <ul className="space-y-2">
                                                        <li className="flex items-start gap-2">
                                                            <span className="text-orange-400 font-bold">1.</span>
                                                            <span><strong>Incompressible Fluid:</strong> Density (ρ) doesn't change. Valid for liquids; gases at low Mach.</span>
                                                        </li>
                                                        <li className="flex items-start gap-2">
                                                            <span className="text-orange-400 font-bold">2.</span>
                                                            <span><strong>Inviscid (No Friction):</strong> Ignores viscosity. Real pipes have friction losses.</span>
                                                        </li>
                                                        <li className="flex items-start gap-2">
                                                            <span className="text-orange-400 font-bold">3.</span>
                                                            <span><strong>Steady Flow:</strong> Flow properties don't change with time at any point.</span>
                                                        </li>
                                                        <li className="flex items-start gap-2">
                                                            <span className="text-orange-400 font-bold">4.</span>
                                                            <span><strong>Along a Streamline:</strong> Equation applies only along a single streamline.</span>
                                                        </li>
                                                    </ul>
                                                </CardContent>
                                            </Card>

                                            {/* Did You Know? */}
                                            <Card className="border-purple-500/30 bg-purple-500/5">
                                                <CardHeader className="pb-2">
                                                    <CardTitle className="text-purple-400 text-sm flex items-center gap-2">
                                                        <Lightbulb className="w-4 h-4" />
                                                        Did You Know?
                                                    </CardTitle>
                                                </CardHeader>
                                                <CardContent className="text-xs text-muted-foreground space-y-2">
                                                    <p>⚾ A curveball in baseball works because of Bernoulli! Spinning ball creates pressure differences → curved path.</p>
                                                    <p>🚂 Standing too close to a fast train is dangerous: air speed creates low pressure that can pull you toward it.</p>
                                                    <p>🏠 In hurricanes, roofs fly off because fast wind over the roof creates low pressure above while inside pressure stays normal.</p>
                                                </CardContent>
                                            </Card>
                                        </motion.div>
                                    )}
                                </TabsContent>

                                <TabsContent value="pipe-flow" className="space-y-6">
                                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                        {/* Controls */}
                                        <Card className="lg:col-span-1">
                                            <CardHeader>
                                                <CardTitle className="text-lg">Flow Parameters</CardTitle>
                                                <CardDescription>Determine Flow Regime (Reynolds No.)</CardDescription>
                                            </CardHeader>
                                            <CardContent className="space-y-6">
                                                <div className="space-y-4">
                                                    <div className="flex justify-between">
                                                        <Label>Velocity (v)</Label>
                                                        <span className="text-sm font-mono">{pipeParams.velocity.toFixed(1)} m/s</span>
                                                    </div>
                                                    <Slider
                                                        value={[pipeParams.velocity * 10]}
                                                        onValueChange={([v]) => setPipeParams(p => ({ ...p, velocity: v / 10 }))}
                                                        min={1}
                                                        max={100}
                                                        step={1}
                                                    />
                                                </div>

                                                <div className="space-y-4">
                                                    <div className="flex justify-between">
                                                        <Label>Pipe Diameter (D)</Label>
                                                        <span className="text-sm font-mono">{(pipeParams.diameter * 100).toFixed(1)} cm</span>
                                                    </div>
                                                    <Slider
                                                        value={[pipeParams.diameter * 1000]}
                                                        onValueChange={([v]) => setPipeParams(p => ({ ...p, diameter: v / 1000 }))}
                                                        min={10}
                                                        max={200}
                                                        step={5}
                                                    />
                                                </div>

                                                <div className="space-y-4">
                                                    <div className="flex justify-between">
                                                        <Label>Viscosity (μ)</Label>
                                                        <span className="text-sm font-mono">{pipeParams.viscosity.toFixed(4)} Pa·s</span>
                                                    </div>
                                                    <Slider
                                                        value={[pipeParams.viscosity * 10000]}
                                                        onValueChange={([v]) => setPipeParams(p => ({ ...p, viscosity: v / 10000 }))}
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
                                                <CardTitle>Pipe Flow Visualization</CardTitle>
                                                <CardDescription>Laminar vs Turbulent Flow</CardDescription>
                                            </CardHeader>
                                            <CardContent className="flex flex-col items-center justify-center min-h-[400px] bg-slate-950/50 p-8">
                                                {/* Premium Glass Pipe Container */}
                                                <div className="relative w-full h-56 flex items-center justify-center">

                                                    {/* The Pipe Itself */}
                                                    <div className="relative w-full h-40 bg-slate-900/40 rounded-r-lg overflow-hidden border-y border-slate-700 backdrop-blur-sm">

                                                        {/* Glass Highlights/Reflections */}
                                                        <div className="absolute top-0 left-0 right-0 h-1/3 bg-gradient-to-b from-white/5 to-transparent pointer-events-none z-20" />
                                                        <div className="absolute bottom-0 left-0 right-0 h-1/4 bg-gradient-to-t from-white/5 to-transparent pointer-events-none z-20" />
                                                        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-500/5 via-transparent to-transparent pointer-events-none z-0" />

                                                        {/* Grid Background inside Pipe */}
                                                        <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:20px_20px]" />

                                                        {/* FLOW PARTICLES (Blue Tracers) */}
                                                        {[...Array(40)].map((_, i) => {
                                                            const rRatio = (Math.random() * 2) - 1;
                                                            const rAbs = Math.abs(rRatio);
                                                            const isLaminar = reynoldsNumber < 2300;
                                                            // Parabolic vs Blunted profile
                                                            const velocityFactor = isLaminar ? (1 - Math.pow(rAbs, 2)) : Math.pow(1 - rAbs, 0.14);

                                                            return (
                                                                <motion.div
                                                                    key={`trace-${i}`}
                                                                    className="absolute w-1 h-0.5 bg-blue-300/30 rounded-full"
                                                                    style={{ top: `${50 + rRatio * 42}%` }}
                                                                    initial={{ x: -10, opacity: 0 }}
                                                                    animate={{
                                                                        x: 700,
                                                                        opacity: [0, 0.5, 0.5, 0],
                                                                        y: !isLaminar ? [0, (Math.random() - 0.5) * 10, 0] : 0
                                                                    }}
                                                                    transition={{
                                                                        duration: 4 / (velocityFactor * pipeParams.velocity + 0.1),
                                                                        repeat: Infinity,
                                                                        delay: Math.random() * 3,
                                                                        ease: "linear"
                                                                    }}
                                                                />
                                                            )
                                                        })}

                                                        {/* DYE INJECTION SYSTEM */}
                                                        {/* Needle */}
                                                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-12 h-[2px] bg-slate-400 z-30 shadow-md" />

                                                        {/* DYE VISUALS */}
                                                        {reynoldsNumber < 2300 ? (
                                                            // LAMINAR: Glowing Laser Filament
                                                            <div className="absolute left-12 top-1/2 -translate-y-[1px] w-full h-[2px] overflow-hidden z-20">
                                                                <motion.div
                                                                    className="w-full h-full bg-red-500 shadow-[0_0_6px_2px_rgba(239,68,68,0.6)]"
                                                                    initial={{ x: "-100%" }}
                                                                    animate={{ x: "0%" }}
                                                                    transition={{ duration: 0.8, ease: "out" }}
                                                                />
                                                            </div>
                                                        ) : (
                                                            // TURBULENT: Particle Cloud (Ink)
                                                            <>
                                                                {[...Array(50)].map((_, i) => (
                                                                    <motion.div
                                                                        key={`ink-${i}`}
                                                                        className="absolute left-12 w-2 h-2 rounded-full bg-red-500/40 blur-[4px]"
                                                                        style={{ top: '50%' }}
                                                                        initial={{ x: 0, scale: 0.5, opacity: 0.8 }}
                                                                        animate={{
                                                                            x: 600,
                                                                            y: [0, (Math.random() - 0.5) * 200], // Wide dispersion
                                                                            scale: [0.5, 4],
                                                                            opacity: [0.8, 0]
                                                                        }}
                                                                        transition={{
                                                                            duration: 2,
                                                                            repeat: Infinity,
                                                                            delay: Math.random() * 0.5,
                                                                            ease: "easeOut"
                                                                        }}
                                                                    />
                                                                ))}
                                                            </>
                                                        )}

                                                        {/* Regime Badge */}
                                                        <div className="absolute bottom-3 right-4 px-3 py-1 bg-black/40 backdrop-blur-md rounded border border-white/10 text-[10px] font-mono tracking-widest uppercase text-white/70">
                                                            {reynoldsNumber < 2300 ? "Laminar Flow" : reynoldsNumber > 4000 ? "Turbulent Flow" : "Transition Zone"}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Graph */}
                                                <div className="w-full mt-6 h-64 bg-slate-900 border border-slate-800 rounded-lg p-4">
                                                    <div className="text-sm font-semibold mb-2 text-slate-100">Velocity Profile</div>
                                                    <ResponsiveContainer width="100%" height="100%">
                                                        <LineChart layout="vertical" data={pipeProfileData}>
                                                            <CartesianGrid strokeDasharray="3 3" opacity={0.1} stroke="#fff" />
                                                            <XAxis type="number" dataKey="v" stroke="#94a3b8" label={{ value: 'Velocity (m/s)', position: 'insideBottom', offset: -5, fill: '#94a3b8' }} />
                                                            <YAxis type="number" dataKey="r" stroke="#94a3b8" label={{ value: 'Radial Position', angle: -90, position: 'insideLeft', fill: '#94a3b8' }} domain={[-1, 1]} />
                                                            <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }} />
                                                            <Line type="monotone" dataKey="v" stroke="#f59e0b" strokeWidth={3} dot={false} />
                                                        </LineChart>
                                                    </ResponsiveContainer>
                                                </div>

                                                {/* Summary Metrics */}
                                                <div className="grid grid-cols-2 gap-4 w-full mt-12">
                                                    <div className={`p-4 rounded-lg border text-center ${reynoldsNumber < 2300 ? 'bg-green-500/10 border-green-500/20 text-green-600' : (reynoldsNumber > 4000 ? 'bg-red-500/10 border-red-500/20 text-red-600' : 'bg-yellow-500/10 border-yellow-500/20 text-yellow-600')}`}>
                                                        <div className="text-2xl font-bold">
                                                            {reynoldsNumber < 2300 ? 'LAMINAR' : (reynoldsNumber > 4000 ? 'TURBULENT' : 'TRANSITIONAL')}
                                                        </div>
                                                        <div className="text-xs uppercase font-semibold">Flow Regime</div>
                                                    </div>
                                                    <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20 text-center">
                                                        <div className="text-2xl font-bold text-blue-600">Re = {reynoldsNumber.toFixed(0)}</div>
                                                        <div className="text-xs text-muted-foreground uppercase font-semibold">Reynolds Number</div>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </div>

                                    {/* Study Mode Content - In Depth */}
                                    {isStudyMode && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="space-y-6"
                                        >
                                            {/* What is Reynolds Number? */}
                                            <Card className="border-blue-500/30 bg-blue-500/5">
                                                <CardHeader>
                                                    <CardTitle className="text-blue-400 flex items-center gap-2">
                                                        <Navigation className="w-5 h-5" />
                                                        What is the Reynolds Number?
                                                    </CardTitle>
                                                </CardHeader>
                                                <CardContent className="text-sm space-y-4">
                                                    <p>
                                                        The <strong>Reynolds Number (Re)</strong> is a <strong>dimensionless quantity</strong> that
                                                        predicts whether fluid flow will be <span className="text-green-400">laminar</span> (smooth) or
                                                        <span className="text-red-400"> turbulent</span> (chaotic).
                                                    </p>
                                                    <div className="bg-background/80 p-4 rounded-lg border border-blue-500/20 text-center">
                                                        <div className="font-mono text-xl mb-2">Re = (ρ · v · D) / μ = (v · D) / ν</div>
                                                        <p className="text-xs text-muted-foreground">
                                                            ρ = density, v = velocity, D = diameter, μ = dynamic viscosity, ν = kinematic viscosity
                                                        </p>
                                                    </div>
                                                    <p className="text-xs text-muted-foreground italic border-l-2 border-blue-500/50 pl-3">
                                                        Named after <strong>Osborne Reynolds</strong> (1883), who demonstrated the transition
                                                        from laminar to turbulent flow using dye injection in a glass tube.
                                                    </p>
                                                </CardContent>
                                            </Card>

                                            {/* Laminar vs Turbulent */}
                                            <Card className="border-secondary/30 bg-secondary/5">
                                                <CardHeader>
                                                    <CardTitle className="text-secondary">Laminar vs Turbulent Flow</CardTitle>
                                                </CardHeader>
                                                <CardContent className="text-sm space-y-4">
                                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                        <div className="bg-green-500/10 p-4 rounded-lg border border-green-500/20">
                                                            <div className="font-mono text-lg text-green-400 mb-2">Re {'<'} 2300</div>
                                                            <div className="font-semibold text-green-400 mb-1">Laminar Flow</div>
                                                            <ul className="text-xs text-muted-foreground space-y-1">
                                                                <li>• Smooth, orderly layers</li>
                                                                <li>• Parabolic velocity profile</li>
                                                                <li>• Low friction losses</li>
                                                                <li>• Predictable behavior</li>
                                                            </ul>
                                                        </div>
                                                        <div className="bg-yellow-500/10 p-4 rounded-lg border border-yellow-500/20">
                                                            <div className="font-mono text-lg text-yellow-400 mb-2">2300 - 4000</div>
                                                            <div className="font-semibold text-yellow-400 mb-1">Transition Zone</div>
                                                            <ul className="text-xs text-muted-foreground space-y-1">
                                                                <li>• Unstable, fluctuating</li>
                                                                <li>• Intermittent turbulence</li>
                                                                <li>• Hard to predict</li>
                                                                <li>• Avoid in design!</li>
                                                            </ul>
                                                        </div>
                                                        <div className="bg-red-500/10 p-4 rounded-lg border border-red-500/20">
                                                            <div className="font-mono text-lg text-red-400 mb-2">Re {'>'} 4000</div>
                                                            <div className="font-semibold text-red-400 mb-1">Turbulent Flow</div>
                                                            <ul className="text-xs text-muted-foreground space-y-1">
                                                                <li>• Chaotic eddies & mixing</li>
                                                                <li>• Flatter velocity profile</li>
                                                                <li>• Higher friction losses</li>
                                                                <li>• Better heat transfer</li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>

                                            {/* Velocity Profiles & Friction */}
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <Card className="border-warning/30 bg-warning/5">
                                                    <CardHeader className="pb-2">
                                                        <CardTitle className="text-warning text-base">Velocity Profiles</CardTitle>
                                                    </CardHeader>
                                                    <CardContent className="text-sm space-y-3">
                                                        <p>
                                                            <strong>Laminar:</strong> Velocity is highest at the center (no-slip at walls).
                                                            The profile forms a <strong>parabola</strong>.
                                                        </p>
                                                        <div className="bg-background/80 p-3 rounded font-mono text-center text-sm border border-warning/20">
                                                            v(r) = v_max × [1 - (r/R)²]
                                                        </div>
                                                        <p>
                                                            <strong>Turbulent:</strong> Momentum mixes across the pipe, creating a
                                                            <strong> blunter, flatter profile</strong>. Flow is more uniform.
                                                        </p>
                                                    </CardContent>
                                                </Card>

                                                <Card className="border-orange-500/30 bg-orange-500/5">
                                                    <CardHeader className="pb-2">
                                                        <CardTitle className="text-orange-400 text-base">Friction & Head Loss</CardTitle>
                                                    </CardHeader>
                                                    <CardContent className="text-sm space-y-3">
                                                        <p>
                                                            Flowing fluid loses energy to friction. The <strong>Darcy-Weisbach</strong> equation
                                                            calculates this head loss:
                                                        </p>
                                                        <div className="bg-background/80 p-3 rounded font-mono text-center text-sm border border-orange-500/20">
                                                            h_f = f × (L/D) × (v²/2g)
                                                        </div>
                                                        <p className="text-xs text-muted-foreground">
                                                            f = friction factor (depends on Re and pipe roughness), L = length, D = diameter
                                                        </p>
                                                    </CardContent>
                                                </Card>
                                            </div>

                                            {/* Physical Meaning */}
                                            <Card className="border-primary/30 bg-primary/5">
                                                <CardHeader className="pb-2">
                                                    <CardTitle className="text-primary text-base flex items-center gap-2">
                                                        <Info className="w-4 h-4" />
                                                        Physical Interpretation
                                                    </CardTitle>
                                                </CardHeader>
                                                <CardContent className="text-sm">
                                                    <p className="mb-3">The Reynolds number is the ratio of two forces:</p>
                                                    <div className="bg-background/80 p-4 rounded text-center font-mono border border-primary/20">
                                                        Re = <span className="text-blue-400">Inertial Forces</span> / <span className="text-green-400">Viscous Forces</span>
                                                    </div>
                                                    <ul className="mt-4 space-y-2 text-sm">
                                                        <li className="flex items-start gap-2">
                                                            <span className="text-blue-400 font-bold">↑</span>
                                                            <span><strong>High Re:</strong> Inertia dominates → fluid keeps moving chaotically → <strong>Turbulent</strong></span>
                                                        </li>
                                                        <li className="flex items-start gap-2">
                                                            <span className="text-green-400 font-bold">↓</span>
                                                            <span><strong>Low Re:</strong> Viscosity dominates → fluid resists disruption → <strong>Laminar</strong></span>
                                                        </li>
                                                    </ul>
                                                </CardContent>
                                            </Card>

                                            {/* Real-World & Tips */}
                                            <Card className="border-green-500/30 bg-green-500/5">
                                                <CardHeader className="pb-2">
                                                    <CardTitle className="text-green-400 text-base">Engineering Applications</CardTitle>
                                                </CardHeader>
                                                <CardContent className="text-sm space-y-2">
                                                    <div className="flex items-start gap-2">
                                                        <span className="text-green-400 font-bold">🔧</span>
                                                        <span><strong>HVAC Ducts:</strong> Designed for turbulent flow (Re ~ 10,000+) for better mixing & heat transfer.</span>
                                                    </div>
                                                    <div className="flex items-start gap-2">
                                                        <span className="text-green-400 font-bold">🩸</span>
                                                        <span><strong>Blood Flow:</strong> Normally laminar (Re ~ 1,000). Turbulence indicates artery blockage!</span>
                                                    </div>
                                                    <div className="flex items-start gap-2">
                                                        <span className="text-green-400 font-bold">🛢️</span>
                                                        <span><strong>Oil Pipelines:</strong> Often laminar (high viscosity) → lower pumping costs.</span>
                                                    </div>
                                                    <div className="flex items-start gap-2">
                                                        <span className="text-green-400 font-bold">🚰</span>
                                                        <span><strong>Water Mains:</strong> Turbulent flow reduces bacteria growth vs stagnant laminar zones.</span>
                                                    </div>
                                                </CardContent>
                                            </Card>

                                            {/* Did You Know? */}
                                            <Card className="border-purple-500/30 bg-purple-500/5">
                                                <CardHeader className="pb-2">
                                                    <CardTitle className="text-purple-400 text-sm flex items-center gap-2">
                                                        <Lightbulb className="w-4 h-4" />
                                                        Did You Know?
                                                    </CardTitle>
                                                </CardHeader>
                                                <CardContent className="text-xs text-muted-foreground space-y-2">
                                                    <p>🐟 Fish and dolphins have evolved skin patterns that delay transition to turbulence, reducing drag!</p>
                                                    <p>✈️ Golf ball dimples force early transition to turbulence, which actually reduces drag on spheres.</p>
                                                    <p>🍯 Honey pouring has Re ~ 0.1 (extremely laminar). Water from a tap is typically Re ~ 10,000+ (turbulent).</p>
                                                </CardContent>
                                            </Card>
                                        </motion.div>
                                    )}
                                </TabsContent>

                                <TabsContent value="continuity" className="space-y-6">
                                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                        {/* Controls */}
                                        <Card className="lg:col-span-1">
                                            <CardHeader>
                                                <CardTitle className="text-lg">Pipe Sections</CardTitle>
                                                <CardDescription>Conservation of Mass</CardDescription>
                                            </CardHeader>
                                            <CardContent className="space-y-6">
                                                <div className="space-y-4">
                                                    <div className="flex justify-between">
                                                        <Label>Inlet Diameter (D1)</Label>
                                                        <span className="text-sm font-mono">{(continuityParams.diameter1 * 100).toFixed(0)} cm</span>
                                                    </div>
                                                    <Slider
                                                        value={[continuityParams.diameter1 * 100]}
                                                        onValueChange={([v]) => setContinuityParams(p => ({ ...p, diameter1: v / 100 }))}
                                                        min={5}
                                                        max={20}
                                                        step={1}
                                                    />
                                                </div>

                                                <div className="space-y-4">
                                                    <div className="flex justify-between">
                                                        <Label>Inlet Velocity (v1)</Label>
                                                        <span className="text-sm font-mono">{continuityParams.velocity1} m/s</span>
                                                    </div>
                                                    <Slider
                                                        value={[continuityParams.velocity1]}
                                                        onValueChange={([v]) => setContinuityParams(p => ({ ...p, velocity1: v }))}
                                                        min={1}
                                                        max={10}
                                                        step={0.5}
                                                    />
                                                </div>

                                                <div className="space-y-4">
                                                    <div className="flex justify-between">
                                                        <Label>Outlet Diameter (D2)</Label>
                                                        <span className="text-sm font-mono">{(continuityParams.diameter2 * 100).toFixed(0)} cm</span>
                                                    </div>
                                                    <Slider
                                                        value={[continuityParams.diameter2 * 100]}
                                                        onValueChange={([v]) => setContinuityParams(p => ({ ...p, diameter2: v / 100 }))}
                                                        min={5}
                                                        max={20}
                                                        step={1}
                                                    />
                                                </div>
                                            </CardContent>
                                        </Card>

                                        {/* Visualization */}
                                        <Card className="lg:col-span-2">
                                            <CardHeader>
                                                <CardTitle>Continuity Equation Visualization</CardTitle>
                                                <CardDescription>A1 · v1 = A2 · v2</CardDescription>
                                            </CardHeader>
                                            <CardContent className="flex flex-col items-center justify-center min-h-[400px]">
                                                <div className="relative w-full h-48 flex items-center justify-center">
                                                    {/* Variable Pipe */}
                                                    <svg viewBox="0 0 400 200" className="w-full h-full">
                                                        <defs>
                                                            <linearGradient id="flowGradient" x1="0" y1="0" x2="1" y2="0">
                                                                <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.2" />
                                                                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.4" />
                                                            </linearGradient>
                                                        </defs>

                                                        {/* Pipe Path */}
                                                        {(() => {
                                                            const h1 = continuityParams.diameter1 * 500; // Scale factor
                                                            const h2 = continuityParams.diameter2 * 500;
                                                            return (
                                                                <path
                                                                    d={`M 0,${100 - h1 / 2} L 150,${100 - h1 / 2} L 250,${100 - h2 / 2} L 400,${100 - h2 / 2} L 400,${100 + h2 / 2} L 250,${100 + h2 / 2} L 150,${100 + h1 / 2} L 0,${100 + h1 / 2} Z`}
                                                                    fill="url(#flowGradient)"
                                                                    stroke="#3b82f6"
                                                                    strokeWidth="2"
                                                                />
                                                            );
                                                        })()}

                                                        {/* Particles */}
                                                        {[...Array(8)].map((_, i) => (
                                                            <motion.circle
                                                                key={i}
                                                                r="3"
                                                                className="fill-blue-100"
                                                                initial={{ cx: 0, cy: 100 }}
                                                                animate={{
                                                                    cx: [0, 150, 250, 400],
                                                                    // Simple trick: scale the time spent in each section inversely to velocity
                                                                }}
                                                                transition={{
                                                                    duration: 3, // simplified
                                                                    repeat: Infinity,
                                                                    delay: i * 0.4,
                                                                    times: [0, 0.4, 0.6, 1], // Spending less time in narrower section? No, wait.
                                                                    // Actually, implementing accurate physics animation for variable speed along a path in CSS/Framer is hard with single 'animate'.
                                                                    // Better to stick to a visual representation of "speed change" by just moving them.
                                                                    ease: "linear"
                                                                }}
                                                            >
                                                            </motion.circle>
                                                        ))}
                                                    </svg>

                                                    {/* Velocity Labels */}
                                                    <div className="absolute left-10 top-1/2 -translate-y-1/2 text-center pointer-events-none">
                                                        <div className="text-xs font-bold text-blue-200 uppercase">Velocity 1</div>
                                                        <div className="text-lg font-mono font-bold text-white">{continuityParams.velocity1} m/s</div>
                                                    </div>

                                                    <div className="absolute right-10 top-1/2 -translate-y-1/2 text-center pointer-events-none">
                                                        <div className="text-xs font-bold text-blue-200 uppercase">Velocity 2</div>
                                                        <div className="text-lg font-mono font-bold text-white">{continuityVelocity2.toFixed(1)} m/s</div>
                                                    </div>
                                                </div>

                                                {/* Graph */}
                                                <div className="w-full mt-6 h-64 bg-slate-900 border border-slate-800 rounded-lg p-4">
                                                    <div className="text-sm font-semibold mb-2 text-slate-100">Velocity vs Pipe Diameter</div>
                                                    <ResponsiveContainer width="100%" height="100%">
                                                        <LineChart data={continuityData}>
                                                            <CartesianGrid strokeDasharray="3 3" opacity={0.1} stroke="#fff" />
                                                            <XAxis dataKey="d" stroke="#94a3b8" label={{ value: 'Diameter (cm)', position: 'insideBottom', offset: -5, fill: '#94a3b8' }} />
                                                            <YAxis stroke="#94a3b8" label={{ value: 'Velocity (m/s)', angle: -90, position: 'insideLeft', fill: '#94a3b8' }} />
                                                            <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }} />
                                                            <ReferenceLine x={continuityParams.diameter1 * 100} stroke="#3b82f6" label="D1" strokeDasharray="3 3" />
                                                            <ReferenceLine x={continuityParams.diameter2 * 100} stroke="#3b82f6" label="D2" strokeDasharray="3 3" />
                                                            <Line type="monotone" dataKey="v" stroke="#10b981" strokeWidth={3} dot={false} />
                                                        </LineChart>
                                                    </ResponsiveContainer>
                                                </div>

                                                {/* Summary Metrics */}
                                                <div className="grid grid-cols-2 gap-4 w-full mt-12">
                                                    <div className="p-4 rounded-lg bg-primary/10 border border-primary/20 text-center">
                                                        <div className="text-2xl font-bold text-primary">
                                                            {continuityVelocity2 > continuityParams.velocity1 ?
                                                                `${(continuityVelocity2 / continuityParams.velocity1).toFixed(1)}x Faster` :
                                                                `${(continuityParams.velocity1 / continuityVelocity2).toFixed(1)}x Slower`}
                                                        </div>
                                                        <div className="text-xs text-muted-foreground uppercase font-semibold">Speed Change</div>
                                                    </div>
                                                    <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20 text-center">
                                                        <div className="text-2xl font-bold text-green-600">Const</div>
                                                        <div className="text-xs text-muted-foreground uppercase font-semibold">Mass Flow Rate</div>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </div>

                                    {/* Study Mode Content - In Depth */}
                                    {isStudyMode && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="space-y-6"
                                        >
                                            {/* What is the Continuity Equation? */}
                                            <Card className="border-cyan-500/30 bg-cyan-500/5">
                                                <CardHeader>
                                                    <CardTitle className="text-cyan-400 flex items-center gap-2">
                                                        <Waves className="w-5 h-5" />
                                                        What is the Continuity Equation?
                                                    </CardTitle>
                                                </CardHeader>
                                                <CardContent className="text-sm space-y-4">
                                                    <p>
                                                        The <strong>Continuity Equation</strong> is a mathematical statement of
                                                        <strong> Conservation of Mass</strong>. For a steady, incompressible flow,
                                                        the amount of fluid entering any section of a pipe equals the amount leaving.
                                                    </p>
                                                    <div className="bg-background/80 p-4 rounded-lg border border-cyan-500/20 text-center">
                                                        <div className="font-mono text-xl mb-2">A₁ · v₁ = A₂ · v₂</div>
                                                        <p className="text-xs text-muted-foreground">
                                                            A = cross-sectional area, v = fluid velocity
                                                        </p>
                                                    </div>
                                                    <p className="text-xs text-muted-foreground italic border-l-2 border-cyan-500/50 pl-3">
                                                        This is why fluids speed up when they pass through constrictions—the same volume
                                                        must pass through in the same time, so velocity must increase when area decreases.
                                                    </p>
                                                </CardContent>
                                            </Card>

                                            {/* Flow Rate Concepts */}
                                            <Card className="border-secondary/30 bg-secondary/5">
                                                <CardHeader>
                                                    <CardTitle className="text-secondary">Understanding Flow Rates</CardTitle>
                                                </CardHeader>
                                                <CardContent className="text-sm space-y-4">
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <div className="bg-blue-500/10 p-4 rounded-lg border border-blue-500/20">
                                                            <div className="font-mono text-lg text-blue-400 mb-2">Q = A × v</div>
                                                            <div className="font-semibold text-blue-400 mb-1">Volumetric Flow Rate</div>
                                                            <ul className="text-xs text-muted-foreground space-y-1">
                                                                <li>• Units: m³/s or L/min</li>
                                                                <li>• Volume passing per unit time</li>
                                                                <li>• For incompressible: Q₁ = Q₂</li>
                                                            </ul>
                                                        </div>
                                                        <div className="bg-green-500/10 p-4 rounded-lg border border-green-500/20">
                                                            <div className="font-mono text-lg text-green-400 mb-2">ṁ = ρ × A × v</div>
                                                            <div className="font-semibold text-green-400 mb-1">Mass Flow Rate</div>
                                                            <ul className="text-xs text-muted-foreground space-y-1">
                                                                <li>• Units: kg/s</li>
                                                                <li>• Mass passing per unit time</li>
                                                                <li>• For all flows: ṁ₁ = ṁ₂</li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>

                                            {/* Area-Velocity Relationship */}
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <Card className="border-warning/30 bg-warning/5">
                                                    <CardHeader className="pb-2">
                                                        <CardTitle className="text-warning text-base">The Key Insight</CardTitle>
                                                    </CardHeader>
                                                    <CardContent className="text-sm space-y-3">
                                                        <p>
                                                            Since A × v = constant:
                                                        </p>
                                                        <ul className="space-y-2">
                                                            <li className="flex items-start gap-2">
                                                                <span className="text-red-400 font-bold">↓</span>
                                                                <span><strong>Area decreases</strong> → Velocity <strong>increases</strong></span>
                                                            </li>
                                                            <li className="flex items-start gap-2">
                                                                <span className="text-green-400 font-bold">↑</span>
                                                                <span><strong>Area increases</strong> → Velocity <strong>decreases</strong></span>
                                                            </li>
                                                        </ul>
                                                        <div className="bg-background/80 p-3 rounded font-mono text-center text-sm border border-warning/20">
                                                            v₂ = v₁ × (A₁ / A₂) = v₁ × (D₁ / D₂)²
                                                        </div>
                                                        <p className="text-xs text-muted-foreground">
                                                            Halving the diameter increases velocity by <strong>4×</strong>!
                                                        </p>
                                                    </CardContent>
                                                </Card>

                                                <Card className="border-orange-500/30 bg-orange-500/5">
                                                    <CardHeader className="pb-2">
                                                        <CardTitle className="text-orange-400 text-base">Compressible vs Incompressible</CardTitle>
                                                    </CardHeader>
                                                    <CardContent className="text-sm space-y-3">
                                                        <p>
                                                            <strong className="text-blue-400">Incompressible (Liquids):</strong> Density stays constant.
                                                            Simple A₁v₁ = A₂v₂ applies.
                                                        </p>
                                                        <p>
                                                            <strong className="text-orange-400">Compressible (Gases at high speed):</strong> Density can change.
                                                            Must use ρ₁A₁v₁ = ρ₂A₂v₂.
                                                        </p>
                                                        <p className="text-xs text-muted-foreground italic">
                                                            At speeds below Mach 0.3, even gases can be treated as incompressible.
                                                        </p>
                                                    </CardContent>
                                                </Card>
                                            </div>

                                            {/* Physical Meaning */}
                                            <Card className="border-primary/30 bg-primary/5">
                                                <CardHeader className="pb-2">
                                                    <CardTitle className="text-primary text-base flex items-center gap-2">
                                                        <Info className="w-4 h-4" />
                                                        Why Mass is Conserved
                                                    </CardTitle>
                                                </CardHeader>
                                                <CardContent className="text-sm space-y-3">
                                                    <p>
                                                        Mass cannot appear or disappear. In a steady-state flow (nothing changing with time),
                                                        what goes in must come out. Think of it like traffic:
                                                    </p>
                                                    <div className="bg-background/80 p-4 rounded border border-primary/20 text-center text-sm">
                                                        <p className="text-muted-foreground">
                                                            If 100 cars/hour enter a tunnel → 100 cars/hour must exit (assuming no cars disappear inside!)
                                                        </p>
                                                    </div>
                                                    <p className="text-xs text-muted-foreground">
                                                        This also explains why rivers flow faster through narrow gorges and
                                                        why garden hose water speeds up when you put your thumb over the end.
                                                    </p>
                                                </CardContent>
                                            </Card>

                                            {/* Real-World Applications */}
                                            <Card className="border-green-500/30 bg-green-500/5">
                                                <CardHeader className="pb-2">
                                                    <CardTitle className="text-green-400 text-base">Engineering Applications</CardTitle>
                                                </CardHeader>
                                                <CardContent className="text-sm space-y-2">
                                                    <div className="flex items-start gap-2">
                                                        <span className="text-green-400 font-bold">🚒</span>
                                                        <span><strong>Fire Nozzles:</strong> Small outlet → very high jet velocity for long-range reach.</span>
                                                    </div>
                                                    <div className="flex items-start gap-2">
                                                        <span className="text-green-400 font-bold">⛲</span>
                                                        <span><strong>Fountains:</strong> Nozzle design controls water pattern and height.</span>
                                                    </div>
                                                    <div className="flex items-start gap-2">
                                                        <span className="text-green-400 font-bold">🏭</span>
                                                        <span><strong>Pipelines:</strong> Engineers size pipes to control velocity (avoid erosion or stagnation).</span>
                                                    </div>
                                                    <div className="flex items-start gap-2">
                                                        <span className="text-green-400 font-bold">🩺</span>
                                                        <span><strong>Blood Vessels:</strong> Capillaries have small area but MANY of them—total cross-section is huge, so blood slows down for exchange.</span>
                                                    </div>
                                                    <div className="flex items-start gap-2">
                                                        <span className="text-green-400 font-bold">🌊</span>
                                                        <span><strong>Rivers:</strong> Rapids form where the channel narrows—same water, less space, higher speed!</span>
                                                    </div>
                                                </CardContent>
                                            </Card>

                                            {/* Did You Know? */}
                                            <Card className="border-purple-500/30 bg-purple-500/5">
                                                <CardHeader className="pb-2">
                                                    <CardTitle className="text-purple-400 text-sm flex items-center gap-2">
                                                        <Lightbulb className="w-4 h-4" />
                                                        Did You Know?
                                                    </CardTitle>
                                                </CardHeader>
                                                <CardContent className="text-xs text-muted-foreground space-y-2">
                                                    <p>🏊 Olympic swimmers cup their hands to increase "area" and push more water backward per stroke.</p>
                                                    <p>🚿 Low-flow showerheads use small holes to maintain pressure while using less water (same Q with smaller A means higher v).</p>
                                                    <p>🌬️ Your lungs have ~300 million alveoli—total surface area of a tennis court! Air slows down for gas exchange.</p>
                                                    <p>🏞️ The Amazon River is so wide in places that it flows as slowly as 1.5 mph despite massive volumes.</p>
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

export default FluidMechanics;
