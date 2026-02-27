import { useRef, useState, useMemo, useEffect, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Text, Line, useGLTF, useAnimations } from "@react-three/drei";
import * as THREE from "three";
import ScrollReveal from "../ScrollReveal";

/*
  ScaleExplorer3D — Interactive 3D room with proper animated human model.
  Uses Soldier.glb from Three.js examples for a realistic standing human.
  Room scales from Intimate (2.4m) to Monumental (12m).
*/

const HUMAN_HEIGHT = 1.75;

/* ── Animated Soldier Model ── */
function HumanModel({ scale = 1 }) {
    const group = useRef();
    const { scene, animations } = useGLTF("/models/Soldier.glb");
    const { actions } = useAnimations(animations, group);

    useEffect(() => {
        // Play Idle animation
        const idleAction = actions["Idle"];
        if (idleAction) {
            idleAction.reset().fadeIn(0.5).play();
        }
        return () => {
            if (idleAction) idleAction.fadeOut(0.5);
        };
    }, [actions]);

    // Clone the scene so we can use it multiple times
    const clonedScene = useMemo(() => {
        const clone = scene.clone(true);
        clone.traverse((child) => {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
            }
        });
        return clone;
    }, [scene]);

    return (
        <group ref={group} position={[0, 0, 0]} scale={[scale, scale, scale]}>
            <primitive object={clonedScene} />
        </group>
    );
}

/* ── Room Geometry ── */
function Room({ ceilingHeight }) {
    const roomWidth = Math.max(4, ceilingHeight * 0.8);
    const roomDepth = Math.max(5, ceilingHeight * 1);

    return (
        <group>
            {/* Floor — warm wood */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
                <planeGeometry args={[roomWidth, roomDepth]} />
                <meshStandardMaterial color="#8a7048" roughness={0.8} />
            </mesh>

            {/* Ceiling */}
            <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, ceilingHeight, 0]}>
                <planeGeometry args={[roomWidth, roomDepth]} />
                <meshStandardMaterial color="#f0e8dc" roughness={0.95} side={THREE.DoubleSide} />
            </mesh>

            {/* Back wall */}
            <mesh position={[0, ceilingHeight / 2, -roomDepth / 2]}>
                <planeGeometry args={[roomWidth, ceilingHeight]} />
                <meshStandardMaterial color="#f5ece0" roughness={0.9} />
            </mesh>

            {/* Left wall */}
            <mesh rotation={[0, Math.PI / 2, 0]} position={[-roomWidth / 2, ceilingHeight / 2, 0]}>
                <planeGeometry args={[roomDepth, ceilingHeight]} />
                <meshStandardMaterial color="#ede4d9" roughness={0.9} />
            </mesh>

            {/* Right wall */}
            <mesh rotation={[0, -Math.PI / 2, 0]} position={[roomWidth / 2, ceilingHeight / 2, 0]}>
                <planeGeometry args={[roomDepth, ceilingHeight]} />
                <meshStandardMaterial color="#ede4d9" roughness={0.9} />
            </mesh>

            {/* Door on back wall */}
            <mesh position={[1.2, 1.05, -roomDepth / 2 + 0.01]}>
                <planeGeometry args={[0.9, 2.1]} />
                <meshStandardMaterial color="#5c4033" roughness={0.7} />
            </mesh>

            {/* Door frame */}
            <mesh position={[1.2, 2.15, -roomDepth / 2 + 0.02]}>
                <planeGeometry args={[1.0, 0.08]} />
                <meshStandardMaterial color="#3e2a1e" roughness={0.6} />
            </mesh>

            {/* Baseboard */}
            <mesh position={[0, 0.04, -roomDepth / 2 + 0.02]}>
                <planeGeometry args={[roomWidth, 0.08]} />
                <meshStandardMaterial color="#3e2a1e" roughness={0.7} />
            </mesh>
        </group>
    );
}

