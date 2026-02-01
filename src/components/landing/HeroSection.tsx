
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { ArrowRight, PlayCircle, Activity } from 'lucide-react';
import HeroCanvas from './3d/HeroCanvas';

const HeroSection = () => {
    return (
        <section className="relative w-full h-screen overflow-hidden flex flex-col items-center justify-center bg-background">
            {/* Background 3D Scene */}
            <HeroCanvas />

            {/* Content Overlay */}
            <div className="relative z-10 container mx-auto px-4 flex flex-col items-center text-center">

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="mb-6 flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-md"
                >
                    <Activity className="w-4 h-4 text-primary animate-pulse" />
                    <span className="text-sm font-medium text-primary">v2.0 Now Live: Enhanced Study Mode</span>
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                    className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6 text-white"
                >
                    Visualize <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-cyan-400 to-primary/80">Thermodynamics</span>.
                    <br />
                    Understand Engineering.
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
                    className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-10 leading-relaxed"
                >
                    Stop memorizing formulas. Start seeing the physics.
                    Interactive simulations of cycles, flows, forces, and energy — built for deep engineering understanding.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
                    className="flex flex-col sm:flex-row gap-4 w-full justify-center"
                >
                    <Link to="/dashboard">
                        <Button size="lg" className="h-14 px-8 text-lg rounded-full shadow-[0_0_20px_rgba(0,136,238,0.3)] hover:shadow-[0_0_30px_rgba(0,136,238,0.5)] transition-all">
                            Launch Simulator <ArrowRight className="ml-2 w-5 h-5" />
                        </Button>
                    </Link>
                    <Link to="/demo">
                        <Button variant="outline" size="lg" className="h-14 px-8 text-lg rounded-full bg-background/20 backdrop-blur-sm border-white/10 hover:bg-white/10">
                            Watch Demo <PlayCircle className="ml-2 w-5 h-5" />
                        </Button>
                    </Link>
                </motion.div>

            </div>

            {/* Scroll Indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5, duration: 1 }}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted-foreground/50"
            >
                <span className="text-xs uppercase tracking-widest">Explore</span>
                <div className="w-[1px] h-12 bg-gradient-to-b from-transparent via-muted-foreground/50 to-transparent" />
            </motion.div>
        </section>
    );
};

export default HeroSection;
