import { useState, useRef, useEffect, useCallback } from "react";
import ScrollReveal from "../ScrollReveal";

/*
  LayoutPlanner — Interactive grid activity for Chapter 1.2
  Users place rooms on a grid to create spatial layouts.
  The system analyzes whether the layout is Linear, Radial, or Clustered.
*/

const GRID = 10;
const CELL = 40;
const COLORS = {
    empty: "rgba(237,228,217,0.4)",
    room: "#c9a96e",
    center: "#6b8f71",
    corridor: "#C78F57",
};

function analyzeLayout(grid) {
    const rooms = [];
    for (let r = 0; r < GRID; r++)
        for (let c = 0; c < GRID; c++)
            if (grid[r][c]) rooms.push({ r, c });

    if (rooms.length < 3) return { type: "none", confidence: 0 };

    // Check linearity
    const rows = new Set(rooms.map((p) => p.r));
    const cols = new Set(rooms.map((p) => p.c));
    const isLinearH = rows.size <= 2;
    const isLinearV = cols.size <= 2;

    // Check radial — rooms clustered around center
    const avgR = rooms.reduce((s, p) => s + p.r, 0) / rooms.length;
    const avgC = rooms.reduce((s, p) => s + p.c, 0) / rooms.length;
    const dists = rooms.map((p) => Math.sqrt((p.r - avgR) ** 2 + (p.c - avgC) ** 2));
    const avgDist = dists.reduce((a, b) => a + b, 0) / dists.length;
    const distVariance = dists.reduce((s, d) => s + (d - avgDist) ** 2, 0) / dists.length;
    const isRadial = distVariance < 2.5 && avgDist > 1.5 && avgDist < 4;

    // Check clustering — multiple groups
    const spread = Math.max(...dists) - Math.min(...dists);

    if (isLinearH || isLinearV) return { type: "Linear", confidence: 85, desc: "Rooms form a clear line — directional, journey-like!" };
    if (isRadial) return { type: "Radial", confidence: 80, desc: "Rooms radiate from a center — hub-like organization!" };
    return { type: "Clustered", confidence: 70 + Math.min(spread * 3, 20), desc: "Organic grouping — flexible and village-like!" };
}

