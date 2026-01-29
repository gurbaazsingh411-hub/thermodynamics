import { useState } from 'react';
import { motion } from 'framer-motion';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
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
                                                    <CardTitle className="text-warning">The Solar Equation</CardTitle>
                                                </CardHeader>
                                                <CardContent className="text-sm space-y-3">
                                                    <p>
                                                        The electrical power generated by a photovoltaic (PV) panel depends on
                                                        the area of the panel, the intensity of sunlight, and the conversion efficiency.
                                                    </p>
                                                    <div className="bg-background/80 p-3 rounded font-mono text-center text-lg my-4">
                                                        P = A · G · η
                                                    </div>
                                                </CardContent>
                                            </Card>

                                            <Card className="border-warning/30 bg-warning/5">
                                                <CardHeader className="flex flex-row items-center gap-2">
                                                    <GraduationCap className="w-5 h-5 text-warning" />
                                                    <CardTitle className="text-warning">Theoretical Limit</CardTitle>
                                                </CardHeader>
                                                <CardContent className="text-sm space-y-3">
                                                    <p>
                                                        Most consumer solar panels have an efficiency between 15% and 22%.
                                                        The theoretical maximum for a single-junction silicon cell is about 33%
                                                        (the Shockley-Queisser limit).
                                                    </p>
                                                    <p className="text-xs text-muted-foreground border-t border-warning/20 pt-2">
                                                        Factors like cloud cover, angle of incidence, and temperature also affect real-world output.
                                                    </p>
                                                </CardContent>
                                            </Card>
                                        </motion.div>
                                    )}
                                </TabsContent>

                                <TabsContent value="wind">
                                    <div className="flex flex-col items-center justify-center min-h-[400px] border-2 border-dashed border-muted rounded-xl bg-muted/50">
                                        <Wind className="w-12 h-12 text-muted-foreground mb-4" />
                                        <h3 className="text-xl font-bold">Wind Turbine Module Coming Soon</h3>
                                        <p className="text-muted-foreground">Analysis of Betz Law and power-wind speed relationship (v³).</p>
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

export default RenewableEnergy;
