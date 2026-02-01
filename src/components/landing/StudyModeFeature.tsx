
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { GraduationCap, BookOpen, Calculator, Variable } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const StudyModeFeature = () => {
    const [isStudyMode, setIsStudyMode] = useState(false);

    return (
        <section className="py-24 bg-background relative overflow-hidden">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                    {/* Content Side */}
                    <div className="order-2 lg:order-1 space-y-8">
                        <div>
                            <Badge variant="outline" className="mb-4 border-warning/20 text-warning bg-warning/5">
                                Engineered for Education
                            </Badge>
                            <h2 className="text-3xl md:text-5xl font-bold mb-6">Not just a toy.<br />A virtual laboratory.</h2>
                            <p className="text-muted-foreground text-lg leading-relaxed">
                                Most simulators only show you <i>what</i> happens. Thermoviz Studio explains <i>why</i>.
                                Toggle "Study Mode" to reveal the mathematical skeleton behind the physical simulation.
                            </p>
                        </div>

                        <div className="space-y-6">
                            {[
                                {
                                    icon: <Variable className="w-6 h-6 text-indigo-500" />,
                                    title: "Derivations, Not Just Answers",
                                    desc: "See the step-by-step calculus derivation for every formula used in the simulation."
                                },
                                {
                                    icon: <Calculator className="w-6 h-6 text-pink-500" />,
                                    title: "Live Variable Tracking",
                                    desc: "Watch how changing input parameters (Temperature, Pressure) propagates through the equations."
                                },
                                {
                                    icon: <BookOpen className="w-6 h-6 text-teal-500" />,
                                    title: "Contextual Theory",
                                    desc: "Relevant physical laws (First Law, Bernoulli, etc.) appear exactly when you need them."
                                }
                            ].map((item, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="flex gap-4 p-4 rounded-xl hover:bg-muted/50 transition-colors border border-transparent hover:border-border"
                                >
                                    <div className="mt-1 bg-background p-2 rounded-lg shadow-sm h-fit">
                                        {item.icon}
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-foreground mb-1">{item.title}</h4>
                                        <p className="text-sm text-muted-foreground">{item.desc}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Interactive Demo Side */}
                    <div className="order-1 lg:order-2 relative">
                        {/* Control Pill */}
                        <div className="absolute -top-6 left-1/2 -translate-x-1/2 z-20 bg-background border border-border shadow-lg rounded-full px-6 py-3 flex items-center gap-4">
                            <Label htmlFor="demo-mode-toggle" className={`text-sm font-medium ${!isStudyMode ? 'text-foreground' : 'text-muted-foreground'}`}>Simulation</Label>
                            <Switch
                                id="demo-mode-toggle"
                                checked={isStudyMode}
                                onCheckedChange={setIsStudyMode}
                                className="data-[state=checked]:bg-warning"
                            />
                            <Label htmlFor="demo-mode-toggle" className={`text-sm font-medium flex items-center gap-2 ${isStudyMode ? 'text-warning' : 'text-muted-foreground'}`}>
                                <GraduationCap className="w-4 h-4" /> Study Mode
                            </Label>
                        </div>

                        {/* Screen Mockup */}
                        <div className="bg-slate-900 rounded-xl border border-slate-800 shadow-2xl overflow-hidden aspect-[4/3] relative group">
                            {/* Background Grid */}
                            <div className="absolute inset-0 bg-grid-white/[0.05]" />

                            {/* Content */}
                            <div className="absolute inset-0 p-8 flex flex-col">
                                {/* Graph Area (Always Visible) */}
                                <div className="flex-1 bg-slate-800/50 rounded-lg border border-slate-700/50 relative overflow-hidden flex items-center justify-center">
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        {/* Simple Sine Wave Animation */}
                                        <svg viewBox="0 0 100 50" className="w-full h-full opacity-50">
                                            <motion.path
                                                d="M0,25 Q25,5 50,25 T100,25"
                                                fill="none"
                                                stroke="#0088EE"
                                                strokeWidth="0.5"
                                                animate={{ d: isStudyMode ? "M0,25 Q25,45 50,25 T100,25" : "M0,25 Q25,5 50,25 T100,25" }}
                                            />
                                        </svg>
                                    </div>
                                </div>

                                {/* Study Mode Overlay */}
                                <AnimatePresence>
                                    {isStudyMode && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            className="mt-4 bg-warning/10 border border-warning/20 rounded-lg overflow-hidden"
                                        >
                                            <div className="p-4 space-y-2">
                                                <div className="flex items-center gap-2 text-warning text-xs font-bold uppercase tracking-wider">
                                                    <GraduationCap className="w-3 h-3" /> Theoretical Context
                                                </div>
                                                <div className="font-mono text-sm text-warning/90">
                                                    y(t) = A · sin(ωt + φ)
                                                </div>
                                                <p className="text-xs text-slate-400">
                                                    The amplitude (A) is directly proportional to the energy in the system. Changing inputs modifies ω (frequency).
                                                </p>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* Simulation Controls (Standard) */}
                                <AnimatePresence>
                                    {!isStudyMode && (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="mt-4 grid grid-cols-3 gap-2"
                                        >
                                            <div className="h-2 bg-slate-700 rounded-full" />
                                            <div className="h-2 bg-slate-700 rounded-full" />
                                            <div className="h-2 bg-blue-500 rounded-full" />
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>

                        {/* Glow effect */}
                        <div className={`absolute -inset-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-2xl rounded-xl -z-10 transition-opacity duration-500 ${isStudyMode ? 'opacity-20' : 'opacity-40'}`} />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default StudyModeFeature;
