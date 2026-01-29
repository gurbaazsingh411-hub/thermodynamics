import { useState } from 'react';
import { motion } from 'framer-motion';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import {
    Thermometer,
    ArrowRight,
    RotateCcw,
    GraduationCap,
    Info,
    Waves,
    Sun
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const HeatTransfer = () => {
    const [isStudyMode, setIsStudyMode] = useState(false);
    const [conductionParams, setConductionParams] = useState({
        temperatureLeft: 400,
        temperatureRight: 300,
        thickness: 0.1,
        conductivity: 50
    });

    const heatFlux = (conductionParams.conductivity * (conductionParams.temperatureLeft - conductionParams.temperatureRight)) / conductionParams.thickness;

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
                                <Thermometer className="w-4 h-4 text-primary" />
                                <span className="font-semibold">Heat Transfer Visualization</span>
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
                            <Tabs defaultValue="conduction" className="w-full">
                                <TabsList className="grid w-full grid-cols-3 mb-8">
                                    <TabsTrigger value="conduction" className="gap-2">
                                        <Thermometer className="w-4 h-4" /> Conduction
                                    </TabsTrigger>
                                    <TabsTrigger value="convection" className="gap-2">
                                        <Waves className="w-4 h-4" /> Convection
                                    </TabsTrigger>
                                    <TabsTrigger value="radiation" className="gap-2">
                                        <Sun className="w-4 h-4" /> Radiation
                                    </TabsTrigger>
                                </TabsList>

                                <TabsContent value="conduction" className="space-y-6">
                                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                        {/* Controls */}
                                        <Card className="lg:col-span-1">
                                            <CardHeader>
                                                <CardTitle className="text-lg">Parameters</CardTitle>
                                                <CardDescription>Adjust variables to see real-time heat flow</CardDescription>
                                            </CardHeader>
                                            <CardContent className="space-y-6">
                                                <div className="space-y-4">
                                                    <div className="flex justify-between">
                                                        <Label>Left Temp (T1)</Label>
                                                        <span className="text-sm font-mono">{conductionParams.temperatureLeft} K</span>
                                                    </div>
                                                    <Slider
                                                        value={[conductionParams.temperatureLeft]}
                                                        onValueChange={([v]) => setConductionParams(p => ({ ...p, temperatureLeft: v }))}
                                                        min={273}
                                                        max={1000}
                                                        step={1}
                                                    />
                                                </div>

                                                <div className="space-y-4">
                                                    <div className="flex justify-between">
                                                        <Label>Right Temp (T2)</Label>
                                                        <span className="text-sm font-mono">{conductionParams.temperatureRight} K</span>
                                                    </div>
                                                    <Slider
                                                        value={[conductionParams.temperatureRight]}
                                                        onValueChange={([v]) => setConductionParams(p => ({ ...p, temperatureRight: v }))}
                                                        min={273}
                                                        max={1000}
                                                        step={1}
                                                    />
                                                </div>

                                                <div className="space-y-4">
                                                    <div className="flex justify-between">
                                                        <Label>Wall Thickness (L)</Label>
                                                        <span className="text-sm font-mono">{conductionParams.thickness} m</span>
                                                    </div>
                                                    <Slider
                                                        value={[conductionParams.thickness * 100]}
                                                        onValueChange={([v]) => setConductionParams(p => ({ ...p, thickness: v / 100 }))}
                                                        min={1}
                                                        max={50}
                                                        step={1}
                                                    />
                                                </div>
                                            </CardContent>
                                        </Card>

                                        {/* Visualization */}
                                        <Card className="lg:col-span-2">
                                            <CardHeader>
                                                <CardTitle>Conduction Visualization</CardTitle>
                                                <CardDescription>Fourier's Law: Q = -kA * (dT/dx)</CardDescription>
                                            </CardHeader>
                                            <CardContent className="flex flex-col items-center justify-center min-h-[400px]">
                                                <div className="relative w-full max-w-lg h-64 bg-muted/20 border-x-8 border-border flex items-center justify-center overflow-hidden rounded-md">
                                                    {/* Heat Gradient Visualization */}
                                                    <div
                                                        className="absolute inset-0 opacity-40 transition-all duration-500"
                                                        style={{
                                                            background: `linear-gradient(to right, 
                                hsl(${((conductionParams.temperatureLeft - 273) / 727) * 240}, 100%, 50%), 
                                hsl(${((conductionParams.temperatureRight - 273) / 727) * 240}, 100%, 50%))`
                                                        }}
                                                    />

                                                    {/* Flow Particles */}
                                                    {conductionParams.temperatureLeft > conductionParams.temperatureRight && (
                                                        <div className="absolute inset-0 flex items-center justify-around overflow-hidden">
                                                            {[...Array(5)].map((_, i) => (
                                                                <motion.div
                                                                    key={i}
                                                                    initial={{ x: -100, opacity: 0 }}
                                                                    animate={{ x: 500, opacity: [0, 1, 0] }}
                                                                    transition={{
                                                                        duration: Math.max(0.5, 5 / (heatFlux / 10000)),
                                                                        repeat: Infinity,
                                                                        delay: i * 0.4
                                                                    }}
                                                                    className="w-4 h-1 bg-white/60 rounded-full blur-[1px]"
                                                                />
                                                            ))}
                                                        </div>
                                                    )}

                                                    <div className="z-10 text-center space-y-2">
                                                        <div className="text-3xl font-bold font-mono">
                                                            {Math.abs(heatFlux).toLocaleString(undefined, { maximumFractionDigits: 0 })} W/m²
                                                        </div>
                                                        <div className="text-sm text-muted-foreground font-medium uppercase tracking-widest">
                                                            Heat Flux
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Summary Metrics */}
                                                <div className="grid grid-cols-2 gap-4 w-full mt-8">
                                                    <div className="p-4 rounded-lg bg-orange-500/10 border border-orange-500/20 text-center">
                                                        <div className="text-2xl font-bold text-orange-600">{conductionParams.temperatureLeft - conductionParams.temperatureRight} K</div>
                                                        <div className="text-xs text-muted-foreground uppercase font-semibold">Temp Difference</div>
                                                    </div>
                                                    <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20 text-center">
                                                        <div className="text-2xl font-bold text-blue-600">{(conductionParams.thickness / conductionParams.conductivity).toFixed(4)}</div>
                                                        <div className="text-xs text-muted-foreground uppercase font-semibold">Thermal Resistance</div>
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
                                                    <CardTitle className="text-warning">The Theory: Fourier's Law</CardTitle>
                                                </CardHeader>
                                                <CardContent className="text-sm space-y-3">
                                                    <p>
                                                        Fourier's Law of Heat Conduction states that the rate of heat transfer through a material
                                                        is proportional to the negative gradient in the temperature and to the area.
                                                    </p>
                                                    <div className="bg-background/80 p-3 rounded font-mono text-center text-lg my-4">
                                                        Q = -k · A · (dT/dx)
                                                    </div>
                                                    <ul className="list-disc pl-5 space-y-1">
                                                        <li><strong>k:</strong> Thermal conductivity (W/m·K)</li>
                                                        <li><strong>A:</strong> Surface area</li>
                                                        <li><strong>dT/dx:</strong> Temperature gradient</li>
                                                    </ul>
                                                </CardContent>
                                            </Card>

                                            <Card className="border-warning/30 bg-warning/5">
                                                <CardHeader className="flex flex-row items-center gap-2">
                                                    <GraduationCap className="w-5 h-5 text-warning" />
                                                    <CardTitle className="text-warning">Key Concept: Thermal Resistance</CardTitle>
                                                </CardHeader>
                                                <CardContent className="text-sm space-y-3">
                                                    <p>
                                                        Similar to electrical resistance, thermal resistance is the ratio of temperature difference
                                                        to the rate of heat flow.
                                                    </p>
                                                    <div className="bg-background/80 p-3 rounded font-mono text-center text-lg my-4">
                                                        R_th = L / k
                                                    </div>
                                                    <p>
                                                        Increasing the thickness (L) or decreasing the conductivity (k) increases the resistance
                                                        to heat flow, which is how insulation works.
                                                    </p>
                                                </CardContent>
                                            </Card>
                                        </motion.div>
                                    )}
                                </TabsContent>

                                <TabsContent value="convection">
                                    <div className="flex flex-col items-center justify-center min-h-[400px] border-2 border-dashed border-muted rounded-xl bg-muted/50">
                                        <Waves className="w-12 h-12 text-muted-foreground mb-4" />
                                        <h3 className="text-xl font-bold">Convection Module Coming Soon</h3>
                                        <p className="text-muted-foreground">Visualizing Newton's Law of Cooling and fluid-heat interaction.</p>
                                    </div>
                                </TabsContent>

                                <TabsContent value="radiation">
                                    <div className="flex flex-col items-center justify-center min-h-[400px] border-2 border-dashed border-muted rounded-xl bg-muted/50">
                                        <Sun className="w-12 h-12 text-muted-foreground mb-4" />
                                        <h3 className="text-xl font-bold">Radiation Module Coming Soon</h3>
                                        <p className="text-muted-foreground">Simulating Stefan-Boltzmann Law and emissivity impacts.</p>
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

export default HeatTransfer;
