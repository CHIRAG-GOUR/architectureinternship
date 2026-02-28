import { useState, useRef, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Edges, Environment, ContactShadows } from "@react-three/drei";
import ScrollReveal from "../ScrollReveal";

const BIM_DATA = {
    wall: {
        category: "Basic Wall",
        type: "Exterior - Brick on CMU",
        cost: "$250 / sq.m",
        fireRating: "2 Hours",
        thermalResistance: "R-20",
        manufacturer: "Generic Construction",
        structural: "Yes",
        volume: "3.2 m³",
        phase: "New Construction"
    },
    window: {
        category: "Window",
        type: "Fixed - Aluminum Double Glazed",
        cost: "$850 / unit",
        fireRating: "N/A",
        thermalResistance: "U-Factor 0.28",
        manufacturer: "Pella Windows",
        structural: "No",
        sillHeight: "0.900 m",
        headHeight: "2.100 m"
    },
    door: {
        category: "Door",
        type: "Single Flush Solid Core",
        cost: "$450 / unit",
        fireRating: "60 mins",
        thermalResistance: "R-5",
        manufacturer: "Masonite",
        structural: "No",
        width: "0.900 m",
        height: "2.100 m"
    },
    column: {
        category: "Structural Column",
        type: "Concrete Round - 300mm",
        cost: "$120 / unit",
        fireRating: "4 Hours",
        thermalResistance: "N/A",
        manufacturer: "In-situ",
        structural: "Yes"
    },
    roof: {
        category: "Basic Roof",
        type: "Generic - Flat 400mm",
        cost: "$180 / sq.m",
        fireRating: "2 Hours",
        thermalResistance: "R-30",
        manufacturer: "Generic Construction",
        structural: "Yes"
    }
};

const initialElements = [
    { id: '1', type: 'wall', position: [0, 1, 0] },
    { id: '2', type: 'window', position: [-0.8, 1.2, 0.05] },
    { id: '3', type: 'door', position: [1, 0.5, 0.05] }
];

