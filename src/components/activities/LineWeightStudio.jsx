import { useState } from "react";
import ScrollReveal from "../ScrollReveal";

// Define the elements of our floor plan
const PLAN_ELEMENTS = [
    // Walls
    { id: "wall1", type: "wall", d: "M 20 20 L 380 20 L 380 40 L 40 40 L 40 260 L 20 260 Z" },
    { id: "wall2", type: "wall", d: "M 380 120 L 380 260 L 200 260 L 200 240 L 360 240 L 360 120 Z" },
    { id: "wall3", type: "wall", d: "M 20 260 L 120 260 L 120 240 L 40 240 Z" },
    { id: "interior_wall", type: "wall", d: "M 200 20 L 200 120 L 180 120 L 180 40 L 40 40 L 40 20 Z" }, // Simplified

    // Windows
    { id: "window1", type: "window", d: "M 40 20 L 180 20", isLine: true },
    { id: "window2", type: "window", d: "M 380 40 L 380 120", isLine: true },

    // Doors
    { id: "door1", type: "door", d: "M 120 260 C 120 200 180 200 200 260", isLine: true, dash: true },
    { id: "door1_panel", type: "door", d: "M 120 260 L 120 200", isLine: true },
    { id: "door2", type: "door", d: "M 180 120 C 180 180 120 180 120 120", isLine: true, dash: true },
    { id: "door2_panel", type: "door", d: "M 180 120 L 180 180", isLine: true },

    // Furniture / Details
    { id: "table", type: "detail", d: "M 80 100 L 140 100 L 140 160 L 80 160 Z" },
    { id: "chair1", type: "detail", d: "M 100 80 A 10 10 0 0 1 120 80" },
    { id: "chair2", type: "detail", d: "M 100 180 A 10 10 0 0 0 120 180" },
    // Floor pattern (tile)
    { id: "tile1", type: "detail", d: "M 220 140 L 340 140", isLine: true },
    { id: "tile2", type: "detail", d: "M 220 180 L 340 180", isLine: true },
    { id: "tile3", type: "detail", d: "M 220 220 L 340 220", isLine: true },
    { id: "tile4", type: "detail", d: "M 260 140 L 260 220", isLine: true },
    { id: "tile5", type: "detail", d: "M 300 140 L 300 220", isLine: true },
];

const WEIGHTS = {
    heavy: { name: "Heavy Pen (Cut)", width: 6, color: "#2c1e16" },
    medium: { name: "Medium Pen (Outline)", width: 3, color: "#4a3728" },
    light: { name: "Light Pen (Detail)", width: 1, color: "#8b7355" },
    unassigned: { name: "Unassigned", width: 2, color: "#d9cbb9" } // Default dashed look
};

// The rules defining correct answers
const CORRECT_MAPPING = {
    wall: "heavy",
    window: "medium",
    door: "medium",
    detail: "light"
};

