
import { useRef, useMemo, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Text, Instance, Instances, Environment, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import { motion } from 'framer-motion-3d';

// --- ATOM COMPONENT ---
const Atom = ({ position, scale = 1, color = "#0088EE" }: { position: [number, number, number], scale?: number, color?: string }) => {
    const groupRef = useRef<THREE.Group>(null);

    useFrame((state) => {
        if (groupRef.current) {
            groupRef.current.rotation.y += 0.01;
            groupRef.current.rotation.z += 0.005;
        }
    });

    return (
        <group ref={groupRef} position={position} scale={scale}>
            {/* Nucleus */}
            <mesh>
                <sphereGeometry args={[0.2, 16, 16]} />
                <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} />
            </mesh>

            {/* Electron Orbits */}
            <group rotation={[Math.PI / 3, 0, 0]}>
                <mesh>
                    <torusGeometry args={[0.8, 0.02, 16, 32]} />
                    <meshBasicMaterial color={color} transparent opacity={0.3} />
                </mesh>
                <mesh position={[0.8, 0, 0]}>
                    <sphereGeometry args={[0.08, 8, 8]} />
                    <meshBasicMaterial color="white" />
                </mesh>
            </group>

            <group rotation={[-Math.PI / 3, 0, 0]}>
                <mesh>
                    <torusGeometry args={[0.8, 0.02, 16, 32]} />
                    <meshBasicMaterial color={color} transparent opacity={0.3} />
                </mesh>
                <mesh position={[-0.8, 0, 0]}>
                    <sphereGeometry args={[0.08, 8, 8]} />
                    <meshBasicMaterial color="white" />
                </mesh>
            </group>
        </group>
    );
};

// --- MATH SYMBOLS ---
const MathSymbols = () => {
    const symbols = ['Σ', 'π', '∫', 'λ', 'θ', 'Δ', 'Ω', 'μ'];

    return (
        <group>
            {symbols.map((sym, i) => (
                <Float key={i} speed={1 + Math.random()} rotationIntensity={1} floatIntensity={1}>
                    <Text
                        position={[
                            (Math.random() - 0.5) * 15,
                            (Math.random() - 0.5) * 10,
                            (Math.random() - 0.5) * 5 - 2
                        ]}
                        fontSize={0.5 + Math.random() * 0.5}
                        color="white"
                        fillOpacity={0.1}
                        font="https://fonts.gstatic.com/s/roboto/v18/KFOmCnqEu92Fr1Mu4mxM.woff" // Standard font
                    >
                        {sym}
                    </Text>
                </Float>
            ))}
        </group>
    );
};

// --- GRID FLOOR ---
const DynamicGrid = () => {
    return (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -4, 0]}>
            <planeGeometry args={[50, 50, 50, 50]} />
            <meshBasicMaterial
                color="#0088EE"
                wireframe
                transparent
                opacity={0.05}
            />
        </mesh>
    );
}

const ScienceBackground = () => {
    return (
        <div className="fixed inset-0 -z-10 bg-background">
            <Canvas dpr={[1, 1.5]}>
                <PerspectiveCamera makeDefault position={[0, 0, 10]} fov={50} />

                <ambientLight intensity={0.2} />
                <pointLight position={[10, 10, 10]} intensity={0.5} />

                <Float speed={0.5} rotationIntensity={0.2} floatIntensity={0.5}>
                    <Atom position={[-3, 2, -2]} scale={1.2} color="#0088EE" />
                    <Atom position={[4, -1, -3]} scale={0.8} color="#F75C0F" />
                    <Atom position={[-2, -3, -1]} scale={0.5} color="#8E44AD" />
                </Float>

                <MathSymbols />
                <DynamicGrid />

                <fog attach="fog" args={['#0a0a0a', 5, 25]} />
            </Canvas>
        </div>
    );
};

export default ScienceBackground;
