import { useState, useRef, useEffect, useCallback } from "react";
import ScrollReveal from "../ScrollReveal";

/*
  RadialControlRoom — Interactive top-down radial architecture simulation
  Teaches centrality, hierarchy, and control in spatial organization.
  
  Features:
  - Central node with continuous pulse animation
  - 8 radiating arms with hover highlights
  - Click center → activate all arms
  - Click arm → toggle as dependent space
  - Lock/unlock toggle per arm
  - Visibility cones from center to active arms
  - Animated connection lines
  - Dark architectural diagram style with subtle grid
*/

const W = 580, H = 520;
const CX = W / 2, CY = H / 2;
const CENTER_R = 38;
const ARM_COUNT = 8;
const ARM_INNER = 75;
const ARM_OUTER = 190;
const ARM_WIDTH = 36;

function getArmAngle(i) {
    return (i * Math.PI * 2) / ARM_COUNT - Math.PI / 2;
}

function getArmRect(i) {
    const angle = getArmAngle(i);
    const midR = (ARM_INNER + ARM_OUTER) / 2;
    return {
        cx: CX + Math.cos(angle) * midR,
        cy: CY + Math.sin(angle) * midR,
        w: ARM_OUTER - ARM_INNER,
        h: ARM_WIDTH,
        angle,
    };
}

const ARM_LABELS = [
    "Wing A", "Wing B", "Wing C", "Wing D",
    "Wing E", "Wing F", "Wing G", "Wing H",
];

