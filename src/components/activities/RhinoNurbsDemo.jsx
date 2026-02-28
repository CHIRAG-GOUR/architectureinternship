import { useState, useRef, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, TorusKnot, Edges, OrthographicCamera, PerspectiveCamera, Environment } from "@react-three/drei";
import ScrollReveal from "../ScrollReveal";

const RhinoViewport = ({ type, p, q, tube, tubularSegments }) => {
    return (
        <div style={{ position: "relative", width: "100%", height: "100%", border: "1px solid #333", background: "#1e1e1e" }}>
            {/* Viewport Label */}
            <div style={{ position: "absolute", top: 8, left: 8, zIndex: 10, color: "#fff", fontSize: "12px", fontFamily: "sans-serif", fontWeight: "bold", background: "rgba(0,0,0,0.5)", padding: "2px 6px", borderRadius: "3px" }}>
                {type}
            </div>

            <Canvas>
                <ambientLight intensity={1} />
                <directionalLight position={[10, 10, 10]} intensity={2} />
                <directionalLight position={[-10, -10, -10]} intensity={1} color="#c9a96e" />
                <Environment preset="studio" />

                {type === "Top" && <OrthographicCamera makeDefault position={[0, 20, 0]} zoom={40} near={0.1} far={100} />}
                {type === "Front" && <OrthographicCamera makeDefault position={[0, 0, 20]} zoom={40} near={0.1} far={100} />}
                {type === "Right" && <OrthographicCamera makeDefault position={[20, 0, 0]} zoom={40} near={0.1} far={100} />}
                {type === "Perspective" && <PerspectiveCamera makeDefault position={[8, 8, 8]} fov={45} />}

                <TorusKnot args={[2, tube, tubularSegments, 32, p, q]}>
                    <meshPhysicalMaterial
                        color="#e0e0e0"
                        metalness={0.9}
                        roughness={0.1}
                        clearcoat={1}
                        envMapIntensity={2}
                    />
                    <Edges scale={1.0} color="#00ff00" threshold={15} />
                </TorusKnot>

                {/* Only orbit in Perspective, pan in Ortho */}
                <OrbitControls
                    enableRotate={type === "Perspective"}
                    enableZoom={true}
                    enablePan={true}
                    makeDefault
                />

                {/* Grid helper */}
                <gridHelper args={[20, 20, "#444", "#222"]} position={[0, -2, 0]} />
            </Canvas>
        </div>
    );
};

