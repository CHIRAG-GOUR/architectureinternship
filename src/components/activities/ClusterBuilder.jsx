import { useState, useRef, useEffect, useCallback } from "react";
import ScrollReveal from "../ScrollReveal";

/*
  ClusterBuilder — Interactive clustered village simulation for Chapter 1.2
  Users click on a landscape canvas to place different building types.
  Buildings automatically form proximity connections, demonstrating how
  clustered organization emerges organically.
  
  Teaches: organic growth, proximity-based relationships, flexibility.
  Completely different from grid/quiz activities.
*/

const W = 580, H = 440;
const BUILDING_TYPES = [
    { id: "house", emoji: "🏠", label: "House", color: "#c9a96e", r: 18 },
    { id: "shop", emoji: "🏪", label: "Shop", color: "#C78F57", r: 16 },
    { id: "church", emoji: "⛪", label: "Landmark", color: "#6b8f71", r: 22 },
    { id: "school", emoji: "🏫", label: "School", color: "#7b9cc7", r: 20 },
    { id: "park", emoji: "🌳", label: "Park", color: "#82a872", r: 15 },
];

const CONNECT_DIST = 110; // max distance for proximity connection

function findClusters(buildings) {
    if (buildings.length === 0) return [];
    const visited = new Set();
    const clusters = [];

    function bfs(start) {
        const cluster = [];
        const queue = [start];
        visited.add(start);
        while (queue.length > 0) {
            const i = queue.shift();
            cluster.push(i);
            for (let j = 0; j < buildings.length; j++) {
                if (visited.has(j)) continue;
                const dx = buildings[i].x - buildings[j].x;
                const dy = buildings[i].y - buildings[j].y;
                if (Math.sqrt(dx * dx + dy * dy) <= CONNECT_DIST) {
                    visited.add(j);
                    queue.push(j);
                }
            }
        }
        return cluster;
    }

    for (let i = 0; i < buildings.length; i++) {
        if (!visited.has(i)) {
            clusters.push(bfs(i));
        }
    }
    return clusters;
}

const CLUSTER_COLORS = [
    "rgba(201,169,110,0.12)",
    "rgba(107,143,113,0.12)",
    "rgba(123,156,199,0.12)",
    "rgba(199,143,87,0.12)",
    "rgba(130,168,114,0.12)",
    "rgba(180,150,200,0.12)",
];

