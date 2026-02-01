
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Point {
    x: number;
    y: number;
    id: number;
}

const CursorEffect = () => {
    const [points, setPoints] = useState<Point[]>([]);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setMousePos({ x: e.clientX, y: e.clientY });

            const newPoint = {
                x: e.clientX,
                y: e.clientY,
                id: Date.now()
            };

            setPoints(prev => [...prev.slice(-15), newPoint]);
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    // Cleanup old points
    useEffect(() => {
        const interval = setInterval(() => {
            setPoints(prev => prev.slice(1));
        }, 50);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
            {/* Main Cursor Glow */}
            <motion.div
                className="absolute w-8 h-8 rounded-full bg-primary/20 blur-md -translate-x-1/2 -translate-y-1/2 border border-primary/50"
                animate={{ x: mousePos.x, y: mousePos.y }}
                transition={{ type: "spring", damping: 30, stiffness: 200, mass: 0.1 }}
            />

            <AnimatePresence>
                {points.map((point, index) => (
                    <motion.div
                        key={point.id}
                        initial={{ opacity: 0.5, scale: 1 }}
                        animate={{ opacity: 0, scale: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        className="absolute w-2 h-2 rounded-full bg-cyan-400 blur-[1px]"
                        style={{
                            left: point.x,
                            top: point.y,
                            transform: 'translate(-50%, -50%)'
                        }}
                    />
                ))}
            </AnimatePresence>
        </div>
    );
};

export default CursorEffect;
