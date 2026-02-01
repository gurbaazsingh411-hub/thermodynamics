
import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, PerspectiveCamera, Points, PointMaterial, Line } from '@react-three/drei';
import * as THREE from 'three';
import { motion } from 'framer-motion-3d';

// Generate a smooth cycle path (Rankine-like loop)
const cyclePoints = (() => {
    const points = [];
    const segments = 100;
    for (let i = 0; i <= segments; i++) {
        const t = i / segments;
        // Parametric equation for a rounded rectangular-ish cycle
        const angle = t * Math.PI * 2;
        // Deforming a circle to look more like a thermodynamic cycle
        const x = Math.cos(angle) * 2;
        const y = Math.sin(angle) * (1.5 + 0.5 * Math.sin(angle * 3));
        const z = Math.sin(angle * 2) * 0.5; // Slight 3D twist
        points.push(new THREE.Vector3(x, y, z));
    }
    return points;
})();

const CyclePath = () => {
    const lineRef = useRef<any>(null);

    useFrame((state) => {
        if (lineRef.current) {
            lineRef.current.rotation.y += 0.005;
        }
    });

    return (
        <group>
            <Line
                ref={lineRef}
                points={cyclePoints}
                color="#0088EE"
                lineWidth={3}
                dashed={false}
                opacity={0.8}
                transparent
            />
            {/* Glow effect duplicate */}
            <Line
                points={cyclePoints}
                color="#0088EE"
                lineWidth={8}
                dashed={false}
                opacity={0.2}
                transparent
                position={[0, 0, -0.1]}
            />
        </group>
    );
};

const Particles = () => {
    const ref = useRef<any>(null);
    const count = 500;

    const positions = useMemo(() => {
        const positions = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 15;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 15;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
        }
        return positions;
    }, []);

    useFrame((state) => {
        if (ref.current) {
            ref.current.rotation.x += 0.0005;
            ref.current.rotation.y += 0.0005;
        }
    });

    return (
        <group rotation={[0, 0, Math.PI / 4]}>
            <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
                <PointMaterial
                    transparent
                    color="#88CCFF"
                    size={0.05}
                    sizeAttenuation={true}
                    depthWrite={false}
                    opacity={0.4}
                />
            </Points>
        </group>
    );
};

const HeroCanvas = () => {
    return (
        <div className="absolute inset-0 z-0 opacity-60">
            <Canvas dpr={[1, 2]}>
                <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={50} />
                <color attach="background" args={['#0a0a0a']} />

                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={1} color="#0088EE" />
                <pointLight position={[-10, -10, -10]} intensity={0.5} color="#F75C0F" />

                <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
                    <CyclePath />
                </Float>

                <Particles />

                {/* Fog for depth */}
                <fog attach="fog" args={['#0a0a0a', 5, 20]} />
            </Canvas>
        </div>
    );
};

export default HeroCanvas;
