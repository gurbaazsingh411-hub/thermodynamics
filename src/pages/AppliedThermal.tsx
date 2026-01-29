import { useState } from 'react';
import { motion } from 'framer-motion';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import {
    Zap,
    ArrowRight,
    RotateCcw,
    GraduationCap,
    Info,
    Flame,
    Snowflake,
    TrendingUp
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const AppliedThermal = () => {
    const [isStudyMode, setIsStudyMode] = useState(false);
    const [engineParams, setEngineParams] = useState({
        heatIn: 1000,   // kJ
        heatOut: 600,   // kJ
    });

    const workNet = engineParams.heatIn - engineParams.heatOut;
    const efficiency = (workNet / engineParams.heatIn) * 100;

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
                                <Zap className="w-4 h-4 text-primary" />
                                <span className="font-semibold">Applied Thermal Engineering</span>
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
                            <Tabs defaultValue="heat-engine" className="w-full">
                                <TabsList className="grid w-full grid-cols-2 mb-8">
                                    <TabsTrigger value="heat-engine" className="gap-2">
                                        <Flame className="w-4 h-4" /> Heat Engine
                                    </TabsTrigger>
                                    <TabsTrigger value="refrigerator" className="gap-2">
                                        <Snowflake className="w-4 h-4" /> Refrigerator/Heat Pump
                                    </TabsTrigger>
                                </TabsList>

                                <TabsContent value="heat-engine" className="space-y-6">
                                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                        {/* Controls */}
                                        <Card className="lg:col-span-1">
                                            <CardHeader>
                                                <CardTitle className="text-lg">Energy Flow</CardTitle>
                                                <CardDescription>Adjust heat input and rejection</CardDescription>
                                            </CardHeader>
                                            <CardContent className="space-y-6">
                                                <div className="space-y-4">
                                                    <div className="flex justify-between">
                                                        <Label>Heat Input (Q_in)</Label>
                                                        <span className="text-sm font-mono">{engineParams.heatIn} kJ</span>
                                                    </div>
                                                    <Slider
                                                        value={[engineParams.heatIn]}
                                                        onValueChange={([v]) => setEngineParams(p => ({ ...p, heatIn: v }))}
                                                        min={500}
                                                        max={2000}
                                                        step={10}
                                                    />
                                                </div>

                                                <div className="space-y-4">
                                                    <div className="flex justify-between">
                                                        <Label>Heat Rejected (Q_out)</Label>
                                                        <span className="text-sm font-mono">{engineParams.heatOut} kJ</span>
                                                    </div>
                                                    <Slider
                                                        value={[engineParams.heatOut]}
                                                        onValueChange={([v]) => setEngineParams(p => ({ ...p, heatOut: Math.min(v, engineParams.heatIn - 1) }))}
                                                        min={100}
                                                        max={engineParams.heatIn}
                                                        step={10}
                                                    />
                                                </div>
                                            </CardContent>
                                        </Card>

                                        {/* Visualization */}
                                        <Card className="lg:col-span-2">
                                            <CardHeader>
                                                <CardTitle>Heat Engine Energy Balance</CardTitle>
                                                <CardDescription>Visualizing First Law of Thermodynamics</CardDescription>
                                            </CardHeader>
                                            <CardContent className="flex flex-col items-center justify-center min-h-[400px]">
                                                <div className="relative w-full max-w-md h-64 flex flex-col items-center justify-between">
                                                    {/* Hot Reservoir */}
                                                    <div className="w-32 h-16 bg-red-500/20 border-2 border-red-500 rounded flex items-center justify-center text-red-500 font-bold">
                                                        Hot Source
                                                    </div>

                                                    {/* Engine and Arrows */}
                                                    <div className="relative w-24 h-24 rounded-full border-4 border-primary flex items-center justify-center bg-card shadow-lg z-10">
                                                        <Zap className="w-10 h-10 text-primary" />

                                                        {/* Q_in Arrow */}
                                                        <motion.div
                                                            className="absolute -top-16 w-1 h-12 bg-red-500"
                                                            animate={{ y: [0, 6, 0] }}
                                                            transition={{ repeat: Infinity, duration: 1 }}
                                                        >
                                                            <div className="absolute -bottom-1 -left-[3px] border-l-4 border-r-4 border-t-4 border-t-red-500 border-l-transparent border-r-transparent" />
                                                        </motion.div>

                                                        {/* Q_out Arrow */}
                                                        <motion.div
                                                            className="absolute -bottom-16 w-1 h-12 bg-blue-500"
                                                            animate={{ y: [0, 6, 0] }}
                                                            transition={{ repeat: Infinity, duration: 1.2 }}
                                                        >
                                                            <div className="absolute -bottom-1 -left-[3px] border-l-4 border-r-4 border-t-4 border-t-blue-500 border-l-transparent border-r-transparent" />
                                                        </motion.div>

                                                        {/* W_net Arrow */}
                                                        <motion.div
                                                            className="absolute left-24 w-12 h-1 bg-green-500"
                                                            animate={{ x: [0, 6, 0] }}
                                                            transition={{ repeat: Infinity, duration: 0.8 }}
                                                        >
                                                            <div className="absolute top-1/2 -right-1 -translate-y-1/2 border-t-4 border-b-4 border-l-4 border-l-green-500 border-t-transparent border-b-transparent" />
                                                        </motion.div>
                                                    </div>

                                                    {/* Cold Reservoir */}
                                                    <div className="w-32 h-16 bg-blue-500/20 border-2 border-blue-500 rounded flex items-center justify-center text-blue-500 font-bold">
                                                        Cold Sink
                                                    </div>

                                                    {/* Labels */}
                                                    <div className="absolute top-2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-xs font-mono text-red-600">Q_in = {engineParams.heatIn}kJ</div>
                                                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 translate-y-1/2 text-xs font-mono text-blue-600">Q_out = {engineParams.heatOut}kJ</div>
                                                    <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 text-xs font-mono text-green-600">W_net = {workNet}kJ</div>
                                                </div>

                                                {/* Summary Metrics */}
                                                <div className="grid grid-cols-1 gap-4 w-full mt-16 max-w-sm">
                                                    <Card className="bg-primary/5 border-primary/20 text-center p-6">
                                                        <div className="text-4xl font-extrabold text-primary">
                                                            {efficiency.toFixed(1)}%
                                                        </div>
                                                        <div className="text-sm text-muted-foreground uppercase font-bold tracking-widest mt-2">Thermal Efficiency (η)</div>
                                                    </Card>
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
                                                    <CardTitle className="text-warning">First Law Analysis</CardTitle>
                                                </CardHeader>
                                                <CardContent className="text-sm space-y-3">
                                                    <p>
                                                        Energy cannot be created or destroyed. In a heat engine, the energy that goes in
                                                        must either come out as net work or be rejected as waste heat.
                                                    </p>
                                                    <div className="bg-background/80 p-3 rounded font-mono text-center text-lg my-4">
                                                        W_net = Q_in - Q_out
                                                    </div>
                                                </CardContent>
                                            </Card>

                                            <Card className="border-warning/30 bg-warning/5">
                                                <CardHeader className="flex flex-row items-center gap-2">
                                                    <GraduationCap className="w-5 h-5 text-warning" />
                                                    <CardTitle className="text-warning">Second Law Efficiency</CardTitle>
                                                </CardHeader>
                                                <CardContent className="text-sm space-y-3">
                                                    <p>
                                                        The Kelvin-Planck statement of the second law says that no heat engine can be 100% efficient.
                                                        Some heat must ALWAYS be rejected to a cold sink.
                                                    </p>
                                                    <div className="bg-background/80 p-3 rounded font-mono text-center text-lg my-4">
                                                        η = W_net / Q_in
                                                    </div>
                                                    <p className="text-xs text-muted-foreground">
                                                        Try reducing Q_out to zero. You'll notice the efficiency would be 100%, but this is
                                                        physically impossible in the real world!
                                                    </p>
                                                </CardContent>
                                            </Card>
                                        </motion.div>
                                    )}
                                </TabsContent>

                                <TabsContent value="refrigerator">
                                    <div className="flex flex-col items-center justify-center min-h-[400px] border-2 border-dashed border-muted rounded-xl bg-muted/50">
                                        <Snowflake className="w-12 h-12 text-muted-foreground mb-4" />
                                        <h3 className="text-xl font-bold">Refrigeration Module Coming Soon</h3>
                                        <p className="text-muted-foreground">Visualizing COP and reverse energy flow.</p>
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

export default AppliedThermal;
