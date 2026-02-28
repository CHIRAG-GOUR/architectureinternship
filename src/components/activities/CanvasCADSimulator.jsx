import { useState, useRef, useEffect } from "react";
import ScrollReveal from "../ScrollReveal";

export default function CanvasCADSimulator() {
    const canvasRef = useRef(null);
    const containerRef = useRef(null);
    const [lines, setLines] = useState([]); // [{x1, y1, x2, y2}]
    const [commandLog, setCommandLog] = useState(["AutoCAD Web Simulator initialized."]);
    const [currentInput, setCurrentInput] = useState("");
    const [state, setState] = useState("IDLE"); // IDLE, WAIT_P1, WAIT_P2
    const [p1, setP1] = useState(null);
    const [isFullscreen, setIsFullscreen] = useState(false);

    // Pan and Zoom state
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const [scale, setScale] = useState(1);
    const [isPanning, setIsPanning] = useState(false);
    const [lastMouse, setLastMouse] = useState({ x: 0, y: 0 });
    const [mouseWorld, setMouseWorld] = useState(null); // Track mouse in CAD world coordinates for preview

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            containerRef.current.requestFullscreen().catch(err => {
                alert(`Error attempting to enable fullscreen: ${err.message} (${err.name})`);
            });
        } else {
            document.exitFullscreen();
        }
    };

    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
            // Resize canvas
            if (canvasRef.current && containerRef.current) {
                if (document.fullscreenElement) {
                    canvasRef.current.width = window.innerWidth;
                    canvasRef.current.height = window.innerHeight - 150; // leave room for ribbon and command line
                } else {
                    canvasRef.current.width = containerRef.current.clientWidth;
                    canvasRef.current.height = 400;
                }
            }
        };

        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
    }, []);

    // Draw the CAD grid and lines
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        const w = canvas.width;
        const h = canvas.height;

        // Black background
        ctx.fillStyle = "#1e1e1e"; // Classic AutoCAD dark theme
        ctx.fillRect(0, 0, w, h);

        ctx.save();
        ctx.translate(w / 2 + offset.x, h / 2 + offset.y);
        ctx.scale(scale, scale);

        // Grid (dark grey)
        ctx.strokeStyle = "#333333";
        ctx.lineWidth = 1 / scale;

        // Dynamic grid based on scale
        const gridSize = 50;
        const startX = -w / scale / 2 - offset.x / scale;
        const endX = w / scale / 2 - offset.x / scale;
        const startY = -h / scale / 2 - offset.y / scale;
        const endY = h / scale / 2 - offset.y / scale;

        const firstX = Math.floor(startX / gridSize) * gridSize;
        const firstY = Math.floor(startY / gridSize) * gridSize;

        ctx.beginPath();
        for (let x = firstX; x < endX; x += gridSize) {
            ctx.moveTo(x, startY); ctx.lineTo(x, endY);
        }
        for (let y = firstY; y < endY; y += gridSize) {
            ctx.moveTo(startX, y); ctx.lineTo(endX, y);
        }
        ctx.stroke();

        // Draw saved lines (AutoCAD green)
        ctx.strokeStyle = "#00ff00";
        ctx.lineWidth = 2 / scale;
        lines.forEach(l => {
            ctx.beginPath();
            ctx.moveTo(l.x1, -l.y1); // Invert Y to match CAD coords (0,0 at center)
            ctx.lineTo(l.x2, -l.y2);
            ctx.stroke();
        });

        // Draw preview line if waiting for P2
        if (state === "WAIT_P2" && p1 && mouseWorld) {
            ctx.strokeStyle = "#ffffff";
            ctx.lineWidth = 1 / scale;
            ctx.setLineDash([5 / scale, 5 / scale]);
            ctx.beginPath();
            ctx.moveTo(p1.x, -p1.y);
            ctx.lineTo(mouseWorld.x, -mouseWorld.y);
            ctx.stroke();
            ctx.setLineDash([]);
        }

        // Draw axis lines (UCS icon mapping)
        ctx.strokeStyle = "#ff0000"; // X red
        ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(100, 0); ctx.stroke();
        ctx.strokeStyle = "#00ff00"; // Y green
        ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, -100); ctx.stroke();

        ctx.restore();

        // Fixed UCS icon at bottom left
        ctx.strokeStyle = "#ff0000";
        ctx.beginPath(); ctx.moveTo(30, h - 30); ctx.lineTo(60, h - 30); ctx.stroke();
        ctx.strokeStyle = "#00ff00";
        ctx.beginPath(); ctx.moveTo(30, h - 30); ctx.lineTo(30, h - 60); ctx.stroke();
        ctx.fillStyle = "#fff";
        ctx.font = "12px sans-serif";
        ctx.fillText("X", 65, h - 25);
        ctx.fillText("Y", 25, h - 65);
        ctx.fillRect(28, h - 32, 4, 4); // origin box

    }, [lines, offset, scale, isFullscreen]);

    const executeCommand = (val) => {
        val = val.trim().toUpperCase();
        const newLog = [...commandLog, `Command: ${val}`];

        if (state === "IDLE") {
            if (val === "LINE" || val === "L") {
                setState("WAIT_P1");
                newLog.push("LINE Specify first point (x,y):");
            } else if (val === "CLEAR") {
                setLines([]);
                newLog.push("Canvas cleared.");
            } else if (val === "ZOOM" || val === "Z") {
                setScale(1);
                setOffset({ x: 0, y: 0 });
                newLog.push("Zoom extents applied.");
            } else {
                newLog.push(`Unknown command "${val}". Press F1 for help.`);
            }
        } else if (state === "WAIT_P1") {
            const coords = val.split(",");
            if (coords.length === 2 && !isNaN(coords[0]) && !isNaN(coords[1])) {
                setP1({ x: parseFloat(coords[0]), y: parseFloat(coords[1]) });
                setState("WAIT_P2");
                newLog.push("Specify next point or [Undo]:");
            } else {
                newLog.push("Invalid point. Format must be X,Y (e.g., 50,50):");
            }
        } else if (state === "WAIT_P2") {
            if (val === "" || val === "C") {
                setState("IDLE");
                newLog.push("Command canceled.");
            } else {
                const coords = val.split(",");
                if (coords.length === 2 && !isNaN(coords[0]) && !isNaN(coords[1])) {
                    const p2 = { x: parseFloat(coords[0]), y: parseFloat(coords[1]) };
                    setLines([...lines, { x1: p1.x, y1: p1.y, x2: p2.x, y2: p2.y }]);
                    setP1(p2); // Chain lines
                    newLog.push("Specify next point or [Undo]:");
                } else {
                    newLog.push("Invalid point. Format must be X,Y:");
                }
            }
        }

        setCommandLog(newLog.slice(-8)); // Keep last 8 logs
    };

    const handleCommand = (e) => {
        if (e.key === "Enter") {
            executeCommand(currentInput);
            setCurrentInput("");
        }
    };

    const handleMouseDown = (e) => {
        const rect = canvasRef.current.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const w = canvasRef.current.width;
        const h = canvasRef.current.height;
        const worldX = (mouseX - w / 2 - offset.x) / scale;
        const worldY = -(mouseY - h / 2 - offset.y) / scale; // Y inverted

        if (e.button === 1 || e.button === 2) { // Middle or Right click pan
            setIsPanning(true);
            setLastMouse({ x: e.clientX, y: e.clientY });
        } else if (e.button === 0) { // Left click
            if (state === "WAIT_P1") {
                setP1({ x: worldX, y: worldY });
                setState("WAIT_P2");
                setCommandLog(prev => [...prev.slice(-7), `Point: ${worldX.toFixed(1)}, ${worldY.toFixed(1)}`, "Specify next point or [Undo]:"]);
            } else if (state === "WAIT_P2") {
                const p2 = { x: worldX, y: worldY };
                setLines(prev => [...prev, { x1: p1.x, y1: p1.y, x2: p2.x, y2: p2.y }]);
                setP1(p2);
                setCommandLog(prev => [...prev.slice(-7), `Point: ${p2.x.toFixed(1)}, ${p2.y.toFixed(1)}`, "Specify next point or [Undo]:"]);
            }
        }
    };

    const handleMouseMove = (e) => {
        const rect = canvasRef.current.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const w = canvasRef.current.width;
        const h = canvasRef.current.height;
        const worldX = (mouseX - w / 2 - offset.x) / scale;
        const worldY = -(mouseY - h / 2 - offset.y) / scale;

        setMouseWorld({ x: worldX, y: worldY });

        if (isPanning) {
            const dx = e.clientX - lastMouse.x;
            const dy = e.clientY - lastMouse.y;
            setOffset(prev => ({ x: prev.x + dx, y: prev.y + dy }));
            setLastMouse({ x: e.clientX, y: e.clientY });
        }
    };

    const handleMouseUp = () => {
        setIsPanning(false);
    };

    const handleWheel = (e) => {
        e.preventDefault(); // Prevent page scrolling
        const zoomIntensity = 0.1;
        const delta = e.deltaY < 0 ? 1 + zoomIntensity : 1 - zoomIntensity;
        setScale(prev => Math.max(0.1, Math.min(prev * delta, 10)));
    };

    // Ribbon UI Toolbar component
    const RibbonButton = ({ icon, label, onClick }) => (
        <button
            onClick={onClick}
            style={{
                background: "transparent", border: "1px solid transparent", color: "#d4d4d4",
                display: "flex", flexDirection: "column", alignItems: "center", padding: "4px 8px", cursor: "pointer",
                fontSize: "11px", borderRadius: "4px"
            }}
            onMouseEnter={e => e.currentTarget.style.background = "#3e3e42"}
            onMouseLeave={e => e.currentTarget.style.background = "transparent"}
        >
            <div style={{ fontSize: "18px", marginBottom: "2px", color: "#61dafb" }}>{icon}</div>
            {label}
        </button>
    );

    return (
        <div className="section-gap">
            <ScrollReveal className="content-card" style={{ padding: isFullscreen ? "0" : "2rem" }}>
                {!isFullscreen && (
                    <div style={{ textAlign: "center" }}>
                        <h3 style={{ color: "#5c4033", marginBottom: "0.5rem" }}>AutoCAD Web Simulator</h3>
                        <p style={{ color: "#8b7355", fontSize: "0.95rem", marginBottom: "1.5rem" }}>
                            Experience industry-grade drafting. Enter coordinates or click below to enter Fullscreen mode.
                        </p>
                    </div>
                )}

                <div
                    ref={containerRef}
                    style={{
                        border: isFullscreen ? "none" : "2px solid #555",
                        borderRadius: isFullscreen ? "0" : "8px",
                        overflow: "hidden",
                        background: "#1e1e1e",
                        display: "flex",
                        flexDirection: "column",
                        width: "100%",
                        height: isFullscreen ? "100vh" : "600px" // explicitly taller default
                    }}
                >
                    {/* Fake Ribbon UI */}
                    <div style={{ background: "#2d2d30", display: "flex", flexDirection: "column", borderBottom: "1px solid #111" }}>
                        <div style={{ display: "flex", gap: "2px", padding: "4px 8px", background: "#3e3e42", fontSize: "12px", color: "#fff" }}>
                            <span style={{ padding: "4px 12px", background: "#1e1e1e", borderTopLeftRadius: "4px", borderTopRightRadius: "4px" }}>Home</span>
                            <span onClick={() => { setCommandLog(prev => [...prev.slice(-7), "[Ribbon] Insert tab clicked. (Simulation Only)"]); }} style={{ padding: "4px 12px", cursor: "pointer" }}>Insert</span>
                            <span onClick={() => { setCommandLog(prev => [...prev.slice(-7), "[Ribbon] Annotate tab clicked. (Simulation Only)"]); }} style={{ padding: "4px 12px", cursor: "pointer" }}>Annotate</span>
                            <span onClick={() => { setCommandLog(prev => [...prev.slice(-7), "[Ribbon] View tab clicked. (Simulation Only)"]); }} style={{ padding: "4px 12px", cursor: "pointer" }}>View</span>
                            <div style={{ flex: 1 }}></div>
                            <button onClick={toggleFullscreen} style={{ background: "#0078d7", color: "white", border: "none", padding: "2px 10px", borderRadius: "2px", cursor: "pointer" }}>
                                {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
                            </button>
                        </div>
                        <div style={{ display: "flex", padding: "8px", gap: "16px", overflowX: "auto" }}>
                            <div style={{ display: "flex", gap: "4px", borderRight: "1px solid #555", paddingRight: "16px" }}>
                                <RibbonButton icon="✏️" label="Line" onClick={() => executeCommand("L")} />
                                <RibbonButton icon="〰️" label="Polyline" onClick={() => { setCommandLog(prev => [...prev.slice(-7), "Command: PLINE (Not implemented in demo)"]); }} />
                                <RibbonButton icon="⭕" label="Circle" onClick={() => { setCommandLog(prev => [...prev.slice(-7), "Command: CIRCLE (Not implemented in demo)"]); }} />
                                <RibbonButton icon="📐" label="Arc" onClick={() => { setCommandLog(prev => [...prev.slice(-7), "Command: ARC (Not implemented in demo)"]); }} />
                            </div>
                            <div style={{ display: "flex", gap: "4px", borderRight: "1px solid #555", paddingRight: "16px" }}>
                                <RibbonButton icon="✂️" label="Trim" onClick={() => { setCommandLog(prev => [...prev.slice(-7), "Select objects to trim: (Not implemented)"]); }} />
                                <RibbonButton icon="🔄" label="Rotate" onClick={() => { setCommandLog(prev => [...prev.slice(-7), "Select objects to rotate: (Not implemented)"]); }} />
                                <RibbonButton icon="🗑️" label="Erase" onClick={() => executeCommand("CLEAR")} />
                            </div>
                            <div style={{ display: "flex", gap: "4px" }}>
                                <RibbonButton icon="🔍" label="Zoom Extents" onClick={() => executeCommand("Z")} />
                                <RibbonButton icon="💾" label="Save & Export" onClick={() => {
                                    if (canvasRef.current) {
                                        const url = canvasRef.current.toDataURL("image/png");
                                        const a = document.createElement('a');
                                        a.href = url;
                                        a.download = 'autocad_drawing.png';
                                        a.click();
                                        setCommandLog(prev => [...prev.slice(-7), "Command: EXPORT - PNG saved locally."]);
                                    }
                                }} />
                            </div>
                        </div>
                    </div>

                    {/* Drawing Canvas */}
                    <canvas
                        ref={canvasRef}
                        width={800} // Initialize with explicit numbers, will be overridden by useEffect if container valid
                        height={400}
                        style={{ flex: 1, display: "block", cursor: "crosshair", userSelect: "none" }}
                        onMouseDown={handleMouseDown}
                        onMouseMove={handleMouseMove}
                        onMouseUp={handleMouseUp}
                        onMouseLeave={handleMouseUp}
                        onWheel={handleWheel}
                        onContextMenu={e => e.preventDefault()}
                    />

                    {/* Command Line Interface */}
                    <div style={{ background: "#252526", borderTop: "2px solid #333", padding: "0.5rem", textAlign: "left", fontFamily: "Consolas, monospace", fontSize: "13px", color: "#d4d4d4", height: "120px", display: "flex", flexDirection: "column" }}>
                        <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
                            {commandLog.map((log, i) => (
                                <div key={i} style={{ opacity: i === commandLog.length - 1 ? 1 : 0.7 }}>{log}</div>
                            ))}
                        </div>
                        <div style={{ display: "flex", marginTop: "4px", background: "#1e1e1e", padding: "2px" }}>
                            <span style={{ marginRight: "4px", color: "#569cd6", fontWeight: "bold" }}>Type a command:</span>
                            <input
                                type="text"
                                value={currentInput}
                                onChange={(e) => setCurrentInput(e.target.value)}
                                onKeyDown={handleCommand}
                                style={{
                                    background: "transparent", border: "none", color: "#fff", outline: "none",
                                    fontFamily: "Consolas, monospace", fontSize: "13px", flex: 1
                                }}
                                autoFocus
                            />
                        </div>
                    </div>
                </div>
            </ScrollReveal>
        </div>
    );
}
