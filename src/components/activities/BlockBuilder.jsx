import { useRef, useEffect, useState, useCallback } from "react";
import ScrollReveal from "../ScrollReveal";

const BRUSH_TYPES = [
    { id: "mass", label: "Mass", color: "#B89A82", glyph: "▮" },
    { id: "volume", label: "Volume", color: "#85ABAB", glyph: "◻" },
    { id: "void", label: "Void", color: "#C78F57", glyph: "○" },
];

const CELL = 36;
const COLS = 14;
const ROWS = 9;

function analyze(grid) {
    let m = 0, v = 0, vd = 0;
    for (let r = 0; r < ROWS; r++)
        for (let c = 0; c < COLS; c++) {
            if (grid[r][c] === "mass") m++;
            else if (grid[r][c] === "volume") v++;
            else if (grid[r][c] === "void") vd++;
        }
    const total = m + v + vd;
    if (total === 0) return { m: 0, v: 0, vd: 0, feel: "Touch the canvas to begin building..." };
    const mp = Math.round((m / total) * 100);
    const vp = Math.round((v / total) * 100);
    const vdp = Math.round((vd / total) * 100);
    let feel;
    if (mp > 60) feel = "Heavy and grounded — like a fortress carved from stone.";
    else if (vp > 50) feel = "Spacious and open — a place to breathe and gather.";
    else if (vdp > 40) feel = "Light and permeable — air and light flow freely.";
    else if (mp > 25 && vp > 25 && vdp > 10) feel = "Balanced. Solid walls define flowing spaces — great architecture.";
    else feel = "Keep exploring — every mark changes the space.";
    return { m: mp, v: vp, vd: vdp, feel };
}

export default function BlockBuilder() {
    const canvasRef = useRef(null);
    const [grid, setGrid] = useState(() => Array.from({ length: ROWS }, () => Array(COLS).fill(null)));
    const [brush, setBrush] = useState("mass");
    const [drawing, setDrawing] = useState(false);
    const result = analyze(grid);

    const draw = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        const w = COLS * CELL, h = ROWS * CELL;
        canvas.width = w; canvas.height = h;
        ctx.fillStyle = "#fefcf7";
        ctx.fillRect(0, 0, w, h);
        for (let r = 0; r < ROWS; r++)
            for (let c = 0; c < COLS; c++) {
                const x = c * CELL, y = r * CELL;
                const bt = BRUSH_TYPES.find(b => b.id === grid[r][c]);
                if (bt) {
                    ctx.fillStyle = bt.color + "50"; ctx.fillRect(x + 1, y + 1, CELL - 2, CELL - 2);
                    ctx.fillStyle = bt.color; ctx.font = "16px Inter, sans-serif";
                    ctx.textAlign = "center"; ctx.textBaseline = "middle";
                    ctx.fillText(bt.glyph, x + CELL / 2, y + CELL / 2);
                }
                ctx.strokeStyle = "rgba(58,46,31,0.06)"; ctx.strokeRect(x, y, CELL, CELL);
            }
    }, [grid]);

    useEffect(() => { draw(); }, [draw]);

    const getCellFromEvent = (e) => {
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const sx = canvas.width / rect.width, sy = canvas.height / rect.height;
        const c = Math.floor((e.clientX - rect.left) * sx / CELL);
        const r = Math.floor((e.clientY - rect.top) * sy / CELL);
        return (r >= 0 && r < ROWS && c >= 0 && c < COLS) ? { r, c } : null;
    };

    const paint = (pos) => {
        if (!pos) return;
        setGrid(prev => { const ng = prev.map(row => [...row]); ng[pos.r][pos.c] = ng[pos.r][pos.c] === brush ? null : brush; return ng; });
    };

    const onDown = (e) => { setDrawing(true); paint(getCellFromEvent(e)); };
    const onMove = (e) => {
        if (!drawing) return;
        const pos = getCellFromEvent(e);
        if (!pos) return;
        setGrid(prev => { const ng = prev.map(row => [...row]); ng[pos.r][pos.c] = brush; return ng; });
    };

    useEffect(() => { const up = () => setDrawing(false); window.addEventListener("mouseup", up); return () => window.removeEventListener("mouseup", up); }, []);

    return (
        <div className="section-gap">
            <ScrollReveal className="heading-card">
                <h2>🏗️ Build a Structure</h2>
                <p className="subtitle">Choose a material and paint on the canvas</p>
            </ScrollReveal>

            <ScrollReveal className="content-card" delay={150}>
                <p style={{ marginBottom: "1rem", color: "#4a3728", fontSize: "1.15rem" }}>
                    Watch how the balance of solid, space, and openings changes the feeling of what you build.
                </p>

                {/* Brush selectors */}
                <div style={{ display: "flex", gap: "1.2rem", marginBottom: "1rem", flexWrap: "wrap" }}>
                    {BRUSH_TYPES.map(bt => (
                        <button
                            key={bt.id}
                            onClick={() => setBrush(bt.id)}
                            style={{
                                background: brush === bt.id ? bt.color + "20" : "transparent",
                                border: brush === bt.id ? `2px solid ${bt.color}` : "2px solid #d9c4a5",
                                borderRadius: "8px", padding: "6px 14px", cursor: "pointer",
                                fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: "0.9rem",
                                color: brush === bt.id ? bt.color : "#5c4033",
                                transition: "all 0.3s",
                            }}
                        >
                            {bt.glyph} {bt.label}
                        </button>
                    ))}
                    <button
                        onClick={() => setGrid(Array.from({ length: ROWS }, () => Array(COLS).fill(null)))}
                        style={{
                            background: "transparent", border: "2px solid #d9c4a5", borderRadius: "8px",
                            padding: "6px 14px", cursor: "pointer", fontFamily: "Inter", fontSize: "0.85rem",
                            color: "#5c4033", marginLeft: "auto",
                        }}
                    >
                        Clear
                    </button>
                </div>

                {/* Canvas */}
                <canvas
                    ref={canvasRef}
                    className="sim-canvas"
                    style={{ width: "100%", maxWidth: `${COLS * CELL}px`, aspectRatio: `${COLS}/${ROWS}` }}
                    onPointerDown={onDown}
                    onPointerMove={onMove}
                    onPointerUp={() => setDrawing(false)}
                    onPointerLeave={() => setDrawing(false)}
                />

                {/* Analysis */}
                <div style={{ marginTop: "1rem", display: "flex", gap: "1rem", fontSize: "1rem", color: "#5c4033", flexWrap: "wrap", justifyContent: "center" }}>
                    {BRUSH_TYPES.map(bt => (
                        <span key={bt.id} style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                            <span style={{ width: 10, height: 10, borderRadius: "50%", background: bt.color, display: "inline-block" }} />
                            {bt.id === "mass" ? result.m : bt.id === "volume" ? result.v : result.vd}%
                        </span>
                    ))}
                </div>
                <p style={{ marginTop: "0.6rem", fontStyle: "italic", color: "#5c4033", textAlign: "center", fontSize: "1.1rem" }}>{result.feel}</p>
            </ScrollReveal>
        </div>
    );
}
