
import { useRef, useMemo, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, PerspectiveCamera, Points, PointMaterial, Line, Text, Html } from '@react-three/drei';
import * as THREE from 'three';
import { motion } from 'framer-motion-3d';

// Generate a smooth cycle path (Rankine-like loop)
const cyclePoints = (() => {
    const points = [];
    const segments = 100;
    for (let i = 0; i <= segments; i++) {
        const t = i / segments;
        const angle = t * Math.PI * 2;
        const x = Math.cos(angle) * 2;
        const y = Math.sin(angle) * (1.5 + 0.5 * Math.sin(angle * 3));
        const z = Math.sin(angle * 2) * 0.5;
        points.push(new THREE.Vector3(x, y, z));
    }
    return points;
})();

const HolographicPanel = ({ position, text, subtitle }: { position: [number, number, number], text: string, subtitle: string }) => {
    return (
        <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
            <group position={position}>
                {/* Panel Background */}
                <mesh position={[0, 0, -0.05]}>
                    <planeGeometry args={[1.5, 0.8]} />
                    <meshBasicMaterial color="#0088EE" transparent opacity={0.1} side={THREE.DoubleSide} />
                </mesh>
                <Line
                    points={[
                        [-0.75, 0.4, 0], [0.75, 0.4, 0], [0.75, -0.4, 0], [-0.75, -0.4, 0], [-0.75, 0.4, 0]
                    ]}
                    color="#0088EE"
                    lineWidth={1}
                />

                {/* Content */}
                <Text
                    position={[-0.6, 0.2, 0.01]}
                    fontSize={0.15}
                    color="#ffffff"
                    anchorX="left"
                    anchorY="top"
                    font="https://fonts.gstatic.com/s/roboto/v18/KFOmCnqEu92Fr1Mu4mxM.woff"
                >
                    {text}
                </Text>
                <Text
                    position={[-0.6, 0, 0.01]}
                    fontSize={0.1}
                    color="#0088EE"
                    anchorX="left"
                    anchorY="top"
                    font="https://fonts.gstatic.com/s/roboto/v18/KFOmCnqEu92Fr1Mu4mxM.woff"
                >
                    {subtitle}
                </Text>

                {/* Animated Bar */}
                <mesh position={[0, -0.2, 0.01]}>
                    <planeGeometry args={[1.2, 0.05]} />
                    <meshBasicMaterial color="#0088EE" transparent opacity={0.3} />
                </mesh>
                <mesh position={[-0.3, -0.2, 0.02]}>
                    <planeGeometry args={[0.6, 0.05]} />
                    <meshBasicMaterial color="white" />
                </mesh>
            </group>
        </Float>
    );
}

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
            <Line
                points={cyclePoints}
                color="#0088EE"
                lineWidth={8}
                dashed={false}
                opacity={0.2}
                transparent
                position={[0, 0, -0.1]}
            />

            {/* Interactive Nodes */}
            <mesh position={[2, 0, 0]}>
                <sphereGeometry args={[0.1, 16, 16]} />
                <meshBasicMaterial color="white" />
            </mesh>
            <mesh position={[-2, 0, 0]}>
                <sphereGeometry args={[0.1, 16, 16]} />
                <meshBasicMaterial color="white" />
            </mesh>
        </group>
    );
};

const Particles = () => {
    const ref = useRef<any>(null);
    const count = 500;

    const positions = useMemo(() => {
        const positions = new Float32Array(count * 3);
        const colors = new Float32Array(count * 3);
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
        <div className="absolute inset-0 z-0 opacity-80 pointer-events-none">
            <Canvas dpr={[1, 2]}>
                <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={50} />
                <color attach="background" args={['#0a0a0a']} />

                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={1} color="#0088EE" />
                <pointLight position={[-10, -10, -10]} intensity={0.5} color="#F75C0F" />

                <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
                    <CyclePath />
                </Float>

                {/* Holographic Panels */}
                <HolographicPanel position={[3.5, 2, 0]} text="Efficiency" subtitle="η = 68.4%" />
                <HolographicPanel position={[-3.5, -1, 0]} text="Work Output" subtitle="W = 450 kJ" />

                <Particles />

                <fog attach="fog" args={['#0a0a0a', 5, 20]} />
            </Canvas>
        </div>
    );
};

export default HeroCanvas;
