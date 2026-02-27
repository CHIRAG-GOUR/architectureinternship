import { useState, useRef, useEffect, useCallback } from "react";
import { gsap } from "gsap";
import { playClick, playToggle, playSlide, playWhoosh } from "../../utils/useSound";
import ScrollReveal from "../ScrollReveal";

const W = 700, H = 520;

const STRATEGIES = [
    {
        id: "stilts", label: "On Stilts", emoji: "🏗️", color: "#c9a96e",
        desc: "\"Touch the earth lightly\" — the building floats above on stilts.",
        learn: "STILTS preserve the natural terrain. Water flows freely underneath, vegetation isn't disturbed, and the building barely touches the ground — ideal for flood-prone or ecologically sensitive sites."
    },
    {
        id: "earthshelter", label: "Earth-Sheltered", emoji: "⛰️", color: "#6b8f71",
        desc: "Dig into the hillside for natural insulation and a green roof.",
        learn: "EARTH-SHELTERING uses the ground itself as insulation. The consistent underground temperature (~15°C) means less heating/cooling energy. Green roofs absorb rainwater, reduce urban heat, and blend into the landscape."
    },
    {
        id: "terraced", label: "Terraced", emoji: "🪜", color: "#7b9cc7",
        desc: "Step down the slope in levels, each with its own view and terrace.",
        learn: "TERRACING follows the natural contours of the land. Each level gets its own outdoor space and views. This minimizes earth-moving while creating a dramatic stepped silhouette — common in Mediterranean hillside villages."
    },
    {
        id: "cutfill", label: "Cut & Fill", emoji: "🚧", color: "#C78F57",
        desc: "Excavate the uphill side and fill the downhill side — creating a flat pad.",
        learn: "CUT & FILL is the most common but most disruptive approach. The uphill soil is excavated and moved downhill to create a level surface. It allows standard construction but forever changes the natural drainage and ecology."
    },
];

const CONTEXTS = [
    {
        id: "forest", label: "Forest", emoji: "🌲", ground: "#5a8a3a", soil: "#6a5030", sky1: "#a8c8e8", sky2: "#d8e8f0",
        learn: "Forest sites require tree preservation plans. Root zones extend far beyond the canopy — cutting too close kills the tree."
    },
    {
        id: "desert", label: "Desert", emoji: "🏜️", ground: "#c4a870", soil: "#9a7848", sky1: "#e8c888", sky2: "#f0e0c0",
        learn: "Desert sites face flash flooding despite low rainfall. Buildings must channel water away and use thermal mass to handle extreme temperature swings."
    },
    {
        id: "coastal", label: "Coast", emoji: "🌊", ground: "#7a9a50", soil: "#7a6a40", sky1: "#88b8d0", sky2: "#c8e0e8",
        learn: "Coastal sites deal with salt corrosion, wind erosion, and storm surge. Materials must resist salt air and foundations need extra depth."
    },
];

function rr(ctx, x, y, w, h, r) { ctx.beginPath(); ctx.roundRect(x, y, w, h, r); }

