import { useState, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, ContactShadows, Edges, Text } from "@react-three/drei";
import ScrollReveal from "../ScrollReveal";
import * as THREE from "three";

// A single piece of the exploded building
const BuildingLayer = ({ yOffset, targetY, color, label, children, delay }) => {
    const groupRef = useRef();

    useFrame((state, delta) => {
        if (!groupRef.current) return;
        // Smoothly interpolate current Y to target Y using lerp
        // Add a slight delay staggering effect based on the layer index
        groupRef.current.position.y = THREE.MathUtils.lerp(
            groupRef.current.position.y,
            targetY,
            0.1 * delta * 60
        );
    });

    return (
        <group ref={groupRef} position={[0, 0, 0]}>
            {children}
            {/* Display label pointing to the layer when exploded */}
            <Text
                position={[3, 0.5, 0]}
                fontSize={0.25}
                color={color}
                anchorX="left"
                anchorY="middle"
                font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeA.woff"
                fillOpacity={targetY > 0.5 ? Math.min((targetY - 0.5) * 2, 1) : 0}
            >
                {label}
            </Text>
            {/* Leading line linking text to model */}
            <mesh position={[2, 0.5, 0]} scale={[1.8, 0.02, 0.02]} visible={targetY > 0.5}>
                <boxGeometry />
                <meshBasicMaterial color={color} transparent opacity={Math.min((targetY - 0.5) * 2, 1)} />
            </mesh>
        </group>
    );
};

