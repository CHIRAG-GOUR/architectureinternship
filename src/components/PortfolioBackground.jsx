import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Float, Decal } from '@react-three/drei';
import * as THREE from 'three';

function PortfolioBoard({ position, rotation, scale, color }) {
    const meshRef = useRef();

    // Slow drift
    useFrame((state) => {
        meshRef.current.position.y += Math.sin(state.clock.elapsedTime * 0.5 + position[0]) * 0.002;
        meshRef.current.rotation.x += 0.001;
        meshRef.current.rotation.y += 0.0005;
    });

    return (
        <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
            <mesh ref={meshRef} position={position} rotation={rotation} scale={scale} castShadow receiveShadow>
                {/* Thin presentation board */}
                <boxGeometry args={[3, 4, 0.05]} />
                <meshStandardMaterial color={color} roughness={0.2} envMapIntensity={0.5} />
            </mesh>
        </Float>
    );
}

const BackgroundScene = () => {
    // Generate scattered boards
    const boards = useMemo(() => {
        return Array.from({ length: 15 }).map(() => ({
            position: [
                (Math.random() - 0.5) * 20,
                (Math.random() - 0.5) * 15,
                (Math.random() - 0.5) * 10 - 5
            ],
            rotation: [
                Math.random() * Math.PI,
                Math.random() * Math.PI,
                Math.random() * Math.PI
            ],
            scale: 0.5 + Math.random() * 1.5,
            color: new THREE.Color().setHSL(Math.random() * 0.1 + 0.05, 0.3, 0.8) // warm parchment/grey tones
        }));
    }, []);

    return (
        <>
            <ambientLight intensity={0.6} />
            <directionalLight position={[10, 10, 10]} intensity={1} castShadow />
            <directionalLight position={[-10, -10, -5]} intensity={0.5} color="#d4c3b3" />
            <Environment preset="studio" />

            <group position={[0, 0, -15]}>
                {boards.map((b, i) => (
                    <PortfolioBoard key={i} {...b} />
                ))}
            </group>

            {/* Fog to fade out deep boards */}
            <fog attach="fog" args={['#1a1a1a', 10, 30]} />
        </>
    );
};

export default function PortfolioBackground() {
    return (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100vh', zIndex: -1, background: '#1a1a1a' }}>
            <Canvas camera={{ position: [0, 0, 5], fov: 60 }} shadows dpr={[1, 2]}>
                <BackgroundScene />
            </Canvas>
        </div>
    );
}