export default function TerrainBuilder() {
    const canvasRef = useRef(null);
    const containerRef = useRef(null);
    const [slope, setSlope] = useState(25);
    const [strategyIdx, setStrategyIdx] = useState(0);
    const [contextIdx, setContextIdx] = useState(0);
    const [showWater, setShowWater] = useState(true);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const animSlope = useRef({ val: 25 });
    const waterOff = useRef(0);
    const frameRef = useRef(0);
    const animRef = useRef(null);

    const strategy = STRATEGIES[strategyIdx];
    const context = CONTEXTS[contextIdx];

    // Fullscreen
    const toggleFullscreen = () => {
        playClick();
        if (!document.fullscreenElement) containerRef.current?.requestFullscreen?.();
        else document.exitFullscreen?.();
    };
    useEffect(() => {
        const handler = () => setIsFullscreen(!!document.fullscreenElement);
        document.addEventListener("fullscreenchange", handler);
        return () => document.removeEventListener("fullscreenchange", handler);
    }, []);

    useEffect(() => { gsap.to(animSlope.current, { val: slope, duration: 0.6, ease: "power2.out" }); }, [slope]);

    function tY(x, sLY, sRY) { return sLY + (x / W) * (sRY - sLY); }

    // ── BUILDING DRAWINGS ──

    function drawStiltsHouse(ctx, cx, ty) {
        const hw = 110, hh = 72;
        const bx = cx - hw / 2, by = ty - hh - 38;
        // Stilts
        ctx.strokeStyle = "#5c4033"; ctx.lineWidth = 4;
        [bx + 14, bx + hw / 2, bx + hw - 14].forEach(sx => { ctx.beginPath(); ctx.moveTo(sx, by + hh); ctx.lineTo(sx, ty + 3); ctx.stroke(); });
        // Cross bracing
        ctx.strokeStyle = "rgba(92,64,51,0.3)"; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.moveTo(bx + 14, by + hh); ctx.lineTo(bx + hw / 2, ty); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(bx + hw - 14, by + hh); ctx.lineTo(bx + hw / 2, ty); ctx.stroke();
        // Platform
        ctx.fillStyle = "#8a7048"; ctx.fillRect(bx - 8, by + hh - 3, hw + 16, 6);
        // Walls
        ctx.fillStyle = "#f0e0c8"; rr(ctx, bx, by, hw, hh, [5, 5, 0, 0]); ctx.fill();
        ctx.strokeStyle = "rgba(0,0,0,0.04)"; ctx.lineWidth = 0.5;
        for (let wy = by + 10; wy < by + hh; wy += 7) { ctx.beginPath(); ctx.moveTo(bx, wy); ctx.lineTo(bx + hw, wy); ctx.stroke(); }
        ctx.strokeStyle = "#c9a96e"; ctx.lineWidth = 2; ctx.strokeRect(bx, by, hw, hh);
        // Roof
        ctx.fillStyle = "#8a5533";
        ctx.beginPath(); ctx.moveTo(bx - 14, by + 2); ctx.lineTo(bx + hw / 2, by - 32); ctx.lineTo(bx + hw + 14, by + 2); ctx.closePath(); ctx.fill();
        ctx.strokeStyle = "#6a3a20"; ctx.lineWidth = 1.5; ctx.stroke();
        for (let rl = 1; rl <= 3; rl++) { const f = rl / 4; const ly = by + 2 - 32 * (1 - f); ctx.strokeStyle = "rgba(0,0,0,0.08)"; ctx.lineWidth = 0.8; ctx.beginPath(); ctx.moveTo(bx - 14 + (hw / 2 + 14) * f, ly); ctx.lineTo(bx + hw + 14 - (hw / 2 + 14) * f, ly); ctx.stroke(); }
        // Windows
        [[bx + 14, by + 16, 20, 24], [bx + hw - 34, by + 16, 20, 24]].forEach(([wx, wy, ww, wh]) => {
            ctx.fillStyle = "#87c8f5"; ctx.fillRect(wx, wy, ww, wh);
            ctx.strokeStyle = "#5c4033"; ctx.lineWidth = 1; ctx.strokeRect(wx, wy, ww, wh);
            ctx.beginPath(); ctx.moveTo(wx + ww / 2, wy); ctx.lineTo(wx + ww / 2, wy + wh); ctx.moveTo(wx, wy + wh / 2); ctx.lineTo(wx + ww, wy + wh / 2); ctx.stroke();
            ctx.fillStyle = "#8a5533"; ctx.fillRect(wx - 6, wy, 4, wh); ctx.fillRect(wx + ww + 2, wy, 4, wh);
            ctx.fillStyle = "#5c4033"; ctx.fillRect(wx - 3, wy + wh + 2, ww + 6, 3);
        });
        // Door
        ctx.fillStyle = "#6b3a22"; rr(ctx, bx + hw / 2 - 11, by + hh - 33, 22, 33, [5, 5, 0, 0]); ctx.fill();
        ctx.fillStyle = "#d4a860"; ctx.beginPath(); ctx.arc(bx + hw / 2 + 6, by + hh - 17, 2, 0, Math.PI * 2); ctx.fill();
        // Label
        ctx.fillStyle = "rgba(92,64,51,0.4)"; ctx.font = "italic 10px Inter, sans-serif"; ctx.textAlign = "center"; ctx.fillText("ground preserved ✓", cx, ty + 20);
    }

    function drawEarthSheltered(ctx, cx, ty) {
        const hw = 120, hh = 60;
        const bx = cx - hw / 2, by = ty - hh;
        // Earth mound
        ctx.fillStyle = context.ground;
        ctx.beginPath(); ctx.ellipse(cx, ty, hw / 2 + 18, hh + 12, 0, Math.PI, 0); ctx.fill();
        // Grass detail
        ctx.fillStyle = context.id === "desert" ? "#b0985a" : "#4a7a2a";
        for (let gx = cx - 55; gx <= cx + 55; gx += 9) { const gy = ty - Math.sqrt(Math.max(0, (hw / 2 + 18) ** 2 - (gx - cx) ** 2)) * (hh + 12) / (hw / 2 + 18); ctx.beginPath(); ctx.ellipse(gx, gy - 2, 6, 3, 0, 0, Math.PI * 2); ctx.fill(); }
        // Front face
        ctx.fillStyle = "#d4c8b0"; rr(ctx, bx + 12, by + 8, hw - 24, hh - 8, [8, 8, 0, 0]); ctx.fill();
        ctx.strokeStyle = "#a09080"; ctx.lineWidth = 1.5; ctx.stroke();
        // Big window
        ctx.fillStyle = "#87c8f5"; rr(ctx, bx + 55, by + 15, 38, 32, 5); ctx.fill(); ctx.strokeStyle = "#5c4033"; ctx.lineWidth = 1; ctx.stroke();
        ctx.beginPath(); ctx.moveTo(bx + 74, by + 15); ctx.lineTo(bx + 74, by + 47); ctx.stroke();
        // Door
        ctx.fillStyle = "#6b3a22"; rr(ctx, bx + 22, by + hh - 42, 24, 42, [6, 6, 0, 0]); ctx.fill();
        ctx.fillStyle = "#d4a860"; ctx.beginPath(); ctx.arc(bx + 41, by + hh - 20, 2.5, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = "rgba(92,64,51,0.4)"; ctx.font = "italic 10px Inter, sans-serif"; ctx.textAlign = "center"; ctx.fillText("earth insulates →", cx + hw / 2 + 22, by + hh / 2);
    }

    function drawTerraced(ctx, cx, ty, slopeRad) {
        const levels = 3;
        const stepW = 65, stepH = 48, overlapX = 20;
        const totalW = stepW * levels - overlapX * (levels - 1);
        const startX = cx - totalW / 2;
        const stepDropY = stepH * 0.45;

        for (let i = 0; i < levels; i++) {
            const lx = startX + i * (stepW - overlapX);
            const ly = ty - stepH * 1.2 + i * stepDropY;

            // Wall with gradient
            const wallGrad = ctx.createLinearGradient(lx, ly, lx, ly + stepH);
            wallGrad.addColorStop(0, i === 0 ? "#f2e5d0" : i === 1 ? "#eadcc5" : "#e2d4bb");
            wallGrad.addColorStop(1, i === 0 ? "#e8d5b8" : i === 1 ? "#e0ccb0" : "#d8c4a8");
            ctx.fillStyle = wallGrad;
            rr(ctx, lx, ly, stepW, stepH, [4, 4, 0, 0]); ctx.fill();
            ctx.strokeStyle = "#7b9cc7"; ctx.lineWidth = 1.5; ctx.stroke();

            // Stripes
            ctx.strokeStyle = "rgba(0,0,0,0.03)"; ctx.lineWidth = 0.5;
            for (let wy = ly + 8; wy < ly + stepH; wy += 6) { ctx.beginPath(); ctx.moveTo(lx, wy); ctx.lineTo(lx + stepW, wy); ctx.stroke(); }

            // Flat roof slab
            ctx.fillStyle = "#8a7048"; ctx.fillRect(lx - 5, ly - 5, stepW + 10, 6);
            // Roof edge detail
            ctx.strokeStyle = "#6a5030"; ctx.lineWidth = 1; ctx.strokeRect(lx - 5, ly - 5, stepW + 10, 6);

            // Windows - different sizes per level
            const winW = stepW * 0.55, winH = stepH * 0.35;
            const winX = lx + (stepW - winW) / 2, winY = ly + 10;
            ctx.fillStyle = "#87c8f5"; rr(ctx, winX, winY, winW, winH, 3); ctx.fill();
            ctx.strokeStyle = "#5c4033"; ctx.lineWidth = 1; ctx.stroke();
            // Cross pane
            ctx.beginPath(); ctx.moveTo(winX + winW / 2, winY); ctx.lineTo(winX + winW / 2, winY + winH); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(winX, winY + winH / 2); ctx.lineTo(winX + winW, winY + winH / 2); ctx.stroke();
            // Shutters
            ctx.fillStyle = "#7b9cc7"; ctx.fillRect(winX - 5, winY, 4, winH); ctx.fillRect(winX + winW + 1, winY, 4, winH);
            // Sill
            ctx.fillStyle = "#5c4033"; ctx.fillRect(winX - 3, winY + winH + 1, winW + 6, 3);

            // Terrace railing (front)
            ctx.strokeStyle = "#5c4033"; ctx.lineWidth = 2;
            const railY = ly + stepH;
            // Railing top bar
            ctx.beginPath(); ctx.moveTo(lx - 8, railY - 12); ctx.lineTo(lx - 8, railY); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(lx - 12, railY - 12); ctx.lineTo(lx + 3, railY - 12); ctx.stroke();
            // Balcony platform
            ctx.fillStyle = "rgba(138,112,72,0.3)"; ctx.fillRect(lx - 12, railY - 3, 15, 3);

            // Door on ground level only
            if (i === levels - 1) {
                ctx.fillStyle = "#6b3a22"; rr(ctx, lx + stepW / 2 - 8, ly + stepH - 26, 16, 26, [4, 4, 0, 0]); ctx.fill();
                ctx.fillStyle = "#d4a860"; ctx.beginPath(); ctx.arc(lx + stepW / 2 + 3, ly + stepH - 13, 2, 0, Math.PI * 2); ctx.fill();
            }

            // Level number
            ctx.fillStyle = "rgba(123,156,199,0.5)"; ctx.font = "bold 9px Inter, sans-serif"; ctx.textAlign = "center";
            ctx.fillText(`L${i + 1}`, lx + stepW / 2, ly - 10);
        }

        // Connection lines between levels (showing the stepping)
        ctx.strokeStyle = "rgba(123,156,199,0.2)"; ctx.lineWidth = 1; ctx.setLineDash([3, 3]);
        for (let i = 0; i < levels - 1; i++) {
            const lx1 = startX + i * (stepW - overlapX) + stepW;
            const ly1 = ty - stepH * 1.2 + i * stepDropY + stepH;
            const ly2 = ty - stepH * 1.2 + (i + 1) * stepDropY;
            ctx.beginPath(); ctx.moveTo(lx1, ly1); ctx.lineTo(lx1, ly2); ctx.stroke();
        }
        ctx.setLineDash([]);

        ctx.fillStyle = "rgba(92,64,51,0.4)"; ctx.font = "italic 10px Inter, sans-serif"; ctx.textAlign = "center";
        ctx.fillText("follows contours ↗", cx, ty + 20);
    }

    function drawCutFill(ctx, cx, ty, slopeRad, sLY, sRY) {
        const hw = 110, hh = 65;
        const bx = cx - hw / 2, by = ty - hh;
        // Cut
        ctx.fillStyle = "rgba(200,120,60,0.2)";
        ctx.beginPath(); ctx.moveTo(bx - 25, ty); const ctY = tY(bx - 25, sLY, sRY); ctx.lineTo(bx - 25, ctY); ctx.lineTo(bx + hw / 2, ty); ctx.closePath(); ctx.fill();
        ctx.fillStyle = "#C78F57"; ctx.font = "bold 11px Inter, sans-serif"; ctx.textAlign = "center"; ctx.fillText("CUT", bx + 5, ty - 15);
        // Fill
        ctx.fillStyle = "rgba(100,170,60,0.2)";
        ctx.beginPath(); ctx.moveTo(bx + hw / 2, ty); const ftY = tY(bx + hw + 25, sLY, sRY); ctx.lineTo(bx + hw + 25, ftY); ctx.lineTo(bx + hw + 25, ty); ctx.closePath(); ctx.fill();
        ctx.fillStyle = "#6a9a40"; ctx.fillText("FILL", bx + hw - 5, ty - 15);
        // Pad
        ctx.fillStyle = "#a09080"; ctx.fillRect(bx - 14, ty - 3, hw + 28, 6);
        // House
        ctx.fillStyle = "#f0e0c8"; rr(ctx, bx, by, hw, hh, [5, 5, 0, 0]); ctx.fill();
        ctx.strokeStyle = "rgba(0,0,0,0.04)"; ctx.lineWidth = 0.5;
        for (let wy = by + 8; wy < by + hh; wy += 7) { ctx.beginPath(); ctx.moveTo(bx, wy); ctx.lineTo(bx + hw, wy); ctx.stroke(); }
        ctx.strokeStyle = "#C78F57"; ctx.lineWidth = 2; ctx.strokeRect(bx, by, hw, hh);
        // Roof
        ctx.fillStyle = "#8a5533";
        ctx.beginPath(); ctx.moveTo(bx - 10, by + 2); ctx.lineTo(bx + hw / 2, by - 30); ctx.lineTo(bx + hw + 10, by + 2); ctx.closePath(); ctx.fill();
        ctx.strokeStyle = "#6a3a20"; ctx.lineWidth = 1.5; ctx.stroke();
        // Windows
        [[bx + 14, by + 14, 20, 24], [bx + hw - 34, by + 14, 20, 24]].forEach(([wx, wy, ww, wh]) => {
            ctx.fillStyle = "#87c8f5"; ctx.fillRect(wx, wy, ww, wh);
            ctx.strokeStyle = "#5c4033"; ctx.lineWidth = 1; ctx.strokeRect(wx, wy, ww, wh);
            ctx.beginPath(); ctx.moveTo(wx + ww / 2, wy); ctx.lineTo(wx + ww / 2, wy + wh); ctx.moveTo(wx, wy + wh / 2); ctx.lineTo(wx + ww, wy + wh / 2); ctx.stroke();
            ctx.fillStyle = "#8a5533"; ctx.fillRect(wx - 5, wy, 4, wh); ctx.fillRect(wx + ww + 1, wy, 4, wh);
            ctx.fillStyle = "#5c4033"; ctx.fillRect(wx - 3, wy + wh + 2, ww + 6, 3);
        });
        ctx.fillStyle = "#6b3a22"; rr(ctx, bx + hw / 2 - 11, by + hh - 30, 22, 30, [5, 5, 0, 0]); ctx.fill();
        ctx.fillStyle = "#d4a860"; ctx.beginPath(); ctx.arc(bx + hw / 2 + 5, by + hh - 15, 2, 0, Math.PI * 2); ctx.fill();
    }

    const draw = useCallback(() => {
        const cvs = canvasRef.current;
        if (!cvs) return; const ctx = cvs.getContext("2d"); ctx.clearRect(0, 0, W, H);
        frameRef.current++;
        const s = animSlope.current.val; const slopeRad = (s * Math.PI) / 180;
        const groundBase = H - 90; const sLY = groundBase + 10;
        const sRY = Math.max(sLY - Math.tan(slopeRad) * (W - 40), 50);

        // Sky
        const skyGrad = ctx.createLinearGradient(0, 0, 0, Math.min(sLY, sRY));
        skyGrad.addColorStop(0, context.sky1); skyGrad.addColorStop(1, context.sky2);
        ctx.fillStyle = skyGrad; ctx.fillRect(0, 0, W, groundBase + 30);

        // Clouds
        ctx.fillStyle = "rgba(255,255,255,0.35)";
        [[80, 40], [320, 28], [540, 50], [200, 60]].forEach(([cx, cy]) => { ctx.beginPath(); ctx.ellipse(cx + Math.sin(frameRef.current * 0.006 + cx) * 3, cy, 32, 12, 0, 0, Math.PI * 2); ctx.fill(); ctx.beginPath(); ctx.ellipse(cx + 18 + Math.sin(frameRef.current * 0.006 + cx) * 3, cy - 6, 22, 10, 0, 0, Math.PI * 2); ctx.fill(); });

        // Underground
        ctx.fillStyle = context.soil; ctx.beginPath(); ctx.moveTo(0, sLY); ctx.lineTo(W, sRY); ctx.lineTo(W, H); ctx.lineTo(0, H); ctx.closePath(); ctx.fill();
        // Topsoil
        ctx.fillStyle = context.ground; ctx.beginPath(); ctx.moveTo(0, sLY); ctx.lineTo(W, sRY); ctx.lineTo(W, Math.min(sRY + 18, H)); ctx.lineTo(0, sLY + 18); ctx.closePath(); ctx.fill();
        // Contour
        ctx.strokeStyle = "rgba(0,0,0,0.06)"; ctx.lineWidth = 0.5;
        for (let i = 1; i <= 6; i++) { const off = i * 25; ctx.beginPath(); ctx.moveTo(0, sLY + off); ctx.lineTo(W, sRY + off); ctx.stroke(); }

        // Slope label
        ctx.fillStyle = "rgba(92,64,51,0.4)"; ctx.font = "11px Inter, sans-serif"; ctx.textAlign = "center";
        ctx.fillText(`${Math.round(s)}° slope (${Math.round(Math.tan(slopeRad) * 100)}% grade)`, W / 2, Math.min(sLY, sRY) - 12);
        ctx.strokeStyle = "rgba(92,64,51,0.2)"; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.arc(50, sLY, 28, -slopeRad, 0); ctx.stroke();

        // Trees
        [W * 0.06, W * 0.15, W * 0.72, W * 0.84, W * 0.93].forEach(tx => {
            const ty = tY(tx, sLY, sRY);
            if (context.id === "forest") { ctx.strokeStyle = "#5a3a20"; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(tx, ty); ctx.lineTo(tx, ty - 28); ctx.stroke(); ctx.fillStyle = "#2a5a1a";[[-12, 0], [-8, -17], [-5, -32]].forEach(([dx, dy]) => { ctx.beginPath(); ctx.moveTo(tx + dx, ty - 23 + dy); ctx.lineTo(tx, ty - 40 + dy); ctx.lineTo(tx - dx, ty - 23 + dy); ctx.closePath(); ctx.fill(); }); }
            else if (context.id === "desert") { ctx.fillStyle = "#5a8a3a"; ctx.beginPath(); ctx.ellipse(tx, ty - 16, 6, 16, 0, 0, Math.PI * 2); ctx.fill(); ctx.beginPath(); ctx.ellipse(tx - 7, ty - 12, 3.5, 8, 0.3, 0, Math.PI * 2); ctx.fill(); }
            else { ctx.fillStyle = "#5a7a3a"; ctx.beginPath(); ctx.ellipse(tx, ty - 7, 11, 8, 0, 0, Math.PI * 2); ctx.fill(); ctx.beginPath(); ctx.ellipse(tx + 7, ty - 3, 9, 6, 0, 0, Math.PI * 2); ctx.fill(); }
        });

        // Building
        const buildX = W * 0.42; const buildTY = tY(buildX, sLY, sRY);
        if (strategy.id === "stilts") drawStiltsHouse(ctx, buildX, buildTY);
        else if (strategy.id === "earthshelter") drawEarthSheltered(ctx, buildX, buildTY);
        else if (strategy.id === "terraced") drawTerraced(ctx, buildX, buildTY, slopeRad);
        else drawCutFill(ctx, buildX, buildTY, slopeRad, sLY, sRY);

        // Water
        if (showWater) {
            waterOff.current += 0.8; ctx.strokeStyle = "rgba(80,150,220,0.45)"; ctx.lineWidth = 2.5;
            ctx.setLineDash([6, 8]); ctx.lineDashOffset = -waterOff.current;
            ctx.beginPath(); ctx.moveTo(W - 15, sRY + 5); ctx.quadraticCurveTo(W * 0.55, (sLY + sRY) / 2 + 8, 15, sLY + 5); ctx.stroke();
            ctx.setLineDash([]); ctx.lineDashOffset = 0;
            ctx.fillStyle = "rgba(80,150,220,0.45)";
            ctx.beginPath(); ctx.moveTo(15, sLY + 5); ctx.lineTo(22, sLY); ctx.lineTo(22, sLY + 10); ctx.closePath(); ctx.fill();
            ctx.font = "9px Inter, sans-serif"; ctx.textAlign = "left"; ctx.fillText("💧 water flow ↓", 28, sLY + 20);
        }

        animRef.current = requestAnimationFrame(draw);
    }, [strategy, context, slope, showWater]);

    useEffect(() => { animRef.current = requestAnimationFrame(draw); return () => cancelAnimationFrame(animRef.current); }, [draw]);

    return (
        <ScrollReveal className="content-card" delay={400}>
            <div ref={containerRef} style={{ background: isFullscreen ? "#fefcf7" : "transparent", padding: isFullscreen ? "1.5rem" : 0, borderRadius: isFullscreen ? 0 : undefined, overflow: "auto", maxHeight: isFullscreen ? "100vh" : undefined }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.3rem" }}>
                    <h4 style={{ fontSize: "1.3rem", color: "#5c4033", margin: 0 }}>⛰️ Terrain Builder</h4>
                    <button onClick={toggleFullscreen} style={{ padding: "0.3rem 0.6rem", borderRadius: 6, fontSize: "0.8rem", border: "1px solid #ddd", background: "#fefcf7", cursor: "pointer", color: "#5c4033", fontWeight: 600 }}>
                        {isFullscreen ? "✕ Exit" : "⛶ Fullscreen"}
                    </button>
                </div>
                <p style={{ fontSize: "1rem", color: "#8a7560", marginBottom: "0.8rem" }}>
                    How should you build on a <strong>slope</strong>? Each strategy has trade-offs — explore all four.
                </p>

                <div style={{ display: "flex", gap: "0.4rem", marginBottom: "0.4rem", flexWrap: "wrap" }}>
                    <span style={{ fontSize: "0.8rem", color: "#8a7560", fontWeight: 600, alignSelf: "center", marginRight: "0.3rem" }}>Strategy:</span>
                    {STRATEGIES.map((s, i) => (
                        <button key={s.id} onClick={() => { setStrategyIdx(i); playToggle(); }} style={{
                            padding: "0.4rem 0.7rem", borderRadius: 8, fontSize: "0.85rem",
                            border: `2px solid ${strategyIdx === i ? s.color : "#ddd"}`, background: strategyIdx === i ? `${s.color}18` : "#fefcf7",
                            color: "#5c4033", cursor: "pointer", fontWeight: 600, transition: "all 0.2s",
                        }}>{s.emoji} {s.label}</button>
                    ))}
                </div>

                <div style={{ display: "flex", gap: "0.4rem", marginBottom: "0.4rem", flexWrap: "wrap" }}>
                    <span style={{ fontSize: "0.8rem", color: "#8a7560", fontWeight: 600, alignSelf: "center", marginRight: "0.3rem" }}>Site:</span>
                    {CONTEXTS.map((c, i) => (
                        <button key={c.id} onClick={() => { setContextIdx(i); playToggle(); }} style={{
                            padding: "0.4rem 0.7rem", borderRadius: 8, fontSize: "0.85rem",
                            border: `2px solid ${contextIdx === i ? "#6b8f71" : "#ddd"}`, background: contextIdx === i ? "rgba(107,143,113,0.1)" : "#fefcf7",
                            color: "#5c4033", cursor: "pointer", fontWeight: 600, transition: "all 0.2s",
                        }}>{c.emoji} {c.label}</button>
                    ))}
                    <button onClick={() => { setShowWater(!showWater); playClick(); }} style={{
                        padding: "0.4rem 0.7rem", borderRadius: 8, fontSize: "0.85rem", marginLeft: "auto",
                        border: `2px solid ${showWater ? "#7b9cc7" : "#ddd"}`, background: showWater ? "rgba(123,156,199,0.1)" : "#fefcf7",
                        color: "#5c4033", cursor: "pointer", fontWeight: 600, transition: "all 0.2s",
                    }}>💧 {showWater ? "Hide" : "Show"} Water</button>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.5rem" }}>
                    <span style={{ fontSize: "0.8rem", color: "#8a7560" }}>Flat 0°</span>
                    <input type="range" min="0" max="45" step="1" value={slope}
                        onChange={(e) => { setSlope(parseInt(e.target.value)); playSlide(); }}
                        style={{ flex: 1, accentColor: "#6b8f71" }} />
                    <span style={{ fontSize: "0.8rem", color: "#8a7560" }}>Steep 45°</span>
                    <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "#6b8f71", minWidth: 40 }}>{slope}°</span>
                </div>

                <canvas ref={canvasRef} width={W} height={H}
                    style={{ borderRadius: 12, display: "block", margin: "0 auto", width: "100%", border: "1px solid rgba(92,64,51,0.08)" }} />

                {/* Learning panels */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.6rem", marginTop: "0.8rem" }}>
                    <div style={{ background: "rgba(201,169,110,0.06)", borderRadius: 10, padding: "0.7rem 0.9rem", border: `1px solid ${strategy.color}25` }}>
                        <p style={{ fontSize: "0.85rem", color: strategy.color, fontWeight: 700, margin: 0 }}>{strategy.emoji} Strategy Lesson:</p>
                        <p style={{ fontSize: "0.85rem", color: "#8a7560", marginTop: "0.3rem" }}>{strategy.learn}</p>
                    </div>
                    <div style={{ background: "rgba(201,169,110,0.06)", borderRadius: 10, padding: "0.7rem 0.9rem", border: "1px solid rgba(107,143,113,0.15)" }}>
                        <p style={{ fontSize: "0.85rem", color: "#6b8f71", fontWeight: 700, margin: 0 }}>{context.emoji} Site Lesson:</p>
                        <p style={{ fontSize: "0.85rem", color: "#8a7560", marginTop: "0.3rem" }}>{context.learn}</p>
                    </div>
                </div>
            </div>
        </ScrollReveal>
    );
}
