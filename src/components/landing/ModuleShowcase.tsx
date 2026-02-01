
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Thermometer,
    Droplets,
    Zap,
    Activity,
    ArrowRight,
    Wind,
    Sun
} from 'lucide-react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    ResponsiveContainer,
    AreaChart,
    Area
} from 'recharts';

const ModuleShowcase = () => {
    const [activeTab, setActiveTab] = useState("thermo");

    // Dummy data generators for visualizations
    const ottoData = Array.from({ length: 40 }, (_, i) => {
        const v = 1 + (i / 40) * 9;
        const pAdiabatic = 100 * Math.pow(v, -1.4);
        return { v, p: pAdiabatic };
    });

    const flowData = Array.from({ length: 20 }, (_, i) => {
        const x = i;
        const v = Math.sin(i * 0.5) * 2 + 5; // Turbulent-ish
        return { x, v };
    });

    return (
        <section className="py-24 bg-muted/20 relative overflow-hidden">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <Badge variant="outline" className="mb-4 border-primary/20 text-primary bg-primary/5">
                        Core Capabilities
                    </Badge>
                    <h2 className="text-3xl md:text-5xl font-bold mb-6">What You Can Explore</h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                        Go beyond static textbook diagrams. Interact with live engineering systems where every variable causes a real-time reaction.
                    </p>
                </div>

                <Tabs defaultValue="thermo" value={activeTab} onValueChange={setActiveTab} className="w-full max-w-6xl mx-auto">
                    <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 h-auto p-1 bg-muted/50 backdrop-blur-sm rounded-xl mb-12">
                        <TabsTrigger value="thermo" className="h-14 gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm">
                            <Thermometer className="w-4 h-4" /> Thermodynamics
                        </TabsTrigger>
                        <TabsTrigger value="fluid" className="h-14 gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm">
                            <Droplets className="w-4 h-4" /> Fluid Mechanics
                        </TabsTrigger>
                        <TabsTrigger value="mechanics" className="h-14 gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm">
                            <Activity className="w-4 h-4" /> Mechanics
                        </TabsTrigger>
                        <TabsTrigger value="renewable" className="h-14 gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm">
                            <Zap className="w-4 h-4" /> Renewable
                        </TabsTrigger>
                    </TabsList>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[500px]">
                        {/* Visual Side */}
                        <div className="relative">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeTab}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    transition={{ duration: 0.3 }}
                                    className="w-full aspect-square md:aspect-video bg-background border border-border rounded-xl shadow-2xl overflow-hidden relative"
                                >
                                    {/* Mini Simulations */}
                                    {activeTab === 'thermo' && (
                                        <div className="w-full h-full p-6 flex flex-col">
                                            <div className="flex justify-between items-center mb-4">
                                                <span className="font-mono text-xs text-muted-foreground">OTTO CYCLE SIMULATION</span>
                                                <Badge variant="secondary" className="font-mono text-[10px]">n = 1.4 (Ideal Gas)</Badge>
                                            </div>
                                            <div className="flex-1 w-full h-full">
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <LineChart data={ottoData}>
                                                        <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                                                        <XAxis dataKey="v" hide />
                                                        <YAxis hide />
                                                        <Line type="monotone" dataKey="p" stroke="#0088EE" strokeWidth={3} dot={false} isAnimationActive={true} />
                                                    </LineChart>
                                                </ResponsiveContainer>
                                            </div>
                                            <div className="mt-4 grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <div className="h-1 w-full bg-muted rounded-full overflow-hidden">
                                                        <motion.div
                                                            className="h-full bg-blue-500"
                                                            animate={{ width: ["0%", "100%", "0%"] }}
                                                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                                        />
                                                    </div>
                                                    <div className="text-[10px] text-muted-foreground uppercase text-center">Piston Position</div>
                                                </div>
                                                <div className="space-y-2">
                                                    <div className="h-1 w-full bg-muted rounded-full overflow-hidden">
                                                        <motion.div
                                                            className="h-full bg-red-500"
                                                            animate={{ width: ["20%", "80%", "20%"] }}
                                                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                                                        />
                                                    </div>
                                                    <div className="text-[10px] text-muted-foreground uppercase text-center">Temperature</div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {activeTab === 'fluid' && (
                                        <div className="w-full h-full p-6 flex flex-col relative">
                                            <div className="absolute inset-0 z-0 flex items-center justify-center opacity-10">
                                                <Droplets className="w-64 h-64" />
                                            </div>
                                            <div className="relative z-10 flex-1 flex flex-col justify-center gap-2">
                                                {/* Streamlines */}
                                                {[...Array(8)].map((_, i) => (
                                                    <div key={i} className="h-8 bg-blue-500/5 border-y border-blue-500/10 relative overflow-hidden">
                                                        <motion.div
                                                            className="absolute inset-0 bg-blue-400/20 w-20"
                                                            animate={{ x: ["-100%", "500%"] }}
                                                            transition={{
                                                                duration: 1 + Math.random(),
                                                                repeat: Infinity,
                                                                ease: "linear",
                                                                delay: i * 0.1
                                                            }}
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="mt-4 flex justify-between items-center bg-background/80 p-3 rounded-lg border backdrop-blur">
                                                <div className="text-xs font-mono">Re: <span className="text-orange-500 font-bold">4200</span> (Turbulent)</div>
                                                <div className="flex gap-1 h-3">
                                                    {[...Array(5)].map((_, i) => (
                                                        <motion.div
                                                            key={i}
                                                            className="w-1 bg-blue-500 rounded-full"
                                                            animate={{ height: ["20%", "100%", "40%"] }}
                                                            transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.1 }}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {activeTab === 'mechanics' && (
                                        <div className="w-full h-full p-6 flex items-center justify-center bg-grid-white/[0.02]">
                                            <div className="relative w-64 h-64">
                                                <div className="absolute bottom-0 left-0 w-full h-1 bg-white/20" />
                                                <motion.div
                                                    className="w-0 h-0 border-l-[30px] border-r-[30px] border-b-[200px] border-l-transparent border-r-transparent border-b-slate-700 absolute bottom-0 left-10 origin-bottom-left"
                                                    style={{ transform: "rotate(0deg)" }}
                                                >
                                                    {/* Block */}
                                                    <motion.div
                                                        className="absolute -left-[20px] top-[80px] w-10 h-10 bg-orange-500 rounded shadow-lg"
                                                        animate={{ y: [0, 50, 0] }}
                                                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                                    >
                                                        {/* Force Vectors */}
                                                        <div className="absolute top-1/2 left-1/2 w-16 h-0.5 bg-white origin-left rotate-45" /> {/* Normal */}
                                                        <div className="absolute top-1/2 left-1/2 w-12 h-0.5 bg-red-500 origin-left rotate-90" /> {/* Gravity */}
                                                    </motion.div>
                                                </motion.div>
                                            </div>
                                        </div>
                                    )}

                                    {activeTab === 'renewable' && (
                                        <div className="w-full h-full p-6 flex flex-col">
                                            <div className="flex justify-between items-center mb-4">
                                                <span className="font-mono text-xs text-muted-foreground">WIND TURBINE POWER CURVE</span>
                                            </div>
                                            <div className="flex-1 relative">
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <AreaChart data={ottoData}> {/* Reusing data shape for simplicity */}
                                                        <Area type="monotone" dataKey="p" stroke="#10b981" fill="#10b981" fillOpacity={0.2} />
                                                    </AreaChart>
                                                </ResponsiveContainer>
                                                <motion.div
                                                    className="absolute top-1/2 left-1/2 text-4xl"
                                                    animate={{ rotate: 360 }}
                                                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                                                >
                                                    <Wind className="w-16 h-16 text-emerald-500" />
                                                </motion.div>
                                            </div>
                                        </div>
                                    )}
                                </motion.div>
                            </AnimatePresence>

                            {/* Decorative Elements */}
                            <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/20 blur-3xl rounded-full" />
                            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-cyan-500/20 blur-3xl rounded-full" />
                        </div>

                        {/* Content Side */}
                        <div className="space-y-6">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeTab}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <h3 className="text-2xl font-bold mb-4 flex items-center gap-3">
                                        {activeTab === 'thermo' && <><Thermometer className="text-red-500" /> Thermodynamics Module</>}
                                        {activeTab === 'fluid' && <><Droplets className="text-blue-500" /> Fluid Mechanics Module</>}
                                        {activeTab === 'mechanics' && <><Activity className="text-orange-500" /> Engineering Mechanics</>}
                                        {activeTab === 'renewable' && <><Zap className="text-emerald-500" /> Renewable Energy</>}
                                    </h3>

                                    <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                                        {activeTab === 'thermo' && "Visualize complex cycles like Otto, Diesel, and Rankine. Adjust compression ratios, temperatures, and pressures to instantly see how they affect efficiency and work output."}
                                        {activeTab === 'fluid' && "Understand flow regimes through interactive pipe simulations. Watch laminar flow transition to turbulence as you increase Reynolds number in real-time."}
                                        {activeTab === 'mechanics' && "Master statics and dynamics. Decompose forces on inclined planes, calculate friction coefficients, and visualize torque vectors in 3D space."}
                                        {activeTab === 'renewable' && "Explore the physics of green energy. Analyze solar panel efficiency limits (Shockley-Queisser) and wind turbine power curves (Betz Limit)."}
                                    </p>

                                    <ul className="space-y-3 mb-8">
                                        {activeTab === 'thermo' && [
                                            "Real Gas vs Ideal Gas toggles",
                                            "P-V, T-S, H-S Diagrams",
                                            "Efficiency Heatmaps"
                                        ].map(item => (
                                            <li key={item} className="flex items-center gap-2 text-sm font-medium">
                                                <div className="w-1.5 h-1.5 rounded-full bg-primary" /> {item}
                                            </li>
                                        ))}
                                        {activeTab === 'fluid' && [
                                            "Bernoulli's Principle Demo",
                                            "Viscosity & Density Controls",
                                            "Velocity Profile Graphs"
                                        ].map(item => (
                                            <li key={item} className="flex items-center gap-2 text-sm font-medium">
                                                <div className="w-1.5 h-1.5 rounded-full bg-blue-500" /> {item}
                                            </li>
                                        ))}
                                        {activeTab === 'mechanics' && [
                                            "Free Body Diagrams",
                                            "Friction vs Angle Calculator",
                                            "Vector Math Visualization"
                                        ].map(item => (
                                            <li key={item} className="flex items-center gap-2 text-sm font-medium">
                                                <div className="w-1.5 h-1.5 rounded-full bg-orange-500" /> {item}
                                            </li>
                                        ))}
                                        {activeTab === 'renewable' && [
                                            "Irradiance Calculations",
                                            "Power Output Modeling",
                                            "Environmental Impact Data"
                                        ].map(item => (
                                            <li key={item} className="flex items-center gap-2 text-sm font-medium">
                                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> {item}
                                            </li>
                                        ))}
                                    </ul>

                                    <Button variant="outline" className="group">
                                        Explore {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </Button>
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </div>
                </Tabs>
            </div>
        </section>
    );
};

export default ModuleShowcase;