/* ── Dimension annotation lines ── */
function DimensionLine({ from, to, label, color = "#c9a96e" }) {
    const mid = [(from[0] + to[0]) / 2, (from[1] + to[1]) / 2, (from[2] + to[2]) / 2];
    return (
        <group>
            <Line points={[from, to]} color={color} lineWidth={2} dashed dashSize={0.1} gapSize={0.05} />
            {/* End caps */}
            <Line points={[[from[0] - 0.1, from[1], from[2]], [from[0] + 0.1, from[1], from[2]]]} color={color} lineWidth={2} />
            <Line points={[[to[0] - 0.1, to[1], to[2]], [to[0] + 0.1, to[1], to[2]]]} color={color} lineWidth={2} />
            <Text position={[mid[0] - 0.25, mid[1], mid[2]]} fontSize={0.16} color={color} anchorX="center" anchorY="middle">
                {label}
            </Text>
        </group>
    );
}

/* ── Smooth light animation ── */
function PulsingLight({ ceilingHeight }) {
    const ref = useRef();
    useFrame(({ clock }) => {
        if (ref.current) {
            ref.current.intensity = 0.8 + Math.sin(clock.elapsedTime * 2) * 0.12;
        }
    });
    return (
        <pointLight ref={ref} position={[0, ceilingHeight - 0.3, 0]}
            intensity={0.8} distance={ceilingHeight * 2.5} color="#ffe8c0" castShadow />
    );
}

/* ── Main Scene ── */
function Scene({ ceilingHeight }) {
    const roomWidth = Math.max(4, ceilingHeight * 0.8);
    const controlsRef = useRef();

    // Smoothly update orbit target
    useFrame(() => {
        if (controlsRef.current) {
            controlsRef.current.target.lerp(
                new THREE.Vector3(0, Math.min(ceilingHeight / 2, 3), 0), 0.05
            );
            controlsRef.current.update();
        }
    });

    return (
        <>
            <ambientLight intensity={0.35} />
            <directionalLight position={[3, ceilingHeight, 3]} intensity={0.65} castShadow
                shadow-mapSize-width={1024} shadow-mapSize-height={1024} />
            <directionalLight position={[-2, ceilingHeight * 0.7, 1]} intensity={0.2} color="#c9deff" />
            <PulsingLight ceilingHeight={ceilingHeight} />

            <Room ceilingHeight={ceilingHeight} />

            {/* Human model */}
            <Suspense fallback={
                <mesh position={[0, HUMAN_HEIGHT / 2, 0]}>
                    <capsuleGeometry args={[0.15, HUMAN_HEIGHT * 0.5, 8, 16]} />
                    <meshStandardMaterial color="#c9a96e" />
                </mesh>
            }>
                <HumanModel scale={0.012} />
            </Suspense>

            {/* Height dimension — room */}
            <DimensionLine
                from={[-roomWidth / 2 + 0.3, 0, 0]}
                to={[-roomWidth / 2 + 0.3, ceilingHeight, 0]}
                label={`${ceilingHeight.toFixed(1)}m`}
            />

            {/* Height dimension — human */}
            <DimensionLine
                from={[0.6, 0, 0.4]}
                to={[0.6, HUMAN_HEIGHT, 0.4]}
                label="1.75m"
                color="#6b8f71"
            />

            <OrbitControls
                ref={controlsRef}
                enablePan={false}
                enableZoom={true}
                minDistance={2}
                maxDistance={20}
                maxPolarAngle={Math.PI / 2.05}
            />
        </>
    );
}

/* ── Presets ── */
const SCALE_PRESETS = [
    { label: "Intimate", height: 2.4, emoji: "🏠", desc: "Low ceiling — cozy and personal" },
    { label: "Normal", height: 3.0, emoji: "🏢", desc: "Standard residential — comfortable" },
    { label: "Grand", height: 5.5, emoji: "🏛️", desc: "High ceilings — dignified" },
    { label: "Monumental", height: 10.0, emoji: "⛪", desc: "Cathedral scale — awe-inspiring" },
];

