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

                                <TabsContent value="pipe-flow">
                                    <div className="flex flex-col items-center justify-center min-h-[400px] border-2 border-dashed border-muted rounded-xl bg-muted/50">
                                        <Navigation className="w-12 h-12 text-muted-foreground mb-4" />
                                        <h3 className="text-xl font-bold">Pipe Flow Analysis Coming Soon</h3>
                                        <p className="text-muted-foreground">Calculating Reynolds number and friction losses (Darcy-Weisbach).</p>
                                    </div>
                                </TabsContent>

                                <TabsContent value="continuity">
                                    <div className="flex flex-col items-center justify-center min-h-[400px] border-2 border-dashed border-muted rounded-xl bg-muted/50">
                                        <Waves className="w-12 h-12 text-muted-foreground mb-4" />
                                        <h3 className="text-xl font-bold">Continuity Equation Coming Soon</h3>
                                        <p className="text-muted-foreground">Conservation of mass: A1 · v1 = A2 · v2</p>
                                    </div>
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