export default function RevitBimInspector() {
    const [elements, setElements] = useState(initialElements);
    const [selectedObject, setSelectedObject] = useState(null);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [activeTab, setActiveTab] = useState("Architecture");
    const [statusMessage, setStatusMessage] = useState("Ready");
    const [placementMode, setPlacementMode] = useState(null);
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
        const handleFullscreenChange = () => setIsFullscreen(!!document.fullscreenElement);
        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
    }, []);

    const handleSelect = (key) => (e) => {
        e.stopPropagation();
        setSelectedObject(null); // quick flash to re-trigger layout if needed
        setTimeout(() => setSelectedObject(BIM_DATA[key]), 10);
        setStatusMessage(`Selected: ${BIM_DATA[key].type}`);
    };

    const handleDeselect = () => {
        setSelectedObject(null);
        setStatusMessage("Ready");
    };

    const triggerTool = (toolName) => {
        setPlacementMode(toolName.toLowerCase());
        setStatusMessage(`Command active: Place ${toolName}. Click on the grid to place.`);
    };

    const handleGridClick = (e) => {
        if (!placementMode) {
            handleDeselect();
            return;
        }
        const { x, z } = e.point;
        let yPos = 0;
        if (placementMode === 'wall') yPos = 1;
        if (placementMode === 'door') yPos = 0.5;
        if (placementMode === 'window') yPos = 1.2;
        if (placementMode === 'column') yPos = 1.5;
        if (placementMode === 'roof') yPos = 2.5;
        if (placementMode === 'floor') yPos = 0;

        const newEl = { id: Date.now().toString(), type: placementMode, position: [x, yPos, z] };
        setElements([...elements, newEl]);
        setStatusMessage(`Placed ${placementMode}.`);
        setPlacementMode(null);
    };

    const exportRender = () => {
        const canvas = containerRef.current.querySelector('canvas');
        if (canvas) {
            const url = canvas.toDataURL("image/png");
            const a = document.createElement("a");
            a.href = url;
            a.download = "revit_render.png";
            a.click();
            setStatusMessage("Render exported successfully.");
        }
    };

    return (
        <div className="section-gap">
            <ScrollReveal className="content-card" style={{ padding: isFullscreen ? "0" : "2rem" }}>
                {!isFullscreen && (
                    <div style={{ textAlign: "center" }}>
                        <h3 style={{ color: "#5c4033", marginBottom: "0.5rem" }}>Revit BIM Engine Emulator</h3>
                        <p style={{ color: "#8b7355", fontSize: "0.95rem", marginBottom: "1.5rem" }}>
                            In BIM, 3D logic is driven by data. Click elements to inspect their parametric metadata, or enter Fullscreen for the complete interface.
                        </p>
                    </div>
                )}

                <div
                    ref={containerRef}
                    style={{
                        border: isFullscreen ? "none" : "2px solid #555",
                        borderRadius: isFullscreen ? "0" : "8px",
                        overflow: "hidden",
                        background: "#f3f3f3", // Revit light grey theme
                        display: "flex",
                        flexDirection: "column",
                        width: "100%",
                        height: isFullscreen ? "100vh" : "600px",
                        fontFamily: "Segoe UI, Tahoma, Geneva, Verdana, sans-serif"
                    }}
                >
                    {/* Top Ribbon & Quick Access Toolbar */}
                    <div style={{ background: "#ffffff", display: "flex", flexDirection: "column", borderBottom: "1px solid #ccc" }}>
                        {/* Title bar */}
                        <div style={{ background: "#0e5e9c", color: "white", fontSize: "12px", padding: "4px 8px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                                <strong style={{ fontSize: "14px", letterSpacing: "1px" }}>R</strong>
                                <span>Autodesk Revit - Project1.rvt - 3D View: {selectedObject ? `{3D - ${selectedObject.type}}` : "{3D}"}</span>
                                <span style={{ marginLeft: "20px", color: "#aaddff", fontStyle: "italic" }}>{statusMessage}</span>
                            </div>
                            <button onClick={toggleFullscreen} style={{ background: "rgba(255,255,255,0.2)", border: "none", color: "white", padding: "2px 8px", cursor: "pointer", fontSize: "11px", borderRadius: "2px" }}>
                                {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
                            </button>
                        </div>
                        {/* Ribbon tabs */}
                        <div style={{ display: "flex", fontSize: "12px", background: "#f5f6f7", borderBottom: "1px solid #e1e1e1", padding: "2px 0", cursor: "default" }}>
                            <span style={{ padding: "4px 12px", color: "#000" }}>File</span>
                            {["Architecture", "Structure", "Steel", "Precast", "Systems", "Insert", "Annotate", "Analyze"].map(tab => (
                                <span
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    style={{
                                        padding: "4px 12px",
                                        cursor: "pointer",
                                        background: activeTab === tab ? "#fff" : "transparent",
                                        borderTop: activeTab === tab ? "2px solid #0e5e9c" : "2px solid transparent",
                                        borderLeft: activeTab === tab ? "1px solid #e1e1e1" : "1px solid transparent",
                                        borderRight: activeTab === tab ? "1px solid #e1e1e1" : "1px solid transparent",
                                        fontWeight: activeTab === tab ? "bold" : "normal",
                                        color: activeTab === tab ? "#000" : "#444"
                                    }}
                                >
                                    {tab}
                                </span>
                            ))}
                        </div>
                        {/* Ribbon tools */}
                        <div style={{ display: "flex", padding: "6px 10px", background: "#fff", height: "65px", gap: "15px", alignItems: "center" }}>
                            <div style={{ display: "flex", gap: "8px", borderRight: "1px solid #eee", paddingRight: "15px", height: "100%", alignItems: "center" }}>
                                <div onClick={() => triggerTool("Wall")} style={{ display: "flex", flexDirection: "column", alignItems: "center", cursor: "pointer", color: "#444" }}>
                                    <div style={{ fontSize: "20px", color: "#666" }}>🧱</div>
                                    <span style={{ fontSize: "10px", marginTop: "2px" }}>Wall</span>
                                </div>
                                <div onClick={() => triggerTool("Door")} style={{ display: "flex", flexDirection: "column", alignItems: "center", cursor: "pointer", color: "#444" }}>
                                    <div style={{ fontSize: "20px", color: "#666" }}>🚪</div>
                                    <span style={{ fontSize: "10px", marginTop: "2px" }}>Door</span>
                                </div>
                                <div onClick={() => triggerTool("Window")} style={{ display: "flex", flexDirection: "column", alignItems: "center", cursor: "pointer", color: "#444" }}>
                                    <div style={{ fontSize: "20px", color: "#666" }}>🪟</div>
                                    <span style={{ fontSize: "10px", marginTop: "2px" }}>Window</span>
                                </div>
                            </div>
                            <div style={{ display: "flex", gap: "8px", borderRight: "1px solid #eee", paddingRight: "15px", height: "100%", alignItems: "center" }}>
                                <div onClick={() => triggerTool("Column")} style={{ display: "flex", flexDirection: "column", alignItems: "center", cursor: "pointer", color: "#444" }}>
                                    <div style={{ fontSize: "20px", color: "#666" }}>🏛️</div>
                                    <span style={{ fontSize: "10px", marginTop: "2px" }}>Column</span>
                                </div>
                                <div onClick={() => triggerTool("Roof")} style={{ display: "flex", flexDirection: "column", alignItems: "center", cursor: "pointer", color: "#444" }}>
                                    <div style={{ fontSize: "20px", color: "#666" }}>🏠</div>
                                    <span style={{ fontSize: "10px", marginTop: "2px" }}>Roof</span>
                                </div>
                            </div>
                            <div style={{ display: "flex", gap: "8px", borderRight: "1px solid #eee", paddingRight: "15px", height: "100%", alignItems: "center" }}>
                                <div onClick={() => setElements([])} style={{ display: "flex", flexDirection: "column", alignItems: "center", cursor: "pointer", color: "#444" }}>
                                    <div style={{ fontSize: "20px", color: "#d9534f" }}>🗑️</div>
                                    <span style={{ fontSize: "10px", marginTop: "2px", color: "#d9534f" }}>Clear</span>
                                </div>
                                <div onClick={exportRender} style={{ display: "flex", flexDirection: "column", alignItems: "center", cursor: "pointer", color: "#444" }}>
                                    <div style={{ fontSize: "20px", color: "#5cb85c" }}>📸</div>
                                    <span style={{ fontSize: "10px", marginTop: "2px", color: "#5cb85c" }}>Render</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div style={{ display: "flex", flex: 1, minHeight: 0 }}>
                        {/* Properties Panel (Left) */}
                        <div style={{ width: "260px", background: "#f5f6f7", borderRight: "1px solid #ccc", display: "flex", flexDirection: "column", fontSize: "11px" }}>
                            <div style={{ padding: "4px 8px", background: "#e1e1e1", fontWeight: "bold", borderBottom: "1px solid #ccc", display: "flex", justifyContent: "space-between" }}>
                                <span>Properties</span>
                                <span style={{ cursor: "pointer" }}>▼</span>
                            </div>

                            {/* Type Selector Dropdown */}
                            <div style={{ padding: "8px", borderBottom: "1px solid #ccc", background: "#fff" }}>
                                <div style={{ display: "flex", alignItems: "center", border: "1px solid #bbb", borderRadius: "2px", padding: "4px", background: "#fdfdfd" }}>
                                    {selectedObject ? (
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontWeight: "bold", fontSize: "12px", color: "#222" }}>{selectedObject.category}</div>
                                            <div style={{ color: "#555" }}>{selectedObject.type}</div>
                                        </div>
                                    ) : (
                                        <div style={{ flex: 1, fontStyle: "italic", color: "#888", padding: "4px 0" }}>
                                            3D View: {`{3D}`}
                                        </div>
                                    )}
                                    <div style={{ borderLeft: "1px solid #ccc", paddingLeft: "4px" }}>▼</div>
                                </div>
                            </div>

                            {/* Data Grid */}
                            <div style={{ flex: 1, overflowY: "auto", background: "#fff" }}>
                                {selectedObject ? (
                                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                                        <tbody>
                                            {/* Header Row */}
                                            <tr style={{ background: "#eef2f5" }}>
                                                <td colSpan={2} style={{ padding: "4px 8px", fontWeight: "bold", borderBottom: "1px solid #ddd" }}>Constraints</td>
                                            </tr>
                                            <tr>
                                                <td style={{ width: "45%", padding: "4px 8px", borderBottom: "1px solid #eee", borderRight: "1px solid #eee", color: "#555" }}>Base Constraint</td>
                                                <td style={{ padding: "4px 8px", borderBottom: "1px solid #eee", color: "#111" }}>Level 1</td>
                                            </tr>
                                            <tr>
                                                <td style={{ padding: "4px 8px", borderBottom: "1px solid #eee", borderRight: "1px solid #eee", color: "#555" }}>Top Constraint</td>
                                                <td style={{ padding: "4px 8px", borderBottom: "1px solid #eee", color: "#111" }}>Up to level: Level 2</td>
                                            </tr>

                                            {/* Dynamic Properties */}
                                            <tr style={{ background: "#eef2f5" }}>
                                                <td colSpan={2} style={{ padding: "4px 8px", fontWeight: "bold", borderBottom: "1px solid #ddd", borderTop: "1px solid #ddd" }}>Identity Data</td>
                                            </tr>
                                            {Object.entries(selectedObject).map(([key, val]) => {
                                                if (key === 'category' || key === 'type') return null; // skip headers
                                                return (
                                                    <tr key={key}>
                                                        <td style={{ padding: "4px 8px", borderBottom: "1px solid #eee", borderRight: "1px solid #eee", color: "#555", textTransform: "capitalize" }}>
                                                            {key.replace(/([A-Z])/g, ' $1').trim()}
                                                        </td>
                                                        <td style={{ padding: "4px 8px", borderBottom: "1px solid #eee", color: "#0e5e9c" }}>
                                                            {val}
                                                        </td>
                                                    </tr>
                                                )
                                            })}
                                        </tbody>
                                    </table>
                                ) : (
                                    <div style={{ padding: "16px", color: "#888", textAlign: "center", fontStyle: "italic" }}>
                                        No item selected. Click on an element in the 3D view to inspect its BIM properties.
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* 3D Canvas Viewport */}
                        <div style={{ flex: 1, position: "relative", background: "#fff" }} onClick={handleDeselect}>
                            {/* ViewCube overlay placeholder */}
                            <div style={{ position: "absolute", top: 16, right: 16, zIndex: 10, width: 60, height: 60, border: "1px solid #ccc", background: "rgba(255,255,255,0.8)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "10px", color: "#666", borderRadius: "2px", boxShadow: "0 2px 5px rgba(0,0,0,0.1)", pointerEvents: "none" }}>
                                <div><div style={{ textAlign: "center", borderBottom: "1px solid #ddd", marginBottom: 2 }}>TOP</div>FRONT</div>
                            </div>

                            <Canvas camera={{ position: [5, 3, 5], fov: 40 }} shadows gl={{ preserveDrawingBuffer: true }}>
                                <Environment preset="city" />
                                <ambientLight intensity={0.5} />
                                <directionalLight position={[5, 10, 5]} intensity={1.2} castShadow shadow-mapSize={[1024, 1024]} />

                                {/* Invisible Ground Plane for Placements */}
                                <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.49, 0]} onClick={handleGridClick} receiveShadow>
                                    <planeGeometry args={[20, 20]} />
                                    <meshBasicMaterial visible={false} />
                                </mesh>

                                <group position={[0, -0.5, 0]}>
                                    {elements.map((el) => {
                                        const isSelected = selectedObject && selectedObject.category.toLowerCase().includes(el.type);
                                        if (el.type === 'wall') {
                                            return (
                                                <mesh key={el.id} position={el.position} castShadow receiveShadow onClick={(e) => { e.stopPropagation(); handleSelect(el.type)(e); }}>
                                                    <boxGeometry args={[4, 2, 0.4]} />
                                                    <meshStandardMaterial color="#b56545" roughness={0.9} emissive={isSelected ? "#0e5e9c" : "#000"} emissiveIntensity={0.2} />
                                                    <Edges color={isSelected ? "#0e5e9c" : "#5a3222"} scale={1.001} />
                                                </mesh>
                                            );
                                        }
                                        if (el.type === 'window') {
                                            return (
                                                <group key={el.id} position={el.position}>
                                                    <mesh castShadow receiveShadow onClick={(e) => { e.stopPropagation(); handleSelect(el.type)(e); }}>
                                                        <boxGeometry args={[1.1, 1.1, 0.5]} />
                                                        <meshStandardMaterial color="#333" roughness={0.5} metalness={0.8} />
                                                    </mesh>
                                                    <mesh position={[0, 0, 0.01]} onClick={(e) => { e.stopPropagation(); handleSelect(el.type)(e); }}>
                                                        <boxGeometry args={[0.9, 0.9, 0.52]} />
                                                        <meshPhysicalMaterial color="#e6f2ff" transmission={0.95} opacity={1} transparent roughness={0.05} ior={1.5} thickness={0.5} emissive={isSelected ? "#0e5e9c" : "#000"} emissiveIntensity={0.2} />
                                                    </mesh>
                                                    <Edges color={isSelected ? "#0e5e9c" : "#111"} scale={1.001} />
                                                </group>
                                            );
                                        }
                                        if (el.type === 'door') {
                                            return (
                                                <group key={el.id} position={el.position}>
                                                    <mesh castShadow receiveShadow onClick={(e) => { e.stopPropagation(); handleSelect(el.type)(e); }}>
                                                        <boxGeometry args={[0.98, 1.54, 0.45]} />
                                                        <meshStandardMaterial color="#ceb693" roughness={0.8} />
                                                    </mesh>
                                                    <mesh castShadow receiveShadow position={[0, 0, 0.1]} onClick={(e) => { e.stopPropagation(); handleSelect(el.type)(e); }}>
                                                        <boxGeometry args={[0.9, 1.5, 0.1]} />
                                                        <meshStandardMaterial color="#6b4c3a" roughness={0.7} emissive={isSelected ? "#0e5e9c" : "#000"} emissiveIntensity={0.2} />
                                                    </mesh>
                                                    <Edges color={isSelected ? "#0e5e9c" : "#3e2a21"} scale={1.001} />
                                                </group>
                                            );
                                        }
                                        if (el.type === 'column') {
                                            return (
                                                <mesh key={el.id} position={el.position} castShadow receiveShadow onClick={(e) => { e.stopPropagation(); handleSelect(el.type)(e); }}>
                                                    <cylinderGeometry args={[0.3, 0.3, 3, 32]} />
                                                    <meshStandardMaterial color="#aaaaaa" roughness={0.8} emissive={isSelected ? "#0e5e9c" : "#000"} emissiveIntensity={0.2} />
                                                    <Edges color={isSelected ? "#0e5e9c" : "#666"} scale={1.001} />
                                                </mesh>
                                            );
                                        }
                                        if (el.type === 'roof') {
                                            return (
                                                <mesh key={el.id} position={el.position} castShadow receiveShadow onClick={(e) => { e.stopPropagation(); handleSelect(el.type)(e); }}>
                                                    <boxGeometry args={[5, 0.4, 5]} />
                                                    <meshStandardMaterial color="#555" roughness={0.9} emissive={isSelected ? "#0e5e9c" : "#000"} emissiveIntensity={0.2} />
                                                    <Edges color={isSelected ? "#0e5e9c" : "#222"} scale={1.001} />
                                                </mesh>
                                            );
                                        }
                                        if (el.type === 'floor') {
                                            return (
                                                <mesh key={el.id} position={el.position} receiveShadow onClick={(e) => { e.stopPropagation(); handleDeselect(); }}>
                                                    <boxGeometry args={[6, 0.2, 6]} />
                                                    <meshStandardMaterial color="#888" roughness={1} />
                                                    <Edges color="#555" scale={1.001} />
                                                </mesh>
                                            );
                                        }
                                        return null;
                                    })}
                                </group>

                                {/* Soft Contact Shadow on ground */}
                                <ContactShadows position={[0, -0.49, 0]} opacity={0.5} scale={10} blur={2} far={4} />

                                <OrbitControls makeDefault enableZoom={true} />
                            </Canvas>

                            {/* View Control Bar at bottom of viewport */}
                            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "#f5f6f7", padding: "2px 8px", borderTop: "1px solid #ccc", display: "flex", gap: "10px", fontSize: "11px", color: "#444" }}>
                                <span>1 : 100</span>
                                <span style={{ borderLeft: "1px solid #ccc", paddingLeft: "10px" }}>Visual Style: Realistic</span>
                                <span style={{ borderLeft: "1px solid #ccc", paddingLeft: "10px" }}>Detail Level: Fine</span>
                            </div>
                        </div>
                    </div>
                </div>
            </ScrollReveal>
        </div>
    );
}
