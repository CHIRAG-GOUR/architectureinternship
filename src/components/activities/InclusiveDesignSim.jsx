import { useState, useRef, useEffect, useCallback } from "react";
import { gsap } from "gsap";
import ScrollReveal from "../ScrollReveal";

/*
  InclusiveDesignSim — Enhanced Canvas 2D kitchen accessibility simulator.
  Merged with ProportionLab: includes height slider + architectural dimensions.
  4 user profiles with proper wheelchair & human drawing.
  GSAP-animated profile transitions.
*/

const W = 600, H = 520;

const PROFILES = [
    {
        id: "adult", label: "Standing Adult", emoji: "🧑", height: 175,
        eyeLevel: 160, maxReach: 210, minReach: 40,
        color: "#6b8f71",
    },
    {
        id: "child", label: "Child (8yr)", emoji: "🧒", height: 120,
        eyeLevel: 108, maxReach: 145, minReach: 25,
        color: "#c9a96e",
    },
    {
        id: "wheelchair", label: "Wheelchair User", emoji: "♿", height: 130,
        eyeLevel: 115, maxReach: 150, minReach: 55,
        color: "#7b9cc7", seated: true,
    },
    {
        id: "elderly", label: "Elderly", emoji: "🧓", height: 160,
        eyeLevel: 145, maxReach: 178, minReach: 50,
        color: "#C78F57",
    },
];

const ELEMENTS = [
    { id: "counter", label: "Counter", x: 55, w: 190, bottom: 0, height: 90, color: "#8a7048" },
    { id: "upper_cab", label: "Upper Cabinet", x: 55, w: 190, bottom: 150, height: 60, color: "#5c4033" },
    { id: "top_shelf", label: "Top Shelf", x: 310, w: 70, bottom: 200, height: 5, color: "#5c4033" },
    { id: "mid_shelf", label: "Mid Shelf", x: 310, w: 70, bottom: 130, height: 5, color: "#5c4033" },
    { id: "low_shelf", label: "Low Shelf", x: 310, w: 70, bottom: 55, height: 5, color: "#5c4033" },
    { id: "switch", label: "Light Switch", x: 420, w: 14, bottom: 130, height: 10, color: "#d4d4d4" },
    { id: "handle", label: "Door Handle", x: 490, w: 12, bottom: 100, height: 6, color: "#c9a96e" },
];

const ARCH_DIMS = [
    { label: "Door", ratio: 1.2, color: "#C78F57", unit: "m" },
    { label: "Counter", ratio: 0.5, color: "#6b8f71", unit: "m" },
    { label: "Reach", ratio: 1.3, color: "#9b7ec7", unit: "m" },
    { label: "Step", ratio: 0.1, color: "#c9a96e", unit: "cm", mult: 100 },
];

function isAccessible(el, maxReach, minReach) {
    const top = el.bottom + el.height;
    return el.bottom >= minReach && top <= maxReach;
}

