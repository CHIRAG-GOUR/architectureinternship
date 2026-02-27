import { useState, useRef, useEffect, useCallback } from "react";
import { gsap } from "gsap";
import ScrollReveal from "../ScrollReveal";

/*
  ProportionLab — Interactive body-to-architecture proportion mapper.
  Shows how changing the "standard" human height affects every
  architectural dimension. Animated with GSAP.
  
  Canvas-based Vitruvian-style visualization.
*/

const W = 580, H = 500;

const ARCH_ELEMENTS = [
    { key: "door", label: "Door Height", ratio: 1.2, color: "#C78F57", unit: "m" },
    { key: "counter", label: "Counter Height", ratio: 0.5, color: "#6b8f71", unit: "m" },
    { key: "step", label: "Step Height", ratio: 0.1, color: "#c9a96e", unit: "cm", mult: 100 },
    { key: "railing", label: "Railing Height", ratio: 0.53, color: "#7b9cc7", unit: "m" },
    { key: "reach", label: "Max Shelf Reach", ratio: 1.3, color: "#9b7ec7", unit: "m" },
    { key: "seat", label: "Seat Height", ratio: 0.27, color: "#c77e7e", unit: "cm", mult: 100 },
];

const PROFILES = [
    { label: "Child", height: 120, emoji: "🧒" },
    { label: "Short Adult", height: 155, emoji: "🧑" },
    { label: "Vitruvian Man", height: 183, emoji: "📐" },
    { label: "Tall Adult", height: 200, emoji: "🧑‍🦱" },
];

