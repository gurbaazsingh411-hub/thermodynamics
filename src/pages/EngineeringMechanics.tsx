import { useState } from 'react';
import { motion } from 'framer-motion';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import {
    Settings,
    ArrowRight,
    RotateCcw,
    GraduationCap,
    Info,
    Box,
    Move
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const EngineeringMechanics = () => {
    const [isStudyMode, setIsStudyMode] = useState(false);
    const [frictionParams, setFrictionParams] = useState({
        mass: 10,       // kg
        coefficient: 0.3,
        angle: 30       // degrees
    });

    const g = 9.81;
    const angleRad = (frictionParams.angle * Math.PI) / 180;
    const forceGravity = frictionParams.mass * g;
    const forceParallel = forceGravity * Math.sin(angleRad);
    const forceNormal = forceGravity * Math.cos(angleRad);
    const forceFrictionMax = frictionParams.coefficient * forceNormal;

    const netForce = Math.max(0, forceParallel - forceFrictionMax);
    const acceleration = netForce / frictionParams.mass;

    // Vector Decomposition State
    const [vectorParams, setVectorParams] = useState({
        magnitude: 100, // N
        angle: 45 // degrees
    });
    const rad = vectorParams.angle * (Math.PI / 180);
    const fx = vectorParams.magnitude * Math.cos(rad);
    const fy = vectorParams.magnitude * Math.sin(rad);

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
                                <Settings className="w-4 h-4 text-primary" />
                                <span className="font-semibold">Engineering Mechanics Visualization</span>
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
                            <Tabs defaultValue="friction" className="w-full">
                                <TabsList className="grid w-full grid-cols-2 mb-8">
                                    <TabsTrigger value="friction" className="gap-2">
                                        <Box className="w-4 h-4" /> Inclined Plane
                                    </TabsTrigger>
                                    <TabsTrigger value="vectors" className="gap-2">
                                        <Move className="w-4 h-4" /> Vector Decomposition
                                    </TabsTrigger>
                                </TabsList>

                                <TabsContent value="friction" className="space-y-6">
                                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                        {/* Controls */}
                                        <Card className="lg:col-span-1">
                                            <CardHeader>
                                                <CardTitle className="text-lg">Parameters</CardTitle>
                                                <CardDescription>Adjust block and plane properties</CardDescription>
                                            </CardHeader>
                                            <CardContent className="space-y-6">
                                                <div className="space-y-4">
                                                    <div className="flex justify-between">
                                                        <Label>Mass (m)</Label>
                                                        <span className="text-sm font-mono">{frictionParams.mass} kg</span>
                                                    </div>
                                                    <Slider
                                                        value={[frictionParams.mass]}
                                                        onValueChange={([v]) => setFrictionParams(p => ({ ...p, mass: v }))}
                                                        min={1}
                                                        max={50}
                                                        step={1}
                                                    />
                                                </div>

                                                <div className="space-y-4">
                                                    <div className="flex justify-between">
                                                        <Label>Angle (θ)</Label>
                                                        <span className="text-sm font-mono">{frictionParams.angle}°</span>
                                                    </div>
                                                    <Slider
                                                        value={[frictionParams.angle]}
                                                        onValueChange={([v]) => setFrictionParams(p => ({ ...p, angle: v }))}
                                                        min={0}
                                                        max={80}
                                                        step={1}
                                                    />
                                                </div>

                                                <div className="space-y-4">
                                                    <div className="flex justify-between">
                                                        <Label>Friction Coeff (μ)</Label>
                                                        <span className="text-sm font-mono">{frictionParams.coefficient}</span>
                                                    </div>
                                                    <Slider
                                                        value={[frictionParams.coefficient * 100]}
                                                        onValueChange={([v]) => setFrictionParams(p => ({ ...p, coefficient: v / 100 }))}
                                                        min={0}
                                                        max={100}
                                                        step={1}
                                                    />
                                                </div>
                                            </CardContent>
                                        </Card>

                                        {/* Visualization */}
                                        <Card className="lg:col-span-2">
                                            <CardHeader>
                                                <CardTitle>Inclined Plane Dynamics</CardTitle>
                                                <CardDescription>Visualizing forces and acceleration</CardDescription>
                                            </CardHeader>
                                            <CardContent className="flex flex-col items-center justify-center min-h-[400px]">
                                                <div className="relative w-full h-64 bg-muted/10 rounded-lg overflow-hidden flex items-end justify-center">
                                                    {/* The Plane */}
                                                    <div
                                                        className="absolute bottom-0 left-0 w-[150%] h-2 bg-foreground origin-bottom-left"
                                                        style={{ transform: `rotate(-${frictionParams.angle}deg)` }}
                                                    />

                                                    {/* The Block */}
                                                    <motion.div
                                                        className="absolute bg-primary w-16 h-12 rounded border border-primary-foreground/20 flex items-center justify-center p-1"
                                                        style={{
                                                            bottom: '0',
                                                            left: '20%',
                                                            transform: `rotate(-${frictionParams.angle}deg)`,
                                                            transformOrigin: 'bottom'
                                                        }}
                                                        animate={{
                                                            x: acceleration > 0 ? 500 : 0,
                                                            y: acceleration > 0 ? 500 * Math.tan(angleRad) : 0
                                                        }}
                                                        transition={{
                                                            duration: acceleration > 0 ? Math.sqrt(2 * 1 / acceleration) * 2 : 0,
                                                            repeat: acceleration > 0 ? Infinity : 0,
                                                            ease: "linear"
                                                        }}
                                                    >
                                                        <span className="text-[10px] text-primary-foreground font-bold">m = {frictionParams.mass}kg</span>
                                                    </motion.div>

                                                    {/* Force Arrows */}
                                                    <div className="absolute top-4 left-4 space-y-2">
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-8 h-1 bg-red-500 rounded" />
                                                            <span className="text-xs font-semibold">Gravity Force: {forceGravity.toFixed(1)} N</span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-8 h-1 bg-blue-500 rounded" />
                                                            <span className="text-xs font-semibold">Parallel Component: {forceParallel.toFixed(1)} N</span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-8 h-1 bg-orange-500 rounded" />
                                                            <span className="text-xs font-semibold">Friction Force: {forceFrictionMax.toFixed(1)} N</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Summary Metrics */}
                                                <div className="grid grid-cols-2 gap-4 w-full mt-8">
                                                    <Card className="bg-secondary/10 border-none shadow-none text-center p-4">
                                                        <div className={`text-2xl font-bold ${acceleration > 0 ? 'text-green-500' : 'text-orange-500'}`}>
                                                            {acceleration > 0 ? 'Sliding' : 'Static'}
                                                        </div>
                                                        <div className="text-xs text-muted-foreground uppercase font-bold">Status</div>
                                                    </Card>
                                                    <Card className="bg-secondary/10 border-none shadow-none text-center p-4">
                                                        <div className="text-2xl font-bold text-primary">
                                                            {acceleration.toFixed(2)} m/s²
                                                        </div>
                                                        <div className="text-xs text-muted-foreground uppercase font-bold">Acceleration</div>
                                                    </Card>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </div>

                                    {/* Study Mode Content */}
                                    {isStudyMode && (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className="grid grid-cols-1 md:grid-cols-2 gap-6"
                                        >
                                            <Card className="border-warning/30 bg-warning/5">
                                                <CardHeader className="flex flex-row items-center gap-2">
                                                    <Info className="w-5 h-5 text-warning" />
                                                    <CardTitle className="text-warning">Force Decomposition</CardTitle>
                                                </CardHeader>
                                                <CardContent className="text-sm space-y-3">
                                                    <p>
                                                        On an inclined plane, gravity is split into two components relative to the surface:
                                                    </p>
                                                    <ul className="space-y-2 font-mono text-xs">
                                                        <li className="flex justify-between border-b border-warning/20 pb-1">
                                                            <span>Parallel (Down-plane):</span>
                                                            <span className="text-blue-500">F_p = m·g·sin(θ)</span>
                                                        </li>
                                                        <li className="flex justify-between border-b border-warning/20 pb-1">
                                                            <span>Normal (Into-plane):</span>
                                                            <span className="text-purple-500">F_n = m·g·cos(θ)</span>
                                                        </li>
                                                    </ul>
                                                </CardContent>
                                            </Card>

                                            <Card className="border-warning/30 bg-warning/5">
                                                <CardHeader className="flex flex-row items-center gap-2">
                                                    <GraduationCap className="w-5 h-5 text-warning" />
                                                    <CardTitle className="text-warning">Condition for Sliding</CardTitle>
                                                </CardHeader>
                                                <CardContent className="text-sm space-y-3">
                                                    <p>
                                                        A block will only slide if the parallel component of gravity exceeds the maximum
                                                        static friction force.
                                                    </p>
                                                    <div className="bg-background/80 p-3 rounded font-mono text-center text-sm my-4">
                                                        m·g·sin(θ) {'>'} μ · m·g·cos(θ)
                                                        <br />
                                                        tan(θ) {'>'} μ
                                                    </div>
                                                    <p>
                                                        Notice how the mass cancels out! Whether it's a pebble or a truck, the angle of
                                                        repose depends only on the material properties (μ).
                                                    </p>
                                                </CardContent>
                                            </Card>
                                        </motion.div>
                                    )}
                                </TabsContent>

                                <TabsContent value="vectors" className="space-y-6">
                                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                        {/* Controls */}
                                        <Card className="lg:col-span-1">
                                            <CardHeader>
                                                <CardTitle className="text-lg">Vector Parameters</CardTitle>
                                                <CardDescription>Force Magnitude & Direction</CardDescription>
                                            </CardHeader>
                                            <CardContent className="space-y-6">
                                                <div className="space-y-4">
                                                    <div className="flex justify-between">
                                                        <Label>Magnitude (F)</Label>
                                                        <span className="text-sm font-mono">{vectorParams.magnitude} N</span>
                                                    </div>
                                                    <Slider
                                                        value={[vectorParams.magnitude]}
                                                        onValueChange={([v]) => setVectorParams(p => ({ ...p, magnitude: v }))}
                                                        min={10}
                                                        max={200}
                                                        step={1}
                                                    />
                                                </div>

                                                <div className="space-y-4">
                                                    <div className="flex justify-between">
                                                        <Label>Angle (θ)</Label>
                                                        <span className="text-sm font-mono">{vectorParams.angle}°</span>
                                                    </div>
                                                    <Slider
                                                        value={[vectorParams.angle]}
                                                        onValueChange={([v]) => setVectorParams(p => ({ ...p, angle: v }))}
                                                        min={0}
                                                        max={90}
                                                        step={1}
                                                    />
                                                </div>
                                            </CardContent>
                                        </Card>

                                        {/* Visualization */}
                                        <Card className="lg:col-span-2">
                                            <CardHeader>
                                                <CardTitle>Vector Decomposition</CardTitle>
                                                <CardDescription>Splitting a force into X and Y components</CardDescription>
                                            </CardHeader>
                                            <CardContent className="flex flex-col items-center justify-center min-h-[400px]">
                                                <div className="relative w-full h-80 bg-slate-50 border border-slate-200 rounded-lg flex items-end justify-start p-10 overflow-hidden">

                                                    {/* Grid Background */}
                                                    <div className="absolute inset-0" style={{
                                                        backgroundImage: 'linear-gradient(#e2e8f0 1px, transparent 1px), linear-gradient(90deg, #e2e8f0 1px, transparent 1px)',
                                                        backgroundSize: '20px 20px'
                                                    }} />

                                                    <svg width="100%" height="100%" viewBox="0 0 400 300" className="overflow-visible">
                                                        <defs>
                                                            <marker id="arrowhead-main" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                                                                <polygon points="0 0, 10 3.5, 0 7" fill="#2563eb" />
                                                            </marker>
                                                            <marker id="arrowhead-x" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                                                                <polygon points="0 0, 10 3.5, 0 7" fill="#ef4444" />
                                                            </marker>
                                                            <marker id="arrowhead-y" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                                                                <polygon points="0 0, 10 3.5, 0 7" fill="#10b981" />
                                                            </marker>
                                                        </defs>

                                                        {/* Origin Translation */}
                                                        <g transform="translate(40, 260) scale(1, -1)">
                                                            {/* Axes */}
                                                            <line x1="-20" y1="0" x2="350" y2="0" stroke="#94a3b8" strokeWidth="2" />
                                                            <line x1="0" y1="-20" x2="0" y2="280" stroke="#94a3b8" strokeWidth="2" />

                                                            {/* X Component */}
                                                            <motion.line
                                                                x1="0" y1="0"
                                                                x2={fx * 1.5} y2="0" // Scale factor
                                                                stroke="#ef4444"
                                                                strokeWidth="4"
                                                                markerEnd="url(#arrowhead-x)"
                                                                initial={false}
                                                                animate={{ x2: fx * 1.5 }}
                                                            />
                                                            {/* Y Component */}
                                                            <motion.line
                                                                x1="0" y1="0"
                                                                x2="0" y2={fy * 1.5}
                                                                stroke="#10b981"
                                                                strokeWidth="4"
                                                                markerEnd="url(#arrowhead-y)"
                                                                initial={false}
                                                                animate={{ y2: fy * 1.5 }}
                                                            />

                                                            {/* Component Connections (Dotted Lines) */}
                                                            <motion.line
                                                                x1={fx * 1.5} y1="0"
                                                                x2={fx * 1.5} y2={fy * 1.5}
                                                                stroke="#ef4444"
                                                                strokeWidth="1"
                                                                strokeDasharray="4"
                                                                animate={{ x1: fx * 1.5, x2: fx * 1.5, y2: fy * 1.5 }}
                                                            />
                                                            <motion.line
                                                                x1="0" y1={fy * 1.5}
                                                                x2={fx * 1.5} y2={fy * 1.5}
                                                                stroke="#10b981"
                                                                strokeWidth="1"
                                                                strokeDasharray="4"
                                                                animate={{ y1: fy * 1.5, x2: fx * 1.5, y2: fy * 1.5 }}
                                                            />

                                                            {/* Main Resultant Vector */}
                                                            <motion.line
                                                                x1="0" y1="0"
                                                                x2={fx * 1.5} y2={fy * 1.5}
                                                                stroke="#2563eb"
                                                                strokeWidth="6"
                                                                markerEnd="url(#arrowhead-main)"
                                                                animate={{ x2: fx * 1.5, y2: fy * 1.5 }}
                                                            />

                                                            {/* Angle Arc */}
                                                            <path
                                                                d={`M 30,0 A 30,30 0 0 1 ${30 * Math.cos(rad)},${30 * Math.sin(rad)}`}
                                                                stroke="#64748b"
                                                                strokeWidth="2"
                                                                fill="transparent"
                                                            />
                                                        </g>
                                                    </svg>
                                                </div>

                                                {/* Summary Metrics */}
                                                <div className="grid grid-cols-2 gap-4 w-full mt-6">
                                                    <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-center">
                                                        <div className="text-2xl font-bold text-red-600">{fx.toFixed(1)} N</div>
                                                        <div className="text-xs text-muted-foreground uppercase font-semibold">Fx (Horizontal)</div>
                                                        <div className="text-[10px] text-muted-foreground font-mono">F · cos(θ)</div>
                                                    </div>
                                                    <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-center">
                                                        <div className="text-2xl font-bold text-emerald-600">{fy.toFixed(1)} N</div>
                                                        <div className="text-xs text-muted-foreground uppercase font-semibold">Fy (Vertical)</div>
                                                        <div className="text-[10px] text-muted-foreground font-mono">F · sin(θ)</div>
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
                                                    <CardTitle className="text-warning">Force Components</CardTitle>
                                                </CardHeader>
                                                <CardContent className="text-sm space-y-3">
                                                    <p>
                                                        Any diagonal force can be split (resolved) into two perpendicular components: Horizontal (Fx) and Vertical (Fy).
                                                    </p>
                                                    <div className="bg-background/80 p-3 rounded font-mono text-center text-lg my-4 space-y-2">
                                                        <div>Fx = F · cos(θ)</div>
                                                        <div>Fy = F · sin(θ)</div>
                                                    </div>
                                                    <p>
                                                        This is essential for analyzing structures, as we can sum up all X forces and all Y forces separately (ΣFx = 0, ΣFy = 0).
                                                    </p>
                                                </CardContent>
                                            </Card>

                                            <Card className="border-warning/30 bg-warning/5">
                                                <CardHeader className="flex flex-row items-center gap-2">
                                                    <Move className="w-5 h-5 text-warning" />
                                                    <CardTitle className="text-warning">Pythagoras Theorem</CardTitle>
                                                </CardHeader>
                                                <CardContent className="text-sm space-y-3">
                                                    <p>
                                                        You can always get back the original force vector from its components using Pythagoras theorem:
                                                    </p>
                                                    <div className="bg-background/80 p-3 rounded font-mono text-center text-lg my-4">
                                                        F = √(Fx² + Fy²)
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

export default EngineeringMechanics;
