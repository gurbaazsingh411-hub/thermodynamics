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

                                <TabsContent value="stats">
                                    <div className="flex flex-col items-center justify-center min-h-[400px] border-2 border-dashed border-muted rounded-xl bg-muted/50">
                                        <Sigma className="w-12 h-12 text-muted-foreground mb-4" />
                                        <h3 className="text-xl font-bold">Error Analysis Coming Soon</h3>
                                        <p className="text-muted-foreground">Visualizing Normal Distributions and Propagation of Errors.</p>
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

export default EngineeringMath;
