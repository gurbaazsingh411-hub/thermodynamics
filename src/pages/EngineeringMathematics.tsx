import { useState } from 'react';
import { motion } from 'framer-motion';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import {
    Activity,
    ArrowRight,
    RotateCcw,
    GraduationCap,
    Info,
    FunctionSquare,
    Sigma,
    LineChart
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const EngineeringMath = () => {
    const [isStudyMode, setIsStudyMode] = useState(false);
    const [functionParams, setFunctionParams] = useState({
        a: 1,
        b: 0,
        c: 0
    });

    // y = ax^2 + bx + c
    const generatePath = () => {
        let path = 'M ';
        for (let x = -100; x <= 100; x += 2) {
            const y = functionParams.a * Math.pow(x / 10, 2) + functionParams.b * (x / 10) + functionParams.c;
            // Invert Y for SVG coordinates (origin top-left)
            path += `${x + 100},${100 - y * 10} `;
        }
        return path;
    };

    // Statistics State
    const [statsParams, setStatsParams] = useState({
        mean: 0,
        stdDev: 1
    });

    const generateNormalPath = () => {
        let path = 'M 0,200 '; // Start point
        for (let i = 0; i <= 200; i += 2) {
            const x = (i - 100) / 20; // x range -5 to 5
            const z = (x - statsParams.mean) / statsParams.stdDev;
            const pdf = (1 / (statsParams.stdDev * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * z * z);

            // Map to SVG coordinates (width 200, height 200)
            // PDF max height usually ~0.4 (for sd=1), so scale Y by ~400
            const svgY = 200 - (pdf * 300);
            path += `L ${i},${svgY} `;
        }
        path += 'L 200,200 Z'; // Close path
        return path;
    };


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
                                <Activity className="w-4 h-4 text-primary" />
                                <span className="font-semibold">Engineering Mathematics Viz</span>
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
                            <Tabs defaultValue="calculus" className="w-full">
                                <TabsList className="grid w-full grid-cols-2 mb-8">
                                    <TabsTrigger value="calculus" className="gap-2">
                                        <FunctionSquare className="w-4 h-4" /> Calculus & Functions
                                    </TabsTrigger>
                                    <TabsTrigger value="stats" className="gap-2">
                                        <Sigma className="w-4 h-4" /> Statistics & Error
                                    </TabsTrigger>
                                </TabsList>

                                <TabsContent value="calculus" className="space-y-6">
                                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                        {/* Controls */}
                                        <Card className="lg:col-span-1">
                                            <CardHeader>
                                                <CardTitle className="text-lg">Function Coefficients</CardTitle>
                                                <CardDescription>f(x) = ax² + bx + c</CardDescription>
                                            </CardHeader>
                                            <CardContent className="space-y-6">
                                                <div className="space-y-4">
                                                    <div className="flex justify-between">
                                                        <Label>Coefficient (a)</Label>
                                                        <span className="text-sm font-mono">{functionParams.a.toFixed(1)}</span>
                                                    </div>
                                                    <Slider
                                                        value={[functionParams.a * 10]}
                                                        onValueChange={([v]) => setFunctionParams(p => ({ ...p, a: v / 10 }))}
                                                        min={-50}
                                                        max={50}
                                                        step={1}
                                                    />
                                                </div>

                                                <div className="space-y-4">
                                                    <div className="flex justify-between">
                                                        <Label>Coefficient (b)</Label>
                                                        <span className="text-sm font-mono">{functionParams.b.toFixed(1)}</span>
                                                    </div>
                                                    <Slider
                                                        value={[functionParams.b * 10]}
                                                        onValueChange={([v]) => setFunctionParams(p => ({ ...p, b: v / 10 }))}
                                                        min={-50}
                                                        max={50}
                                                        step={1}
                                                    />
                                                </div>

                                                <div className="space-y-4">
                                                    <div className="flex justify-between">
                                                        <Label>Constant (c)</Label>
                                                        <span className="text-sm font-mono">{functionParams.c.toFixed(1)}</span>
                                                    </div>
                                                    <Slider
                                                        value={[functionParams.c * 10]}
                                                        onValueChange={([v]) => setFunctionParams(p => ({ ...p, c: v / 10 }))}
                                                        min={-50}
                                                        max={50}
                                                        step={1}
                                                    />
                                                </div>
                                            </CardContent>
                                        </Card>

                                        {/* Visualization */}
                                        <Card className="lg:col-span-2">
                                            <CardHeader>
                                                <CardTitle>Interactive Function Grapher</CardTitle>
                                                <CardDescription>Visualizing algebraic changes in real-time</CardDescription>
                                            </CardHeader>
                                            <CardContent className="flex flex-col items-center justify-center min-h-[400px]">
                                                <div className="relative w-full aspect-square max-w-[400px] border border-border bg-muted/5 rounded-lg overflow-hidden shadow-inner">
                                                    {/* Grid Lines */}
                                                    <div className="absolute inset-0 grid grid-cols-10 grid-rows-10 opacity-10">
                                                        {[...Array(11)].map((_, i) => (
                                                            <div key={`v-${i}`} className="border-l border-foreground" style={{ left: `${i * 10}%` }} />
                                                        ))}
                                                        {[...Array(11)].map((_, i) => (
                                                            <div key={`h-${i}`} className="border-t border-foreground" style={{ top: `${i * 10}%` }} />
                                                        ))}
                                                    </div>

                                                    {/* Axes */}
                                                    <div className="absolute left-1/2 top-0 bottom-0 w-[2px] bg-muted-foreground/30" />
                                                    <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-muted-foreground/30" />

                                                    {/* Graph */}
                                                    <svg viewBox="0 0 200 200" className="w-full h-full overflow-visible">
                                                        <motion.path
                                                            d={generatePath()}
                                                            fill="none"
                                                            stroke="hsl(var(--primary))"
                                                            strokeWidth="3"
                                                            strokeLinecap="round"
                                                            initial={false}
                                                            animate={{ d: generatePath() }}
                                                        />

                                                        {/* Points/Tangent Placeholder */}
                                                        <circle cx="100" cy={100 - functionParams.c * 10} r="4" fill="hsl(var(--primary))" />
                                                    </svg>

                                                    <div className="absolute bottom-2 left-2 text-[10px] font-mono text-muted-foreground italic">
                                                        y = {functionParams.a.toFixed(1)}x² + {functionParams.b.toFixed(1)}x + {functionParams.c.toFixed(1)}
                                                    </div>
                                                </div>

                                                {/* Summary Metrics */}
                                                <div className="grid grid-cols-2 gap-4 w-full mt-8">
                                                    <div className="p-4 rounded-lg bg-primary/5 border border-primary/20 text-center">
                                                        <div className="text-xl font-bold text-primary italic">y' = {(2 * functionParams.a).toFixed(1)}x + {functionParams.b.toFixed(1)}</div>
                                                        <div className="text-[10px] text-muted-foreground uppercase font-semibold">Derivative</div>
                                                    </div>
                                                    <div className="p-4 rounded-lg bg-primary/5 border border-primary/20 text-center">
                                                        <div className="text-xl font-bold text-primary italic">x_v = {(-functionParams.b / (2 * functionParams.a || 1)).toFixed(2)}</div>
                                                        <div className="text-[10px] text-muted-foreground uppercase font-semibold">Vertex X</div>
                                                    </div>
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
                                                    <CardTitle className="text-warning">Quadratic Behavior</CardTitle>
                                                </CardHeader>
                                                <CardContent className="text-sm space-y-3">
                                                    <p>
                                                        A quadratic function produces a parabola. The coefficient 'a' determines the
                                                        steepness and direction (opens up if positive, down if negative).
                                                    </p>
                                                    <p>
                                                        The constant 'c' represents the y-intercept—where the graph crosses the vertical axis.
                                                    </p>
                                                </CardContent>
                                            </Card>

                                            <Card className="border-warning/30 bg-warning/5">
                                                <CardHeader className="flex flex-row items-center gap-2">
                                                    <GraduationCap className="w-5 h-5 text-warning" />
                                                    <CardTitle className="text-warning">Visualizing Derivatives</CardTitle>
                                                </CardHeader>
                                                <CardContent className="text-sm space-y-3">
                                                    <p>
                                                        The derivative represents the slope of the curve at any point. For a quadratic,
                                                        the derivative is linear.
                                                    </p>
                                                    <p>
                                                        Notice that when 'a' is zero, the curve becomes a straight line, and the
                                                        derivative becomes constant!
                                                    </p>
                                                </CardContent>
                                            </Card>
                                        </motion.div>
                                    )}
                                </TabsContent>

                                <TabsContent value="stats" className="space-y-6">
                                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                        {/* Controls */}
                                        <Card className="lg:col-span-1">
                                            <CardHeader>
                                                <CardTitle className="text-lg">Normal Distribution</CardTitle>
                                                <CardDescription>Gaussian Parameters</CardDescription>
                                            </CardHeader>
                                            <CardContent className="space-y-6">
                                                <div className="space-y-4">
                                                    <div className="flex justify-between">
                                                        <Label>Mean (μ)</Label>
                                                        <span className="text-sm font-mono">{statsParams.mean}</span>
                                                    </div>
                                                    <Slider
                                                        value={[statsParams.mean]}
                                                        onValueChange={([v]) => setStatsParams(p => ({ ...p, mean: v }))}
                                                        min={-2}
                                                        max={2}
                                                        step={0.1}
                                                    />
                                                </div>

                                                <div className="space-y-4">
                                                    <div className="flex justify-between">
                                                        <Label>Standard Deviation (σ)</Label>
                                                        <span className="text-sm font-mono">{statsParams.stdDev}</span>
                                                    </div>
                                                    <Slider
                                                        value={[statsParams.stdDev]}
                                                        onValueChange={([v]) => setStatsParams(p => ({ ...p, stdDev: v }))}
                                                        min={0.5}
                                                        max={3}
                                                        step={0.1}
                                                    />
                                                </div>

                                                <div className="p-4 bg-muted text-xs text-muted-foreground rounded-lg">
                                                    <p className="mb-2 font-semibold">68-95-99.7 Rule:</p>
                                                    <ul className="list-disc ml-4 space-y-1">
                                                        <li>68% of data within ±1σ</li>
                                                        <li>95% of data within ±2σ</li>
                                                        <li>99.7% of data within ±3σ</li>
                                                    </ul>
                                                </div>
                                            </CardContent>
                                        </Card>

                                        {/* Visualization */}
                                        <Card className="lg:col-span-2">
                                            <CardHeader>
                                                <CardTitle>Bell Curve Visualization</CardTitle>
                                                <CardDescription>Probability Density Function</CardDescription>
                                            </CardHeader>
                                            <CardContent className="flex flex-col items-center justify-center min-h-[400px]">
                                                <div className="relative w-80 h-80 border-b border-l border-slate-300">
                                                    <svg width="100%" height="100%" viewBox="0 0 200 200" className="overflow-visible">
                                                        {/* Grid Lines */}
                                                        <line x1="100" y1="0" x2="100" y2="200" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="4" />

                                                        {/* The Distribution Curve */}
                                                        <motion.path
                                                            d={generateNormalPath()}
                                                            fill="rgba(59, 130, 246, 0.2)"
                                                            stroke="#3b82f6"
                                                            strokeWidth="2"
                                                            initial={{ d: "M 0,200 L 200,200 Z" }}
                                                            animate={{ d: generateNormalPath() }}
                                                            transition={{ duration: 0.3 }}
                                                        />
                                                    </svg>

                                                    {/* Labels */}
                                                    <div className="absolute bottom-[-24px] left-0 text-xs text-muted-foreground">-5σ</div>
                                                    <div className="absolute bottom-[-24px] right-0 text-xs text-muted-foreground">+5σ</div>
                                                    <div className="absolute bottom-[-24px] left-1/2 -translate-x-1/2 text-xs font-bold text-slate-700">0</div>
                                                </div>
                                                <div className="mt-8 text-center text-sm text-slate-500">
                                                    The wider the curve (higher σ), the more "error" or spread there is in the data.
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
                                                    <Sigma className="w-5 h-5 text-warning" />
                                                    <CardTitle className="text-warning">Standard Deviation</CardTitle>
                                                </CardHeader>
                                                <CardContent className="text-sm space-y-3">
                                                    <p>
                                                        Standard Deviation (σ) quantifies the amount of variation or dispersion.
                                                        A low standard deviation indicates that the values tend to be close to the mean.
                                                    </p>
                                                </CardContent>
                                            </Card>

                                            <Card className="border-warning/30 bg-warning/5">
                                                <CardHeader className="flex flex-row items-center gap-2">
                                                    <Activity className="w-5 h-5 text-warning" />
                                                    <CardTitle className="text-warning">Error Propagation</CardTitle>
                                                </CardHeader>
                                                <CardContent className="text-sm space-y-3">
                                                    <p>
                                                        When combining measurements, their errors add up in quadrature:
                                                    </p>
                                                    <div className="bg-background/80 p-3 rounded font-mono text-center text-lg my-4">
                                                        Δz = √((Δx)² + (Δy)²)
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

export default EngineeringMath;
