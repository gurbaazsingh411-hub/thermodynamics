
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Cpu, Globe, Database, Code, Zap } from 'lucide-react';

const TechStackSection = () => {
    return (
        <section className="py-24 bg-muted/10 border-t border-border/50">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold mb-6">Built for Performance</h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        A modern engineering stack designed for accurate, lag-free simulations directly in your browser.
                    </p>
                </div>

                {/* Architecture Flow */}
                <div className="max-w-5xl mx-auto mb-20 relative">
                    <div className="absolute top-1/2 left-0 w-full h-1 bg-gradient-to-r from-transparent via-border to-transparent -translate-y-1/2 hidden md:block" />

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
                        {/* Step 1 */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="bg-background border border-border p-6 rounded-xl text-center shadow-lg relative group"
                        >
                            <div className="w-12 h-12 bg-blue-500/10 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                                <Code className="w-6 h-6" />
                            </div>
                            <h3 className="font-bold text-lg mb-2">React + TS</h3>
                            <p className="text-sm text-muted-foreground">Type-safe component architecture for robust state management.</p>
                        </motion.div>

                        {/* Step 2 */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="bg-background border border-border p-6 rounded-xl text-center shadow-lg relative group"
                        >
                            <div className="w-12 h-12 bg-purple-500/10 text-purple-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                                <Cpu className="w-6 h-6" />
                            </div>
                            <h3 className="font-bold text-lg mb-2">Math Engine</h3>
                            <p className="text-sm text-muted-foreground">Symbolic processing with Nerdamer & complex number support.</p>

                            {/* Pulse Effect representing processing */}
                            <div className="absolute -inset-1 border border-purple-500/30 rounded-xl opacity-0 group-hover:opacity-100 animate-ping duration-1000 -z-10" />
                        </motion.div>

                        {/* Step 3 */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.4 }}
                            className="bg-background border border-border p-6 rounded-xl text-center shadow-lg relative group"
                        >
                            <div className="w-12 h-12 bg-orange-500/10 text-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                                <Globe className="w-6 h-6" />
                            </div>
                            <h3 className="font-bold text-lg mb-2">WebGL Render</h3>
                            <p className="text-sm text-muted-foreground">Hardware-accelerated graphics using Three.js & Fiber.</p>
                        </motion.div>
                    </div>
                </div>

                {/* Badges Grid */}
                <div className="flex flex-wrap justify-center gap-4 max-w-3xl mx-auto">
                    {["React 18", "TypeScript", "Vite", "Three.js", "Framer Motion", "Recharts", "Supabase", "Tailwind"].map((tech, i) => (
                        <Badge key={i} variant="secondary" className="px-4 py-2 text-sm bg-muted/50 hover:bg-muted transition-colors">
                            {tech}
                        </Badge>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TechStackSection;