/* ── Component ── */
export default function ScaleExplorer3D() {
    const [ceilingHeight, setCeilingHeight] = useState(3.0);

    const scaleLabel = useMemo(() => {
        if (ceilingHeight <= 2.6) return { label: "Intimate", color: "#C78F57" };
        if (ceilingHeight <= 3.5) return { label: "Normal", color: "#6b8f71" };
        if (ceilingHeight <= 6) return { label: "Grand", color: "#c9a96e" };
        return { label: "Monumental", color: "#8a5c3a" };
    }, [ceilingHeight]);

    return (
        <ScrollReveal className="content-card" delay={200}>
            <h4 style={{ fontSize: "1.3rem", marginBottom: "0.3rem", color: "#5c4033" }}>
                📐 Scale Explorer 3D
            </h4>
            <p style={{ fontSize: "1rem", color: "#8a7560", marginBottom: "0.8rem" }}>
                Drag the slider to change ceiling height. Watch how the <strong>same person</strong> feels
                in rooms of different scales. Orbit with your mouse to explore.
            </p>

            {/* Presets */}
            <div style={{ display: "flex", gap: "0.4rem", marginBottom: "0.5rem", flexWrap: "wrap" }}>
                {SCALE_PRESETS.map((p) => (
                    <button key={p.label} onClick={() => setCeilingHeight(p.height)}
                        style={{
                            padding: "0.4rem 0.7rem", borderRadius: 8, fontSize: "0.85rem",
                            border: `2px solid ${Math.abs(ceilingHeight - p.height) < 0.3 ? "#c9a96e" : "#ddd"}`,
                            background: Math.abs(ceilingHeight - p.height) < 0.3 ? "rgba(201,169,110,0.15)" : "#fefcf7",
                            color: "#5c4033", cursor: "pointer", fontWeight: 600,
                        }}>
                        {p.emoji} {p.label}
                    </button>
                ))}
            </div>

            {/* Slider */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.8rem", marginBottom: "0.5rem" }}>
                <span style={{ fontSize: "0.85rem", color: "#8a7560" }}>2.4m</span>
                <input type="range" min="2.4" max="12" step="0.1" value={ceilingHeight}
                    onChange={(e) => setCeilingHeight(parseFloat(e.target.value))}
                    style={{ flex: 1, accentColor: "#c9a96e" }} />
                <span style={{ fontSize: "0.85rem", color: "#8a7560" }}>12m</span>
            </div>

            {/* Scale badge */}
            <div style={{ textAlign: "center", marginBottom: "0.5rem" }}>
                <span style={{
                    display: "inline-block", padding: "0.3rem 0.8rem", borderRadius: 20,
                    background: `${scaleLabel.color}20`, color: scaleLabel.color, fontWeight: 700,
                    fontSize: "0.9rem", border: `1px solid ${scaleLabel.color}40`,
                }}>
                    {scaleLabel.label} Scale — {ceilingHeight.toFixed(1)}m ceiling
                </span>
            </div>

            {/* 3D Canvas */}
            <div style={{ height: 420, borderRadius: 12, overflow: "hidden", background: "#1a1714" }}>
                <Canvas shadows camera={{ position: [3.5, 1.8, 4], fov: 50 }}>
                    <Scene ceilingHeight={ceilingHeight} />
                </Canvas>
            </div>

            {/* Insight */}
            <div style={{
                marginTop: "0.8rem", background: "rgba(201,169,110,0.06)", borderRadius: 10,
                padding: "0.8rem 1rem", border: "1px solid rgba(201,169,110,0.15)",
            }}>
                <p style={{ fontSize: "0.95rem", color: "#c9a96e", fontWeight: 700, margin: 0 }}>
                    💡 What you're feeling:
                </p>
                <p style={{ fontSize: "0.9rem", color: "#8a7560", marginTop: "0.3rem" }}>
                    {ceilingHeight <= 2.6 && "At this intimate scale, the space hugs you — perfect for reading nooks, Japanese tea rooms, or cozy bedrooms. Notice how the human figure almost touches the ceiling."}
                    {ceilingHeight > 2.6 && ceilingHeight <= 3.5 && "This is the 'Goldilocks' zone — standard residential height. The human feels comfortable and in proportion with the room."}
                    {ceilingHeight > 3.5 && ceilingHeight <= 6 && "Grand scale — the human figure becomes less dominant. This is the realm of lobbies, libraries, and galleries where space takes center stage."}
                    {ceilingHeight > 6 && `At ${ceilingHeight.toFixed(1)}m, monumental scale dwarfs the human. Cathedrals, temples, and grand atriums use this to inspire awe and humility.`}
                </p>
            </div>
        </ScrollReveal>
    );
}

// Preload the GLB model
useGLTF.preload("/models/Soldier.glb");
