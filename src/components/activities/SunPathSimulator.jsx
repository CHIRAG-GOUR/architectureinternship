import { useState, useRef, useEffect, useCallback } from "react";
import { playClick, playToggle, playSlide } from "../../utils/useSound";
import ScrollReveal from "../ScrollReveal";

const W = 700, H = 560;

const SEASONS = [
    { id: "summer", label: "Summer", emoji: "☀️", sunArc: 75, learn: "In summer the sun travels a HIGH arc (75°). Buildings need deep overhangs and shading to prevent overheating." },
    { id: "equinox", label: "Equinox", emoji: "🌤️", sunArc: 50, learn: "At the equinox the sun is at 50°. This is the baseline architects use to calibrate shading devices." },
    { id: "winter", label: "Winter", emoji: "❄️", sunArc: 25, learn: "In winter the sun stays LOW (25°). South-facing windows capture maximum warmth through 'passive solar gain'." },
];

const CLIMATES = [
    {
        id: "hot", label: "Hot / Arid", emoji: "🏜️",
        skyTop: "#f0c27f", skyBot: "#fceabb", groundCol: "#d4a76a", grassCol: "#c4956a",
        wallCol: "#f5d5a0", roofCol: "#c48040", trimCol: "#a06830",
        windowStyle: "small", roofStyle: "flat", wallThick: "thick",
        desc: "Small windows, thick walls (thermal mass), flat roof, courtyard.",
        learn: "In hot-arid climates, THICK WALLS absorb heat during the day and release it at night. Small windows minimize solar gain. Flat roofs and courtyards create shaded outdoor living.",
    },
    {
        id: "cold", label: "Cold", emoji: "🏔️",
        skyTop: "#a8c0d0", skyBot: "#dae8f0", groundCol: "#c5d5c0", grassCol: "#8ab880",
        wallCol: "#e8d5b8", roofCol: "#8b4533", trimCol: "#6b3020",
        windowStyle: "large-south", roofStyle: "pitched", wallThick: "thick",
        desc: "Large south-facing windows (passive solar gain), pitched roof for snow, insulation.",
        learn: "Cold climates use PASSIVE SOLAR GAIN — large south-facing windows let low winter sun heat interiors naturally. Pitched roofs shed snow. Thick insulation keeps warmth inside.",
    },
    {
        id: "tropical", label: "Tropical", emoji: "🌴",
        skyTop: "#62b6cb", skyBot: "#bee9e8", groundCol: "#7bb369", grassCol: "#5a9a48",
        wallCol: "#f0e0c8", roofCol: "#4a7a3a", trimCol: "#3a5a2a",
        windowStyle: "large", roofStyle: "steep-pitch", wallThick: "thin",
        desc: "Cross-ventilation, steep pitched roof for rain, deep overhangs, raised on stilts.",
        learn: "Tropical design prioritizes AIRFLOW. Large openable windows enable cross-ventilation. Steep roofs shed heavy rain. Stilts protect from flooding and improve air circulation underneath.",
    },
];

function rr(ctx, x, y, w, h, r) { ctx.beginPath(); ctx.roundRect(x, y, w, h, r); }