export default function LayoutPlanner() {
    const [grid, setGrid] = useState(Array.from({ length: GRID }, () => Array(GRID).fill(0)));
    const [tool, setTool] = useState("room"); // room, erase
    const [isDrawing, setIsDrawing] = useState(false);
    const canvasRef = useRef(null);
    const analysis = analyzeLayout(grid);

    const roomCount = grid.flat().filter(Boolean).length;

    const drawGrid = useCallback(() => {
        const cvs = canvasRef.current;
        if (!cvs) return;
        const ctx = cvs.getContext("2d");
        ctx.clearRect(0, 0, cvs.width, cvs.height);

        for (let r = 0; r < GRID; r++) {
            for (let c = 0; c < GRID; c++) {
                const x = c * CELL;
                const y = r * CELL;
                ctx.fillStyle = grid[r][c] ? COLORS.room : COLORS.empty;
                ctx.fillRect(x + 1, y + 1, CELL - 2, CELL - 2);
                ctx.strokeStyle = "rgba(92,64,51,0.15)";
                ctx.strokeRect(x + 1, y + 1, CELL - 2, CELL - 2);

                if (grid[r][c]) {
                    // Room shadow
                    ctx.fillStyle = "rgba(92,64,51,0.15)";
                    ctx.fillRect(x + 3, y + 3, CELL - 2, CELL - 2);
                    ctx.fillStyle = COLORS.room;
                    ctx.fillRect(x + 1, y + 1, CELL - 2, CELL - 2);
                    // Inner
                    ctx.fillStyle = "rgba(255,255,255,0.2)";
                    ctx.fillRect(x + 4, y + 4, CELL - 8, CELL - 8);
                }
            }
        }

        // Draw center marker if radial
        if (analysis.type === "Radial" && roomCount > 0) {
            const rooms = [];
            for (let r = 0; r < GRID; r++)
                for (let c = 0; c < GRID; c++)
                    if (grid[r][c]) rooms.push({ r, c });
            const avgR = rooms.reduce((s, p) => s + p.r, 0) / rooms.length;
            const avgC = rooms.reduce((s, p) => s + p.c, 0) / rooms.length;
            ctx.beginPath();
            ctx.arc(avgC * CELL + CELL / 2, avgR * CELL + CELL / 2, 6, 0, Math.PI * 2);
            ctx.fillStyle = COLORS.center;
            ctx.fill();
        }
    }, [grid, analysis, roomCount]);

    useEffect(() => { drawGrid(); }, [drawGrid]);

    const handleCell = (e) => {
        const rect = canvasRef.current.getBoundingClientRect();
        const c = Math.floor((e.clientX - rect.left) / CELL);
        const r = Math.floor((e.clientY - rect.top) / CELL);
        if (r < 0 || r >= GRID || c < 0 || c >= GRID) return;
        setGrid((prev) => {
            const next = prev.map((row) => [...row]);
            next[r][c] = tool === "room" ? 1 : 0;
            return next;
        });
    };

    const clear = () => setGrid(Array.from({ length: GRID }, () => Array(GRID).fill(0)));

    return (
        <ScrollReveal className="content-card" delay={200}>
            <h4 style={{ fontSize: "1.3rem", marginBottom: "0.3rem" }}>🏗️ Layout Planner</h4>
            <p style={{ fontSize: "1.05rem", color: "#5c4033", marginBottom: "1rem" }}>
                Place rooms on the grid to create spatial layouts. The system will analyze your organization pattern!
            </p>

            <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem", flexWrap: "wrap" }}>
                <button onClick={() => setTool("room")}
                    style={{ padding: "0.5rem 1rem", borderRadius: 8, border: `2px solid ${tool === "room" ? "#c9a96e" : "#ddd"}`, background: tool === "room" ? "#c9a96e" : "#fefcf7", color: tool === "room" ? "#fff" : "#5c4033", cursor: "pointer", fontWeight: 600, fontSize: "0.9rem" }}>
                    🧱 Place Room
                </button>
                <button onClick={() => setTool("erase")}
                    style={{ padding: "0.5rem 1rem", borderRadius: 8, border: `2px solid ${tool === "erase" ? "#C78F57" : "#ddd"}`, background: tool === "erase" ? "#C78F57" : "#fefcf7", color: tool === "erase" ? "#fff" : "#5c4033", cursor: "pointer", fontWeight: 600, fontSize: "0.9rem" }}>
                    🧹 Erase
                </button>
                <button onClick={clear}
                    style={{ padding: "0.5rem 1rem", borderRadius: 8, border: "1px solid #ddd", background: "#fefcf7", color: "#5c4033", cursor: "pointer", marginLeft: "auto", fontSize: "0.9rem" }}>
                    Clear
                </button>
            </div>

            <canvas
                ref={canvasRef}
                width={GRID * CELL}
                height={GRID * CELL}
                className="sim-canvas"
                style={{ border: "1px solid rgba(92,64,51,0.15)", borderRadius: 8, background: "#fefcf7" }}
                onMouseDown={(e) => { setIsDrawing(true); handleCell(e); }}
                onMouseMove={(e) => isDrawing && handleCell(e)}
                onMouseUp={() => setIsDrawing(false)}
                onMouseLeave={() => setIsDrawing(false)}
                onTouchStart={(e) => { setIsDrawing(true); handleCell(e.touches[0]); }}
                onTouchMove={(e) => { e.preventDefault(); handleCell(e.touches[0]); }}
                onTouchEnd={() => setIsDrawing(false)}
            />

            <div style={{ textAlign: "center", marginTop: "1rem" }}>
                {roomCount < 3 ? (
                    <p style={{ fontSize: "1.1rem", fontStyle: "italic", color: "#8a7560" }}>
                        Place at least 3 rooms to see analysis...
                    </p>
                ) : (
                    <div style={{ background: "rgba(201,169,110,0.1)", borderRadius: 12, padding: "1rem", border: "1px solid rgba(201,169,110,0.2)" }}>
                        <p style={{ fontSize: "1.2rem", fontWeight: 700, color: "#5c4033", margin: 0 }}>
                            {analysis.type === "Linear" && "📏"} {analysis.type === "Radial" && "🎯"} {analysis.type === "Clustered" && "🏘️"} {analysis.type} Organization
                        </p>
                        <p style={{ fontSize: "1rem", color: "#6b4d3b", marginTop: "0.3rem" }}>{analysis.desc}</p>
                        <div style={{ marginTop: "0.5rem", background: "#EDE4D9", borderRadius: 6, height: 8, overflow: "hidden" }}>
                            <div style={{ width: `${analysis.confidence}%`, height: "100%", background: "linear-gradient(90deg, #c9a96e, #C78F57)", borderRadius: 6, transition: "width 0.5s" }} />
                        </div>
                        <p style={{ fontSize: "0.85rem", color: "#8a7560", marginTop: "0.3rem" }}>Confidence: {analysis.confidence}%</p>
                    </div>
                )}
            </div>
        </ScrollReveal>
    );
}
