import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Edges } from "@react-three/drei";
import * as THREE from "three";

// Colors that match the "parchment blueprint" theme
const GRID_COLOR = "#c9a96e";
const BG_COLOR = "#e8dfd5";
const LINE_COLOR = "#8b7355";
const HIGHLIGHT = "#5c4033";
const WALL_SOLID = "#dfd6c8";
const GRASS_COLOR = "#d4cdbd"; // Subdued green-brown for site

// A large floor plane with a denser, more detailed grid
function DetailedMapGrid() {
    return (
        <group position={[0, -0.5, 0]}>
            <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
                <planeGeometry args={[100, 100, 100, 100]} />
                <meshBasicMaterial color={BG_COLOR} />
                <meshBasicMaterial color={GRID_COLOR} wireframe={true} transparent opacity={0.2} />
            </mesh>
            {/* Major grid lines for a more detailed map look */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow position={[0, 0.01, 0]}>
                <planeGeometry args={[100, 100, 20, 20]} />
                <meshBasicMaterial color={LINE_COLOR} wireframe={true} transparent opacity={0.15} />
            </mesh>
        </group>
    );
}

// Contour lines / topological features
function TopoMap() {
    return (
        <group position={[0, -0.48, 0]}>
            <mesh rotation={[-Math.PI / 2, 0, 0]}>
                <ringGeometry args={[10, 10.2, 64]} />
                <meshBasicMaterial color={LINE_COLOR} transparent opacity={0.3} />
            </mesh>
            <mesh rotation={[-Math.PI / 2, 0, 0]}>
                <ringGeometry args={[20, 20.2, 64]} />
                <meshBasicMaterial color={LINE_COLOR} transparent opacity={0.2} />
            </mesh>
            <mesh rotation={[-Math.PI / 2, 0, 0]}>
                <ringGeometry args={[30, 30.2, 64]} />
                <meshBasicMaterial color={LINE_COLOR} transparent opacity={0.1} />
            </mesh>
        </group>
    );
}

// Simplified house massing to allow for many instances
function MapHouse({ position = [0, 0, 0], rot = 0, scale = 1, type = "block" }) {
    const groupRef = useRef();

    return (
        <group ref={groupRef} position={position} rotation={[0, rot, 0]} scale={scale}>
            {type === "block" && (
                <mesh position={[0, 1, 0]} castShadow receiveShadow>
                    <boxGeometry args={[3, 2, 4]} />
                    <meshStandardMaterial color={WALL_SOLID} roughness={0.9} />
                    <Edges scale={1.01} color={LINE_COLOR} />
                </mesh>
            )}

            {type === "house" && (
                <group>
                    <mesh position={[0, 1, 0]} castShadow receiveShadow>
                        <boxGeometry args={[4, 2, 6]} />
                        <meshStandardMaterial color={WALL_SOLID} roughness={0.9} />
                        <Edges scale={1.01} color={LINE_COLOR} />
                    </mesh>
                    <mesh position={[0, 3, 0]} castShadow>
                        <coneGeometry args={[4.5, 2, 4]} />
                        <meshStandardMaterial color={WALL_SOLID} roughness={0.9} />
                        <Edges scale={1.01} color={LINE_COLOR} />
                    </mesh>
                </group>
            )}

            {type === "tower" && (
                <group>
                    <mesh position={[0, 3, 0]} castShadow receiveShadow>
                        <boxGeometry args={[3, 6, 3]} />
                        <meshStandardMaterial color={WALL_SOLID} roughness={0.9} />
                        <Edges scale={1.01} color={LINE_COLOR} />
                    </mesh>
                </group>
            )}
        </group>
    );
}

// Generates a sprawling, dense neighborhood map
function SprawlingNeighborhood() {
    const buildings = useMemo(() => {
        const layout = [];
        // Centerpiece detailed house under construction
        layout.push({ pos: [0, 0, 0], rot: 0, scale: 1.2, type: "house", isDetail: true });

        // Generate a grid-based city layout
        for (let x = -40; x <= 40; x += 8) {
            for (let z = -40; z <= 40; z += 10) {
                // Leave a clearing in the center
                if (Math.abs(x) < 10 && Math.abs(z) < 10) continue;

                // Create varied buildings
                if (Math.random() > 0.3) {
                    const offsetX = (Math.random() - 0.5) * 2;
                    const offsetZ = (Math.random() - 0.5) * 2;
                    const rType = Math.random();
                    let bType = "block";
                    if (rType > 0.8) bType = "house";
                    if (rType > 0.9) bType = "tower";

                    const scale = 0.8 + Math.random() * 0.4;
                    const rot = (Math.floor(Math.random() * 4) * Math.PI) / 2; // Orthogonal rotations
                    layout.push({ pos: [x + offsetX, 0, z + offsetZ], rot, scale, type: bType });
                }
            }
        }
        return layout;
    }, []);

    const containerRef = useRef();

    useFrame((state) => {
        // Slow rotation to show the massive detailed map
        if (containerRef.current) {
            containerRef.current.rotation.y = state.clock.elapsedTime * 0.03;
        }
    });

    return (
        <group ref={containerRef}>
            {buildings.map((b, i) => {
                if (b.isDetail) {
                    return <UnderConstructionHouse key={i} />;
                }
                return <MapHouse key={i} position={b.pos} rot={b.rot} scale={b.scale} type={b.type} />;
            })}
        </group>
    );
}

// ── The detailed house from IsometricBackground ──
function UnderConstructionHouse() {
    return (
        <group scale={1.2}>
            {/* Solid First Floor Walls */}
            <mesh position={[0, 1, 0]} castShadow>
                <boxGeometry args={[4, 2, 6]} />
                <meshStandardMaterial color={WALL_SOLID} roughness={0.9} />
                <Edges scale={1.01} color={LINE_COLOR} />
            </mesh>

            {/* Wireframe Second Floor extending up */}
            <group position={[0, 2, 0]}>
                <mesh position={[0, 1, 0]}>
                    <boxGeometry args={[4, 2, 6]} />
                    <meshStandardMaterial color={HIGHLIGHT} wireframe transparent opacity={0.3} />
                </mesh>

                {/* Construction beams */}
                {[[-1.9, -1.9], [1.9, -1.9], [-1.9, 1.9], [1.9, 1.9], [1.9, 2.9], [-1.9, 2.9]].map((pos, i) => (
                    <mesh key={i} position={[pos[0], 1, pos[1]]}>
                        <boxGeometry args={[0.1, 2, 0.1]} />
                        <meshStandardMaterial color={HIGHLIGHT} />
                    </mesh>
                ))}
            </group>

            {/* Floating Roof Wireframe */}
            <mesh position={[0, 5, 0]} rotation={[0, 0, 0]}>
                <coneGeometry args={[4.5, 2, 4]} />
                <meshStandardMaterial color={LINE_COLOR} wireframe />
            </mesh>
        </group>
    );
}

export default function DetailedArchitectMapBackground() {
    return (
        <div
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100vw",
                height: "100vh",
                zIndex: -1,
                background: "linear-gradient(135deg, #e8dfd5 0%, #d9cbb9 100%)",
                pointerEvents: "none",
            }}
        >
            <Canvas
                shadows
                // True isometric/axonometric
                orthographic
                camera={{ position: [20, 20, 20], zoom: 40, near: -100, far: 500 }}
            >
                <fog attach="fog" args={["#d9cbb9", 25, 100]} />

                <ambientLight intensity={0.7} />
                <directionalLight
                    position={[15, 30, 15]}
                    intensity={1.2}
                    castShadow
                    shadow-mapSize={[2048, 2048]}
                />
                <directionalLight position={[-10, 10, -10]} intensity={0.5} />

                <group position={[0, -2, 0]}>
                    <DetailedMapGrid />
                    <TopoMap />
                    <SprawlingNeighborhood />
                </group>
            </Canvas>
        </div>
    );
}
