import { useState, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Edges } from "@react-three/drei";
import * as THREE from "three";
import ScrollReveal from "../ScrollReveal";

const HOUSE_COLOR = "#EDE4D9";
const POCHE_COLOR = "#c9a96e";
const WALL_THICKNESS = 0.2;

// The material used for the exterior and interior faces. Needs `clipIntersection` for some effects, but mainly `side: THREE.DoubleSide`.
function HouseModel({ clipPlane }) {
    const group = useRef();

    // Create a reusable material that responds to the clipping plane
    const material = useMemo(() => {
        return new THREE.MeshStandardMaterial({
            color: HOUSE_COLOR,
            roughness: 0.8,
            side: THREE.DoubleSide,
            clippingPlanes: [clipPlane],
            clipShadows: true,
        });
    }, [clipPlane]);

    // Create a separate material for the "cut surface" (Poche) effect using stencil buffers or a solid backface
    // A simple hack for clipping poche is to use a back-facing material with the poche color.
    const pocheMaterial = useMemo(() => {
        return new THREE.MeshBasicMaterial({
            color: POCHE_COLOR,
            side: THREE.BackSide,
            clippingPlanes: [clipPlane],
        });
    }, [clipPlane]);

    // Build a hollow house: Floor, 4 Walls, Pitched Roof, Internal partition
    return (
        <group ref={group} dispose={null}>
            {/* Outer Shell using dual materials (front side and back side) to simulate solid thickness */}
            <mesh castShadow receiveShadow position={[0, -1.4, 0]}>
                <boxGeometry args={[4, WALL_THICKNESS, 6]} />
                <meshStandardMaterial color="#A9A090" object={{ clippingPlanes: [clipPlane] }} />
            </mesh>

            {/* Left Wall */}
            <mesh castShadow receiveShadow position={[-1.9, 0, 0]}>
                <boxGeometry args={[WALL_THICKNESS, 3, 6]} />
                <primitive object={material} attach="material" />
            </mesh>
            <mesh position={[-1.9, 0, 0]} scale={0.99}>
                <boxGeometry args={[WALL_THICKNESS, 3, 6]} />
                <primitive object={pocheMaterial} attach="material" />
            </mesh>

            {/* Right Wall */}
            <mesh castShadow receiveShadow position={[1.9, 0, 0]}>
                <boxGeometry args={[WALL_THICKNESS, 3, 6]} />
                <primitive object={material} attach="material" />
            </mesh>
            <mesh position={[1.9, 0, 0]} scale={0.99}>
                <boxGeometry args={[WALL_THICKNESS, 3, 6]} />
                <primitive object={pocheMaterial} attach="material" />
            </mesh>

            {/* Back Wall */}
            <mesh castShadow receiveShadow position={[0, 0, -2.9]}>
                <boxGeometry args={[4, 3, WALL_THICKNESS]} />
                <primitive object={material} attach="material" />
            </mesh>
            <mesh position={[0, 0, -2.9]} scale={0.99}>
                <boxGeometry args={[4, 3, WALL_THICKNESS]} />
                <primitive object={pocheMaterial} attach="material" />
            </mesh>

            {/* Front Wall (with a door cutout simulated by 2 pieces) */}
            <mesh castShadow receiveShadow position={[-1, 0, 2.9]}>
                <boxGeometry args={[2, 3, WALL_THICKNESS]} />
                <primitive object={material} attach="material" />
            </mesh>
            <mesh castShadow receiveShadow position={[1.5, 0, 2.9]}>
                <boxGeometry args={[1, 3, WALL_THICKNESS]} />
                <primitive object={material} attach="material" />
            </mesh>
            <mesh castShadow receiveShadow position={[0.5, 1, 2.9]}>
                <boxGeometry args={[1, 1, WALL_THICKNESS]} />
                <primitive object={material} attach="material" />
            </mesh>

            {/* Inner Partition */}
            <mesh castShadow receiveShadow position={[0, 0, 0]}>
                <boxGeometry args={[4, 3, WALL_THICKNESS]} />
                <primitive object={material} attach="material" />
            </mesh>

            {/* Second Floor */}
            <mesh castShadow receiveShadow position={[0, 1.4, 0]}>
                <boxGeometry args={[4, WALL_THICKNESS, 6]} />
                <primitive object={material} attach="material" />
            </mesh>

            {/* Roof Left */}
            <mesh castShadow receiveShadow position={[-1, 2.5, 0]} rotation={[0, 0, -Math.PI / 6]}>
                <boxGeometry args={[2.5, WALL_THICKNESS, 6.4]} />
                <primitive object={material} attach="material" />
            </mesh>
            {/* Roof Right */}
            <mesh castShadow receiveShadow position={[1, 2.5, 0]} rotation={[0, 0, Math.PI / 6]}>
                <boxGeometry args={[2.5, WALL_THICKNESS, 6.4]} />
                <primitive object={material} attach="material" />
            </mesh>

            {/* Furniture (Stairs proxy) */}
            {[0, 1, 2, 3, 4, 5, 6].map(i => (
                <mesh key={i} castShadow receiveShadow position={[1.2, -1.3 + i * 0.2, 1 - i * 0.3]}>
                    <boxGeometry args={[1, 0.2, 0.3]} />
                    <meshStandardMaterial color="#8B7355" object={{ clippingPlanes: [clipPlane] }} />
                </mesh>
            ))}
        </group>
    );
}

