import { useState, useRef, useEffect, useCallback } from "react";
import ScrollReveal from "../ScrollReveal";

const W = 340, H = 340, PAD = 55;
const SIDES = ["top", "right", "bottom", "left"];
const STATES = ["solid", "window", "door", "open"];
const STATE_META = {
    solid: { label: "Solid Wall", fill: "#3a2e1f", drawGap: false },
    window: { label: "Window", fill: "#C78F57", drawGap: true, gapRatio: 0.4 },
    door: { label: "Doorway", fill: "#C78F57", drawGap: true, gapRatio: 0.5 },
    open: { label: "Open", fill: "#d9c4a5", drawGap: true, gapRatio: 0.9 },
};

function getFeel(walls) {
    const s = Object.values(walls).filter(v => v === "solid").length;
    const o = Object.values(walls).filter(v => v === "open" || v === "door").length;
    if (s === 4) return "Enclosed. Protected. Still.";
    if (o >= 3) return "Boundless. The room dissolves into landscape.";
    if (o === 2 && s === 2) return "A passage. Space flows through.";
    if (s >= 2 && o >= 1) return "Sheltered, with a connection outside.";
    return "A space in tension — part shelter, part opening.";
}

export default function SpaceDesigner() {
    const canvasRef = useRef(null);
    const [walls, setWalls] = useState({ top: "solid", right: "solid", bottom: "solid", left: "solid" });

    const draw = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        canvas.width = W; canvas.height = H;
        ctx.clearRect(0, 0, W, H);
        const ix = PAD, iy = PAD, iw = W - PAD * 2, ih = H - PAD * 2;
        const sc = Object.values(walls).filter(v => v === "solid").length;
        ctx.fillStyle = `rgba(58,46,31,${0.03 + (sc / 4) * 0.06})`;
        ctx.fillRect(ix, iy, iw, ih);

        SIDES.forEach(side => {
            const st = walls[side], meta = STATE_META[st];
            ctx.lineWidth = st === "solid" ? 6 : 3;
            ctx.strokeStyle = meta.fill;
            let x1, y1, x2, y2;
            switch (side) {
                case "top": x1 = ix; y1 = iy; x2 = ix + iw; y2 = iy; break;
                case "right": x1 = ix + iw; y1 = iy; x2 = ix + iw; y2 = iy + ih; break;
                case "bottom": x1 = ix; y1 = iy + ih; x2 = ix + iw; y2 = iy + ih; break;
                case "left": x1 = ix; y1 = iy; x2 = ix; y2 = iy + ih; break;
            }
            if (!meta.drawGap) {
                ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
            } else {
                const len = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
                const gl = len * meta.gapRatio, dx = (x2 - x1) / len, dy = (y2 - y1) / len;
                const gs = (len - gl) / 2, ge = gs + gl;
                ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x1 + dx * gs, y1 + dy * gs); ctx.stroke();
                ctx.beginPath(); ctx.moveTo(x1 + dx * ge, y1 + dy * ge); ctx.lineTo(x2, y2); ctx.stroke();
                ctx.save(); ctx.setLineDash([4, 4]); ctx.lineWidth = 1; ctx.strokeStyle = meta.fill + "40";
                ctx.beginPath(); ctx.moveTo(x1 + dx * gs, y1 + dy * gs); ctx.lineTo(x1 + dx * ge, y1 + dy * ge); ctx.stroke(); ctx.restore();
            }
            const mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
            let lx = mx, ly = my;
            switch (side) { case "top": ly -= 16; break; case "bottom": ly += 18; break; case "left": lx -= 28; break; case "right": lx += 28; break; }
            ctx.font = "14px Inter, sans-serif"; ctx.fillStyle = meta.fill + "90"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
            ctx.fillText(meta.label, lx, ly);
        });

        ctx.font = "13px Inter"; ctx.fillStyle = "#3a2e1f40"; ctx.textAlign = "center";
        ctx.fillText("tap a side to change", W / 2, H / 2);
    }, [walls]);

    useEffect(() => { draw(); }, [draw]);

    const handleClick = (e) => {
        const canvas = canvasRef.current, rect = canvas.getBoundingClientRect();
        const sx = canvas.width / rect.width, sy = canvas.height / rect.height;
        const x = (e.clientX - rect.left) * sx, y = (e.clientY - rect.top) * sy;
        const ix = PAD, iy = PAD, iw = W - PAD * 2, ih = H - PAD * 2, mg = 22;
        let clicked = null;
        if (y < iy + mg && x > ix && x < ix + iw) clicked = "top";
        else if (y > iy + ih - mg && x > ix && x < ix + iw) clicked = "bottom";
        else if (x < ix + mg && y > iy && y < iy + ih) clicked = "left";
        else if (x > ix + iw - mg && y > iy && y < iy + ih) clicked = "right";
        if (clicked) setWalls(prev => ({ ...prev, [clicked]: STATES[(STATES.indexOf(prev[clicked]) + 1) % 4] }));
    };

    return (
        <div className="section-gap">
            <ScrollReveal className="heading-card">
                <h2>🏠 Sculpt a Space</h2>
                <p className="subtitle">Tap any wall to cycle: solid → window → doorway → open</p>
            </ScrollReveal>

            <ScrollReveal className="content-card" delay={150}>
                <p style={{ marginBottom: "1rem", color: "#4a3728", fontSize: "1.15rem" }}>
                    Feel how the space transforms as you open and close its boundaries.
                </p>
                <div style={{ display: "flex", justifyContent: "center" }}>
                    <canvas ref={canvasRef} className="sim-canvas" style={{ width: "320px", height: "320px" }} onClick={handleClick} />
                </div>
                <p style={{ marginTop: "1.2rem", fontStyle: "italic", color: "#5c4033", textAlign: "center", fontSize: "1.1rem" }}>
                    {getFeel(walls)}
                </p>
            </ScrollReveal>
        </div>
    );
}