export default function ClusterBuilder() {
    const canvasRef = useRef(null);
    const [buildings, setBuildings] = useState([]);
    const [selectedType, setSelectedType] = useState(BUILDING_TYPES[0]);
    const [hoveredBuilding, setHoveredBuilding] = useState(-1);
    const animRef = useRef(null);
    const timeRef = useRef(0);

    const clusters = findClusters(buildings);
    const diversityScore = new Set(buildings.map(b => b.type)).size;
    const spreadScore = clusters.length;

    const handleClick = (e) => {
        const rect = canvasRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Check if clicking on existing building to remove
        for (let i = buildings.length - 1; i >= 0; i--) {
            const b = buildings[i];
            const dx = x - b.x, dy = y - b.y;
            if (Math.sqrt(dx * dx + dy * dy) < b.r + 4) {
                setBuildings(prev => prev.filter((_, idx) => idx !== i));
                return;
            }
        }

        // Place new building
        if (buildings.length < 20) {
            setBuildings(prev => [...prev, {
                x, y,
                type: selectedType.id,
                emoji: selectedType.emoji,
                color: selectedType.color,
                r: selectedType.r,
                born: Date.now(),
            }]);
        }
    };

    const handleMouseMove = (e) => {
        const rect = canvasRef.current.getBoundingClientRect();
        const mx = e.clientX - rect.left;
        const my = e.clientY - rect.top;
        let hovered = -1;
        for (let i = 0; i < buildings.length; i++) {
            const dx = mx - buildings[i].x, dy = my - buildings[i].y;
            if (Math.sqrt(dx * dx + dy * dy) < buildings[i].r + 4) {
                hovered = i;
                break;
            }
        }
        setHoveredBuilding(hovered);
        canvasRef.current.style.cursor = hovered >= 0 ? "pointer" : "crosshair";
    };

    const animate = useCallback(() => {
        const cvs = canvasRef.current;
        if (!cvs) return;
        const ctx = cvs.getContext("2d");
        const t = timeRef.current;
        timeRef.current += 0.016;
        ctx.clearRect(0, 0, W, H);

        // Background — warm landscape
        const bgGrad = ctx.createLinearGradient(0, 0, 0, H);
        bgGrad.addColorStop(0, "#f5ece0");
        bgGrad.addColorStop(1, "#e8dcc8");
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, W, H);

        // Subtle terrain texture
        ctx.strokeStyle = "rgba(92,64,51,0.04)";
        ctx.lineWidth = 0.5;
        for (let y = 0; y < H; y += 20) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            for (let x = 0; x < W; x += 10) {
                ctx.lineTo(x, y + Math.sin(x * 0.05 + y * 0.03) * 3);
            }
            ctx.stroke();
        }

        // Draw cluster hulls
        clusters.forEach((cluster, ci) => {
            if (cluster.length < 2) return;
            const clusterBuildings = cluster.map(i => buildings[i]);

            // Convex hull approximation — just draw expanded circle around centroid
            const avgX = clusterBuildings.reduce((s, b) => s + b.x, 0) / clusterBuildings.length;
            const avgY = clusterBuildings.reduce((s, b) => s + b.y, 0) / clusterBuildings.length;
            const maxDist = Math.max(...clusterBuildings.map(b => {
                const dx = b.x - avgX, dy = b.y - avgY;
                return Math.sqrt(dx * dx + dy * dy);
            }));

            ctx.save();
            ctx.fillStyle = CLUSTER_COLORS[ci % CLUSTER_COLORS.length];
            ctx.beginPath();
            ctx.arc(avgX, avgY, maxDist + 35, 0, Math.PI * 2);
            ctx.fill();

            ctx.strokeStyle = CLUSTER_COLORS[ci % CLUSTER_COLORS.length].replace("0.12", "0.25");
            ctx.lineWidth = 1;
            ctx.setLineDash([4, 6]);
            ctx.stroke();
            ctx.restore();

            // Cluster label
            ctx.fillStyle = "rgba(92,64,51,0.25)";
            ctx.font = "10px Inter, sans-serif";
            ctx.textAlign = "center";
            ctx.fillText(`Cluster ${ci + 1}`, avgX, avgY - maxDist - 18);
        });

        // Draw proximity connections
        for (let i = 0; i < buildings.length; i++) {
            for (let j = i + 1; j < buildings.length; j++) {
                const a = buildings[i], b = buildings[j];
                const dx = a.x - b.x, dy = a.y - b.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist <= CONNECT_DIST) {
                    const alpha = 0.08 + (1 - dist / CONNECT_DIST) * 0.12;
                    ctx.save();
                    ctx.strokeStyle = `rgba(92,64,51,${alpha})`;
                    ctx.lineWidth = 1;
                    ctx.setLineDash([3, 5]);
                    ctx.lineDashOffset = -t * 20;
                    ctx.beginPath();
                    ctx.moveTo(a.x, a.y);
                    ctx.lineTo(b.x, b.y);
                    ctx.stroke();
                    ctx.restore();
                }
            }
        }

        // Draw buildings
        buildings.forEach((b, i) => {
            const age = Math.min((Date.now() - b.born) / 300, 1); // pop-in animation
            const scale = 0.3 + age * 0.7;
            const hovered = hoveredBuilding === i;
            const r = b.r * scale;

            // Shadow
            ctx.beginPath();
            ctx.arc(b.x + 2, b.y + 2, r, 0, Math.PI * 2);
            ctx.fillStyle = "rgba(0,0,0,0.06)";
            ctx.fill();

            // Building body
            ctx.beginPath();
            ctx.arc(b.x, b.y, r, 0, Math.PI * 2);
            ctx.fillStyle = hovered ? b.color : `${b.color}cc`;
            ctx.fill();
            ctx.strokeStyle = hovered ? "#5c4033" : `${b.color}88`;
            ctx.lineWidth = hovered ? 2.5 : 1.5;
            ctx.stroke();

            // Emoji
            ctx.font = `${Math.round(r * 0.9)}px serif`;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(b.emoji, b.x, b.y + 1);
        });

        // Place hint if empty
        if (buildings.length === 0) {
            ctx.fillStyle = "rgba(92,64,51,0.25)";
            ctx.font = "14px Inter, sans-serif";
            ctx.textAlign = "center";
            ctx.fillText("Click anywhere to place buildings!", W / 2, H / 2);
            ctx.font = "12px Inter, sans-serif";
            ctx.fillText("Nearby buildings will automatically form clusters", W / 2, H / 2 + 22);
        }

        animRef.current = requestAnimationFrame(animate);
    }, [buildings, clusters, hoveredBuilding]);

    useEffect(() => {
        animRef.current = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(animRef.current);
    }, [animate]);

    return (
        <ScrollReveal className="content-card" delay={600}>
            <h4 style={{ fontSize: "1.3rem", marginBottom: "0.3rem", color: "#5c4033" }}>
                🏘️ Cluster Builder
            </h4>
            <p style={{ fontSize: "1rem", color: "#8a7560", marginBottom: "0.8rem" }}>
                Build a village! Place buildings on the landscape and watch clusters form organically.
                Buildings within range auto-connect. Click a building to remove it.
            </p>

            {/* Type selector */}
            <div style={{ display: "flex", gap: "0.4rem", marginBottom: "0.8rem", flexWrap: "wrap" }}>
                {BUILDING_TYPES.map(bt => (
                    <button key={bt.id} onClick={() => setSelectedType(bt)}
                        style={{
                            padding: "0.4rem 0.7rem", borderRadius: 8, fontSize: "0.85rem",
                            border: `2px solid ${selectedType.id === bt.id ? bt.color : "#ddd"}`,
                            background: selectedType.id === bt.id ? `${bt.color}20` : "#fefcf7",
                            color: "#5c4033", cursor: "pointer", fontWeight: 600,
                        }}>
                        {bt.emoji} {bt.label}
                    </button>
                ))}
                <button onClick={() => setBuildings([])}
                    style={{
                        padding: "0.4rem 0.7rem", borderRadius: 8, fontSize: "0.85rem",
                        border: "1px solid #ddd", background: "#fefcf7",
                        color: "#8a7560", cursor: "pointer", marginLeft: "auto",
                    }}>
                    Clear All
                </button>
            </div>

            <canvas
                ref={canvasRef}
                width={W}
                height={H}
                onClick={handleClick}
                onMouseMove={handleMouseMove}
                onMouseLeave={() => setHoveredBuilding(-1)}
                style={{ borderRadius: 12, display: "block", margin: "0 auto", maxWidth: "100%", border: "1px solid rgba(92,64,51,0.1)" }}
            />

            {/* Stats & insight */}
            {buildings.length > 0 && (
                <div style={{
                    marginTop: "0.8rem", display: "flex", gap: "0.5rem", flexWrap: "wrap",
                }}>
                    <div style={{
                        flex: "1 1 120px", background: "rgba(201,169,110,0.06)", borderRadius: 8,
                        padding: "0.6rem", textAlign: "center", border: "1px solid rgba(201,169,110,0.12)",
                    }}>
                        <p style={{ fontSize: "1.4rem", fontWeight: 700, color: "#c9a96e", margin: 0 }}>{buildings.length}</p>
                        <p style={{ fontSize: "0.8rem", color: "#8a7560" }}>Buildings</p>
                    </div>
                    <div style={{
                        flex: "1 1 120px", background: "rgba(107,143,113,0.06)", borderRadius: 8,
                        padding: "0.6rem", textAlign: "center", border: "1px solid rgba(107,143,113,0.12)",
                    }}>
                        <p style={{ fontSize: "1.4rem", fontWeight: 700, color: "#6b8f71", margin: 0 }}>{clusters.length}</p>
                        <p style={{ fontSize: "0.8rem", color: "#8a7560" }}>Clusters</p>
                    </div>
                    <div style={{
                        flex: "1 1 120px", background: "rgba(199,143,87,0.06)", borderRadius: 8,
                        padding: "0.6rem", textAlign: "center", border: "1px solid rgba(199,143,87,0.12)",
                    }}>
                        <p style={{ fontSize: "1.4rem", fontWeight: 700, color: "#C78F57", margin: 0 }}>{diversityScore}/5</p>
                        <p style={{ fontSize: "0.8rem", color: "#8a7560" }}>Diversity</p>
                    </div>
                </div>
            )}

            {buildings.length >= 3 && (
                <div style={{
                    marginTop: "0.6rem", background: "rgba(201,169,110,0.06)", borderRadius: 10,
                    padding: "0.8rem 1rem", border: "1px solid rgba(201,169,110,0.15)",
                }}>
                    <p style={{ fontSize: "0.95rem", color: "#c9a96e", fontWeight: 700, margin: 0 }}>
                        💡 Cluster Analysis:
                    </p>
                    <p style={{ fontSize: "0.9rem", color: "#8a7560", marginTop: "0.3rem" }}>
                        {clusters.length === 1 && "All buildings form one tight cluster — like a compact medieval village where everything is within walking distance."}
                        {clusters.length === 2 && "Two separate clusters! Like a town with distinct neighborhoods — each has its own character but they're separate communities."}
                        {clusters.length >= 3 && `${clusters.length} independent clusters — like a scattered settlement. Each group is self-contained. This is the essence of clustered organization!`}
                        {diversityScore >= 4 && " Great diversity — mixed-use clusters are more vibrant!"}
                    </p>
                </div>
            )}
        </ScrollReveal>
    );
}
