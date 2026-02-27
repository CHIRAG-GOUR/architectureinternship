import { useState, useRef, useEffect, useCallback } from "react";
import ScrollReveal from "../ScrollReveal";

/*
  FlowSimulator — Animated people-flow visualization for Chapter 1.2
  Users toggle between Linear, Radial, and Clustered floor plans.
  Animated dots show how people move through each organization type.
*/

const W = 480, H = 380;

// Floor plan definitions
const plans = {
    linear: {
        label: "Linear",
        emoji: "📏",
        rooms: [
            { x: 30, y: 150, w: 70, h: 80 },
            { x: 130, y: 150, w: 70, h: 80 },
            { x: 230, y: 150, w: 70, h: 80 },
            { x: 330, y: 150, w: 70, h: 80 },
        ],
        corridors: [
            { x: 100, y: 175, w: 30, h: 30 },
            { x: 200, y: 175, w: 30, h: 30 },
            { x: 300, y: 175, w: 30, h: 30 },
        ],
        waypoints: [
            [65, 190], [165, 190], [265, 190], [365, 190],
        ],
        desc: "People flow in a single direction — like a hallway. Sequential, predictable movement.",
    },
    radial: {
        label: "Radial",
        emoji: "🎯",
        rooms: [
            { x: 190, y: 140, w: 100, h: 100 },  // center hub
            { x: 100, y: 40, w: 70, h: 60 },     // top-left
            { x: 310, y: 40, w: 70, h: 60 },     // top-right
            { x: 40, y: 260, w: 70, h: 60 },     // bottom-left
            { x: 370, y: 260, w: 70, h: 60 },    // bottom-right
        ],
        corridors: [
            { x: 160, y: 90, w: 30, h: 50 },
            { x: 290, y: 90, w: 30, h: 50 },
            { x: 130, y: 240, w: 60, h: 30 },
            { x: 290, y: 240, w: 80, h: 30 },
        ],
        waypoints: [
            [240, 190], [135, 70], [345, 70], [75, 290], [405, 290],
        ],
        desc: "All movement flows through a central hub — everyone meets in the middle. Efficient, controlled.",
    },
    clustered: {
        label: "Clustered",
        emoji: "🏘️",
        rooms: [
            { x: 50, y: 50, w: 80, h: 70 },
            { x: 160, y: 30, w: 60, h: 60 },
            { x: 100, y: 150, w: 90, h: 70 },
            { x: 250, y: 120, w: 70, h: 80 },
            { x: 50, y: 260, w: 80, h: 60 },
            { x: 200, y: 250, w: 90, h: 70 },
            { x: 340, y: 220, w: 70, h: 60 },
        ],
        corridors: [],
        waypoints: [
            [90, 85], [190, 60], [145, 185], [285, 160], [90, 290], [245, 285], [375, 250],
        ],
        desc: "Organic movement — people wander between nearby spaces. Flexible, village-like flow.",
    },
};

// Animated person dot
function createPerson(waypoints) {
    const start = Math.floor(Math.random() * waypoints.length);
    return {
        x: waypoints[start][0],
        y: waypoints[start][1],
        targetIdx: (start + 1) % waypoints.length,
        speed: 0.8 + Math.random() * 0.7,
        hue: Math.floor(Math.random() * 40) + 20, // warm hues
    };
}