export default function SunPathSimulator() {
    const canvasRef = useRef(null);
    const containerRef = useRef(null);
    const [seasonIdx, setSeasonIdx] = useState(0);
    const [climateIdx, setClimateIdx] = useState(0);
    const [timeOfDay, setTimeOfDay] = useState(0.5);
    const [autoPlay, setAutoPlay] = useState(true);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const autoRef = useRef(null);
    const timeRef = useRef(0.5);
    const smokeParticles = useRef([]);
    const frameRef = useRef(0);

    const season = SEASONS[seasonIdx];
    const climate = CLIMATES[climateIdx];

    // Fullscreen
    const toggleFullscreen = () => {
        playClick();
        if (!document.fullscreenElement) {
            containerRef.current?.requestFullscreen?.();
        } else {
            document.exitFullscreen?.();
        }
    };
    useEffect(() => {
        const handler = () => setIsFullscreen(!!document.fullscreenElement);
        document.addEventListener("fullscreenchange", handler);
        return () => document.removeEventListener("fullscreenchange", handler);
    }, []);

    useEffect(() => {
        if (autoPlay) {
            const tick = () => { timeRef.current += 0.002; if (timeRef.current > 1) timeRef.current = 0; setTimeOfDay(timeRef.current); autoRef.current = requestAnimationFrame(tick); };
            autoRef.current = requestAnimationFrame(tick);
        }
        return () => cancelAnimationFrame(autoRef.current);
    }, [autoPlay]);

    useEffect(() => { timeRef.current = timeOfDay; }, [timeOfDay]);

    const draw = useCallback(() => {
        const cvs = canvasRef.current;
        if (!cvs) return;
        const ctx = cvs.getContext("2d");
        ctx.clearRect(0, 0, W, H);
        frameRef.current++;

        const groundY = H - 120;
        const t = timeOfDay;
        const sunMaxAngle = season.sunArc;
        const sunBrightness = Math.sin(t * Math.PI);

        // Sky
        const skyGrad = ctx.createLinearGradient(0, 0, 0, groundY);
        skyGrad.addColorStop(0, climate.skyTop); skyGrad.addColorStop(1, climate.skyBot);
        ctx.fillStyle = skyGrad; ctx.fillRect(0, 0, W, groundY);
        if (sunBrightness < 0.3) { ctx.fillStyle = `rgba(25,15,8,${0.4 - sunBrightness})`; ctx.fillRect(0, 0, W, groundY); }

        // Clouds
        ctx.fillStyle = `rgba(255,255,255,${sunBrightness * 0.3})`;
        [[100, 70], [350, 45], [550, 80], [250, 35]].forEach(([cx, cy]) => {
            ctx.beginPath(); ctx.ellipse(cx + Math.sin(frameRef.current * 0.006 + cx) * 5, cy, 35, 13, 0, 0, Math.PI * 2); ctx.fill();
            ctx.beginPath(); ctx.ellipse(cx + 20 + Math.sin(frameRef.current * 0.006 + cx) * 5, cy - 7, 25, 11, 0, 0, Math.PI * 2); ctx.fill();
        });

        // Sun arc
        const arcCx = W / 2, arcCy = groundY, arcRx = W * 0.42, arcRy = sunMaxAngle * 3.8;
        ctx.setLineDash([4, 8]); ctx.strokeStyle = `rgba(255,200,50,${sunBrightness * 0.2})`; ctx.lineWidth = 1;
        ctx.beginPath();
        for (let i = 0; i <= 1; i += 0.02) { const a = Math.PI - i * Math.PI; const sx = arcCx + arcRx * Math.cos(a), sy = arcCy - arcRy * Math.sin(a); i === 0 ? ctx.moveTo(sx, sy) : ctx.lineTo(sx, sy); }
        ctx.stroke(); ctx.setLineDash([]);

        ctx.fillStyle = `rgba(255,200,50,${sunBrightness * 0.35})`; ctx.font = "11px Inter, sans-serif"; ctx.textAlign = "center";
        ctx.fillText(`${sunMaxAngle}° max altitude`, arcCx, arcCy - arcRy - 12);

        // Sun
        const sunAngle = Math.PI - t * Math.PI;
        const sunX = arcCx + arcRx * Math.cos(sunAngle), sunY = arcCy - arcRy * Math.sin(sunAngle);
        const glowR = 55 + sunBrightness * 20;
        const glow = ctx.createRadialGradient(sunX, sunY, 5, sunX, sunY, glowR);
        glow.addColorStop(0, `rgba(255,220,50,${sunBrightness * 0.6})`); glow.addColorStop(0.5, `rgba(255,200,80,${sunBrightness * 0.15})`); glow.addColorStop(1, "rgba(255,200,80,0)");
        ctx.fillStyle = glow; ctx.fillRect(sunX - glowR, sunY - glowR, glowR * 2, glowR * 2);
        ctx.fillStyle = `rgba(255,200,50,${0.6 + sunBrightness * 0.4})`; ctx.beginPath(); ctx.arc(sunX, sunY, 20, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = `rgba(255,230,100,${sunBrightness * 0.35})`; ctx.lineWidth = 2;
        for (let a = 0; a < Math.PI * 2; a += Math.PI / 8) { ctx.beginPath(); ctx.moveTo(sunX + Math.cos(a) * 24, sunY + Math.sin(a) * 24); ctx.lineTo(sunX + Math.cos(a) * 36, sunY + Math.sin(a) * 36); ctx.stroke(); }

        // Ground
        ctx.fillStyle = climate.groundCol; ctx.fillRect(0, groundY, W, H - groundY);
        ctx.fillStyle = climate.grassCol;
        for (let gx = 0; gx < W; gx += 8) { ctx.beginPath(); ctx.ellipse(gx, groundY + Math.sin(gx * 0.3) * 2, 5, 3, 0, 0, Math.PI * 2); ctx.fill(); }

        // ═══ HOUSE ═══
        const hx = W / 2 - 75, hy = groundY, hw = 150, hh = 105;
        const wallY = hy - hh;

        // Shadow
        ctx.fillStyle = `rgba(0,0,0,${sunBrightness * 0.05})`; ctx.beginPath(); ctx.ellipse(hx + hw / 2, hy + 8, hw * 0.55, 8, 0, 0, Math.PI * 2); ctx.fill();

        // Foundation
        ctx.fillStyle = "#a09080"; rr(ctx, hx - 4, hy - 6, hw + 8, 10, 2); ctx.fill();

        // Walls
        ctx.fillStyle = climate.wallCol; rr(ctx, hx, wallY, hw, hh, [5, 5, 0, 0]); ctx.fill();
        ctx.strokeStyle = "rgba(0,0,0,0.04)"; ctx.lineWidth = 0.5;
        for (let wy = wallY + 10; wy < hy; wy += 8) { ctx.beginPath(); ctx.moveTo(hx, wy); ctx.lineTo(hx + hw, wy); ctx.stroke(); }
        ctx.strokeStyle = climate.trimCol; ctx.lineWidth = 2; ctx.strokeRect(hx, wallY, hw, hh);

        // Roof
        if (climate.roofStyle === "flat") {
            ctx.fillStyle = climate.roofCol; ctx.fillRect(hx - 12, wallY - 10, hw + 24, 14);
            ctx.strokeStyle = climate.trimCol; ctx.lineWidth = 1.5; ctx.strokeRect(hx - 12, wallY - 10, hw + 24, 14);
            for (let rx = hx - 8; rx < hx + hw + 18; rx += 14) { ctx.fillStyle = climate.trimCol; ctx.fillRect(rx, wallY - 15, 7, 5); }
        } else {
            const oh = climate.roofStyle === "steep-pitch" ? 25 : 14;
            const pk = climate.roofStyle === "steep-pitch" ? 60 : 42;
            ctx.fillStyle = climate.roofCol;
            ctx.beginPath(); ctx.moveTo(hx - oh, wallY + 2); ctx.lineTo(hx + hw / 2, wallY - pk); ctx.lineTo(hx + hw + oh, wallY + 2); ctx.closePath(); ctx.fill();
            ctx.strokeStyle = "rgba(0,0,0,0.1)"; ctx.lineWidth = 0.8;
            for (let rl = 1; rl <= 4; rl++) { const f = rl / 5; const ly = wallY + 2 - pk * (1 - f); const lxL = hx - oh + (hw / 2 + oh) * f; const lxR = hx + hw + oh - (hw / 2 + oh) * f; ctx.beginPath(); ctx.moveTo(lxL - 3, ly + 2); ctx.lineTo(lxR + 3, ly + 2); ctx.stroke(); }
            ctx.strokeStyle = climate.trimCol; ctx.lineWidth = 2;
            ctx.beginPath(); ctx.moveTo(hx - oh, wallY + 2); ctx.lineTo(hx + hw / 2, wallY - pk); ctx.lineTo(hx + hw + oh, wallY + 2); ctx.closePath(); ctx.stroke();
        }

        // Chimney + smoke
        const chimX = hx + hw * 0.7, chimW = 16, chimH = 34;
        const chimY = wallY - chimH + 8;
        ctx.fillStyle = "#8c5c3c"; rr(ctx, chimX, chimY, chimW, chimH, [3, 3, 0, 0]); ctx.fill();
        ctx.fillStyle = "#6a4030"; ctx.fillRect(chimX - 2, chimY - 3, chimW + 4, 5);
        ctx.strokeStyle = "rgba(0,0,0,0.1)"; ctx.lineWidth = 0.5;
        for (let cy = chimY + 5; cy < chimY + chimH; cy += 5) { ctx.beginPath(); ctx.moveTo(chimX, cy); ctx.lineTo(chimX + chimW, cy); ctx.stroke(); }
        if (frameRef.current % 12 === 0) smokeParticles.current.push({ x: chimX + chimW / 2, y: chimY - 8, r: 4, alpha: 0.35 });
        smokeParticles.current = smokeParticles.current.filter(p => p.alpha > 0.01);
        smokeParticles.current.forEach(p => { p.y -= 0.6; p.x += Math.sin(p.y * 0.05) * 0.5; p.r += 0.15; p.alpha -= 0.003; ctx.fillStyle = `rgba(180,170,160,${p.alpha})`; ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill(); });

        // Door
        const doorX = hx + hw / 2 - 13, doorY = hy - 42, doorW = 26, doorH = 42;
        ctx.fillStyle = "#6b3a22"; rr(ctx, doorX, doorY, doorW, doorH, [6, 6, 0, 0]); ctx.fill();
        ctx.strokeStyle = "#4a2815"; ctx.lineWidth = 1.5; ctx.stroke();
        ctx.fillStyle = "#d4a860"; ctx.beginPath(); ctx.arc(doorX + doorW - 6, doorY + doorH / 2, 2.5, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = "rgba(0,0,0,0.08)"; ctx.lineWidth = 0.8; ctx.strokeRect(doorX + 4, doorY + 4, doorW - 8, doorH * 0.4); ctx.strokeRect(doorX + 4, doorY + doorH * 0.5, doorW - 8, doorH * 0.4);
        ctx.fillStyle = climate.trimCol; ctx.fillRect(doorX - 6, doorY - 5, doorW + 12, 4);

        // Windows
        const winCol = `rgba(135,200,245,${0.4 + sunBrightness * 0.4})`;
        const winGlint = `rgba(255,255,255,${sunBrightness * 0.25})`;
        function drawWindow(wx, wy, ww, wh, hasShutters = true) {
            ctx.fillStyle = climate.trimCol; ctx.fillRect(wx - 2, wy - 2, ww + 4, wh + 4);
            ctx.fillStyle = winCol; ctx.fillRect(wx, wy, ww, wh);
            ctx.strokeStyle = climate.trimCol; ctx.lineWidth = 1.5;
            ctx.beginPath(); ctx.moveTo(wx + ww / 2, wy); ctx.lineTo(wx + ww / 2, wy + wh); ctx.moveTo(wx, wy + wh / 2); ctx.lineTo(wx + ww, wy + wh / 2); ctx.stroke();
            ctx.fillStyle = winGlint; ctx.beginPath(); ctx.moveTo(wx + 3, wy + 3); ctx.lineTo(wx + ww * 0.4, wy + 3); ctx.lineTo(wx + 3, wy + wh * 0.4); ctx.closePath(); ctx.fill();
            if (hasShutters) { ctx.fillStyle = climate.roofCol; ctx.fillRect(wx - 8, wy - 2, 6, wh + 4); ctx.fillRect(wx + ww + 2, wy - 2, 6, wh + 4); }
            ctx.fillStyle = climate.trimCol; ctx.fillRect(wx - 4, wy + wh + 2, ww + 8, 3);
        }
        if (climate.windowStyle === "small") { drawWindow(hx + 14, wallY + 24, 22, 26); drawWindow(hx + hw - 36, wallY + 24, 22, 26); }
        else if (climate.windowStyle === "large-south") { drawWindow(hx + hw - 45, wallY + 16, 36, 58, true); drawWindow(hx + 12, wallY + 28, 18, 20, false); ctx.fillStyle = "rgba(92,64,51,0.4)"; ctx.font = "bold 9px Inter, sans-serif"; ctx.textAlign = "center"; ctx.fillText("SOUTH →", hx + hw - 28, hy + 18); }
        else {
            drawWindow(hx + 12, wallY + 18, 30, 52, true); drawWindow(hx + hw - 42, wallY + 18, 30, 52, true);
            ctx.strokeStyle = `rgba(100,200,255,${sunBrightness * 0.5})`; ctx.lineWidth = 2; ctx.setLineDash([4, 4]);
            ctx.beginPath(); ctx.moveTo(hx - 20, wallY + 44); ctx.lineTo(hx + hw + 20, wallY + 44); ctx.stroke(); ctx.setLineDash([]);
            ctx.beginPath(); ctx.moveTo(hx + hw + 20, wallY + 44); ctx.lineTo(hx + hw + 12, wallY + 39); ctx.lineTo(hx + hw + 12, wallY + 49); ctx.closePath(); ctx.fillStyle = `rgba(100,200,255,${sunBrightness * 0.5})`; ctx.fill();
        }

        // Tropical stilts
        if (climate.id === "tropical") { ctx.strokeStyle = "#5c4033"; ctx.lineWidth = 4;[hx + 10, hx + hw / 2, hx + hw - 10].forEach(sx => { ctx.beginPath(); ctx.moveTo(sx, hy); ctx.lineTo(sx, hy + 24); ctx.stroke(); }); }

        // Shadow
        if (sunBrightness > 0.1) { const sd = sunX < hx + hw / 2 ? 1 : -1; const sl = Math.min(160, 90 * (1 - sunBrightness + 0.3)) * sd; const sg = ctx.createLinearGradient(sd > 0 ? hx + hw : hx, hy, sd > 0 ? hx + hw + sl : hx + sl, hy); sg.addColorStop(0, `rgba(0,0,0,${sunBrightness * 0.1})`); sg.addColorStop(1, "rgba(0,0,0,0)"); ctx.fillStyle = sg; ctx.fillRect(sd > 0 ? hx + hw : hx + sl, hy - 3, Math.abs(sl), 10); }

        // Garden
        [[hx - 22, hy - 12], [hx + hw + 8, hy - 14]].forEach(([bx, by]) => { ctx.fillStyle = climate.id === "hot" ? "#a89060" : "#5a8a3a"; ctx.beginPath(); ctx.ellipse(bx, by, 14, 11, 0, 0, Math.PI * 2); ctx.fill(); ctx.beginPath(); ctx.ellipse(bx + 10, by + 2, 11, 9, 0, 0, Math.PI * 2); ctx.fill(); });
        if (climate.id === "hot") { ctx.fillStyle = "#a06030"; ctx.fillRect(doorX - 18, hy - 14, 9, 12); ctx.fillStyle = "#e06040"; ctx.beginPath(); ctx.arc(doorX - 14, hy - 17, 5, 0, Math.PI * 2); ctx.fill(); }
        if (climate.id === "tropical") { const ptx = hx - 60; ctx.strokeStyle = "#6a5030"; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(ptx, hy); ctx.quadraticCurveTo(ptx - 3, hy - 55, ptx + 5, hy - 85); ctx.stroke(); ctx.fillStyle = "#3a7a2a";[[-15, -5], [15, -3], [0, -12], [-20, 5], [20, 5], [-8, -8], [8, -8]].forEach(([dx, dy]) => { ctx.beginPath(); ctx.ellipse(ptx + 5 + dx, hy - 87 + dy, 18, 5, dx * 0.04, 0, Math.PI * 2); ctx.fill(); }); ctx.fillStyle = "#8a6530";[[-2, 2], [3, 4], [0, 6]].forEach(([dx, dy]) => { ctx.beginPath(); ctx.arc(ptx + 5 + dx, hy - 82 + dy, 3, 0, Math.PI * 2); ctx.fill(); }); }
        if (climate.id === "cold") { const ptx = hx + hw + 55; ctx.strokeStyle = "#5a3a20"; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(ptx, hy); ctx.lineTo(ptx, hy - 35); ctx.stroke(); ctx.fillStyle = "#2a6a2a";[[-14, 0], [-10, -22], [-6, -42]].forEach(([dx, dy]) => { ctx.beginPath(); ctx.moveTo(ptx + dx, hy - 28 + dy); ctx.lineTo(ptx, hy - 50 + dy); ctx.lineTo(ptx - dx, hy - 28 + dy); ctx.closePath(); ctx.fill(); }); }

        // Compass
        const compX = W - 45, compY = groundY - 22;
        ctx.fillStyle = `rgba(255,255,255,${sunBrightness * 0.3})`; ctx.beginPath(); ctx.arc(compX, compY, 18, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = "rgba(92,64,51,0.3)"; ctx.lineWidth = 1; ctx.stroke();
        ctx.fillStyle = "rgba(92,64,51,0.5)"; ctx.font = "bold 9px Inter, sans-serif"; ctx.textAlign = "center";
        ctx.fillText("N", compX, compY - 22); ctx.fillText("S", compX, compY + 28); ctx.fillText("E", compX - 24, compY + 3); ctx.fillText("W", compX + 24, compY + 3);

        // Time
        const hr = 6 + t * 12; const h = Math.floor(hr), m = Math.floor((hr % 1) * 60);
        ctx.fillStyle = `rgba(92,64,51,${0.3 + sunBrightness * 0.4})`; ctx.font = "bold 14px Inter, sans-serif"; ctx.textAlign = "left";
        ctx.fillText(`${h}:${m.toString().padStart(2, "0")} ${h >= 12 ? "PM" : "AM"}`, 15, groundY - 10);

    }, [timeOfDay, season, climate]);

    useEffect(() => { const loop = () => { draw(); requestAnimationFrame(loop); }; const id = requestAnimationFrame(loop); return () => cancelAnimationFrame(id); }, [draw]);

    return (
        <ScrollReveal className="content-card" delay={200}>
            <div ref={containerRef} style={{ background: isFullscreen ? "#fefcf7" : "transparent", padding: isFullscreen ? "1.5rem" : 0, borderRadius: isFullscreen ? 0 : undefined, overflow: "auto", maxHeight: isFullscreen ? "100vh" : undefined }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.3rem" }}>
                    <h4 style={{ fontSize: "1.3rem", color: "#5c4033", margin: 0 }}>☀️ Sun Path Simulator</h4>
                    <button onClick={toggleFullscreen} style={{ padding: "0.3rem 0.6rem", borderRadius: 6, fontSize: "0.8rem", border: "1px solid #ddd", background: "#fefcf7", cursor: "pointer", color: "#5c4033", fontWeight: 600 }}>
                        {isFullscreen ? "✕ Exit" : "⛶ Fullscreen"}
                    </button>
                </div>
                <p style={{ fontSize: "1rem", color: "#8a7560", marginBottom: "0.8rem" }}>
                    Watch how the <strong>same house</strong> transforms across climates and seasons. Every design choice has a reason.
                </p>

                <div style={{ display: "flex", gap: "0.4rem", marginBottom: "0.4rem", flexWrap: "wrap" }}>
                    <span style={{ fontSize: "0.8rem", color: "#8a7560", fontWeight: 600, alignSelf: "center", marginRight: "0.3rem" }}>Season:</span>
                    {SEASONS.map((s, i) => (
                        <button key={s.id} onClick={() => { setSeasonIdx(i); playToggle(); }} style={{
                            padding: "0.4rem 0.7rem", borderRadius: 8, fontSize: "0.85rem",
                            border: `2px solid ${seasonIdx === i ? "#c9a96e" : "#ddd"}`, background: seasonIdx === i ? "rgba(201,169,110,0.15)" : "#fefcf7",
                            color: "#5c4033", cursor: "pointer", fontWeight: 600, transition: "all 0.2s",
                        }}>{s.emoji} {s.label}</button>
                    ))}
                </div>

                <div style={{ display: "flex", gap: "0.4rem", marginBottom: "0.5rem", flexWrap: "wrap" }}>
                    <span style={{ fontSize: "0.8rem", color: "#8a7560", fontWeight: 600, alignSelf: "center", marginRight: "0.3rem" }}>Climate:</span>
                    {CLIMATES.map((c, i) => (
                        <button key={c.id} onClick={() => { setClimateIdx(i); playToggle(); }} style={{
                            padding: "0.4rem 0.7rem", borderRadius: 8, fontSize: "0.85rem",
                            border: `2px solid ${climateIdx === i ? "#6b8f71" : "#ddd"}`, background: climateIdx === i ? "rgba(107,143,113,0.12)" : "#fefcf7",
                            color: "#5c4033", cursor: "pointer", fontWeight: 600, transition: "all 0.2s",
                        }}>{c.emoji} {c.label}</button>
                    ))}
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.5rem" }}>
                    <span style={{ fontSize: "0.8rem", color: "#8a7560" }}>🌅 Sunrise</span>
                    <input type="range" min="0" max="1" step="0.005" value={timeOfDay}
                        onChange={(e) => { setAutoPlay(false); setTimeOfDay(parseFloat(e.target.value)); playSlide(); }}
                        style={{ flex: 1, accentColor: "#c9a96e" }} />
                    <span style={{ fontSize: "0.8rem", color: "#8a7560" }}>🌇 Sunset</span>
                    <button onClick={() => { setAutoPlay(!autoPlay); playClick(); }} style={{
                        padding: "0.3rem 0.6rem", borderRadius: 6, fontSize: "0.8rem",
                        border: "1px solid #ddd", background: autoPlay ? "rgba(107,143,113,0.12)" : "#fefcf7",
                        color: "#5c4033", cursor: "pointer", fontWeight: 600,
                    }}>{autoPlay ? "⏸ Pause" : "▶ Play"}</button>
                </div>

                <canvas ref={canvasRef} width={W} height={H}
                    style={{ borderRadius: 12, display: "block", margin: "0 auto", width: "100%", border: "1px solid rgba(92,64,51,0.08)" }} />

                {/* Learning panel */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.6rem", marginTop: "0.8rem" }}>
                    <div style={{ background: "rgba(201,169,110,0.06)", borderRadius: 10, padding: "0.7rem 0.9rem", border: "1px solid rgba(201,169,110,0.15)" }}>
                        <p style={{ fontSize: "0.85rem", color: "#6b8f71", fontWeight: 700, margin: 0 }}>🏠 Climate Lesson:</p>
                        <p style={{ fontSize: "0.85rem", color: "#8a7560", marginTop: "0.3rem" }}>{climate.learn}</p>
                    </div>
                    <div style={{ background: "rgba(201,169,110,0.06)", borderRadius: 10, padding: "0.7rem 0.9rem", border: "1px solid rgba(201,169,110,0.15)" }}>
                        <p style={{ fontSize: "0.85rem", color: "#c9a96e", fontWeight: 700, margin: 0 }}>{season.emoji} Season Lesson:</p>
                        <p style={{ fontSize: "0.85rem", color: "#8a7560", marginTop: "0.3rem" }}>{season.learn}</p>
                    </div>
                </div>
            </div>
        </ScrollReveal>
    );
}