export default function InclusiveDesignSim() {
    const canvasRef = useRef(null);
    const [profileIdx, setProfileIdx] = useState(0);
    const [customHeight, setCustomHeight] = useState(175);
    const [useCustom, setUseCustom] = useState(false);
    const animatedVals = useRef({ height: 175, maxReach: 210, minReach: 40, eyeLevel: 160 });
    const animRef = useRef(null);

    const profile = PROFILES[profileIdx];
    const effectiveHeight = useCustom ? customHeight : profile.height;
    const effectiveMaxReach = useCustom ? customHeight * 1.2 : profile.maxReach;
    const effectiveMinReach = useCustom ? Math.max(20, customHeight * 0.22) : profile.minReach;
    const effectiveEyeLevel = useCustom ? customHeight * 0.91 : profile.eyeLevel;

    const accessibleCount = ELEMENTS.filter(el => isAccessible(el, effectiveMaxReach, effectiveMinReach)).length;
    const accessPct = Math.round((accessibleCount / ELEMENTS.length) * 100);

    // GSAP smooth transition
    useEffect(() => {
        gsap.to(animatedVals.current, {
            height: effectiveHeight,
            maxReach: effectiveMaxReach,
            minReach: effectiveMinReach,
            eyeLevel: effectiveEyeLevel,
            duration: 0.6,
            ease: "power2.out",
        });
    }, [effectiveHeight, effectiveMaxReach, effectiveMinReach, effectiveEyeLevel]);

    const draw = useCallback(() => {
        const cvs = canvasRef.current;
        if (!cvs) return;
        const ctx = cvs.getContext("2d");
        ctx.clearRect(0, 0, W, H);

        const av = animatedVals.current;
        const scale = 1.5; // px per cm
        const groundY = H - 55;
        const kitchenW = 530;

        // ── Background ──
        ctx.fillStyle = "#f5ece0";
        ctx.fillRect(0, 0, W, H);

        // Floor
        ctx.fillStyle = "#8a7048";
        ctx.fillRect(0, groundY, W, H - groundY);

        // Floor texture
        ctx.strokeStyle = "rgba(140,115,75,0.5)";
        ctx.lineWidth = 0.5;
        for (let x = 0; x < W; x += 35) {
            ctx.beginPath(); ctx.moveTo(x, groundY); ctx.lineTo(x, H); ctx.stroke();
        }

        // Wall texture grain
        ctx.strokeStyle = "rgba(92,64,51,0.03)";
        for (let y = 0; y < groundY; y += 18) {
            ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
        }

        // ── Reach Zone Band ──
        const reachTop = groundY - av.maxReach * scale;
        const reachBot = groundY - av.minReach * scale;
        const grad = ctx.createLinearGradient(0, reachTop, 0, reachBot);
        grad.addColorStop(0, `${useCustom ? "#c9a96e" : profile.color}10`);
        grad.addColorStop(0.5, `${useCustom ? "#c9a96e" : profile.color}22`);
        grad.addColorStop(1, `${useCustom ? "#c9a96e" : profile.color}10`);
        ctx.fillStyle = grad;
        ctx.fillRect(0, reachTop, kitchenW, reachBot - reachTop);

        // Reach boundaries
        ctx.setLineDash([5, 5]);
        ctx.strokeStyle = `${useCustom ? "#c9a96e" : profile.color}45`;
        ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(0, reachTop); ctx.lineTo(kitchenW, reachTop); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0, reachBot); ctx.lineTo(kitchenW, reachBot); ctx.stroke();
        ctx.setLineDash([]);

        // Reach labels
        ctx.fillStyle = `${useCustom ? "#c9a96e" : profile.color}80`;
        ctx.font = "10px Inter, sans-serif";
        ctx.textAlign = "right";
        ctx.fillText(`↑ Max: ${Math.round(av.maxReach)}cm`, kitchenW - 6, reachTop - 4);
        ctx.fillText(`↓ Min: ${Math.round(av.minReach)}cm`, kitchenW - 6, reachBot + 12);

        // ── Kitchen Elements ──
        ELEMENTS.forEach(el => {
            const elY = groundY - (el.bottom + el.height) * scale;
            const elH = el.height * scale;
            const accessible = isAccessible(el, av.maxReach, av.minReach);

            // Shadow
            ctx.fillStyle = "rgba(0,0,0,0.04)";
            ctx.fillRect(el.x + 3, elY + 3, el.w, elH);

            // Body
            ctx.fillStyle = accessible ? "rgba(76,175,80,0.25)" : "rgba(229,115,115,0.25)";
            ctx.beginPath();
            ctx.roundRect(el.x, elY, el.w, elH, 3);
            ctx.fill();
            ctx.strokeStyle = accessible ? "#4caf50" : "#e57373";
            ctx.lineWidth = 1.5;
            ctx.stroke();

            // Label
            ctx.fillStyle = accessible ? "#2e7d32" : "#c62828";
            ctx.font = "bold 10px Inter, sans-serif";
            ctx.textAlign = "center";
            ctx.fillText(`${el.label} ${accessible ? "✓" : "✗"}`, el.x + el.w / 2, elY - 6);

            // Height annotation
            ctx.fillStyle = "rgba(92,64,51,0.3)";
            ctx.font = "9px Inter, sans-serif";
            ctx.fillText(`${el.bottom + el.height}cm`, el.x + el.w / 2, elY + elH + 11);
        });

        // ── Door opening ──
        ctx.fillStyle = "#3e2a1e";
        ctx.beginPath();
        ctx.roundRect(475, groundY - 210 * scale, 62, 210 * scale, [6, 6, 0, 0]);
        ctx.fill();
        ctx.fillStyle = "#5c4033";
        ctx.beginPath();
        ctx.roundRect(478, groundY - 207 * scale, 56, 207 * scale, [4, 4, 0, 0]);
        ctx.fill();

        // ── Human Figure ──
        const figX = 395;
        const figH = av.height * scale;
        const headR = Math.max(8, figH * 0.06);
        const isSeated = !useCustom && profile.seated;

        if (isSeated) {
            // ── Wheelchair (proper side view) ──
            const seatH = 48 * scale;
            const wheelR = 22;
            const smallWheelR = 8;
            const seatY = groundY - seatH;

            // Large rear wheel
            ctx.strokeStyle = "#444";
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(figX - 8, groundY - wheelR - 2, wheelR, 0, Math.PI * 2);
            ctx.stroke();
            // Wheel spokes
            ctx.lineWidth = 1;
            ctx.strokeStyle = "#666";
            for (let a = 0; a < Math.PI * 2; a += Math.PI / 4) {
                ctx.beginPath();
                ctx.moveTo(figX - 8, groundY - wheelR - 2);
                ctx.lineTo(figX - 8 + Math.cos(a) * wheelR, groundY - wheelR - 2 + Math.sin(a) * wheelR);
                ctx.stroke();
            }
            // Push rim
            ctx.strokeStyle = "#888";
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.arc(figX - 8, groundY - wheelR - 2, wheelR - 4, 0, Math.PI * 2);
            ctx.stroke();

            // Small front caster
            ctx.strokeStyle = "#444";
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(figX + 30, groundY - smallWheelR - 1, smallWheelR, 0, Math.PI * 2);
            ctx.stroke();

            // Seat frame
            ctx.strokeStyle = "#555";
            ctx.lineWidth = 2.5;
            // Seat horizontal
            ctx.beginPath();
            ctx.moveTo(figX - 20, seatY);
            ctx.lineTo(figX + 25, seatY);
            ctx.stroke();
            // Backrest
            ctx.beginPath();
            ctx.moveTo(figX - 20, seatY);
            ctx.lineTo(figX - 22, seatY - 40);
            ctx.stroke();
            // Front leg down to caster
            ctx.beginPath();
            ctx.moveTo(figX + 25, seatY);
            ctx.lineTo(figX + 30, groundY - smallWheelR * 2);
            ctx.stroke();
            // Rear leg to wheel axle
            ctx.beginPath();
            ctx.moveTo(figX - 15, seatY);
            ctx.lineTo(figX - 8, groundY - wheelR - 2);
            ctx.stroke();
            // Footrest
            ctx.beginPath();
            ctx.moveTo(figX + 22, seatY + 10);
            ctx.lineTo(figX + 28, groundY - smallWheelR * 2 - 5);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(figX + 25, groundY - smallWheelR * 2 - 5);
            ctx.lineTo(figX + 35, groundY - smallWheelR * 2 - 5);
            ctx.stroke();

            // Armrest
            ctx.strokeStyle = "#666";
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(figX - 18, seatY - 20);
            ctx.lineTo(figX + 18, seatY - 20);
            ctx.stroke();

            // Seated person body
            ctx.strokeStyle = profile.color;
            ctx.lineWidth = 3;
            // Torso (leaning slightly)
            ctx.beginPath();
            ctx.moveTo(figX, seatY);
            ctx.quadraticCurveTo(figX - 3, seatY - 35, figX - 5, seatY - 55);
            ctx.stroke();
            // Shoulders
            ctx.beginPath();
            ctx.moveTo(figX - 20, seatY - 45);
            ctx.lineTo(figX - 5, seatY - 50);
            ctx.lineTo(figX + 15, seatY - 45);
            ctx.stroke();
            // Arms down to armrest
            ctx.lineWidth = 2.5;
            ctx.beginPath();
            ctx.moveTo(figX - 20, seatY - 45);
            ctx.quadraticCurveTo(figX - 22, seatY - 30, figX - 16, seatY - 20);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(figX + 15, seatY - 45);
            ctx.quadraticCurveTo(figX + 18, seatY - 30, figX + 14, seatY - 20);
            ctx.stroke();
            // Legs (bent at knee)
            ctx.lineWidth = 2.5;
            ctx.beginPath();
            ctx.moveTo(figX - 5, seatY);
            ctx.quadraticCurveTo(figX + 15, seatY + 5, figX + 25, groundY - smallWheelR * 2 - 5);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(figX + 5, seatY);
            ctx.quadraticCurveTo(figX + 18, seatY + 5, figX + 28, groundY - smallWheelR * 2 - 5);
            ctx.stroke();
            // Head
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(figX - 5, seatY - 55 - headR, headR, 0, Math.PI * 2);
            ctx.stroke();
            ctx.fillStyle = profile.color + "30";
            ctx.fill();
        } else {
            // ── Standing human (proportional stick figure) ──
            const col = useCustom ? "#c9a96e" : profile.color;
            const figTop = groundY - figH;

            ctx.strokeStyle = col;
            ctx.lineWidth = 3;

            // Neck + Spine (curved)
            ctx.beginPath();
            ctx.moveTo(figX, figTop + headR * 2.2);
            ctx.quadraticCurveTo(figX + 1, figTop + figH * 0.35, figX, figTop + figH * 0.55);
            ctx.stroke();

            // Shoulders
            const shoulderY = figTop + figH * 0.22;
            const shoulderW = figH * 0.16;
            ctx.lineWidth = 2.5;
            ctx.beginPath();
            ctx.moveTo(figX - shoulderW, shoulderY + 5);
            ctx.lineTo(figX, shoulderY);
            ctx.lineTo(figX + shoulderW, shoulderY + 5);
            ctx.stroke();

            // Arms (slightly bent)
            ctx.lineWidth = 2.5;
            ctx.beginPath();
            ctx.moveTo(figX - shoulderW, shoulderY + 5);
            ctx.quadraticCurveTo(figX - shoulderW - 5, shoulderY + figH * 0.18, figX - shoulderW + 2, figTop + figH * 0.5);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(figX + shoulderW, shoulderY + 5);
            ctx.quadraticCurveTo(figX + shoulderW + 5, shoulderY + figH * 0.18, figX + shoulderW - 2, figTop + figH * 0.5);
            ctx.stroke();

            // Hips
            const hipY = figTop + figH * 0.55;
            ctx.lineWidth = 2.5;
            ctx.beginPath();
            ctx.moveTo(figX - figH * 0.08, hipY);
            ctx.lineTo(figX + figH * 0.08, hipY);
            ctx.stroke();

            // Legs (with knee bend)
            const kneeY = figTop + figH * 0.75;
            ctx.beginPath();
            ctx.moveTo(figX - figH * 0.08, hipY);
            ctx.quadraticCurveTo(figX - figH * 0.1, kneeY, figX - figH * 0.08, groundY);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(figX + figH * 0.08, hipY);
            ctx.quadraticCurveTo(figX + figH * 0.1, kneeY, figX + figH * 0.08, groundY);
            ctx.stroke();

            // Head (with slight face detail)
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(figX, figTop + headR, headR, 0, Math.PI * 2);
            ctx.stroke();
            ctx.fillStyle = col + "25";
            ctx.fill();

            // Height label
            ctx.fillStyle = col;
            ctx.font = "bold 12px Inter, sans-serif";
            ctx.textAlign = "center";
            ctx.fillText(`${Math.round(av.height)}cm`, figX, figTop - 12);
        }

        // ── Eye level indicator ──
        const eyeY = groundY - av.eyeLevel * scale;
        ctx.setLineDash([2, 4]);
        ctx.strokeStyle = `${useCustom ? "#c9a96e" : profile.color}35`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(figX + 30, eyeY);
        ctx.lineTo(figX + 55, eyeY);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillStyle = `${useCustom ? "#c9a96e" : profile.color}60`;
        ctx.font = "9px Inter, sans-serif";
        ctx.textAlign = "left";
        ctx.fillText("👁", figX + 35, eyeY + 3);

        // ── Architectural Dimensions Panel (merged from ProportionLab) ──
        if (useCustom) {
            const panelX = 10;
            const panelY = 10;
            const panelW = 140;
            ctx.fillStyle = "rgba(26,23,20,0.85)";
            ctx.beginPath();
            ctx.roundRect(panelX, panelY, panelW, 115, 8);
            ctx.fill();

            ctx.fillStyle = "#c9a96e";
            ctx.font = "bold 10px Inter, sans-serif";
            ctx.textAlign = "left";
            ctx.fillText("Dimensions", panelX + 8, panelY + 16);

            ARCH_DIMS.forEach((dim, i) => {
                const val = (av.height / 100) * dim.ratio;
                const display = dim.mult ? (val * dim.mult).toFixed(0) : val.toFixed(2);
                const y = panelY + 30 + i * 20;
                const barW = Math.min((val / 2.5) * 60, 60);

                ctx.fillStyle = "rgba(201,169,110,0.15)";
                ctx.fillRect(panelX + 8, y, 60, 10);
                ctx.fillStyle = dim.color + "80";
                ctx.fillRect(panelX + 8, y, barW, 10);

                ctx.fillStyle = "rgba(255,255,255,0.5)";
                ctx.font = "9px Inter, sans-serif";
                ctx.textAlign = "left";
                ctx.fillText(dim.label, panelX + 72, y + 9);
                ctx.textAlign = "right";
                ctx.fillStyle = dim.color;
                ctx.font = "bold 9px Inter, sans-serif";
                ctx.fillText(`${display}${dim.unit}`, panelX + panelW - 6, y + 9);
            });
        }

        animRef.current = requestAnimationFrame(draw);
    }, [profile, profileIdx, useCustom, effectiveHeight, effectiveMaxReach, effectiveMinReach]);

    useEffect(() => {
        animRef.current = requestAnimationFrame(draw);
        return () => cancelAnimationFrame(animRef.current);
    }, [draw]);

    return (
        <ScrollReveal className="content-card" delay={400}>
            <h4 style={{ fontSize: "1.3rem", marginBottom: "0.3rem", color: "#5c4033" }}>
                ♿ Inclusive Design Simulator
            </h4>
            <p style={{ fontSize: "1rem", color: "#8a7560", marginBottom: "0.8rem" }}>
                Toggle between users to see which kitchen elements are{" "}
                <span style={{ color: "#4caf50", fontWeight: 700 }}>accessible ✓</span> or{" "}
                <span style={{ color: "#e57373", fontWeight: 700 }}>out of reach ✗</span>.
                Use the height slider to test <strong>any body size</strong>.
            </p>

            {/* Profile toggles */}
            <div style={{ display: "flex", gap: "0.4rem", marginBottom: "0.5rem", flexWrap: "wrap" }}>
                {PROFILES.map((p, i) => (
                    <button key={p.id} onClick={() => { setProfileIdx(i); setUseCustom(false); }}
                        style={{
                            padding: "0.5rem 0.8rem", borderRadius: 8, fontSize: "0.85rem",
                            border: `2px solid ${!useCustom && profileIdx === i ? p.color : "#ddd"}`,
                            background: !useCustom && profileIdx === i ? `${p.color}20` : "#fefcf7",
                            color: "#5c4033", cursor: "pointer", fontWeight: 600,
                        }}>
                        {p.emoji} {p.label}
                    </button>
                ))}
                <button onClick={() => setUseCustom(true)}
                    style={{
                        padding: "0.5rem 0.8rem", borderRadius: 8, fontSize: "0.85rem",
                        border: `2px solid ${useCustom ? "#c9a96e" : "#ddd"}`,
                        background: useCustom ? "rgba(201,169,110,0.15)" : "#fefcf7",
                        color: "#5c4033", cursor: "pointer", fontWeight: 600,
                    }}>
                    📏 Custom Height
                </button>
            </div>

            {/* Custom height slider (merged from ProportionLab) */}
            {useCustom && (
                <div style={{
                    display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.5rem",
                    background: "rgba(201,169,110,0.06)", padding: "0.5rem 0.8rem", borderRadius: 8,
                    border: "1px solid rgba(201,169,110,0.15)",
                }}>
                    <span style={{ fontSize: "0.8rem", color: "#8a7560", whiteSpace: "nowrap" }}>110cm</span>
                    <input type="range" min="110" max="200" step="1" value={customHeight}
                        onChange={(e) => setCustomHeight(parseInt(e.target.value))}
                        style={{ flex: 1, accentColor: "#c9a96e" }} />
                    <span style={{ fontSize: "0.8rem", color: "#8a7560", whiteSpace: "nowrap" }}>200cm</span>
                    <span style={{ fontSize: "0.9rem", fontWeight: 700, color: "#c9a96e", minWidth: 50, textAlign: "right" }}>
                        {customHeight}cm
                    </span>
                </div>
            )}

            {/* Accessibility bar */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.5rem" }}>
                <span style={{ fontSize: "0.85rem", color: "#8a7560", fontWeight: 600 }}>
                    Accessibility: {accessibleCount}/{ELEMENTS.length}
                </span>
                <div style={{ flex: 1, height: 8, background: "rgba(201,169,110,0.1)", borderRadius: 4 }}>
                    <div style={{
                        width: `${accessPct}%`, height: "100%", borderRadius: 4,
                        background: accessPct >= 80 ? "#4caf50" : accessPct >= 50 ? "#ffb74d" : "#e57373",
                        transition: "width 0.5s, background 0.5s",
                    }} />
                </div>
                <span style={{ fontSize: "0.85rem", fontWeight: 700, color: accessPct >= 80 ? "#4caf50" : accessPct >= 50 ? "#ffb74d" : "#e57373" }}>
                    {accessPct}%
                </span>
            </div>

            <canvas
                ref={canvasRef}
                width={W}
                height={H}
                style={{ borderRadius: 12, display: "block", margin: "0 auto", maxWidth: "100%", border: "1px solid rgba(92,64,51,0.08)" }}
            />

            {/* Insight */}
            <div style={{
                marginTop: "0.8rem", background: "rgba(201,169,110,0.06)", borderRadius: 10,
                padding: "0.8rem 1rem", border: "1px solid rgba(201,169,110,0.15)",
            }}>
                <p style={{ fontSize: "0.95rem", color: useCustom ? "#c9a96e" : profile.color, fontWeight: 700, margin: 0 }}>
                    {useCustom ? `📏 Custom ${customHeight}cm Person:` : `${profile.emoji} ${profile.label}'s Experience:`}
                </p>
                <p style={{ fontSize: "0.9rem", color: "#8a7560", marginTop: "0.3rem" }}>
                    {useCustom && customHeight < 140 && `At ${customHeight}cm, upper cabinets and top shelves are unreachable. Standard kitchens exclude this body size.`}
                    {useCustom && customHeight >= 140 && customHeight < 170 && `At ${customHeight}cm, some high elements are a stretch. The Vitruvian standard (183cm) wasn't designed for you.`}
                    {useCustom && customHeight >= 170 && customHeight < 190 && `At ${customHeight}cm, most standard designs work — but remember, inclusivity means designing for everyone, not just your height.`}
                    {useCustom && customHeight >= 190 && `At ${customHeight}cm, standard designs feel tight. Low ceilings and small counters become uncomfortable — tall people face ergonomic challenges too.`}
                    {!useCustom && profile.id === "adult" && "Standard adult can reach 210cm. Most kitchens are designed for this one body type — but they represent only a fraction of all users."}
                    {!useCustom && profile.id === "child" && "A child can only reach 145cm — upper cabinets are completely unreachable. Even light switches at 130cm require stretching."}
                    {!useCustom && profile.id === "wheelchair" && "Wheelchair users reach 150cm max but can't access anything below 55cm either. Standard counters work, but upper cabinets don't."}
                    {!useCustom && profile.id === "elderly" && "Reduced mobility limits reach to 178cm. Designs that barely work for young adults become barriers — Universal Design solves this."}
                </p>
            </div>
        </ScrollReveal>
    );
}