export default function ExplodedAxonometric() {
    const [explosionFactor, setExplosionFactor] = useState(0);

    return (
        <div className="section-gap">
            <ScrollReveal className="content-card">
                <div style={{ textAlign: "center" }}>
                    <h3 style={{ color: "#5c4033", marginBottom: "0.5rem" }}>The Exploded Axonometric</h3>
                    <p style={{ color: "#8b7355", fontSize: "0.95rem", marginBottom: "1.5rem" }}>
                        Drag the slider to peel back the layers of complexity. An exploded axo is the ultimate tool for narrating how a building's systems relate vertically.
                    </p>

                    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
                        <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "#8b7355" }}>Assembled</span>
                        <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.01"
                            value={explosionFactor}
                            onChange={(e) => setExplosionFactor(parseFloat(e.target.value))}
                            style={{ width: "200px" }}
                        />
                        <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "#8b7355" }}>Exploded</span>
                    </div>

                    <div style={{
                        height: "500px", border: "2px solid #d9c4a5", borderRadius: "8px", overflow: "hidden", background: "#fdfbf7", position: "relative"
                    }}>
                        <Canvas camera={{ position: [8, 8, 8], fov: 35 }}>
                            <ambientLight intensity={0.5} />
                            <directionalLight position={[10, 20, 10]} intensity={1.2} castShadow />

                            {/* Layer 0: Site & Foundation (Does not move) */}
                            <BuildingLayer targetY={0} color="#756557" label="1. Topography & Foundation">
                                <mesh position={[0, -0.25, 0]} receiveShadow>
                                    <boxGeometry args={[6, 0.5, 6]} />
                                    <meshStandardMaterial color="#c2b2a1" roughness={0.9} />
                                    <Edges color="#756557" />
                                </mesh>
                                {/* Foundation footings */}
                                <mesh position={[-1.5, 0.1, -1.5]}><boxGeometry args={[0.4, 0.2, 0.4]} /><meshStandardMaterial color="#888" /></mesh>
                                <mesh position={[1.5, 0.1, -1.5]}><boxGeometry args={[0.4, 0.2, 0.4]} /><meshStandardMaterial color="#888" /></mesh>
                                <mesh position={[-1.5, 0.1, 1.5]}><boxGeometry args={[0.4, 0.2, 0.4]} /><meshStandardMaterial color="#888" /></mesh>
                                <mesh position={[1.5, 0.1, 1.5]}><boxGeometry args={[0.4, 0.2, 0.4]} /><meshStandardMaterial color="#888" /></mesh>
                            </BuildingLayer>

                            {/* Layer 1: Structure */}
                            <BuildingLayer targetY={explosionFactor * 2} color="#000" label="2. Structural Frame">
                                {/* Columns */}
                                <mesh position={[-1.5, 1, -1.5]}><boxGeometry args={[0.2, 2, 0.2]} /><meshStandardMaterial color="#333" /><Edges color="#000" /></mesh>
                                <mesh position={[1.5, 1, -1.5]}><boxGeometry args={[0.2, 2, 0.2]} /><meshStandardMaterial color="#333" /><Edges color="#000" /></mesh>
                                <mesh position={[-1.5, 1, 1.5]}><boxGeometry args={[0.2, 2, 0.2]} /><meshStandardMaterial color="#333" /><Edges color="#000" /></mesh>
                                <mesh position={[1.5, 1, 1.5]}><boxGeometry args={[0.2, 2, 0.2]} /><meshStandardMaterial color="#333" /><Edges color="#000" /></mesh>
                                {/* Beams */}
                                <mesh position={[0, 2.1, -1.5]}><boxGeometry args={[3.2, 0.2, 0.2]} /><meshStandardMaterial color="#333" /><Edges color="#000" /></mesh>
                                <mesh position={[0, 2.1, 1.5]}><boxGeometry args={[3.2, 0.2, 0.2]} /><meshStandardMaterial color="#333" /><Edges color="#000" /></mesh>
                                <mesh position={[-1.5, 2.1, 0]}><boxGeometry args={[0.2, 0.2, 3.2]} /><meshStandardMaterial color="#333" /><Edges color="#000" /></mesh>
                                <mesh position={[1.5, 2.1, 0]}><boxGeometry args={[0.2, 0.2, 3.2]} /><meshStandardMaterial color="#333" /><Edges color="#000" /></mesh>
                            </BuildingLayer>

                            {/* Layer 2: Core & Walls */}
                            <BuildingLayer targetY={explosionFactor * 4.5} color="#0066cc" label="3. Envelope & Core">
                                {/* Core wall */}
                                <mesh position={[0, 1, 0.5]}>
                                    <boxGeometry args={[1.5, 2, 0.2]} />
                                    <meshStandardMaterial color="#e0e0e0" roughness={0.5} />
                                    <Edges color="#aaa" />
                                </mesh>
                                {/* Glass Façade (Front) */}
                                <mesh position={[0, 1, -1.5]} transparent opacity={0.4}>
                                    <boxGeometry args={[2.8, 1.8, 0.05]} />
                                    <meshPhysicalMaterial color="#aaddff" transmission={0.9} roughness={0.1} />
                                    <Edges color="#0066cc" />
                                </mesh>
                            </BuildingLayer>

                            {/* Layer 3: Tech / HVAC */}
                            <BuildingLayer targetY={explosionFactor * 7} color="#cc0000" label="4. Mechanical Systems">
                                {/* HVAC Ducts */}
                                <mesh position={[0, 2.4, 0]}>
                                    <cylinderGeometry args={[0.1, 0.1, 2.5, 8]} />
                                    <meshStandardMaterial color="#silver" metalness={0.8} roughness={0.3} />
                                    <Edges color="#cc0000" />
                                </mesh>
                                <mesh position={[0, 2.4, -1.2]} rotation={[Math.PI / 2, 0, 0]}>
                                    <cylinderGeometry args={[0.1, 0.1, 0.5, 8]} />
                                    <meshStandardMaterial color="#silver" metalness={0.8} roughness={0.3} />
                                </mesh>
                            </BuildingLayer>

                            {/* Layer 4: Roof */}
                            <BuildingLayer targetY={explosionFactor * 9} color="#8b7355" label="5. Roof Assembly">
                                <mesh position={[0, 2.7, 0]} castShadow>
                                    <boxGeometry args={[4, 0.2, 4]} />
                                    <meshStandardMaterial color="#4a3b2c" roughness={0.9} />
                                    <Edges color="#221100" />
                                </mesh>
                            </BuildingLayer>

                            {/* Guidelines showing the vertical connection */}
                            <mesh position={[-1.5, explosionFactor * 4.5, -1.5]} visible={explosionFactor > 0.1}>
                                <cylinderGeometry args={[0.01, 0.01, explosionFactor * 9, 4]} />
                                <meshBasicMaterial color="#ccc" transparent opacity={0.5} />
                            </mesh>
                            <mesh position={[1.5, explosionFactor * 4.5, 1.5]} visible={explosionFactor > 0.1}>
                                <cylinderGeometry args={[0.01, 0.01, explosionFactor * 9, 4]} />
                                <meshBasicMaterial color="#ccc" transparent opacity={0.5} />
                            </mesh>

                            <OrbitControls makeDefault minPolarAngle={0} maxPolarAngle={Math.PI / 2 - 0.1} autoRotate={explosionFactor === 0} autoRotateSpeed={0.5} />
                            <ContactShadows position={[0, -0.49, 0]} opacity={0.3} scale={15} blur={2} />
                        </Canvas>
                    </div>
                </div>
            </ScrollReveal>
        </div>
    );
}
