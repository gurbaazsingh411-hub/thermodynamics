import { useState } from 'react';
import { motion } from 'framer-motion';
import { Header } from '@/components/layout/Header';
import {
    Zap,
    ArrowRight,
    RotateCcw,
    GraduationCap,
    Info,
    Flame,
    Snowflake,
    TrendingUp,
    Lightbulb
} from 'lucide-react';
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

    // Refrigerator State
    const [fridgeParams, setFridgeParams] = useState({
        workIn: 300,    // kJ
        qCold: 600,     // kJ (Heat removed from inside)
    });
    const qHot = fridgeParams.qCold + fridgeParams.workIn;
    const cop = fridgeParams.qCold / fridgeParams.workIn;

    // Heat Engine Graph Data (Efficiency vs Q_out)
    const efficiencyData = Array.from({ length: 20 }, (_, i) => {
        // Range Q_out from 0 to HeatIn
        const qOutVal = (i / 19) * engineParams.heatIn;
        const wNet = engineParams.heatIn - qOutVal;
        const eff = (wNet / engineParams.heatIn) * 100;
        return { qOut: qOutVal, efficiency: eff };
    });

    // Refrigerator Graph Data (COP vs Work Input)
    const copData = Array.from({ length: 20 }, (_, i) => {
        const wIn = 50 + i * 50; // 50 to 1000
        const copVal = fridgeParams.qCold / wIn;
        return { work: wIn, cop: copVal };
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

                                    {/* Graph */}
                                    <div className="w-full mt-6 h-64 bg-slate-900 border border-slate-800 rounded-lg p-4">
                                        <div className="text-sm font-semibold mb-2 text-slate-100">Efficiency vs Heat Rejected</div>
                                        <ResponsiveContainer width="100%" height="100%">
                                            <AreaChart data={efficiencyData}>
                                                <CartesianGrid strokeDasharray="3 3" opacity={0.1} stroke="#fff" />
                                                <XAxis dataKey="qOut" stroke="#94a3b8" label={{ value: 'Heat Rejected (kJ)', position: 'insideBottom', offset: -5, fill: '#94a3b8' }} />
                                                <YAxis stroke="#94a3b8" label={{ value: 'Efficiency (%)', angle: -90, position: 'insideLeft', fill: '#94a3b8' }} domain={[0, 100]} />
                                                <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }} />
                                                <ReferenceLine x={engineParams.heatOut} stroke="#ef4444" strokeDasharray="3 3" label="Current" />
                                                <Area type="monotone" dataKey="efficiency" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    </div>

                                    {/* Study Mode Content - In Depth */}
                                    {isStudyMode && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="space-y-6"
                                        >
                                            {/* What is a Heat Engine? */}
                                            <Card className="border-warning/30 bg-warning/5">
                                                <CardHeader>
                                                    <CardTitle className="text-warning flex items-center gap-2">
                                                        <Flame className="w-5 h-5" />
                                                        What is a Heat Engine?
                                                    </CardTitle>
                                                </CardHeader>
                                                <CardContent className="text-sm space-y-4">
                                                    <p>
                                                        A <strong>Heat Engine</strong> is a device that converts <strong>thermal energy (heat)</strong> into
                                                        <strong> mechanical work</strong>. It operates by exploiting the temperature difference between
                                                        a <span className="text-red-400 font-semibold">hot reservoir (T_H)</span> and a
                                                        <span className="text-blue-400 font-semibold"> cold reservoir (T_L)</span>.
                                                    </p>
                                                    <div className="bg-background/80 p-4 rounded-lg border border-warning/20">
                                                        <p className="text-muted-foreground mb-3 text-xs">The basic process of any heat engine:</p>
                                                        <ol className="list-decimal list-inside space-y-2 text-sm">
                                                            <li><strong>Absorb Heat (Q_in):</strong> Heat is absorbed from a high-temperature source (e.g., burning fuel, steam, solar energy).</li>
                                                            <li><strong>Produce Work (W_net):</strong> Some of this energy is converted into useful mechanical work (e.g., spinning a turbine, moving a piston).</li>
                                                            <li><strong>Reject Heat (Q_out):</strong> The remaining energy is discharged to a low-temperature sink (e.g., atmosphere, cooling water).</li>
                                                        </ol>
                                                    </div>
                                                    <p className="text-xs text-muted-foreground italic border-l-2 border-warning/50 pl-3">
                                                        Examples: Steam power plants, internal combustion engines (cars), jet engines.
                                                    </p>
                                                </CardContent>
                                            </Card>

                                            {/* First Law & Carnot - Side by Side */}
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <Card className="border-primary/30 bg-primary/5">
                                                    <CardHeader className="flex flex-row items-center gap-2 pb-2">
                                                        <Info className="w-5 h-5 text-primary" />
                                                        <CardTitle className="text-primary text-base">First Law of Thermodynamics</CardTitle>
                                                    </CardHeader>
                                                    <CardContent className="text-sm space-y-3">
                                                        <p>
                                                            Energy is <strong>conserved</strong>. The net work output of a heat engine
                                                            equals the difference between heat absorbed and heat rejected.
                                                        </p>
                                                        <div className="bg-background/80 p-4 rounded font-mono text-center text-lg border border-primary/20">
                                                            W_net = Q_in - Q_out
                                                        </div>
                                                        <p className="text-xs text-muted-foreground">
                                                            This is an <strong>energy balance</strong>. All energy that enters must either be converted to work or leave as waste heat.
                                                        </p>
                                                    </CardContent>
                                                </Card>

                                                <Card className="border-secondary/30 bg-secondary/5">
                                                    <CardHeader className="flex flex-row items-center gap-2 pb-2">
                                                        <GraduationCap className="w-5 h-5 text-secondary" />
                                                        <CardTitle className="text-secondary text-base">Thermal Efficiency (η)</CardTitle>
                                                    </CardHeader>
                                                    <CardContent className="text-sm space-y-3">
                                                        <p>
                                                            Efficiency measures <strong>how much of the input heat is converted to useful work</strong>.
                                                            It's always less than 100%.
                                                        </p>
                                                        <div className="bg-background/80 p-4 rounded font-mono text-center text-lg border border-secondary/20">
                                                            η = W_net / Q_in = 1 - (Q_out / Q_in)
                                                        </div>
                                                        <p className="text-xs text-muted-foreground">
                                                            Expressed as a percentage (e.g., η = 0.4 means 40% of heat becomes work).
                                                        </p>
                                                    </CardContent>
                                                </Card>
                                            </div>

                                            {/* The Carnot Limit */}
                                            <Card className="border-green-500/30 bg-green-500/5">
                                                <CardHeader>
                                                    <CardTitle className="text-green-400 flex items-center gap-2">
                                                        <TrendingUp className="w-5 h-5" />
                                                        The Carnot Limit: The Ultimate Efficiency
                                                    </CardTitle>
                                                </CardHeader>
                                                <CardContent className="text-sm space-y-4">
                                                    <p>
                                                        The <strong>Second Law of Thermodynamics</strong> dictates that no real engine can be
                                                        100% efficient. The theoretical maximum is the <strong className="text-green-400">Carnot Efficiency</strong>,
                                                        achieved only by an idealized, reversible engine.
                                                    </p>
                                                    <div className="bg-background/80 p-4 rounded-lg border border-green-500/20 text-center">
                                                        <div className="font-mono text-2xl text-green-400 mb-2">
                                                            η_Carnot = 1 - (T_L / T_H)
                                                        </div>
                                                        <p className="text-xs text-muted-foreground">
                                                            (Temperatures MUST be in Kelvin!)
                                                        </p>
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-4 text-xs">
                                                        <div className="bg-red-500/10 p-3 rounded border border-red-500/20">
                                                            <strong className="text-red-400">↑ Increase T_H</strong>
                                                            <p className="text-muted-foreground mt-1">Hotter source = higher efficiency. This is why power plants use superheated steam.</p>
                                                        </div>
                                                        <div className="bg-blue-500/10 p-3 rounded border border-blue-500/20">
                                                            <strong className="text-blue-400">↓ Decrease T_L</strong>
                                                            <p className="text-muted-foreground mt-1">Colder sink = higher efficiency. Limited by ambient temperature.</p>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>

                                            {/* Why Real Engines Are Less Efficient */}
                                            <Card className="border-orange-500/30 bg-orange-500/5">
                                                <CardHeader>
                                                    <CardTitle className="text-orange-400 text-base">Why Are Real Engines Less Efficient?</CardTitle>
                                                </CardHeader>
                                                <CardContent className="text-sm">
                                                    <p className="mb-3">Real engines have <strong>irreversibilities</strong> that cause energy loss:</p>
                                                    <ul className="space-y-2">
                                                        <li className="flex items-start gap-2">
                                                            <span className="text-orange-400 font-bold mt-0.5">1.</span>
                                                            <span><strong>Friction:</strong> Moving parts (pistons, bearings) generate heat loss.</span>
                                                        </li>
                                                        <li className="flex items-start gap-2">
                                                            <span className="text-orange-400 font-bold mt-0.5">2.</span>
                                                            <span><strong>Heat Leakage:</strong> Imperfect insulation allows heat to escape without doing work.</span>
                                                        </li>
                                                        <li className="flex items-start gap-2">
                                                            <span className="text-orange-400 font-bold mt-0.5">3.</span>
                                                            <span><strong>Non-Quasi-Equilibrium Processes:</strong> Rapid expansions/compressions are not thermodynamically ideal.</span>
                                                        </li>
                                                        <li className="flex items-start gap-2">
                                                            <span className="text-orange-400 font-bold mt-0.5">4.</span>
                                                            <span><strong>Incomplete Combustion:</strong> Fuel may not burn completely, wasting potential energy.</span>
                                                        </li>
                                                    </ul>
                                                </CardContent>
                                            </Card>

                                            {/* Real-World Comparison Table */}
                                            <Card className="border-muted">
                                                <CardHeader>
                                                    <CardTitle className="text-sm">Real-World Heat Engine Efficiencies</CardTitle>
                                                </CardHeader>
                                                <CardContent>
                                                    <div className="overflow-x-auto">
                                                        <table className="w-full text-sm">
                                                            <thead>
                                                                <tr className="border-b border-muted">
                                                                    <th className="text-left py-2 px-3">Engine Type</th>
                                                                    <th className="text-center py-2 px-3">Typical η</th>
                                                                    <th className="text-left py-2 px-3">Notes</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody className="text-muted-foreground">
                                                                <tr className="border-b border-muted/50">
                                                                    <td className="py-2 px-3 font-medium text-foreground">Coal Power Plant</td>
                                                                    <td className="text-center py-2 px-3 text-yellow-400">33-40%</td>
                                                                    <td className="py-2 px-3">Uses Rankine cycle; T_H ≈ 550°C</td>
                                                                </tr>
                                                                <tr className="border-b border-muted/50">
                                                                    <td className="py-2 px-3 font-medium text-foreground">Combined Cycle Gas Turbine</td>
                                                                    <td className="text-center py-2 px-3 text-green-400">55-60%</td>
                                                                    <td className="py-2 px-3">Most efficient; uses waste heat twice</td>
                                                                </tr>
                                                                <tr className="border-b border-muted/50">
                                                                    <td className="py-2 px-3 font-medium text-foreground">Car Engine (Gasoline)</td>
                                                                    <td className="text-center py-2 px-3 text-orange-400">25-30%</td>
                                                                    <td className="py-2 px-3">Otto cycle; limited by material constraints</td>
                                                                </tr>
                                                                <tr>
                                                                    <td className="py-2 px-3 font-medium text-foreground">Diesel Engine</td>
                                                                    <td className="text-center py-2 px-3 text-yellow-400">35-42%</td>
                                                                    <td className="py-2 px-3">Higher compression ratio than gasoline</td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </CardContent>
                                            </Card>

                                            {/* Did You Know? */}
                                            <Card className="border-purple-500/30 bg-purple-500/5">
                                                <CardHeader className="pb-2">
                                                    <CardTitle className="text-purple-400 text-sm flex items-center gap-2">
                                                        <Lightbulb className="w-4 h-4" />
                                                        Did You Know?
                                                    </CardTitle>
                                                </CardHeader>
                                                <CardContent className="text-xs text-muted-foreground space-y-2">
                                                    <p>🔥 The <strong>Sun</strong> has a surface temperature of ~5,800K. If we could use it as T_H and outer space (~3K) as T_L, the Carnot efficiency would be 99.95%!</p>
                                                    <p>🚗 Most of the energy in your car's fuel (~70%) is wasted as heat through the radiator and exhaust.</p>
                                                    <p>💡 <strong>Cogeneration</strong> plants capture "waste" Q_out and use it for heating buildings, boosting overall energy utilization to 80%+.</p>
                                                </CardContent>
                                            </Card>
                                        </motion.div>
                                    )}
                                </TabsContent>

                                <TabsContent value="refrigerator" className="space-y-6">
                                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                        {/* Controls */}
                                        <Card className="lg:col-span-1">
                                            <CardHeader>
                                                <CardTitle className="text-lg">Cycle Parameters</CardTitle>
                                                <CardDescription>Input Work & Cooling Load</CardDescription>
                                            </CardHeader>
                                            <CardContent className="space-y-6">
                                                <div className="space-y-4">
                                                    <div className="flex justify-between">
                                                        <Label>Heat Removed (Q_cold)</Label>
                                                        <span className="text-sm font-mono">{fridgeParams.qCold} kJ</span>
                                                    </div>
                                                    <Slider
                                                        value={[fridgeParams.qCold]}
                                                        onValueChange={([v]) => setFridgeParams(p => ({ ...p, qCold: v }))}
                                                        min={100}
                                                        max={2000}
                                                        step={50}
                                                    />
                                                </div>

                                                <div className="space-y-4">
                                                    <div className="flex justify-between">
                                                        <Label>Work Input (W_in)</Label>
                                                        <span className="text-sm font-mono">{fridgeParams.workIn} kJ</span>
                                                    </div>
                                                    <Slider
                                                        value={[fridgeParams.workIn]}
                                                        onValueChange={([v]) => setFridgeParams(p => ({ ...p, workIn: v }))}
                                                        min={50}
                                                        max={1000}
                                                        step={10}
                                                    />
                                                </div>

                                                <div className="mt-8 p-4 bg-muted/50 rounded-lg">
                                                    <div className="flex justify-between items-center mb-2">
                                                        <span className="font-semibold">Performance (COP)</span>
                                                        <span className={`text-xl font-bold ${cop > 3 ? 'text-green-600' : 'text-yellow-600'}`}>{cop.toFixed(2)}</span>
                                                    </div>
                                                    <div className="text-xs text-muted-foreground">
                                                        Higher is better. Typical A/C units are 2.5 - 4.0.
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>

                                        {/* Visualization */}
                                        <Card className="lg:col-span-2">
                                            <CardHeader>
                                                <CardTitle>Energy Flow Diagram</CardTitle>
                                                <CardDescription>Reverse Heat Engine</CardDescription>
                                            </CardHeader>
                                            <CardContent className="flex flex-col items-center justify-center min-h-[400px]">
                                                <div className="relative w-full max-w-lg h-80 flex flex-col justify-between py-4">

                                                    {/* Hot Reservoir (Kitchen Air) */}
                                                    <div className="mx-auto w-48 h-16 bg-red-100 border-2 border-red-300 rounded-lg flex items-center justify-center relative">
                                                        <div className="text-center">
                                                            <div className="font-bold text-red-700">Hot Reservoir</div>
                                                            <div className="text-xs text-red-600">Q_hot = {qHot} kJ</div>
                                                        </div>
                                                        <motion.div
                                                            className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[10px] border-r-[10px] border-l-transparent border-r-transparent border-b-[20px] border-b-red-400"
                                                            animate={{ y: [0, -5, 0] }}
                                                            transition={{ repeat: Infinity, duration: 1 }}
                                                        />
                                                    </div>

                                                    {/* System/Compressor */}
                                                    <div className="mx-auto w-32 h-32 rounded-full border-4 border-slate-300 flex items-center justify-center relative bg-white z-10">
                                                        <Snowflake className="w-12 h-12 text-blue-400" />

                                                        {/* Work In Arrow */}
                                                        <div className="absolute top-1/2 right-full flex items-center">
                                                            <div className="mr-2 text-right">
                                                                <div className="text-xs font-bold text-slate-600">Work In</div>
                                                                <div className="text-xs font-mono">{fridgeParams.workIn} kJ</div>
                                                            </div>
                                                            <motion.div
                                                                className="w-16 h-1 bg-yellow-400"
                                                                initial={{ scaleX: 0.8 }}
                                                                animate={{ scaleX: [0.8, 1.2, 0.8] }}
                                                            />
                                                            <div className="w-0 h-0 border-t-[8px] border-b-[8px] border-t-transparent border-b-transparent border-l-[16px] border-l-yellow-400" />
                                                        </div>
                                                    </div>

                                                    {/* Cold Reservoir (Inside Fridge) */}
                                                    <div className="mx-auto w-48 h-16 bg-blue-100 border-2 border-blue-300 rounded-lg flex items-center justify-center relative">
                                                        <motion.div
                                                            className="absolute -top-8 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[10px] border-r-[10px] border-l-transparent border-r-transparent border-b-[20px] border-b-blue-400"
                                                            animate={{ y: [0, -5, 0] }}
                                                            transition={{ repeat: Infinity, duration: 1 }}
                                                        />
                                                        <div className="text-center">
                                                            <div className="font-bold text-blue-700">Cold Reservoir</div>
                                                            <div className="text-xs text-blue-600">Q_cold = {fridgeParams.qCold} kJ</div>
                                                        </div>
                                                    </div>

                                                    {/* Energy Path Lines */}
                                                    <svg className="absolute inset-0 w-full h-full pointer-events-none -z-0">
                                                        {/* Cold to System */}
                                                        <motion.path
                                                            d="M 256,220 L 256,200"
                                                            stroke="#60a5fa"
                                                            strokeWidth={Math.max(2, fridgeParams.qCold / 100)}
                                                            strokeDasharray="5,5"
                                                            animate={{ strokeDashoffset: [10, 0] }}
                                                            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                                                        />
                                                        {/* System to Hot */}
                                                        <motion.path
                                                            d="M 256,120 L 256,100"
                                                            stroke="#f87171"
                                                            strokeWidth={Math.max(2, qHot / 100)}
                                                            strokeDasharray="5,5"
                                                            animate={{ strokeDashoffset: [0, -10] }}
                                                            transition={{ repeat: Infinity, duration: 0.5, ease: "linear" }}
                                                        />
                                                    </svg>
                                                </div>

                                                {/* Formula Display */}
                                                <div className="mt-6 font-mono text-sm bg-slate-100 p-2 rounded border">
                                                    Q_hot ({qHot}) = Q_cold ({fridgeParams.qCold}) + Work ({fridgeParams.workIn})
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </div>

                                    {/* Graph */}
                                    <div className="w-full mt-6 h-64 bg-slate-900 border border-slate-800 rounded-lg p-4">
                                        <div className="text-sm font-semibold mb-2 text-slate-100">COP vs Work Input</div>
                                        <ResponsiveContainer width="100%" height="100%">
                                            <LineChart data={copData}>
                                                <CartesianGrid strokeDasharray="3 3" opacity={0.1} stroke="#fff" />
                                                <XAxis dataKey="work" stroke="#94a3b8" label={{ value: 'Work Input (kJ)', position: 'insideBottom', offset: -5, fill: '#94a3b8' }} />
                                                <YAxis stroke="#94a3b8" label={{ value: 'COP', angle: -90, position: 'insideLeft', fill: '#94a3b8' }} />
                                                <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }} />
                                                <ReferenceLine x={fridgeParams.workIn} stroke="#fbbf24" strokeDasharray="3 3" label="Current" />
                                                <Line type="monotone" dataKey="cop" stroke="#10b981" strokeWidth={3} dot={false} />
                                            </LineChart>
                                        </ResponsiveContainer>
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
                                                    <CardTitle className="text-warning">Coefficient of Performance (COP)</CardTitle>
                                                </CardHeader>
                                                <CardContent className="text-sm space-y-3">
                                                    <p>
                                                        Unlike efficiency (which must be &lt; 100%), COP can be greater than 1. It measures how much heat you move per unit of work input.
                                                    </p>
                                                    <div className="bg-background/80 p-3 rounded font-mono text-center text-lg my-4 space-y-2">
                                                        <div>COP = Heat Removed / Work Input</div>
                                                        <div>COP = Q_cold / W_in</div>
                                                    </div>
                                                </CardContent>
                                            </Card>

                                            <Card className="border-warning/30 bg-warning/5">
                                                <CardHeader className="flex flex-row items-center gap-2">
                                                    <Flame className="w-5 h-5 text-warning" />
                                                    <CardTitle className="text-warning">Refrigerants & Environment</CardTitle>
                                                </CardHeader>
                                                <CardContent className="text-sm space-y-3">
                                                    <p>
                                                        Most systems use the <strong>Vapor Compression Cycle</strong> (Compression → Condensation → Expansion → Evaporation).
                                                    </p>
                                                    <div className="space-y-1 text-xs outline outline-1 outline-warning/20 p-2 rounded bg-background/50">
                                                        <p><strong>Impact Metrics:</strong></p>
                                                        <p>1. <strong>GWP:</strong> Global Warming Potential.</p>
                                                        <p>2. <strong>ODP:</strong> Ozone Depletion Potential.</p>
                                                    </div>
                                                    <p className="text-xs italic text-muted-foreground">
                                                        Modern engineering focuses on GWP {'<'} 150 (like R-1234yf or CO2) to mitigate climate impact.
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

export default AppliedThermal;
