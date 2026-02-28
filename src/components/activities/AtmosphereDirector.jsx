import { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, ContactShadows, Environment, Sky } from "@react-three/drei";
import ScrollReveal from "../ScrollReveal";

// A simple abstract proxy for a "scale figure" (person)
const ScaleFigure = ({ position }) => (
    <group position={position}>
        {/* Body */}
        <mesh position={[0, 0.8, 0]} castShadow>
            <cylinderGeometry args={[0.2, 0.2, 1.6, 8]} />
            <meshStandardMaterial color="#444" roughness={0.8} />
        </mesh>
        {/* Head */}
        <mesh position={[0, 1.75, 0]} castShadow>
            <sphereGeometry args={[0.15, 16, 16]} />
            <meshStandardMaterial color="#cca" roughness={0.6} />
        </mesh>
    </group>
);

export default function AtmosphereDirector() {
    const [timeOfDay, setTimeOfDay] = useState("Sunset"); // Morning, Noon, Sunset, Night
    const [showFigures, setShowFigures] = useState(true);
    const [materialPhase, setMaterialPhase] = useState("Clay"); // Clay, Realistic

    // Lighting configs
    const configs = {
        Morning: { sunPos: [10, 5, -10], lightColor: "#ffeec2", intensity: 1.2, ambient: 0.4, skyConfig: { turbidity: 1, rayleigh: 0.5, mieCoefficient: 0.005, mieDirectionalG: 0.8, elevation: 15, azimuth: 180 } },
        Noon: { sunPos: [0, 20, 0], lightColor: "#ffffff", intensity: 1.5, ambient: 0.7, skyConfig: { turbidity: 0.3, rayleigh: 0.1, mieCoefficient: 0.005, mieDirectionalG: 0.8, elevation: 85, azimuth: 180 } },
        Sunset: { sunPos: [-15, 2, 8], lightColor: "#ffaa66", intensity: 1.8, ambient: 0.3, skyConfig: { turbidity: 10, rayleigh: 3, mieCoefficient: 0.005, mieDirectionalG: 0.8, elevation: 5, azimuth: 180 } },
        Night: { sunPos: [-5, 10, -5], lightColor: "#88bbff", intensity: 0.3, ambient: 0.1, skyConfig: { turbidity: 0.1, rayleigh: 0.1, mieCoefficient: 0, mieDirectionalG: 0, elevation: -5, azimuth: 180 } }
    };

    const currentConfig = configs[timeOfDay];

    // Materials
    const wallColor = materialPhase === "Clay" ? "#e0e0e0" : "#d1cdc2"; // Concrete
    const wallRoughness = materialPhase === "Clay" ? 0.9 : 0.7;
    const floorColor = materialPhase === "Clay" ? "#e0e0e0" : "#8c7e6c"; // Wood flooring proxy
    const glassProps = materialPhase === "Clay" ?
        { color: "#e0e0e0", transmission: 0, opacity: 1 } :
        { color: "#aaddff", transmission: 0.9, opacity: 1, transparent: true, roughness: 0.1, ior: 1.5 };

    return (
        <div className="section-gap">
            <ScrollReveal className="content-card">
                <div style={{ textAlign: "center" }}>
                    <h3 style={{ color: "#5c4033", marginBottom: "0.5rem" }}>Atmosphere & Scale Director</h3>
                    <p style={{ color: "#8b7355", fontSize: "0.95rem", marginBottom: "1.5rem" }}>
                        Curate the "Human Element." A sterile model feels lifeless without scale figures, and a rendering's story is entirely dictated by its atmospheric lighting.
                    </p>

                    {/* UI Controls */}
                    <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "1.5rem", marginBottom: "1.5rem" }}>
                        <div style={{ background: "#f5f6f7", padding: "10px", borderRadius: "8px", border: "1px solid #ddd" }}>
                            <strong style={{ fontSize: "12px", display: "block", marginBottom: "6px", color: "#555" }}>Time of Day (Sun & Sky)</strong>
                            <div style={{ display: "flex", gap: "5px" }}>
                                {["Morning", "Noon", "Sunset", "Night"].map(t => (
                                    <button
                                        key={t} onClick={() => setTimeOfDay(t)}
                                        style={{ padding: "4px 10px", fontSize: "12px", border: "none", borderRadius: "4px", background: timeOfDay === t ? "#5c4033" : "#ddd", color: timeOfDay === t ? "#fff" : "#333", cursor: "pointer" }}
                                    >
                                        {t}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div style={{ background: "#f5f6f7", padding: "10px", borderRadius: "8px", border: "1px solid #ddd" }}>
                            <strong style={{ fontSize: "12px", display: "block", marginBottom: "6px", color: "#555" }}>Material Phase</strong>
                            <div style={{ display: "flex", gap: "5px" }}>
                                {["Clay", "Realistic"].map(m => (
                                    <button
                                        key={m} onClick={() => setMaterialPhase(m)}
                                        style={{ padding: "4px 10px", fontSize: "12px", border: "none", borderRadius: "4px", background: materialPhase === m ? "#5c4033" : "#ddd", color: materialPhase === m ? "#fff" : "#333", cursor: "pointer" }}
                                    >
                                        {m}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div style={{ background: "#f5f6f7", padding: "10px", borderRadius: "8px", border: "1px solid #ddd", display: "flex", alignItems: "center" }}>
                            <label style={{ fontSize: "14px", fontWeight: "bold", color: "#5c4033", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" }}>
                                <input type="checkbox" checked={showFigures} onChange={e => setShowFigures(e.target.checked)} style={{ transform: "scale(1.2)" }} />
                                Show Scale Figures
                            </label>
                        </div>
                    </div>

                    <div style={{
                        height: "500px", border: "2px solid #d9c4a5", borderRadius: "8px", overflow: "hidden", background: timeOfDay === "Night" ? "#1a202c" : "#87CEEB", position: "relative"
                    }}>
                        <Canvas camera={{ position: [0, 2, 8], fov: 45 }} shadows>
                            <Sky sunPosition={currentConfig.sunPos} {...currentConfig.skyConfig} />

                            <ambientLight intensity={currentConfig.ambient} />

                            <directionalLight
                                position={currentConfig.sunPos}
                                intensity={currentConfig.intensity}
                                color={currentConfig.lightColor}
                                castShadow
                                shadow-mapSize={[2048, 2048]}
                                shadow-camera-near={0.5}
                                shadow-camera-far={50}
                                shadow-camera-left={-10}
                                shadow-camera-right={10}
                                shadow-camera-top={10}
                                shadow-camera-bottom={-10}
                                shadow-bias={-0.0001}
                            />

                            {/* Interior artificial lights (only visible at night) */}
                            {timeOfDay === "Night" && (
                                <pointLight position={[0, 3, -2]} intensity={50} color="#ffddaa" distance={20} decay={2} castShadow />
                            )}

                            {/* Enclosed Courtyard Architecture */}
                            <group position={[0, -1, 0]}>
                                {/* Floor */}
                                <mesh position={[0, -0.05, 0]} receiveShadow>
                                    <boxGeometry args={[15, 0.1, 15]} />
                                    <meshStandardMaterial color={floorColor} roughness={0.8} />
                                </mesh>

                                {/* Back Wall */}
                                <mesh position={[0, 2, -4]} castShadow receiveShadow>
                                    <boxGeometry args={[10, 4, 0.5]} />
                                    <meshStandardMaterial color={wallColor} roughness={wallRoughness} />
                                </mesh>

                                {/* Left Wall */}
                                <mesh position={[-4.75, 2, -1]} castShadow receiveShadow>
                                    <boxGeometry args={[0.5, 4, 6]} />
                                    <meshStandardMaterial color={wallColor} roughness={wallRoughness} />
                                </mesh>

                                {/* Right Wall (Column structure) */}
                                <mesh position={[4, 2, -3]} castShadow receiveShadow><boxGeometry args={[0.5, 4, 0.5]} /><meshStandardMaterial color={wallColor} /></mesh>
                                <mesh position={[4, 2, -1]} castShadow receiveShadow><boxGeometry args={[0.5, 4, 0.5]} /><meshStandardMaterial color={wallColor} /></mesh>
                                <mesh position={[4, 2, 1]} castShadow receiveShadow><boxGeometry args={[0.5, 4, 0.5]} /><meshStandardMaterial color={wallColor} /></mesh>

                                {/* Roof Cantilever */}
                                <mesh position={[0, 4.25, -2]} castShadow receiveShadow>
                                    <boxGeometry args={[10, 0.5, 6]} />
                                    <meshStandardMaterial color={wallColor} roughness={wallRoughness} />
                                </mesh>

                                {/* Huge Glass Window Wall (Center) */}
                                <mesh position={[0, 2, -2]} castShadow receiveShadow>
                                    <boxGeometry args={[6, 4, 0.1]} />
                                    <meshPhysicalMaterial {...glassProps} />
                                </mesh>
                                {/* Window Mullions */}
                                <mesh position={[0, 2, -1.95]} castShadow><boxGeometry args={[6, 0.1, 0.1]} /><meshStandardMaterial color="#222" /></mesh>
                                <mesh position={[-1.5, 2, -1.95]} castShadow><boxGeometry args={[0.1, 4, 0.1]} /><meshStandardMaterial color="#222" /></mesh>
                                <mesh position={[1.5, 2, -1.95]} castShadow><boxGeometry args={[0.1, 4, 0.1]} /><meshStandardMaterial color="#222" /></mesh>

                                {/* Scale Figures */}
                                {showFigures && (
                                    <>
                                        {/* Figure inside looking out */}
                                        <ScaleFigure position={[-1, 0, -3]} />
                                        {/* Figure standing in courtyard */}
                                        <ScaleFigure position={[2, 0, 1]} />
                                    </>
                                )}
                            </group>

                            <OrbitControls makeDefault maxPolarAngle={Math.PI / 2 - 0.05} minDistance={2} maxDistance={20} target={[0, 1, 0]} />
                        </Canvas>
                    </div>
                </div>
            </ScrollReveal>
        </div>
    );
}
