import { useState, useRef, useEffect } from "react";
import ScrollReveal from "../ScrollReveal";

export default function TheVanishingPoint() {
    const [vpX, setVpX] = useState(250); // Vanishing Point X
    const [vpY, setVpY] = useState(150); // Vanishing Point Y (Horizon Line)
    const [isDraggingVP, setIsDraggingVP] = useState(false);
    const svgRef = useRef();

    const buildings = [
        { x: 50, y: 200, width: 80, height: 100, color: "#8b7355" }, // Left building
        { x: 350, y: 150, width: 100, height: 150, color: "#5c4033" }, // Right building
    ];

    const handlePointerDown = (e) => {
        setIsDraggingVP(true);
        e.target.setPointerCapture(e.pointerId);
    };

    const handlePointerMove = (e) => {
        if (!isDraggingVP) return;
        const rect = svgRef.current.getBoundingClientRect();
        // Constrain VP within SVG bounds
        const x = Math.max(0, Math.min(rect.width, e.clientX - rect.left));
        const y = Math.max(0, Math.min(rect.height, e.clientY - rect.top));
        setVpX(x);
        setVpY(y);
    };

    const handlePointerUp = (e) => {
        setIsDraggingVP(false);
        e.target.releasePointerCapture(e.pointerId);
    };

    return (
        <div className="section-gap">
            <ScrollReveal className="content-card">
                <div style={{ textAlign: "center" }}>
                    <h3 style={{ color: "#5c4033", marginBottom: "1rem" }}>The Vanishing Point</h3>
                    <p style={{ color: "#8b7355", fontSize: "0.95rem", marginBottom: "1.5rem" }}>
                        Drag the red Vanishing Point and the Horizon Line to see how One-Point Perspective dynamically updates the depth of the buildings.
                    </p>

                    <div
                        style={{
                            border: "2px solid #d9c4a5",
                            borderRadius: "8px",
                            overflow: "hidden",
                            background: "#f0efe9",
                            position: "relative"
                        }}
                    >
                        <svg
                            ref={svgRef}
                            viewBox="0 0 500 350"
                            style={{ width: "100%", height: "auto", display: "block" }}
                            onPointerMove={handlePointerMove}
                            onPointerUp={handlePointerUp}
                            onPointerCancel={handlePointerUp}
                        >
                            {/* Horizon Line */}
                            <line x1="0" y1={vpY} x2="500" y2={vpY} stroke="#c9a96e" strokeWidth="2" strokeDasharray="5,5" />
                            <text x="10" y={vpY - 10} fill="#c9a96e" fontSize="12" fontWeight="bold">Horizon Line (Eye Level)</text>

                            {/* Buildings and Convergence Lines */}
                            {buildings.map((b, i) => {
                                // Determine which face is visible to draw the depth
                                // In 1-point, front face is parallel to viewer

                                // Calculate corners of the front face
                                const topLeft = { x: b.x, y: b.y };
                                const topRight = { x: b.x + b.width, y: b.y };
                                const bottomLeft = { x: b.x, y: b.y + b.height };
                                const bottomRight = { x: b.x + b.width, y: b.y + b.height };

                                // Convergence lines (guidelines) to VP
                                return (
                                    <g key={i}>
                                        {/* Convergence guidelines (faint) */}
                                        <line x1={topLeft.x} y1={topLeft.y} x2={vpX} y2={vpY} stroke={b.color} strokeWidth="1" strokeDasharray="3,3" opacity="0.4" />
                                        <line x1={topRight.x} y1={topRight.y} x2={vpX} y2={vpY} stroke={b.color} strokeWidth="1" strokeDasharray="3,3" opacity="0.4" />

                                        {/* We don't draw bottom lines if they are hidden behind the front face relative to VP, but drawing all is fine for wireframe feel */}
                                        <line x1={bottomLeft.x} y1={bottomLeft.y} x2={vpX} y2={vpY} stroke={b.color} strokeWidth="1" strokeDasharray="3,3" opacity="0.4" />
                                        <line x1={bottomRight.x} y1={bottomRight.y} x2={vpX} y2={vpY} stroke={b.color} strokeWidth="1" strokeDasharray="3,3" opacity="0.4" />

                                        {/* Front Face (Solid) */}
                                        <rect x={b.x} y={b.y} width={b.width} height={b.height} fill={b.color} opacity="0.8" />
                                        <rect x={b.x} y={b.y} width={b.width} height={b.height} fill="none" stroke="#3e2a21" strokeWidth="2" />
                                    </g>
                                );
                            })}

                            {/* Interactive Vanishing Point */}
                            <circle
                                cx={vpX}
                                cy={vpY}
                                r="8"
                                fill="#c97a7e"
                                stroke="#ffffff"
                                strokeWidth="2"
                                onPointerDown={handlePointerDown}
                                style={{ cursor: "grab" }}
                            />
                            <text x={vpX + 15} y={vpY + 5} fill="#c97a7e" fontSize="12" fontWeight="bold">Vanishing Point</text>
                        </svg>
                    </div>
                </div>
            </ScrollReveal>
        </div>
    );
}