export default function RhinoNurbsDemo() {
    const [tube, setTube] = useState(0.4);
    const [tubularSegments, setTubularSegments] = useState(128); // high res
    const [p, setP] = useState(2);
    const [q, setQ] = useState(3);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [commandText, setCommandText] = useState("_TorusKnot");
    const containerRef = useRef(null);

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            containerRef.current.requestFullscreen().catch(err => {
                console.warn(`Error attempting to enable fullscreen: ${err.message}`);
            });
        } else {
            document.exitFullscreen();
        }
    };

    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };
        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
    }, []);

    const ToolbarIcon = ({ icon, active, onClick }) => (
        <div
            onClick={onClick}
            style={{
                width: 30, height: 30, background: active ? "#333" : "transparent",
                border: active ? "1px solid #555" : "1px solid transparent",
                borderRadius: 3, display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer", fontSize: "16px", color: "#ddd"
            }} onMouseEnter={e => e.currentTarget.style.background = "#444"} onMouseLeave={e => e.currentTarget.style.background = active ? "#333" : "transparent"}>
            {icon}
        </div>
    );

    const MenuOption = ({ label }) => (
        <span onClick={() => setCommandText(`Opening ${label} menu...`)} style={{ cursor: "pointer", padding: "2px 4px" }} onMouseEnter={e => e.currentTarget.style.background = "#555"} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
            {label}
        </span>
    );

    return (
        <div className="section-gap">
            <ScrollReveal className="content-card" style={{ padding: isFullscreen ? "0" : "2rem" }}>
                {!isFullscreen && (
                    <div style={{ textAlign: "center" }}>
                        <h3 style={{ color: "#5c4033", marginBottom: "0.5rem" }}>Rhino 3D Web Environment</h3>
                        <p style={{ color: "#8b7355", fontSize: "0.95rem", marginBottom: "1.5rem" }}>
                            Sculpt organic forms using perfect mathematical curves (NURBS). Use the parametric sliders below, or enter Fullscreen to experience the full 4-viewport UI.
                        </p>
                    </div>
                )}

                <div
                    ref={containerRef}
                    style={{
                        border: isFullscreen ? "none" : "2px solid #555",
                        borderRadius: isFullscreen ? "0" : "8px",
                        overflow: "hidden",
                        background: "#2a2a2a",
                        display: "flex",
                        flexDirection: "column",
                        width: "100%",
                        height: isFullscreen ? "100vh" : "600px",
                        fontFamily: "sans-serif"
                    }}
                >
                    {/* Menu Bar */}
                    <div style={{ display: "flex", alignItems: "center", background: "#333", padding: "4px 8px", fontSize: "12px", color: "#ccc", gap: "10px", borderBottom: "1px solid #111" }}>
                        <MenuOption label="File" />
                        <MenuOption label="Edit" />
                        <MenuOption label="View" />
                        <MenuOption label="Curve" />
                        <MenuOption label="Surface" />
                        <MenuOption label="Solid" />
                        <MenuOption label="Mesh" />
                        <MenuOption label="Dimension" />
                        <MenuOption label="Transform" />
                        <MenuOption label="Tools" />
                        <div style={{ flex: 1 }}></div>
                        <button onClick={toggleFullscreen} style={{ background: "#444", color: "white", border: "1px solid #555", padding: "2px 10px", borderRadius: "2px", cursor: "pointer", fontSize: "11px" }}>
                            {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
                        </button>
                    </div>

                    {/* Command Line Area */}
                    <div style={{ background: "#1e1e1e", padding: "4px 8px", display: "flex", fontSize: "12px", borderBottom: "1px solid #111" }}>
                        <span style={{ color: "#bbb", marginRight: "8px" }}>Command:</span>
                        <span style={{ color: "#fff" }}>{commandText}</span>
                    </div>

                    <div style={{ display: "flex", flex: 1, minHeight: 0 }}>
                        {/* Side Toolbar */}
                        <div style={{ width: 40, background: "#2a2a2a", borderRight: "1px solid #111", display: "flex", flexDirection: "column", alignItems: "center", padding: "8px 0", gap: "4px" }}>
                            <ToolbarIcon icon="↖️" active={true} onClick={() => setCommandText("Cancel")} />
                            <ToolbarIcon icon="⚫" onClick={() => setCommandText("_Point")} />
                            <ToolbarIcon icon="〰️" onClick={() => setCommandText("_Polyline")} />
                            <ToolbarIcon icon="🟩" onClick={() => setCommandText("_Plane")} />
                            <ToolbarIcon icon="🟦" onClick={() => setCommandText("_Box")} />
                            <ToolbarIcon icon="🧊" onClick={() => setCommandText("_ExtrudeSrf")} />
                            <ToolbarIcon icon="✂️" onClick={() => setCommandText("_Trim")} />
                            <div style={{ margin: "4px 0", width: "80%", height: "1px", background: "#444" }}></div>
                            <ToolbarIcon icon="🔄" onClick={() => setCommandText("_Rotate")} />
                            <ToolbarIcon icon="↕️" onClick={() => setCommandText("_Scale")} />
                        </div>

                        {/* 4-Viewport Grid */}
                        <div style={{ flex: 1, display: "grid", gridTemplateColumns: "1fr 1fr", gridTemplateRows: "1fr 1fr", gap: "2px", background: "#111", padding: "2px" }}>
                            <RhinoViewport type="Top" p={p} q={q} tube={tube} tubularSegments={tubularSegments} />
                            <RhinoViewport type="Perspective" p={p} q={q} tube={tube} tubularSegments={tubularSegments} />
                            <RhinoViewport type="Front" p={p} q={q} tube={tube} tubularSegments={tubularSegments} />
                            <RhinoViewport type="Right" p={p} q={q} tube={tube} tubularSegments={tubularSegments} />
                        </div>

                        {/* Parametric Properties Panel */}
                        <div style={{ width: 220, background: "#2a2a2a", borderLeft: "1px solid #111", display: "flex", flexDirection: "column", padding: "10px", color: "#ddd", fontSize: "12px", overflowY: "auto" }}>
                            <div style={{ borderBottom: "1px solid #444", paddingBottom: "6px", marginBottom: "12px", fontWeight: "bold" }}>
                                Properties
                            </div>

                            <div style={{ marginBottom: "16px" }}>
                                <label style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                                    Thickness (Radius)
                                    <input type="range" min="0.1" max="1" step="0.05" value={tube} onChange={e => setTube(parseFloat(e.target.value))} />
                                </label>
                            </div>

                            <div style={{ marginBottom: "16px" }}>
                                <label style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                                    Complexity (P-value)
                                    <input type="range" min="1" max="8" step="1" value={p} onChange={e => setP(parseInt(e.target.value))} />
                                </label>
                            </div>

                            <div style={{ marginBottom: "16px" }}>
                                <label style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                                    Twists (Q-value)
                                    <input type="range" min="1" max="15" step="1" value={q} onChange={e => setQ(parseInt(e.target.value))} />
                                </label>
                            </div>

                            <div style={{ marginTop: "auto", padding: "8px", background: "#1e1e1e", borderRadius: "4px" }}>
                                <div style={{ color: "#aaa", marginBottom: "4px" }}>Object Type:</div>
                                <div>Closed NURBS Surface</div>
                            </div>
                        </div>
                    </div>

                    {/* Status Bar */}
                    <div style={{ background: "#333", padding: "2px 8px", fontSize: "11px", color: "#aaa", borderTop: "1px solid #111", display: "flex", gap: "10px" }}>
                        <span>CPlane</span>
                        <span>x: 0.000</span>
                        <span>y: 0.000</span>
                        <span>z: 0.000</span>
                        <div style={{ flex: 1 }}></div>
                        <span style={{ fontWeight: "bold", color: "#fff" }}>Osnap</span>
                        <span>Ortho</span>
                        <span>Planar</span>
                        <span style={{ fontWeight: "bold", color: "#fff" }}>SmartTrack</span>
                        <span style={{ fontWeight: "bold", color: "#fff" }}>Gumball</span>
                    </div>
                </div>
            </ScrollReveal>
        </div>
    );
}
