import { useState, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Edges } from "@react-three/drei";
import ScrollReveal from "../ScrollReveal";

// Define the 3D puzzle shape (a set of 1x1x1 blocks)
// We use a 3x3x3 logical grid space from 0 to 2
const BLOCKS = [
    { x: 1, y: 0, z: 1 }, // Center base
    { x: 2, y: 0, z: 1 }, // Right base
    { x: 1, y: 0, z: 2 }, // Front base
    { x: 1, y: 1, z: 1 }, // Center middle
    { x: 1, y: 2, z: 1 }, // Center top
];

// Calculate correct 2D projections (3x3 grids)
// Top view: looking down Y axis. x maps to col, z maps to row
const CORRECT_TOP = [
    [false, false, false],
    [false, true, true],
    [false, true, false]
];

// Front view: looking along Z axis. x maps to col, y maps to inverse row
const CORRECT_FRONT = [
    [false, true, false],
    [false, true, false],
    [false, true, true]
];

// Side view: looking along X axis (from right). z maps to col (reversed), y maps to inverse row
const CORRECT_SIDE = [
    [false, true, false],
    [false, true, false],
    [true, true, false]
];

function BlockShape() {
    return (
        <group position={[-1, -1, -1]}>
            {BLOCKS.map((pos, i) => (
                <mesh key={i} position={[pos.x, pos.y, pos.z]} castShadow receiveShadow>
                    <boxGeometry args={[1, 1, 1]} />
                    <meshStandardMaterial color="#85ABAB" roughness={0.6} />
                    <Edges scale={1.01} color="#1F3345" />
                </mesh>
            ))}
            {/* Reference wireframe box for the 3x3x3 bounds */}
            <mesh position={[1, 1, 1]}>
                <boxGeometry args={[3, 3, 3]} />
                <meshBasicMaterial color="#d9cbb9" wireframe transparent opacity={0.2} />
            </mesh>
        </group>
    );
}

// Reusable 3x3 Grid component for drawing views
function DrawingGrid({ title, activeGrid, setGrid, correctGrid }) {
    const toggleCell = (r, c) => {
        const newGrid = activeGrid.map(row => [...row]);
        newGrid[r][c] = !newGrid[r][c];
        setGrid(newGrid);
    };

    // Check if current grid exactly matches correct grid
    const isCorrect = activeGrid.every((row, r) =>
        row.every((cell, c) => cell === correctGrid[r][c])
    );

    return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem" }}>
            <h4 style={{ margin: 0, color: "#4a3728", fontSize: "0.95rem" }}>
                {title} {isCorrect && "✅"}
            </h4>
            <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 40px)",
                gridTemplateRows: "repeat(3, 40px)",
                gap: "2px",
                background: "#d9cbb9",
                padding: "4px",
                borderRadius: "4px",
                border: `2px solid ${isCorrect ? "#2e7d32" : "transparent"}`
            }}>
                {activeGrid.map((row, r) =>
                    row.map((cell, c) => (
                        <div
                            key={`${r}-${c}`}
                            onClick={() => toggleCell(r, c)}
                            style={{
                                background: cell ? "#85ABAB" : "#fff",
                                cursor: "pointer",
                                transition: "background 0.2s",
                                boxShadow: cell ? "inset 0 0 0 1px #1F3345" : "none"
                            }}
                        />
                    ))
                )}
            </div>
        </div>
    );
}

export default function ProjectionPuzzle() {
    // Initialize empty 3x3 grids
    const emptyGrid = Array(3).fill(null).map(() => Array(3).fill(false));

    const [topGrid, setTopGrid] = useState(emptyGrid);
    const [frontGrid, setFrontGrid] = useState(emptyGrid);
    const [sideGrid, setSideGrid] = useState(emptyGrid);

    const isTopCorrect = topGrid.every((row, r) => row.every((val, c) => val === CORRECT_TOP[r][c]));
    const isFrontCorrect = frontGrid.every((row, r) => row.every((val, c) => val === CORRECT_FRONT[r][c]));
    const isSideCorrect = sideGrid.every((row, r) => row.every((val, c) => val === CORRECT_SIDE[r][c]));

    const allCorrect = isTopCorrect && isFrontCorrect && isSideCorrect;

    const handleClear = () => {
        setTopGrid(emptyGrid);
        setFrontGrid(emptyGrid);
        setSideGrid(emptyGrid);
    };

    return (
        <div className="section-gap">
            <ScrollReveal className="heading-card">
                <h2>🧊 Projection Puzzle Machine</h2>
                <p className="subtitle">Translate 3D form into 2D blueprints</p>
            </ScrollReveal>

            <ScrollReveal className="content-card" delay={150}>
                <p style={{ marginBottom: "1.5rem", color: "#4a3728", fontSize: "1.05rem" }}>
                    Rotate the 3D block arrangement on the left. Then, act as the architect and draw its Top, Front, and Side (Right) orthographic views on the grids.
                </p>

                <div style={{ display: "flex", flexWrap: "wrap", gap: "2rem", justifyContent: "center", alignItems: "flex-start" }}>

                    {/* 3D Model View */}
                    <div style={{
                        width: "300px", height: "300px",
                        background: "radial-gradient(circle, #fcf8f2 0%, #e8dfd5 100%)",
                        borderRadius: "12px", border: "1px solid #d9cbb9",
                        overflow: "hidden"
                    }}>
                        <Canvas camera={{ position: [5, 4, 5], fov: 40 }} shadows>
                            <ambientLight intensity={0.6} />
                            <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
                            <BlockShape />
                            <OrbitControls makeDefault enablePan={false} minDistance={3} maxDistance={12} />
                        </Canvas>
                    </div>

                    {/* 2D Grids */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                        <div style={{ display: "flex", gap: "1.5rem" }}>
                            <DrawingGrid title="Top View (Plan)" activeGrid={topGrid} setGrid={setTopGrid} correctGrid={CORRECT_TOP} />
                            <DrawingGrid title="Front View" activeGrid={frontGrid} setGrid={setFrontGrid} correctGrid={CORRECT_FRONT} />
                            <DrawingGrid title="Right Side View" activeGrid={sideGrid} setGrid={setSideGrid} correctGrid={CORRECT_SIDE} />
                        </div>

                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "1rem" }}>
                            <button onClick={handleClear} style={{ background: "transparent", border: "1px solid #c9a96e", padding: "6px 12px", borderRadius: "6px", cursor: "pointer", color: "#5c4033" }}>
                                Clear All
                            </button>

                            <div style={{ fontWeight: "bold", color: allCorrect ? "#2e7d32" : "#8b7355" }}>
                                {allCorrect ? "🎉 Spatial Master! All views correct." : "Match all 3 views to complete"}
                            </div>
                        </div>
                    </div>

                </div>
            </ScrollReveal>
        </div>
    );
}