function SlicerScene({ cutMode, cutDepth }) {
    // Update the clipping plane based on state
    const clipPlane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, -1, 0), 0), []);

    useFrame(() => {
        if (cutMode === "plan") {
            clipPlane.normal.set(0, -1, 0); // Cut horizontally
            clipPlane.constant = cutDepth;   // Depth maps to Y height
        } else {
            clipPlane.normal.set(-1, 0, 0); // Cut vertically
            clipPlane.constant = cutDepth;   // Depth maps to X position
        }
    });

    return (
        <>
            <ambientLight intensity={0.6} />
            <directionalLight position={[5, 10, 5]} intensity={1.5} castShadow shadow-mapSize={[1024, 1024]} />
            <directionalLight position={[-5, 5, -5]} intensity={0.5} />

            <HouseModel clipPlane={clipPlane} />

            <OrbitControls makeDefault enableDamping dampingFactor={0.05} minPolarAngle={0} maxPolarAngle={Math.PI / 2 + 0.1} />
        </>
    );
}

export default function OrthographicSlicer() {
    const [cutMode, setCutMode] = useState("plan");
    // Plan ranges from Y=4 down to Y=-1
    // Section ranges from X=3 down to X=-3
    const [cutDepth, setCutDepth] = useState(2);

    const handleModeChange = (mode) => {
        setCutMode(mode);
        setCutDepth(mode === "plan" ? 2 : 1.5);
    };

    const getMinMax = () => {
        if (cutMode === "plan") return { min: -1.5, max: 4 };
        return { min: -2.5, max: 2.5 };
    };

    return (
        <div className="section-gap">
            <ScrollReveal className="heading-card">
                <h2>🔪 Orthographic Slicer 3D</h2>
                <p className="subtitle">Slice a building to reveal its inside logic</p>
            </ScrollReveal>

            <ScrollReveal className="content-card" delay={150}>
                <p style={{ marginBottom: "1.5rem", color: "#4a3728", fontSize: "1.1rem" }}>
                    Move the slider to cut through the 3D model. Watch how slicing perfectly horizontally creates a <strong>Floor Plan</strong>, while slicing vertically creates a <strong>Section</strong>.
                </p>

                {/* Controls */}
                <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem", flexWrap: "wrap", justifyContent: "center" }}>
                    <button
                        onClick={() => handleModeChange("plan")}
                        style={{
                            background: cutMode === "plan" ? "#c9a96e" : "transparent",
                            border: `2px solid #c9a96e`,
                            color: cutMode === "plan" ? "#fff" : "#5c4033",
                            padding: "8px 16px", borderRadius: "8px", cursor: "pointer", fontWeight: 600, transition: "all 0.3s"
                        }}
                    >
                        Horizontal Cut (Plan)
                    </button>
                    <button
                        onClick={() => handleModeChange("section")}
                        style={{
                            background: cutMode === "section" ? "#c9a96e" : "transparent",
                            border: `2px solid #c9a96e`,
                            color: cutMode === "section" ? "#fff" : "#5c4033",
                            padding: "8px 16px", borderRadius: "8px", cursor: "pointer", fontWeight: 600, transition: "all 0.3s"
                        }}
                    >
                        Vertical Cut (Section)
                    </button>
                </div>

                <div style={{ padding: "0 1rem 1.5rem 1rem", maxWidth: "400px", margin: "0 auto" }}>
                    <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "#8b7355", marginBottom: "0.5rem" }}>
                        Cut Depth
                    </label>
                    <input
                        type="range"
                        min={getMinMax().min}
                        max={getMinMax().max}
                        step="0.05"
                        value={cutDepth}
                        onChange={(e) => setCutDepth(parseFloat(e.target.value))}
                        style={{ width: "100%", accentColor: "#c9a96e" }}
                    />
                </div>

                {/* 3D Viewport */}
                <div style={{
                    height: "400px",
                    width: "100%",
                    background: "radial-gradient(circle at center, #ffffff 0%, #f4eee6 100%)",
                    borderRadius: "12px",
                    border: "1px solid #d9cbb9",
                    overflow: "hidden",
                    cursor: "grab"
                }}>
                    <Canvas gl={{ localClippingEnabled: true }} shadows camera={{ position: [5, 4, 6], fov: 45 }}>
                        <SlicerScene cutMode={cutMode} cutDepth={cutDepth} />
                    </Canvas>
                </div>
                <p style={{ textAlign: "center", fontSize: "0.85rem", color: "#8b7355", marginTop: "0.75rem", fontStyle: "italic" }}>
                    Drag to rotate • Scroll to zoom
                </p>
            </ScrollReveal>
        </div>
    );
}
