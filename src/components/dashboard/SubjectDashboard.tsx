import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Flame,
    Droplets,
    Settings,
    Zap,
    Infinity,
    ChevronRight,
    Thermometer,
    Wind,
    Layers,
    Activity
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Subject {
    id: string;
    title: string;
    description: string;
    icon: React.ReactNode;
    color: string;
    modules: string[];
    route: string;
    status: 'active' | 'coming-soon';
}

const SUBJECTS: Subject[] = [
    {
        id: 'thermodynamics',
        title: 'Thermodynamics',
        description: 'Fundamental principles of heat, work, and energy conversion cycles.',
        icon: <Flame className="w-8 h-8" />,
        color: 'from-orange-500/20 to-red-500/20',
        modules: ['Cycles', 'Laws', 'State Variables'],
        route: '/thermodynamics',
        status: 'active'
    },
    {
        id: 'heat-transfer',
        title: 'Heat Transfer',
        description: 'Mechanisms of thermal energy transport through conduction, convection, and radiation.',
        icon: <Thermometer className="w-8 h-8" />,
        color: 'from-red-500/20 to-pink-500/20',
        modules: ['Conduction', 'Cooling Curves', 'Radiation'],
        route: '/heat-transfer',
        status: 'active'
    },

    {
        id: 'fluid-mechanics',
        title: 'Fluid Mechanics',
        description: 'Behavior of fluids at rest and in motion, including pipe flow and buoyancy.',
        icon: <Droplets className="w-8 h-8" />,
        color: 'from-blue-500/20 to-cyan-500/20',
        modules: ['Bernoulli', 'Pipe Flow', 'Continuity'],
        route: '/fluid-mechanics',
        status: 'active'
    },

    {
        id: 'mechanics',
        title: 'Engineering Mechanics',
        description: 'Analysis of forces, motion, and equilibrium in physical systems.',
        icon: <Settings className="w-8 h-8" />,
        color: 'from-indigo-500/20 to-blue-500/20',
        modules: ['Friction', 'Forces', 'Kinematics'],
        route: '/mechanics',
        status: 'active'
    },

    {
        id: 'thermal-applied',
        title: 'Thermal Engineering',
        description: 'Applied thermodynamics in engines, refrigerators, and power plants.',
        icon: <Zap className="w-8 h-8" />,
        color: 'from-yellow-500/20 to-orange-500/20',
        modules: ['IC Engines', 'COP', 'Power Plants'],
        route: '/thermal-applied',
        status: 'active'
    },

    {
        id: 'renewables',
        title: 'Renewable Energy',
        description: 'Sustainable energy systems including solar, wind, and geothermal power.',
        icon: <Wind className="w-8 h-8" />,
        color: 'from-green-500/20 to-emerald-500/20',
        modules: ['Solar PV', 'Wind Turbines', 'Sustainability'],
        route: '/renewables',
        status: 'active'
    },

    {
        id: 'math-viz',
        title: 'Eng. Mathematics',
        description: 'Visualizing core mathematical concepts used across engineering disciplines.',
        icon: <Activity className="w-8 h-8" />,
        color: 'from-purple-500/20 to-violet-500/20',
        modules: ['Differentiation', 'Integration', 'Error Analysis'],
        route: '/math',
        status: 'active'
    }

];

export const SubjectDashboard = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-transparent p-8 relative z-10">
            <div className="max-w-7xl mx-auto space-y-12">
                {/* Header */}
                <div className="text-left space-y-4">
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl font-extrabold tracking-tight bg-gradient-to-r from-primary via-blue-500 to-purple-600 bg-clip-text text-transparent drop-shadow-sm"
                    >
                        Engineering Concepts Simulator
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-xl text-muted-foreground/80 max-w-3xl"
                    >
                        Select a subject to explore interactive simulations and master fundamental engineering principles.
                    </motion.p>
                </div>

                {/* Subjects Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {SUBJECTS.map((subject, index) => (
                        <motion.div
                            key={subject.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.05 }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.98 }}
                            className="cursor-pointer group"
                            onClick={() => subject.status === 'active' && navigate(subject.route)}
                        >
                            <Card className="h-full border border-white/20 overflow-hidden relative bg-white/5 backdrop-blur-2xl hover:bg-white/10 transition-all duration-500 shadow-[0_8px_32px_rgba(0,0,0,0.4)] hover:shadow-primary/30 group-hover:-translate-y-1">
                                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
                                    {subject.icon}
                                </div>

                                <CardHeader>
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="p-3 rounded-xl bg-background/50 shadow-sm border border-border/50">
                                            {subject.icon}
                                        </div>
                                        {subject.status === 'coming-soon' && (
                                            <Badge variant="secondary" className="bg-muted text-muted-foreground border-none">
                                                Coming Soon
                                            </Badge>
                                        )}
                                    </div>
                                    <CardTitle className="text-2xl font-bold">{subject.title}</CardTitle>
                                </CardHeader>

                                <CardContent className="space-y-6">
                                    <CardDescription className="text-base leading-relaxed text-foreground/80">
                                        {subject.description}
                                    </CardDescription>

                                    <div className="space-y-3">
                                        <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Key Modules</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {subject.modules.map((module) => (
                                                <span
                                                    key={module}
                                                    className="px-3 py-1 rounded-full bg-background/40 border border-border/50 text-xs font-medium backdrop-blur-sm"
                                                >
                                                    {module}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="pt-4 flex items-center text-primary font-semibold text-sm">
                                        {subject.status === 'active' ? (
                                            <span className="flex items-center">
                                                Explore Modules <ChevronRight className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                            </span>
                                        ) : (
                                            <span className="text-muted-foreground opacity-50">In Development</span>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>

                {/* Footer Stats/Info */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="pt-12 border-t border-border/50 grid grid-cols-1 md:grid-cols-3 gap-8 text-center"
                >
                    <div className="space-y-2">
                        <h3 className="text-3xl font-bold text-primary">Simulation First</h3>
                        <p className="text-muted-foreground">Interactive learning before theory</p>
                    </div>
                    <div className="space-y-2">
                        <h3 className="text-3xl font-bold text-primary">Educational Mode</h3>
                        <p className="text-muted-foreground">Toggleable study guides for all topics</p>
                    </div>
                    <div className="space-y-2">
                        <h3 className="text-3xl font-bold text-primary">Web-Based</h3>
                        <p className="text-muted-foreground">Accessible anywhere, no install required</p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};