export default function RadialControlRoom() {
    const canvasRef = useRef(null);
    const animRef = useRef(null);
    const timeRef = useRef(0);
    const mouseRef = useRef({ x: -1, y: -1 });

    const [activeArms, setActiveArms] = useState(Array(ARM_COUNT).fill(false));
    const [lockedArms, setLockedArms] = useState(Array(ARM_COUNT).fill(false));
    const [hoveredArm, setHoveredArm] = useState(-1);
    const [centerActive, setCenterActive] = useState(false);
    const [allActivated, setAllActivated] = useState(false);
    const [showCones, setShowCones] = useState(true);
    const [stats, setStats] = useState({ active: 0, locked: 0 });

    // Update stats
    useEffect(() => {
        setStats({
            active: activeArms.filter(Boolean).length,
            locked: lockedArms.filter(Boolean).length,
        });
    }, [activeArms, lockedArms]);

    // Hit testing
    const hitTestCenter = useCallback((mx, my) => {
        const dx = mx - CX, dy = my - CY;
        return Math.sqrt(dx * dx + dy * dy) <= CENTER_R + 8;
    }, []);

    const hitTestArm = useCallback((mx, my) => {
        for (let i = 0; i < ARM_COUNT; i++) {
            const arm = getArmRect(i);
            const cos = Math.cos(-arm.angle), sin = Math.sin(-arm.angle);
            const lx = (mx - arm.cx) * cos - (my - arm.cy) * sin;
            const ly = (mx - arm.cx) * sin + (my - arm.cy) * cos;
            if (Math.abs(lx) <= arm.w / 2 + 6 && Math.abs(ly) <= arm.h / 2 + 6) {
                return i;
            }
        }
        return -1;
    }, []);

    // Handle click
    const handleClick = useCallback((e) => {
        const rect = canvasRef.current.getBoundingClientRect();
        const mx = e.clientX - rect.left;
        const my = e.clientY - rect.top;

        if (hitTestCenter(mx, my)) {
            // Click center → activate/deactivate all unlocked arms
            const allActive = activeArms.every((a, i) => a || lockedArms[i]);
            setActiveArms(prev => prev.map((a, i) => lockedArms[i] ? a : !allActive));
            setCenterActive(true);
            setAllActivated(!allActive);
            setTimeout(() => setCenterActive(false), 600);
            return;
        }

        const armIdx = hitTestArm(mx, my);
        if (armIdx >= 0 && !lockedArms[armIdx]) {
            setActiveArms(prev => {
                const next = [...prev];
                next[armIdx] = !next[armIdx];
                return next;
            });
        }
    }, [activeArms, lockedArms, hitTestCenter, hitTestArm]);

    // Handle mouse move
    const handleMouseMove = useCallback((e) => {
        const rect = canvasRef.current.getBoundingClientRect();
        mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
        const arm = hitTestArm(mouseRef.current.x, mouseRef.current.y);
        setHoveredArm(arm);

        // Set cursor
        if (hitTestCenter(mouseRef.current.x, mouseRef.current.y) || (arm >= 0 && !lockedArms[arm])) {
            canvasRef.current.style.cursor = "pointer";
        } else {
            canvasRef.current.style.cursor = "default";
        }
    }, [hitTestArm, hitTestCenter, lockedArms]);

    // Toggle lock on arm
    const toggleLock = (i) => {
        setLockedArms(prev => {
            const next = [...prev];
            next[i] = !next[i];
            if (next[i]) {
                setActiveArms(prev2 => {
                    const n = [...prev2];
                    n[i] = false;
                    return n;
                });
            }
            return next;
        });
    };

    // Animation loop
    const animate = useCallback(() => {
        const cvs = canvasRef.current;
        if (!cvs) return;
        const ctx = cvs.getContext("2d");
        const t = timeRef.current;
        timeRef.current += 0.016;
        ctx.clearRect(0, 0, W, H);

        // Background
        ctx.fillStyle = "#1a1714";
        ctx.fillRect(0, 0, W, H);

        // Subtle grid
        ctx.strokeStyle = "rgba(201,169,110,0.06)";
        ctx.lineWidth = 0.5;
        for (let x = 0; x < W; x += 30) {
            ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
        }
        for (let y = 0; y < H; y += 30) {
            ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
        }

        // Concentric reference circles
        ctx.strokeStyle = "rgba(201,169,110,0.08)";
        ctx.lineWidth = 0.5;
        [ARM_INNER, ARM_OUTER, ARM_OUTER + 30].forEach(r => {
            ctx.beginPath();
            ctx.arc(CX, CY, r, 0, Math.PI * 2);
            ctx.stroke();
        });

        // Connection lines from center to arms
        for (let i = 0; i < ARM_COUNT; i++) {
            const angle = getArmAngle(i);
            const active = activeArms[i];
            const locked = lockedArms[i];

            if (locked) continue;

            const lineEndR = active ? ARM_OUTER : ARM_INNER;
            const ex = CX + Math.cos(angle) * lineEndR;
            const ey = CY + Math.sin(angle) * lineEndR;

            // Animated dash
            ctx.save();
            ctx.setLineDash(active ? [6, 4] : [3, 8]);
            ctx.lineDashOffset = -t * 40;
            ctx.strokeStyle = active
                ? `rgba(201,169,110,${0.5 + Math.sin(t * 3 + i) * 0.2})`
                : "rgba(201,169,110,0.12)";
            ctx.lineWidth = active ? 2 : 1;
            ctx.beginPath();
            ctx.moveTo(CX, CY);
            ctx.lineTo(ex, ey);
            ctx.stroke();
            ctx.restore();
        }

        // Visibility cones
        if (showCones) {
            for (let i = 0; i < ARM_COUNT; i++) {
                if (!activeArms[i] || lockedArms[i]) continue;
                const angle = getArmAngle(i);
                const coneSpread = 0.18;
                const coneR = ARM_OUTER + 20;

                const grad = ctx.createRadialGradient(CX, CY, CENTER_R, CX, CY, coneR);
                grad.addColorStop(0, "rgba(201,169,110,0.12)");
                grad.addColorStop(1, "rgba(201,169,110,0)");

                ctx.save();
                ctx.fillStyle = grad;
                ctx.beginPath();
                ctx.moveTo(CX, CY);
                ctx.arc(CX, CY, coneR, angle - coneSpread, angle + coneSpread);
                ctx.closePath();
                ctx.fill();
                ctx.restore();
            }
        }

        // Draw arms
        for (let i = 0; i < ARM_COUNT; i++) {
            const arm = getArmRect(i);
            const active = activeArms[i];
            const locked = lockedArms[i];
            const hovered = hoveredArm === i;

            ctx.save();
            ctx.translate(arm.cx, arm.cy);
            ctx.rotate(arm.angle);

            // Arm body
            const rx = -arm.w / 2, ry = -arm.h / 2;

            if (locked) {
                ctx.fillStyle = "rgba(60,50,40,0.3)";
                ctx.strokeStyle = "rgba(100,85,70,0.3)";
            } else if (active) {
                ctx.fillStyle = `rgba(201,169,110,${0.25 + Math.sin(t * 2 + i * 0.5) * 0.08})`;
                ctx.strokeStyle = `rgba(201,169,110,${0.7 + Math.sin(t * 2 + i) * 0.15})`;
            } else if (hovered) {
                ctx.fillStyle = "rgba(201,169,110,0.15)";
                ctx.strokeStyle = "rgba(201,169,110,0.5)";
            } else {
                ctx.fillStyle = "rgba(92,64,51,0.15)";
                ctx.strokeStyle = "rgba(201,169,110,0.2)";
            }

            ctx.lineWidth = hovered || active ? 2 : 1;
            ctx.beginPath();
            ctx.roundRect(rx, ry, arm.w, arm.h, 4);
            ctx.fill();
            ctx.stroke();

            // Arm label
            ctx.fillStyle = locked
                ? "rgba(150,130,110,0.3)"
                : active ? "rgba(201,169,110,0.9)" : "rgba(201,169,110,0.5)";
            ctx.font = "11px Inter, sans-serif";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";

            // Rotate text to be readable
            if (arm.angle > Math.PI / 2 && arm.angle < Math.PI * 1.5) {
                ctx.rotate(Math.PI);
            }
            ctx.fillText(locked ? "🔒" : ARM_LABELS[i], 0, 0);

            ctx.restore();
        }

        // Central node — pulsing glow
        const pulseScale = 1 + Math.sin(t * 2.5) * 0.08;
        const glowR = CENTER_R * pulseScale;

        // Outer glow rings
        for (let g = 3; g >= 0; g--) {
            const r = glowR + g * 8;
            const alpha = (centerActive ? 0.2 : 0.06) * (1 - g * 0.22);
            ctx.beginPath();
            ctx.arc(CX, CY, r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(201,169,110,${alpha})`;
            ctx.fill();
        }

        // Center circle
        const centerGrad = ctx.createRadialGradient(CX - 5, CY - 5, 0, CX, CY, glowR);
        centerGrad.addColorStop(0, centerActive ? "#e8c872" : "#c9a96e");
        centerGrad.addColorStop(0.7, centerActive ? "#b8944d" : "#8a7048");
        centerGrad.addColorStop(1, centerActive ? "#9a7a3a" : "#5c4033");

        ctx.beginPath();
        ctx.arc(CX, CY, glowR, 0, Math.PI * 2);
        ctx.fillStyle = centerGrad;
        ctx.fill();
        ctx.strokeStyle = `rgba(201,169,110,${0.6 + Math.sin(t * 3) * 0.2})`;
        ctx.lineWidth = 2;
        ctx.stroke();

        // Center label
        ctx.fillStyle = "#fefcf7";
        ctx.font = "bold 13px Inter, sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("HUB", CX, CY - 2);
        ctx.font = "9px Inter, sans-serif";
        ctx.fillStyle = "rgba(254,252,247,0.7)";
        ctx.fillText("Click me", CX, CY + 12);

        // Legend
        ctx.fillStyle = "rgba(201,169,110,0.5)";
        ctx.font = "11px Inter, sans-serif";
        ctx.textAlign = "left";
        ctx.fillText(`Active: ${stats.active}/${ARM_COUNT}`, 12, H - 36);
        ctx.fillText(`Locked: ${stats.locked}/${ARM_COUNT}`, 12, H - 20);

        // Influence indicator
        const influence = stats.active / (ARM_COUNT - stats.locked || 1);
        ctx.fillStyle = "rgba(201,169,110,0.3)";
        ctx.fillRect(W - 120, H - 24, 100, 8);
        ctx.fillStyle = influence > 0.6 ? "rgba(107,143,113,0.8)" : "rgba(201,169,110,0.7)";
        ctx.fillRect(W - 120, H - 24, 100 * influence, 8);
        ctx.fillStyle = "rgba(201,169,110,0.5)";
        ctx.font = "10px Inter, sans-serif";
        ctx.textAlign = "right";
        ctx.fillText("Central Influence", W - 20, H - 30);

        animRef.current = requestAnimationFrame(animate);
    }, [activeArms, lockedArms, hoveredArm, centerActive, showCones, stats]);

    useEffect(() => {
        animRef.current = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(animRef.current);
    }, [animate]);

    return (
        <ScrollReveal className="content-card" delay={200}>
            <h4 style={{ fontSize: "1.3rem", marginBottom: "0.3rem", color: "#5c4033" }}>
                🎯 Radial Control Room
            </h4>
            <p style={{ fontSize: "1rem", color: "#8a7560", marginBottom: "0.8rem" }}>
                Explore how centrality, hierarchy, and control work in radial architecture.
                Click the <strong>HUB</strong> to activate all wings. Click individual wings to toggle them.
                Lock wings to restrict access and see how central influence changes.
            </p>

            <div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.8rem", flexWrap: "wrap" }}>
                <button onClick={() => setShowCones(prev => !prev)}
                    style={{
                        padding: "0.4rem 0.9rem", borderRadius: 8, fontSize: "0.85rem",
                        border: `2px solid ${showCones ? "#c9a96e" : "#555"}`,
                        background: showCones ? "rgba(201,169,110,0.15)" : "rgba(50,40,30,0.3)",
                        color: showCones ? "#c9a96e" : "#8a7560",
                        cursor: "pointer", fontWeight: 600,
                    }}>
                    {showCones ? "👁️ Cones ON" : "👁️ Cones OFF"}
                </button>
                <button onClick={() => {
                    setActiveArms(Array(ARM_COUNT).fill(false));
                    setLockedArms(Array(ARM_COUNT).fill(false));
                }}
                    style={{
                        padding: "0.4rem 0.9rem", borderRadius: 8, fontSize: "0.85rem",
                        border: "1px solid #555", background: "rgba(50,40,30,0.3)",
                        color: "#8a7560", cursor: "pointer", marginLeft: "auto",
                    }}>
                    Reset
                </button>
            </div>

            <canvas
                ref={canvasRef}
                width={W}
                height={H}
                onClick={handleClick}
                onMouseMove={handleMouseMove}
                onMouseLeave={() => { setHoveredArm(-1); mouseRef.current = { x: -1, y: -1 }; }}
                style={{ borderRadius: 12, display: "block", margin: "0 auto", maxWidth: "100%" }}
            />

            {/* Arm lock controls */}
            <div style={{ marginTop: "0.8rem" }}>
                <p style={{ fontSize: "0.85rem", color: "#8a7560", marginBottom: "0.4rem", fontWeight: 600 }}>
                    🔐 Wing Access Control:
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.3rem" }}>
                    {ARM_LABELS.map((label, i) => (
                        <button key={i} onClick={() => toggleLock(i)}
                            style={{
                                padding: "0.3rem 0.6rem", borderRadius: 6, fontSize: "0.8rem",
                                border: `1px solid ${lockedArms[i] ? "#e57373" : activeArms[i] ? "#6b8f71" : "#555"}`,
                                background: lockedArms[i] ? "rgba(229,115,115,0.12)" : activeArms[i] ? "rgba(107,143,113,0.12)" : "rgba(50,40,30,0.3)",
                                color: lockedArms[i] ? "#e57373" : activeArms[i] ? "#6b8f71" : "#8a7560",
                                cursor: "pointer", fontWeight: 600, minWidth: 58,
                            }}>
                            {lockedArms[i] ? "🔒" : "🔓"} {label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Educational insight */}
            <div style={{
                marginTop: "1rem", background: "rgba(201,169,110,0.06)", borderRadius: 10,
                padding: "0.8rem 1rem", border: "1px solid rgba(201,169,110,0.15)",
            }}>
                <p style={{ fontSize: "0.95rem", color: "#c9a96e", fontWeight: 700, margin: 0 }}>
                    💡 What you're seeing:
                </p>
                <p style={{ fontSize: "0.9rem", color: "#8a7560", marginTop: "0.3rem" }}>
                    {stats.locked === 0 && stats.active === 0 && "Click the central HUB to see how radial organization gives the center total control over all connected spaces."}
                    {stats.active > 0 && stats.locked === 0 && `The center controls ${stats.active} wing${stats.active > 1 ? "s" : ""}. In radial architecture, the hub sees and accesses everything — maximum hierarchy.`}
                    {stats.locked > 0 && stats.active > 0 && `With ${stats.locked} wing${stats.locked > 1 ? "s" : ""} locked, central influence drops. Real buildings use this — restricted wings reduce the hub's power.`}
                    {stats.locked > 0 && stats.active === 0 && `${stats.locked} wing${stats.locked > 1 ? "s" : ""} locked. Try activating the remaining ones — notice how locking reduces the center's sphere of control.`}
                </p>
            </div>
        </ScrollReveal>
    );
}