export default function FlowSimulator() {
    const [mode, setMode] = useState("linear");
    const canvasRef = useRef(null);
    const peopleRef = useRef([]);
    const animRef = useRef(null);

    const plan = plans[mode];

    // Initialize people when mode changes
    useEffect(() => {
        peopleRef.current = Array.from({ length: 8 }, () => createPerson(plan.waypoints));
    }, [mode]);

    const animate = useCallback(() => {
        const cvs = canvasRef.current;
        if (!cvs) return;
        const ctx = cvs.getContext("2d");
        ctx.clearRect(0, 0, W, H);

        // Draw rooms
        plan.rooms.forEach((room, i) => {
            ctx.fillStyle = i === 0 && mode === "radial" ? "rgba(107,143,113,0.25)" : "rgba(201,169,110,0.2)";
            ctx.fillRect(room.x, room.y, room.w, room.h);
            ctx.strokeStyle = "rgba(92,64,51,0.3)";
            ctx.lineWidth = 1.5;
            ctx.strokeRect(room.x, room.y, room.w, room.h);
        });

        // Draw corridors
        plan.corridors.forEach((c) => {
            ctx.fillStyle = "rgba(199,143,87,0.15)";
            ctx.fillRect(c.x, c.y, c.w, c.h);
        });

        // Draw waypoint connections
        ctx.setLineDash([4, 4]);
        ctx.strokeStyle = "rgba(201,169,110,0.3)";
        ctx.lineWidth = 1;
        if (mode === "linear") {
            ctx.beginPath();
            plan.waypoints.forEach((wp, i) => {
                if (i === 0) ctx.moveTo(wp[0], wp[1]);
                else ctx.lineTo(wp[0], wp[1]);
            });
            ctx.stroke();
        } else if (mode === "radial") {
            const center = plan.waypoints[0];
            for (let i = 1; i < plan.waypoints.length; i++) {
                ctx.beginPath();
                ctx.moveTo(center[0], center[1]);
                ctx.lineTo(plan.waypoints[i][0], plan.waypoints[i][1]);
                ctx.stroke();
            }
        } else {
            // Clustered — connect nearby waypoints
            for (let i = 0; i < plan.waypoints.length; i++) {
                for (let j = i + 1; j < plan.waypoints.length; j++) {
                    const dx = plan.waypoints[i][0] - plan.waypoints[j][0];
                    const dy = plan.waypoints[i][1] - plan.waypoints[j][1];
                    if (Math.sqrt(dx * dx + dy * dy) < 200) {
                        ctx.beginPath();
                        ctx.moveTo(plan.waypoints[i][0], plan.waypoints[i][1]);
                        ctx.lineTo(plan.waypoints[j][0], plan.waypoints[j][1]);
                        ctx.stroke();
                    }
                }
            }
        }
        ctx.setLineDash([]);

        // Animate people
        peopleRef.current.forEach((p) => {
            const target = plan.waypoints[p.targetIdx];
            const dx = target[0] - p.x;
            const dy = target[1] - p.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 5) {
                // Reached target — pick next
                if (mode === "linear") {
                    p.targetIdx = (p.targetIdx + 1) % plan.waypoints.length;
                } else if (mode === "radial") {
                    if (p.targetIdx === 0) {
                        p.targetIdx = 1 + Math.floor(Math.random() * (plan.waypoints.length - 1));
                    } else {
                        p.targetIdx = 0; // always return to center
                    }
                } else {
                    // Clustered — go to a random nearby point
                    let next;
                    do { next = Math.floor(Math.random() * plan.waypoints.length); } while (next === p.targetIdx);
                    p.targetIdx = next;
                }
            } else {
                p.x += (dx / dist) * p.speed;
                p.y += (dy / dist) * p.speed;
            }

            // Draw person
            ctx.beginPath();
            ctx.arc(p.x, p.y, 5, 0, Math.PI * 2);
            ctx.fillStyle = `hsl(${p.hue}, 60%, 50%)`;
            ctx.fill();
            ctx.beginPath();
            ctx.arc(p.x, p.y, 8, 0, Math.PI * 2);
            ctx.strokeStyle = `hsla(${p.hue}, 60%, 50%, 0.3)`;
            ctx.lineWidth = 2;
            ctx.stroke();
        });

        // Room labels
        ctx.font = "11px Inter, sans-serif";
        ctx.fillStyle = "rgba(92,64,51,0.5)";
        ctx.textAlign = "center";
        plan.rooms.forEach((room, i) => {
            const label = mode === "radial" && i === 0 ? "Hub" : `Room ${i + 1}`;
            ctx.fillText(label, room.x + room.w / 2, room.y + room.h / 2 + 4);
        });

        animRef.current = requestAnimationFrame(animate);
    }, [mode, plan]);

    useEffect(() => {
        animRef.current = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(animRef.current);
    }, [animate]);

    return (
        <ScrollReveal className="content-card" delay={400}>
            <h4 style={{ fontSize: "1.3rem", marginBottom: "0.3rem" }}>🚶 Flow Simulator</h4>
            <p style={{ fontSize: "1.05rem", color: "#5c4033", marginBottom: "1rem" }}>
                Watch how people move through different spatial organizations. Toggle between types to see the pattern!
            </p>

            <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem", flexWrap: "wrap" }}>
                {Object.entries(plans).map(([key, p]) => (
                    <button key={key} onClick={() => setMode(key)}
                        style={{
                            padding: "0.5rem 1rem", borderRadius: 8,
                            border: `2px solid ${mode === key ? "#c9a96e" : "#ddd"}`,
                            background: mode === key ? "#c9a96e" : "#fefcf7",
                            color: mode === key ? "#fff" : "#5c4033",
                            cursor: "pointer", fontWeight: 600, fontSize: "0.9rem",
                            transition: "all 0.25s",
                        }}>
                        {p.emoji} {p.label}
                    </button>
                ))}
            </div>

            <canvas
                ref={canvasRef}
                width={W}
                height={H}
                className="sim-canvas"
                style={{ border: "1px solid rgba(92,64,51,0.15)", borderRadius: 8, background: "#fefcf7", maxWidth: "100%" }}
            />

            <div style={{ textAlign: "center", marginTop: "1rem", background: "rgba(201,169,110,0.1)", borderRadius: 12, padding: "1rem", border: "1px solid rgba(201,169,110,0.2)" }}>
                <p style={{ fontSize: "1.1rem", fontWeight: 700, color: "#5c4033", margin: 0 }}>
                    {plan.emoji} {plan.label} Flow Pattern
                </p>
                <p style={{ fontSize: "1rem", color: "#6b4d3b", marginTop: "0.3rem" }}>{plan.desc}</p>
            </div>
        </ScrollReveal>
    );
}
