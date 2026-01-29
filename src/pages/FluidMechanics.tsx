import { useState } from 'react';
import { motion } from 'framer-motion';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import {
    Droplets,
    Waves,
    ArrowRight,
    RotateCcw,
    GraduationCap,
    Info,
    Activity,
    Navigation
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const FluidMechanics = () => {
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

    // Pipe Flow State (Reynolds)
    const [pipeParams, setPipeParams] = useState({
        velocity: 2, // m/s
        diameter: 0.05, // m
        viscosity: 0.001 // Pa·s (Dynamic Viscosity of water)
    });
    // Re = (rho * v * D) / mu. Assuming rho=1000 for water.
    const reynoldsNumber = (1000 * pipeParams.velocity * pipeParams.diameter) / pipeParams.viscosity;

    // Continuity State
    const [continuityParams, setContinuityParams] = useState({
        diameter1: 0.1, // m
        velocity1: 2,   // m/s
        diameter2: 0.05 // m
    });
    const area1 = Math.PI * Math.pow(continuityParams.diameter1 / 2, 2);
    const area2 = Math.PI * Math.pow(continuityParams.diameter2 / 2, 2);
    const continuityVelocity2 = (area1 * continuityParams.velocity1) / area2;


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

                                    {/* Study Mode Content */}
                                    {isStudyMode && (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.98 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className="grid grid-cols-1 md:grid-cols-2 gap-6"
                                        >
                                            <Card className="border-warning/30 bg-warning/5">
                                                <CardHeader className="flex flex-row items-center gap-2">
                                                    <Info className="w-5 h-5 text-warning" />
                                                    <CardTitle className="text-warning">Bernoulli's Principle</CardTitle>
                                                </CardHeader>
                                                <CardContent className="text-sm space-y-3">
                                                    <p>
                                                        Named after Daniel Bernoulli, this principle states that an increase in the speed of a fluid
                                                        occurs simultaneously with a decrease in static pressure or a decrease in the fluid's potential energy.
                                                    </p>
                                                    <div className="bg-background/80 p-3 rounded font-mono text-center text-xs sm:text-sm my-4 overflow-x-auto">
                                                        P + ½ρv² + ρgh = constant
                                                    </div>
                                                    <p className="text-xs italic text-muted-foreground">
                                                        Note: This assumes laminar, incompressible, and non-viscous flow.
                                                    </p>
                                                </CardContent>
                                            </Card>

                                            <Card className="border-warning/30 bg-warning/5">
                                                <CardHeader className="flex flex-row items-center gap-2">
                                                    <GraduationCap className="w-5 h-5 text-warning" />
                                                    <CardTitle className="text-warning">The Venturi Effect</CardTitle>
                                                </CardHeader>
                                                <CardContent className="text-sm space-y-3">
                                                    <p>
                                                        A special case of Bernoulli's principle. When a fluid flows through a constricted section
                                                        of pipe, its velocity increases and its static pressure decreases.
                                                    </p>
                                                    <p>
                                                        This is used in carburetors, pitot tubes, and even perfume sprayers!
                                                    </p>
                                                    <div className="flex gap-2 items-center text-xs font-semibold text-warning mt-2">
                                                        <div className="p-1 rounded bg-warning/20">Pro Tip</div>
                                                        <span>Watch how the outlet pressure drops as you decrease the exit area!</span>
                                                    </div>
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
                                            <CardContent className="flex flex-col items-center justify-center min-h-[400px]">
                                                <div className="relative w-full h-48 bg-slate-900 rounded-lg overflow-hidden border border-slate-700 flex items-center">
                                                    {/* Pipe Walls */}
                                                    <div className="absolute top-0 left-0 right-0 h-2 bg-slate-600 z-10" />
                                                    <div className="absolute bottom-0 left-0 right-0 h-2 bg-slate-600 z-10" />

                                                    {/* Streamlines */}
                                                    {[...Array(7)].map((_, i) => (
                                                        <motion.div
                                                            key={i}
                                                            className="absolute h-0.5 bg-blue-400 opacity-60 rounded-full"
                                                            style={{
                                                                top: `${15 + i * 12}%`,
                                                                left: 0,
                                                                right: 0
                                                            }}
                                                            animate={{
                                                                y: reynoldsNumber > 2300 ? [0, Math.sin(i) * (reynoldsNumber / 300), 0, -Math.sin(i) * (reynoldsNumber / 300), 0] : 0,
                                                            }}
                                                            transition={{
                                                                duration: 0.2, // Fast jitter for turbulence
                                                                repeat: Infinity,
                                                                ease: "linear"
                                                            }}
                                                        >
                                                            {/* Flowing particles on line */}
                                                            <div className="relative w-full h-full overflow-hidden">
                                                                <motion.div
                                                                    className="absolute top-0 bottom-0 w-20 bg-white/50 blur-[2px]"
                                                                    initial={{ x: "-10%" }}
                                                                    animate={{ x: "110%" }}
                                                                    transition={{
                                                                        duration: 3 / pipeParams.velocity,
                                                                        repeat: Infinity,
                                                                        ease: "linear",
                                                                        delay: i * 0.1
                                                                    }}
                                                                />
                                                            </div>
                                                        </motion.div>
                                                    ))}
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
                                                    <CardTitle className="text-warning">Reynolds Number (Re)</CardTitle>
                                                </CardHeader>
                                                <CardContent className="text-sm space-y-3">
                                                    <p>
                                                        The Reynolds number is a dimensionless quantity that helps predict flow patterns. It represents the ratio of inertial forces to viscous forces.
                                                    </p>
                                                    <div className="bg-background/80 p-3 rounded font-mono text-center text-lg my-4">
                                                        Re = (ρ · v · D) / μ
                                                    </div>
                                                    <ul className="list-disc pl-5 space-y-1">
                                                        <li><strong>Re {'<'} 2300:</strong> Laminar flow (smooth, organized)</li>
                                                        <li><strong>Re {'>'} 4000:</strong> Turbulent flow (chaotic, mixing)</li>
                                                    </ul>
                                                </CardContent>
                                            </Card>

                                            <Card className="border-warning/30 bg-warning/5">
                                                <CardHeader className="flex flex-row items-center gap-2">
                                                    <Navigation className="w-5 h-5 text-warning" />
                                                    <CardTitle className="text-warning">Real World Impact</CardTitle>
                                                </CardHeader>
                                                <CardContent className="text-sm space-y-3">
                                                    <p>
                                                        High viscosity fluids (like honey) tend to flow in a laminar way (low Re). Low viscosity fluids at high speeds (like air over a wing) are often turbulent (high Re).
                                                    </p>
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
                                                    <CardTitle className="text-warning">Continuity Equation</CardTitle>
                                                </CardHeader>
                                                <CardContent className="text-sm space-y-3">
                                                    <p>
                                                        Since mass cannot be created or destroyed (conservation of mass), the amount of fluid entering a pipe must equal the amount leaving it.
                                                    </p>
                                                    <div className="bg-background/80 p-3 rounded font-mono text-center text-lg my-4">
                                                        A₁ · v₁ = A₂ · v₂
                                                    </div>
                                                    <p>
                                                        If the pipe gets narrower (Area decreases), the fluid MUST speed up (Velocity increases) to maintain the same flow rate.
                                                    </p>
                                                </CardContent>
                                            </Card>

                                            <Card className="border-warning/30 bg-warning/5">
                                                <CardHeader className="flex flex-row items-center gap-2">
                                                    <Waves className="w-5 h-5 text-warning" />
                                                    <CardTitle className="text-warning">Incompressible Flow</CardTitle>
                                                </CardHeader>
                                                <CardContent className="text-sm space-y-3">
                                                    <p>
                                                        This simple equation assumes the fluid density doesn't change (incompressible), which is true for water and low-speed airflow.
                                                    </p>
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
