import { useState, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { Edges, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import ScrollReveal from "../ScrollReveal";

function ExtrudableRoom({ position, size, color, label, onExtrude, height }) {
    const [hovered, setHovered] = useState(false);
    // Base height if not extruded
    const currentHeight = height || 0.1;

    return (
        <group position={position}>
            <mesh
                position={[0, currentHeight / 2, 0]}
                onPointerOver={(e) => { e.stopPropagation(); setHovered(true); }}
                onPointerOut={(e) => { e.stopPropagation(); setHovered(false); }}
                onClick={(e) => { e.stopPropagation(); onExtrude(); }}
            >
                <boxGeometry args={[size[0], currentHeight, size[1]]} />
                <meshStandardMaterial
                    color={color}
                    roughness={0.7}
                    emissive={hovered ? color : "#000000"}
                    emissiveIntensity={hovered ? 0.3 : 0}
                    transparent
                    opacity={height > 0.1 ? 0.9 : 0.6} // More solid when extruded
                />
                <Edges scale={1.01} color="#3e2a21" />
            </mesh>
            {/* Label only visible when flat */}
            {height === 0.1 && (
                <mesh position={[0, 0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                    <planeGeometry args={[size[0] * 0.8, size[1] * 0.8]} />
                    <meshBasicMaterial color="#ffffff" transparent opacity={0.3} />
                </mesh>
            )}
        </group>
    );
}

export default function IsometricExtruder() {
    const [roomHeights, setRoomHeights] = useState([0.1, 0.1, 0.1]);

    const handleExtrude = (index, targetHeight) => {
        const newHeights = [...roomHeights];
        // Toggle between flat (0.1) and targetHeight
        newHeights[index] = newHeights[index] > 0.1 ? 0.1 : targetHeight;
        setRoomHeights(newHeights);
    };

    const isComplete = roomHeights.every(h => h > 0.1);

    return (
        <div className="section-gap">
            <ScrollReveal className="content-card">
                <div style={{ textAlign: "center" }}>
                    <h3 style={{ color: "#5c4033", marginBottom: "0.5rem" }}>Isometric Extruder</h3>
                    <p style={{ color: "#8b7355", fontSize: "0.95rem", marginBottom: "1.5rem" }}>
                        Click on the floor plan zones to extrude them upward into a <strong>Plan Oblique</strong> 3D model.
                        Notice how the floor plan retains its true shape even in 3D!
                    </p>

                    <div
                        style={{
                            height: "400px",
                            border: "2px solid #d9c4a5",
                            borderRadius: "8px",
                            overflow: "hidden",
                            background: "#dfd6c8",
                            position: "relative"
                        }}
                    >
                        <Canvas orthographic camera={{ position: [10, 10, 10], zoom: 60, near: -100, far: 500 }}>
                            <ambientLight intensity={0.7} />
                            <directionalLight position={[10, 20, 10]} intensity={1.5} />

                            {/* Grid Floor */}
                            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]}>
                                <planeGeometry args={[20, 20]} />
                                <meshBasicMaterial color="#d9cbb9" />
                                <gridHelper args={[20, 20, "#c9a96e", "#e8dfd5"]} rotation={[Math.PI / 2, 0, 0]} />
                            </mesh>

                            <group position={[0, 0, 0]}>
                                {/* Main Living Area */}
                                <ExtrudableRoom
                                    position={[-1, 0, 1]}
                                    size={[4, 3]}
                                    color="#85ABAB"
                                    height={roomHeights[0]}
                                    onExtrude={() => handleExtrude(0, 3)}
                                />
                                {/* Bedroom Wing */}
                                <ExtrudableRoom
                                    position={[2.5, 0, -1]}
                                    size={[3, 5]}
                                    color="#e0a96d"
                                    height={roomHeights[1]}
                                    onExtrude={() => handleExtrude(1, 2)}
                                />
                                {/* Entry/Garage */}
                                <ExtrudableRoom
                                    position={[-2, 0, -2]}
                                    size={[2, 3]}
                                    color="#c97a7e"
                                    height={roomHeights[2]}
                                    onExtrude={() => handleExtrude(2, 1.5)}
                                />
                            </group>

                            {/* Lock rotation to keep it isometric/axonometric feeling */}
                            <OrbitControls
                                enableZoom={true}
                                enablePan={false}
                                minPolarAngle={Math.PI / 6}
                                maxPolarAngle={Math.PI / 3}
                            />
                        </Canvas>

                        {isComplete && (
                            <div style={{
                                position: "absolute", bottom: "1rem", left: "50%", transform: "translateX(-50%)",
                                background: "#2e7d32", color: "white", padding: "0.75rem 1.5rem", borderRadius: "20px",
                                fontWeight: 600, fontSize: "0.9rem", boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                                pointerEvents: "none", animation: "popIn 0.3s ease-out"
                            }}>
                            </div>
                        )}
                    </div>
                </div>
            </ScrollReveal>
        </div>
    );
}