export default function ProportionLab() {
    const canvasRef = useRef(null);
    const [humanHeight, setHumanHeight] = useState(183);
    const animatedHeight = useRef(183);
    const animRef = useRef(null);

    // GSAP smooth transition
    useEffect(() => {
        gsap.to(animatedHeight, {
            current: humanHeight,
            duration: 0.6,
            ease: "power2.out",
        });
    }, [humanHeight]);

    const draw = useCallback(() => {
        const cvs = canvasRef.current;
        if (!cvs) return;
        const ctx = cvs.getContext("2d");
        ctx.clearRect(0, 0, W, H);

        const h = animatedHeight.current;
        const scale = 2.2; // pixels per cm
        const figureH = h * scale / 100;
        const figurePixels = Math.min(figureH * 100, 350);
        const baseY = H - 60;
        const figureX = 140;

        // Background
        const bgGrad = ctx.createLinearGradient(0, 0, 0, H);
        bgGrad.addColorStop(0, "#1a1714");
        bgGrad.addColorStop(1, "#2a2420");
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, W, H);

        // Grid lines
        ctx.strokeStyle = "rgba(201,169,110,0.06)";
        ctx.lineWidth = 0.5;
        for (let y = 0; y < H; y += 25) {
            ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
        }

        // Ground line
        ctx.strokeStyle = "rgba(201,169,110,0.3)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(20, baseY);
        ctx.lineTo(W - 20, baseY);
        ctx.stroke();

        // Draw human figure (simplified Vitruvian style)
        const headR = figurePixels * 0.08;
        const bodyTop = baseY - figurePixels + headR * 2;
        const bodyBot = baseY;
        const bodyMid = (bodyTop + bodyBot) / 2;

        // Body
        ctx.strokeStyle = "#c9a96e";
        ctx.lineWidth = 2.5;
        // Spine
        ctx.beginPath();
        ctx.moveTo(figureX, bodyTop + headR);
        ctx.lineTo(figureX, bodyBot - figurePixels * 0.35);
        ctx.stroke();
        // Arms
        const armSpan = figurePixels * 0.4;
        ctx.beginPath();
        ctx.moveTo(figureX - armSpan, bodyMid - figurePixels * 0.05);
        ctx.lineTo(figureX, bodyMid - figurePixels * 0.15);
        ctx.lineTo(figureX + armSpan, bodyMid - figurePixels * 0.05);
        ctx.stroke();
        // Legs
        ctx.beginPath();
        ctx.moveTo(figureX, bodyBot - figurePixels * 0.35);
        ctx.lineTo(figureX - figurePixels * 0.15, bodyBot);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(figureX, bodyBot - figurePixels * 0.35);
        ctx.lineTo(figureX + figurePixels * 0.15, bodyBot);
        ctx.stroke();
        // Head
        ctx.beginPath();
        ctx.arc(figureX, bodyTop, headR, 0, Math.PI * 2);
        ctx.strokeStyle = "#c9a96e";
        ctx.stroke();

        // Height label
        ctx.fillStyle = "#c9a96e";
        ctx.font = "bold 14px Inter, sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(`${Math.round(h)} cm`, figureX, baseY - figurePixels - 18);

        // Height dimension line
        ctx.setLineDash([3, 3]);
        ctx.strokeStyle = "rgba(201,169,110,0.4)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(figureX + 50, baseY);
        ctx.lineTo(figureX + 50, baseY - figurePixels);
        ctx.stroke();
        ctx.setLineDash([]);

        // Draw architectural elements panel
        const panelX = 250;
        const panelW = W - panelX - 20;
        const barHeight = 28;
        const barGap = 12;

        ctx.fillStyle = "rgba(201,169,110,0.08)";
        ctx.beginPath();
        ctx.roundRect(panelX - 10, 30, panelW + 20, ARCH_ELEMENTS.length * (barHeight + barGap) + 80, 12);
        ctx.fill();

        ctx.fillStyle = "#c9a96e";
        ctx.font = "bold 13px Inter, sans-serif";
        ctx.textAlign = "left";
        ctx.fillText("Architectural Dimensions", panelX, 55);

        ctx.fillStyle = "rgba(201,169,110,0.4)";
        ctx.font = "11px Inter, sans-serif";
        ctx.fillText(`Based on ${Math.round(h)}cm human standard`, panelX, 72);

        ARCH_ELEMENTS.forEach((el, i) => {
            const y = 90 + i * (barHeight + barGap);
            const value = (h / 100) * el.ratio;
            const displayValue = el.mult ? (value * el.mult).toFixed(0) : value.toFixed(2);
            const maxBarWidth = panelW - 120;
            const barW = Math.min((value / 2.5) * maxBarWidth, maxBarWidth);

            // Label
            ctx.fillStyle = "rgba(201,169,110,0.6)";
            ctx.font = "11px Inter, sans-serif";
            ctx.textAlign = "left";
            ctx.fillText(el.label, panelX, y - 2);

            // Bar background
            ctx.fillStyle = "rgba(201,169,110,0.08)";
            ctx.beginPath();
            ctx.roundRect(panelX, y + 2, maxBarWidth, barHeight, 4);
            ctx.fill();

            // Bar fill
            ctx.fillStyle = el.color + "80";
            ctx.beginPath();
            ctx.roundRect(panelX, y + 2, barW, barHeight, 4);
            ctx.fill();

            // Value
            ctx.fillStyle = el.color;
            ctx.font = "bold 12px Inter, sans-serif";
            ctx.textAlign = "right";
            ctx.fillText(`${displayValue} ${el.unit}`, panelX + panelW, y + barHeight - 4);
        });

        // Vitruvian circle (faint)
        if (Math.abs(h - 183) < 5) {
            ctx.strokeStyle = "rgba(201,169,110,0.08)";
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.arc(figureX, bodyMid, figurePixels * 0.5, 0, Math.PI * 2);
            ctx.stroke();
        }

        animRef.current = requestAnimationFrame(draw);
    }, []);

    useEffect(() => {
        animRef.current = requestAnimationFrame(draw);
        return () => cancelAnimationFrame(animRef.current);
    }, [draw]);

    return (
        <ScrollReveal className="content-card" delay={400}>
            <h4 style={{ fontSize: "1.3rem", marginBottom: "0.3rem", color: "#5c4033" }}>
                📏 Proportion Lab
            </h4>
            <p style={{ fontSize: "1rem", color: "#8a7560", marginBottom: "0.8rem" }}>
                Adjust the human height and watch how <strong>every architectural dimension</strong> changes.
                The Vitruvian standard (183cm) is just one of many possible "measuring sticks."
            </p>

            {/* Profile presets */}
            <div style={{ display: "flex", gap: "0.4rem", marginBottom: "0.5rem", flexWrap: "wrap" }}>
                {PROFILES.map((p) => (
                    <button key={p.label} onClick={() => setHumanHeight(p.height)}
                        style={{
                            padding: "0.4rem 0.7rem", borderRadius: 8, fontSize: "0.85rem",
                            border: `2px solid ${Math.abs(humanHeight - p.height) < 5 ? "#c9a96e" : "#ddd"}`,
                            background: Math.abs(humanHeight - p.height) < 5 ? "rgba(201,169,110,0.15)" : "#fefcf7",
                            color: "#5c4033", cursor: "pointer", fontWeight: 600,
                        }}>
                        {p.emoji} {p.label} ({p.height}cm)
                    </button>
                ))}
            </div>

            {/* Slider */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.8rem", marginBottom: "0.8rem" }}>
                <span style={{ fontSize: "0.85rem", color: "#8a7560" }}>120cm</span>
                <input type="range" min="120" max="200" step="1" value={humanHeight}
                    onChange={(e) => setHumanHeight(parseInt(e.target.value))}
                    style={{ flex: 1, accentColor: "#c9a96e" }}
                />
                <span style={{ fontSize: "0.85rem", color: "#8a7560" }}>200cm</span>
            </div>

            <canvas
                ref={canvasRef}
                width={W}
                height={H}
                style={{ borderRadius: 12, display: "block", margin: "0 auto", maxWidth: "100%" }}
            />

            {/* Insight */}
            <div style={{
                marginTop: "0.8rem", background: "rgba(201,169,110,0.06)", borderRadius: 10,
                padding: "0.8rem 1rem", border: "1px solid rgba(201,169,110,0.15)",
            }}>
                <p style={{ fontSize: "0.95rem", color: "#c9a96e", fontWeight: 700, margin: 0 }}>
                    💡 The Problem:
                </p>
                <p style={{ fontSize: "0.9rem", color: "#8a7560", marginTop: "0.3rem" }}>
                    {humanHeight >= 175 && humanHeight <= 190
                        ? "At ~183cm, these dimensions match the Vitruvian/Modulor standard. But this 'ideal' only fits a portion of the population!"
                        : humanHeight < 155
                            ? `At ${humanHeight}cm, a standard kitchen counter (92cm) is nearly chest-height. Standard shelves are unreachable. This is the reality for children and many adults.`
                            : humanHeight < 175
                                ? `At ${humanHeight}cm, standard door handles and light switches designed for the 'Vitruvian Man' are consistently placed too high. Universal Design fixes this.`
                                : `At ${humanHeight}cm, standard doorways (210cm) feel tight, and ceilings designed for the 'average' feel low. Tall people face their own ergonomic challenges.`
                    }
                </p>
            </div>
        </ScrollReveal>
    );
}