export default function LineWeightStudio() {
    const [activePen, setActivePen] = useState("heavy");
    // Holds mapping of element id -> weight key ("heavy", "medium", "light")
    const [assignedWeights, setAssignedWeights] = useState({});

    const handleElementClick = (id) => {
        setAssignedWeights(prev => ({
            ...prev,
            [id]: activePen
        }));
    };

    // Check if all elements are assigned and correct
    const totalElements = PLAN_ELEMENTS.length;
    const assignedCount = Object.keys(assignedWeights).length;

    let correctCount = 0;
    PLAN_ELEMENTS.forEach(el => {
        if (assignedWeights[el.id] === CORRECT_MAPPING[el.type]) {
            correctCount++;
        }
    });

    const isComplete = assignedCount === totalElements;
    const isAllCorrect = correctCount === totalElements;

    return (
        <div className="section-gap">
            <ScrollReveal className="heading-card" style={{ background: "#2c1e16", borderLeft: "6px solid #c9a96e" }}>
                <h2 style={{ color: "#fcf8f2" }}>✒️ Line Weight Studio</h2>
                <p className="subtitle" style={{ color: "rgba(252, 248, 242, 0.7)" }}>Drafting the perfect floor plan</p>
            </ScrollReveal>

            <ScrollReveal className="content-card" delay={150}>
                <p style={{ marginBottom: "1rem", color: "#4a3728", fontSize: "1.05rem" }}>
                    Select a pen from the toolbar and click the lines on the blueprint below to apply standard architectural line weights.
                </p>

                {/* Toolbar */}
                <div style={{ display: "flex", gap: "10px", marginBottom: "1.5rem", flexWrap: "wrap", justifyContent: "center" }}>
                    {["heavy", "medium", "light"].map(weight => (
                        <button
                            key={weight}
                            onClick={() => setActivePen(weight)}
                            style={{
                                display: "flex", alignItems: "center", gap: "8px",
                                background: activePen === weight ? "#e8dfd5" : "transparent",
                                border: `2px solid ${activePen === weight ? WEIGHTS[weight].color : "#d9cbb9"} `,
                                color: WEIGHTS[weight].color,
                                padding: "8px 16px", borderRadius: "8px", cursor: "pointer", fontWeight: 600, transition: "all 0.2s"
                            }}
                        >
                            {/* Pen thickness visual indicator */}
                            <div style={{ width: "20px", height: `${WEIGHTS[weight].width} px`, background: WEIGHTS[weight].color, borderRadius: "2px" }} />
                            {WEIGHTS[weight].name}
                        </button>
                    ))}
                </div>

                {/* Status indicator */}
                <div style={{ textAlign: "center", marginBottom: "1rem", minHeight: "24px", fontWeight: "bold", color: isAllCorrect ? "#2e7d32" : "#8b7355" }}>
                    {isComplete
                        ? (isAllCorrect ? "✨ Perfect Draft! The hierarchy is clear." : "Almost there. Check your wall slices vs details.")
                        : `Drafted: ${assignedCount} / ${totalElements} elements`}
                </div >

                {/* SVG Drawing Canvas */}
                < div style={{
                    background: "#faf7f2",
                    borderRadius: "12px",
                    border: "2px solid #e8dfd5",
                    padding: "1rem",
                    width: "100%",
                    maxWidth: "600px",
                    margin: "0 auto",
                    boxShadow: "inset 0 2px 10px rgba(0,0,0,0.02)"
                }}>
                    <svg viewBox="0 0 400 300" style={{ width: "100%", height: "auto", display: "block" }}>
                        {/* Grid background */}
                        <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#d9cbb9" strokeWidth="0.5" opacity="0.5" />
                        </pattern>
                        <rect width="400" height="300" fill="url(#grid)" />

                        {/* Elements */}
                        {PLAN_ELEMENTS.map(el => {
                            const weightInfo = assignedWeights[el.id] ? WEIGHTS[assignedWeights[el.id]] : WEIGHTS.unassigned;
                            const isHoverable = true;

                            return (
                                <path
                                    key={el.id}
                                    d={el.d}
                                    fill={el.isLine ? "none" : (assignedWeights[el.id] ? "rgba(44,30,22,0.05)" : "none")}
                                    stroke={weightInfo.color}
                                    strokeWidth={weightInfo.width}
                                    strokeDasharray={(!assignedWeights[el.id] && !el.dash) ? "4 4" : (el.dash ? "6 4" : "none")}
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    style={{
                                        cursor: "pointer",
                                        transition: "all 0.3s ease",
                                    }}
                                    onClick={() => handleElementClick(el.id)}
                                    onMouseEnter={(e) => { e.target.style.opacity = "0.7"; }}
                                    onMouseLeave={(e) => { e.target.style.opacity = "1"; }}
                                />
                            );
                        })}
                    </svg>
                </div >

                {/* Hints */}
                < div style={{ marginTop: "1.5rem", fontSize: "0.85rem", color: "#5c4033", display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
                    <span><strong>Hint:</strong> Walls are cut (Heavy).</span>
                    <span>Doors/Windows are outlines (Medium).</span>
                    <span>Furniture/Tiles are details (Light).</span>
                </div >
            </ScrollReveal >
        </div >
    );
}
