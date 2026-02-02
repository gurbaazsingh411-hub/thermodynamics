import { useState } from 'react';
import { motion } from 'framer-motion';
import { Header } from '@/components/layout/Header';
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
import {
    Settings,
    ArrowRight,
    RotateCcw,
    GraduationCap,
    Info,
    Box,
    Move,
    Lightbulb,
    Target
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

    // Friction Graph Data (Force vs Angle)
    const frictionGraphData = Array.from({ length: 91 }, (_, i) => {
        const angRad = (i * Math.PI) / 180;
        const parallel = frictionParams.mass * 9.81 * Math.sin(angRad);
        const frictionMax = frictionParams.coefficient * frictionParams.mass * 9.81 * Math.cos(angRad);
        return { angle: i, parallel, frictionMax };
    });

    // Vector Graph Data (Components vs Angle)
    const vectorGraphData = Array.from({ length: 91 }, (_, i) => {
        const angRad = (i * Math.PI) / 180;
        const fxVal = vectorParams.magnitude * Math.cos(angRad);
        const fyVal = vectorParams.magnitude * Math.sin(angRad);
        return { angle: i, fx: fxVal, fy: fyVal };
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

                                        {/* Improved Visualization */}
                                        <Card className="lg:col-span-2">
                                            <CardHeader>
                                                <CardTitle>Inclined Plane Dynamics</CardTitle>
                                                <CardDescription>Visualizing forces and acceleration</CardDescription>
                                            </CardHeader>
                                            <CardContent className="flex flex-col items-center justify-center min-h-[450px]">
                                                {/* Main SVG Visualization */}
                                                <div className="relative w-full h-80 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 rounded-xl overflow-hidden border border-slate-700/50">
                                                    <svg viewBox="0 0 500 300" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
                                                        <defs>
                                                            {/* Gradient for plane surface */}
                                                            <linearGradient id="planeGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                                                <stop offset="0%" stopColor="#64748b" />
                                                                <stop offset="50%" stopColor="#475569" />
                                                                <stop offset="100%" stopColor="#334155" />
                                                            </linearGradient>
                                                            {/* Gradient for block */}
                                                            <linearGradient id="blockGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                                                <stop offset="0%" stopColor="#3b82f6" />
                                                                <stop offset="100%" stopColor="#1d4ed8" />
                                                            </linearGradient>
                                                            {/* Arrow markers */}
                                                            <marker id="arrowRed" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth">
                                                                <path d="M0,0 L0,6 L9,3 z" fill="#ef4444" />
                                                            </marker>
                                                            <marker id="arrowBlue" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth">
                                                                <path d="M0,0 L0,6 L9,3 z" fill="#3b82f6" />
                                                            </marker>
                                                            <marker id="arrowPurple" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth">
                                                                <path d="M0,0 L0,6 L9,3 z" fill="#a855f7" />
                                                            </marker>
                                                            <marker id="arrowOrange" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth">
                                                                <path d="M0,0 L0,6 L9,3 z" fill="#f97316" />
                                                            </marker>
                                                            <marker id="arrowGreen" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth">
                                                                <path d="M0,0 L0,6 L9,3 z" fill="#22c55e" />
                                                            </marker>
                                                            {/* Ground pattern */}
                                                            <pattern id="groundPattern" patternUnits="userSpaceOnUse" width="20" height="20">
                                                                <rect width="20" height="20" fill="#1e293b" />
                                                                <line x1="0" y1="20" x2="20" y2="0" stroke="#334155" strokeWidth="1" />
                                                            </pattern>
                                                        </defs>

                                                        {/* Ground */}
                                                        <rect x="0" y="240" width="500" height="60" fill="url(#groundPattern)" />
                                                        <line x1="0" y1="240" x2="500" y2="240" stroke="#475569" strokeWidth="2" />

                                                        {/* Inclined Plane - 3D effect with depth */}
                                                        <g transform={`rotate(-${frictionParams.angle}, 50, 240)`}>
                                                            {/* Plane depth/side */}
                                                            <polygon
                                                                points="50,240 450,240 450,250 50,250"
                                                                fill="#1e293b"
                                                                stroke="#334155"
                                                                strokeWidth="1"
                                                            />
                                                            {/* Main plane surface */}
                                                            <rect
                                                                x="50"
                                                                y="225"
                                                                width="400"
                                                                height="15"
                                                                fill="url(#planeGradient)"
                                                                stroke="#64748b"
                                                                strokeWidth="1"
                                                                rx="2"
                                                            />
                                                            {/* Surface texture lines */}
                                                            {[100, 150, 200, 250, 300, 350, 400].map((x, i) => (
                                                                <line key={i} x1={x} y1="227" x2={x} y2="238" stroke="#94a3b8" strokeWidth="0.5" opacity="0.3" />
                                                            ))}
                                                        </g>

                                                        {/* Angle Arc */}
                                                        <path
                                                            d={`M 85 240 A 35 35 0 0 0 ${85 + 35 * Math.cos(angleRad)} ${240 - 35 * Math.sin(angleRad)}`}
                                                            fill="none"
                                                            stroke="#fbbf24"
                                                            strokeWidth="2"
                                                            strokeDasharray="3,2"
                                                        />
                                                        <text x="100" y="225" fill="#fbbf24" fontSize="14" fontWeight="bold">θ = {frictionParams.angle}°</text>

                                                        {/* Block that slides on the plane - inside the rotated coordinate system */}
                                                        <g transform={`rotate(-${frictionParams.angle}, 50, 240)`}>
                                                            <motion.g
                                                                animate={{
                                                                    x: acceleration > 0 ? -120 : 0
                                                                }}
                                                                transition={{
                                                                    duration: acceleration > 0 ? 2.5 : 0,
                                                                    repeat: acceleration > 0 ? Infinity : 0,
                                                                    repeatType: "loop",
                                                                    ease: "easeIn"
                                                                }}
                                                            >
                                                                {/* Block positioned on the plane surface */}
                                                                <g transform="translate(180, 200)">
                                                                    {/* Block shadow */}
                                                                    <rect x="-27" y="-17" width="54" height="34" rx="3" fill="rgba(0,0,0,0.3)" />
                                                                    {/* Block body */}
                                                                    <rect x="-30" y="-20" width="60" height="40" rx="4" fill="url(#blockGradient)" stroke="#60a5fa" strokeWidth="2" />
                                                                    {/* Block highlight */}
                                                                    <rect x="-28" y="-18" width="56" height="8" rx="2" fill="rgba(255,255,255,0.1)" />
                                                                    {/* Mass label */}
                                                                    <text x="0" y="5" fill="white" fontSize="11" fontWeight="bold" textAnchor="middle">{frictionParams.mass} kg</text>

                                                                    {/* FORCE VECTORS FROM BLOCK CENTER */}
                                                                    {/* Gravity Vector (straight down in world coords, so we un-rotate) */}
                                                                    <g transform={`rotate(${frictionParams.angle})`}>
                                                                        <line
                                                                            x1="0" y1="0"
                                                                            x2="0" y2={Math.min(80, forceGravity * 0.8)}
                                                                            stroke="#ef4444"
                                                                            strokeWidth="3"
                                                                            markerEnd="url(#arrowRed)"
                                                                        />
                                                                        <text x="8" y={Math.min(80, forceGravity * 0.8) - 5} fill="#ef4444" fontSize="10" fontWeight="bold">W</text>
                                                                    </g>

                                                                    {/* Normal Force (perpendicular to surface, pointing away) */}
                                                                    <line
                                                                        x1="0" y1="0"
                                                                        x2="0" y2={-Math.min(60, forceNormal * 0.6)}
                                                                        stroke="#a855f7"
                                                                        strokeWidth="3"
                                                                        markerEnd="url(#arrowPurple)"
                                                                    />
                                                                    <text x="8" y={-Math.min(60, forceNormal * 0.6) + 5} fill="#a855f7" fontSize="10" fontWeight="bold">N</text>

                                                                    {/* Parallel Component (along surface, down-slope) */}
                                                                    <line
                                                                        x1="0" y1="0"
                                                                        x2={Math.min(70, forceParallel * 0.7)} y2="0"
                                                                        stroke="#3b82f6"
                                                                        strokeWidth="3"
                                                                        markerEnd="url(#arrowBlue)"
                                                                    />
                                                                    <text x={Math.min(70, forceParallel * 0.7) - 5} y="-8" fill="#3b82f6" fontSize="10" fontWeight="bold">F∥</text>

                                                                    {/* Friction Force (opposite to motion direction) */}
                                                                    <line
                                                                        x1="0" y1="0"
                                                                        x2={-Math.min(60, forceFrictionMax * 0.6)} y2="0"
                                                                        stroke="#f97316"
                                                                        strokeWidth="3"
                                                                        markerEnd="url(#arrowOrange)"
                                                                    />
                                                                    <text x={-Math.min(60, forceFrictionMax * 0.6) + 5} y="-8" fill="#f97316" fontSize="10" fontWeight="bold">f</text>

                                                                    {/* Net Force (if sliding) */}
                                                                    {acceleration > 0 && (
                                                                        <>
                                                                            <line
                                                                                x1="0" y1="25"
                                                                                x2={Math.min(50, netForce * 0.5)} y2="25"
                                                                                stroke="#22c55e"
                                                                                strokeWidth="4"
                                                                                markerEnd="url(#arrowGreen)"
                                                                            />
                                                                            <text x={Math.min(50, netForce * 0.5) + 5} y="28" fill="#22c55e" fontSize="10" fontWeight="bold">F_net</text>
                                                                        </>
                                                                    )}
                                                                </g>
                                                            </motion.g>
                                                        </g>

                                                        {/* Legend */}
                                                        <g transform="translate(340, 15)">
                                                            <rect x="0" y="0" width="155" height="95" rx="6" fill="rgba(15, 23, 42, 0.9)" stroke="#334155" strokeWidth="1" />
                                                            <text x="10" y="18" fill="#94a3b8" fontSize="10" fontWeight="bold">FORCE LEGEND</text>

                                                            <line x1="10" y1="30" x2="35" y2="30" stroke="#ef4444" strokeWidth="3" />
                                                            <text x="42" y="34" fill="#e2e8f0" fontSize="9">Weight: {forceGravity.toFixed(1)} N</text>

                                                            <line x1="10" y1="45" x2="35" y2="45" stroke="#a855f7" strokeWidth="3" />
                                                            <text x="42" y="49" fill="#e2e8f0" fontSize="9">Normal: {forceNormal.toFixed(1)} N</text>

                                                            <line x1="10" y1="60" x2="35" y2="60" stroke="#3b82f6" strokeWidth="3" />
                                                            <text x="42" y="64" fill="#e2e8f0" fontSize="9">Parallel: {forceParallel.toFixed(1)} N</text>

                                                            <line x1="10" y1="75" x2="35" y2="75" stroke="#f97316" strokeWidth="3" />
                                                            <text x="42" y="79" fill="#e2e8f0" fontSize="9">Friction: {forceFrictionMax.toFixed(1)} N</text>

                                                            {acceleration > 0 && (
                                                                <>
                                                                    <line x1="10" y1="90" x2="35" y2="90" stroke="#22c55e" strokeWidth="3" />
                                                                    <text x="42" y="94" fill="#22c55e" fontSize="9">Net: {netForce.toFixed(1)} N</text>
                                                                </>
                                                            )}
                                                        </g>
                                                    </svg>

                                                    {/* Status Badge */}
                                                    <div className={`absolute top-3 left-3 px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-2 ${acceleration > 0
                                                        ? 'bg-green-500/20 border border-green-500/50 text-green-400'
                                                        : 'bg-orange-500/20 border border-orange-500/50 text-orange-400'
                                                        }`}>
                                                        <motion.div
                                                            className={`w-2 h-2 rounded-full ${acceleration > 0 ? 'bg-green-400' : 'bg-orange-400'}`}
                                                            animate={{ scale: [1, 1.3, 1] }}
                                                            transition={{ duration: 1, repeat: Infinity }}
                                                        />
                                                        {acceleration > 0 ? 'SLIDING' : 'STATIC'}
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

                                                {/* Graph */}
                                                <div className="w-full mt-6 h-64 bg-slate-900 border border-slate-800 rounded-lg p-4">
                                                    <div className="text-sm font-semibold mb-2 text-slate-100">Force Balance vs Angle</div>
                                                    <ResponsiveContainer width="100%" height="100%">
                                                        <LineChart data={frictionGraphData}>
                                                            <CartesianGrid strokeDasharray="3 3" opacity={0.1} stroke="#fff" />
                                                            <XAxis dataKey="angle" stroke="#94a3b8" label={{ value: 'Angle (°)', position: 'insideBottom', offset: -5, fill: '#94a3b8' }} />
                                                            <YAxis stroke="#94a3b8" label={{ value: 'Force (N)', angle: -90, position: 'insideLeft', fill: '#94a3b8' }} />
                                                            <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }} />
                                                            <ReferenceLine x={frictionParams.angle} stroke="#ffffff" strokeDasharray="3 3" label="Current" />
                                                            <Line type="monotone" dataKey="parallel" name="Gravity Component" stroke="#3b82f6" strokeWidth={3} dot={false} />
                                                            <Line type="monotone" dataKey="frictionMax" name="Max Static Friction" stroke="#f97316" strokeWidth={3} dot={false} />
                                                        </LineChart>
                                                    </ResponsiveContainer>
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

                                            <Card className="border-warning/30 bg-warning/5">
                                                <CardHeader className="flex flex-row items-center gap-2">
                                                    <GraduationCap className="w-5 h-5 text-warning" />
                                                    <CardTitle className="text-warning">Static vs. Kinetic Friction</CardTitle>
                                                </CardHeader>
                                                <CardContent className="text-sm space-y-3">
                                                    <p>
                                                        <strong>Static Friction (μs):</strong> The force keeping an object at rest. It must be overcome to start moving.
                                                    </p>
                                                    <p>
                                                        <strong>Kinetic Friction (μk):</strong> The force acting on an object in motion. Usually, μk {'<'} μs, which is why it's harder to start a heavy box moving than to keep it sliding.
                                                    </p>
                                                    <div className="bg-background/80 p-2 rounded text-xs border border-warning/10">
                                                        <strong>Tip:</strong> The angle where sliding starts is called the "Angle of Repose". It satisfies: <strong>tan(θ) = μs</strong>.
                                                    </div>
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

                                        {/* Enhanced Visualization */}
                                        <Card className="lg:col-span-2">
                                            <CardHeader>
                                                <CardTitle>Vector Decomposition</CardTitle>
                                                <CardDescription>Splitting a force into X and Y components</CardDescription>
                                            </CardHeader>
                                            <CardContent className="flex flex-col items-center justify-center min-h-[450px]">
                                                <div className="relative w-full h-96 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-xl overflow-hidden border border-slate-700/50">

                                                    {/* Subtle Grid Background */}
                                                    <div className="absolute inset-0 opacity-20" style={{
                                                        backgroundImage: 'linear-gradient(#475569 1px, transparent 1px), linear-gradient(90deg, #475569 1px, transparent 1px)',
                                                        backgroundSize: '30px 30px'
                                                    }} />

                                                    <svg viewBox="0 0 500 350" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
                                                        <defs>
                                                            {/* Main Force Vector Gradient */}
                                                            <linearGradient id="forceGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                                                <stop offset="0%" stopColor="#3b82f6" />
                                                                <stop offset="100%" stopColor="#60a5fa" />
                                                            </linearGradient>
                                                            {/* X Component Gradient */}
                                                            <linearGradient id="xGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                                                <stop offset="0%" stopColor="#ef4444" />
                                                                <stop offset="100%" stopColor="#f87171" />
                                                            </linearGradient>
                                                            {/* Y Component Gradient */}
                                                            <linearGradient id="yGradient" x1="0%" y1="100%" x2="0%" y2="0%">
                                                                <stop offset="0%" stopColor="#10b981" />
                                                                <stop offset="100%" stopColor="#34d399" />
                                                            </linearGradient>
                                                            {/* Arrow markers */}
                                                            <marker id="arrowMain" markerWidth="12" markerHeight="12" refX="10" refY="4" orient="auto" markerUnits="strokeWidth">
                                                                <path d="M0,0 L0,8 L12,4 z" fill="#60a5fa" />
                                                            </marker>
                                                            <marker id="arrowX" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth">
                                                                <path d="M0,0 L0,6 L9,3 z" fill="#f87171" />
                                                            </marker>
                                                            <marker id="arrowY" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth">
                                                                <path d="M0,0 L0,6 L9,3 z" fill="#34d399" />
                                                            </marker>
                                                            {/* Glow effect */}
                                                            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                                                                <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                                                                <feMerge>
                                                                    <feMergeNode in="coloredBlur" />
                                                                    <feMergeNode in="SourceGraphic" />
                                                                </feMerge>
                                                            </filter>
                                                        </defs>

                                                        {/* Coordinate System Origin at bottom-left */}
                                                        <g transform="translate(80, 290)">
                                                            {/* X Axis */}
                                                            <line x1="-30" y1="0" x2="380" y2="0" stroke="#64748b" strokeWidth="2" />
                                                            <text x="370" y="25" fill="#94a3b8" fontSize="16" fontWeight="bold">X</text>
                                                            {/* Axis ticks */}
                                                            {[50, 100, 150, 200, 250, 300].map((x, i) => (
                                                                <g key={i}>
                                                                    <line x1={x} y1="-5" x2={x} y2="5" stroke="#64748b" strokeWidth="1" />
                                                                    <text x={x} y="20" fill="#64748b" fontSize="10" textAnchor="middle">{x}</text>
                                                                </g>
                                                            ))}

                                                            {/* Y Axis */}
                                                            <line x1="0" y1="30" x2="0" y2="-260" stroke="#64748b" strokeWidth="2" />
                                                            <text x="-20" y="-240" fill="#94a3b8" fontSize="16" fontWeight="bold">Y</text>
                                                            {/* Y Axis ticks */}
                                                            {[50, 100, 150, 200].map((y, i) => (
                                                                <g key={i}>
                                                                    <line x1="-5" y1={-y} x2="5" y2={-y} stroke="#64748b" strokeWidth="1" />
                                                                    <text x="-20" y={-y + 4} fill="#64748b" fontSize="10" textAnchor="end">{y}</text>
                                                                </g>
                                                            ))}

                                                            {/* Origin point with glow */}
                                                            <motion.circle
                                                                cx="0" cy="0" r="6"
                                                                fill="#fbbf24"
                                                                filter="url(#glow)"
                                                                animate={{ scale: [1, 1.2, 1] }}
                                                                transition={{ duration: 2, repeat: Infinity }}
                                                            />
                                                            <text x="8" y="18" fill="#fbbf24" fontSize="11" fontWeight="bold">Origin (0,0)</text>

                                                            {/* Component Dotted Lines (Parallelogram) */}
                                                            <motion.line
                                                                x1={fx * 1.5} y1="0"
                                                                x2={fx * 1.5} y2={-fy * 1.5}
                                                                stroke="#ef4444"
                                                                strokeWidth="2"
                                                                strokeDasharray="6,4"
                                                                opacity="0.6"
                                                                animate={{ x1: fx * 1.5, x2: fx * 1.5, y2: -fy * 1.5 }}
                                                            />
                                                            <motion.line
                                                                x1="0" y1={-fy * 1.5}
                                                                x2={fx * 1.5} y2={-fy * 1.5}
                                                                stroke="#10b981"
                                                                strokeWidth="2"
                                                                strokeDasharray="6,4"
                                                                opacity="0.6"
                                                                animate={{ y1: -fy * 1.5, x2: fx * 1.5, y2: -fy * 1.5 }}
                                                            />

                                                            {/* Right Angle Marker */}
                                                            <motion.path
                                                                d={`M ${fx * 1.5 - 12} 0 L ${fx * 1.5 - 12} -12 L ${fx * 1.5} -12`}
                                                                stroke="#94a3b8"
                                                                strokeWidth="1.5"
                                                                fill="none"
                                                                animate={{ d: `M ${fx * 1.5 - 12} 0 L ${fx * 1.5 - 12} -12 L ${fx * 1.5} -12` }}
                                                            />

                                                            {/* X Component Vector */}
                                                            <motion.line
                                                                x1="0" y1="0"
                                                                x2={fx * 1.5} y2="0"
                                                                stroke="url(#xGradient)"
                                                                strokeWidth="5"
                                                                markerEnd="url(#arrowX)"
                                                                filter="url(#glow)"
                                                                animate={{ x2: fx * 1.5 }}
                                                            />
                                                            {/* X Label */}
                                                            <motion.g animate={{ x: fx * 0.75 }}>
                                                                <rect x="-25" y="8" width="50" height="18" rx="4" fill="rgba(239, 68, 68, 0.2)" stroke="#ef4444" strokeWidth="1" />
                                                                <text x="0" y="21" fill="#f87171" fontSize="11" fontWeight="bold" textAnchor="middle">
                                                                    Fx = {fx.toFixed(0)}N
                                                                </text>
                                                            </motion.g>

                                                            {/* Y Component Vector */}
                                                            <motion.line
                                                                x1="0" y1="0"
                                                                x2="0" y2={-fy * 1.5}
                                                                stroke="url(#yGradient)"
                                                                strokeWidth="5"
                                                                markerEnd="url(#arrowY)"
                                                                filter="url(#glow)"
                                                                animate={{ y2: -fy * 1.5 }}
                                                            />
                                                            {/* Y Label */}
                                                            <motion.g animate={{ y: -fy * 0.75 }}>
                                                                <rect x="-55" y="-9" width="50" height="18" rx="4" fill="rgba(16, 185, 129, 0.2)" stroke="#10b981" strokeWidth="1" />
                                                                <text x="-30" y="4" fill="#34d399" fontSize="11" fontWeight="bold" textAnchor="middle">
                                                                    Fy = {fy.toFixed(0)}N
                                                                </text>
                                                            </motion.g>

                                                            {/* Main Resultant Force Vector */}
                                                            <motion.line
                                                                x1="0" y1="0"
                                                                x2={fx * 1.5} y2={-fy * 1.5}
                                                                stroke="url(#forceGradient)"
                                                                strokeWidth="7"
                                                                markerEnd="url(#arrowMain)"
                                                                filter="url(#glow)"
                                                                animate={{ x2: fx * 1.5, y2: -fy * 1.5 }}
                                                            />
                                                            {/* F Label at vector tip */}
                                                            <motion.g animate={{ x: fx * 0.75 + 15, y: -fy * 0.75 - 15 }}>
                                                                <rect x="-30" y="-12" width="60" height="22" rx="5" fill="rgba(59, 130, 246, 0.3)" stroke="#3b82f6" strokeWidth="1.5" />
                                                                <text x="0" y="4" fill="#60a5fa" fontSize="12" fontWeight="bold" textAnchor="middle">
                                                                    F = {vectorParams.magnitude}N
                                                                </text>
                                                            </motion.g>

                                                            {/* Angle Arc */}
                                                            <motion.path
                                                                d={`M 40 0 A 40 40 0 0 0 ${40 * Math.cos(rad)} ${-40 * Math.sin(rad)}`}
                                                                stroke="#fbbf24"
                                                                strokeWidth="2.5"
                                                                fill="none"
                                                                strokeLinecap="round"
                                                            />
                                                            {/* Angle Label */}
                                                            <text
                                                                x={55 * Math.cos(rad / 2)}
                                                                y={-55 * Math.sin(rad / 2)}
                                                                fill="#fbbf24"
                                                                fontSize="14"
                                                                fontWeight="bold"
                                                                textAnchor="middle"
                                                            >
                                                                θ = {vectorParams.angle}°
                                                            </text>
                                                        </g>

                                                        {/* Formula Legend */}
                                                        <g transform="translate(320, 20)">
                                                            <rect x="0" y="0" width="165" height="95" rx="8" fill="rgba(15, 23, 42, 0.9)" stroke="#334155" strokeWidth="1" />
                                                            <text x="12" y="22" fill="#94a3b8" fontSize="11" fontWeight="bold">DECOMPOSITION</text>

                                                            <line x1="12" y1="38" x2="30" y2="38" stroke="#3b82f6" strokeWidth="4" />
                                                            <text x="38" y="42" fill="#e2e8f0" fontSize="11">F = {vectorParams.magnitude} N</text>

                                                            <line x1="12" y1="55" x2="30" y2="55" stroke="#ef4444" strokeWidth="3" />
                                                            <text x="38" y="59" fill="#e2e8f0" fontSize="10">Fx = F·cos(θ)</text>

                                                            <line x1="12" y1="72" x2="30" y2="72" stroke="#10b981" strokeWidth="3" />
                                                            <text x="38" y="76" fill="#e2e8f0" fontSize="10">Fy = F·sin(θ)</text>

                                                            <circle cx="20" cy="87" r="4" fill="#fbbf24" />
                                                            <text x="38" y="91" fill="#e2e8f0" fontSize="10">θ = {vectorParams.angle}°</text>
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

                                                {/* Graph */}
                                                <div className="w-full mt-6 h-64 bg-slate-900 border border-slate-800 rounded-lg p-4">
                                                    <div className="text-sm font-semibold mb-2 text-slate-100">Components vs Angle</div>
                                                    <ResponsiveContainer width="100%" height="100%">
                                                        <AreaChart data={vectorGraphData}>
                                                            <CartesianGrid strokeDasharray="3 3" opacity={0.1} stroke="#fff" />
                                                            <XAxis dataKey="angle" stroke="#94a3b8" label={{ value: 'Angle (°)', position: 'insideBottom', offset: -5, fill: '#94a3b8' }} />
                                                            <YAxis stroke="#94a3b8" label={{ value: 'Force (N)', angle: -90, position: 'insideLeft', fill: '#94a3b8' }} />
                                                            <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }} />
                                                            <ReferenceLine x={vectorParams.angle} stroke="#ffffff" strokeDasharray="3 3" label="Current" />
                                                            <Area type="monotone" dataKey="fx" name="Fx (Horizontal)" stackId="1" stroke="#ef4444" fill="#ef4444" fillOpacity={0.3} />
                                                            <Area type="monotone" dataKey="fy" name="Fy (Vertical)" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
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
                                                    <CardTitle className="text-warning">Moment & Torque Basics</CardTitle>
                                                </CardHeader>
                                                <CardContent className="text-sm space-y-3">
                                                    <p>
                                                        Vectors aren't just for pulling! When a force vector is applied at a distance <strong>d</strong> from a point, it creates a <strong>Moment (Torque)</strong>.
                                                    </p>
                                                    <p>
                                                        <strong>Cross Product:</strong> M = r × F = |r|·|F|·sin(θ). This determines the rotational effect of a force.
                                                    </p>
                                                    <p className="text-xs italic text-muted-foreground border-t border-warning/10 pt-2">
                                                        Only the component of force perpendicular to the lever arm contributes to the moment!
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

export default EngineeringMechanics;
