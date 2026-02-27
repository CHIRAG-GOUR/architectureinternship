import { useState, useRef, useEffect, useCallback } from "react";
import { playClick, playToggle, playWhoosh } from "../../utils/useSound";
import ScrollReveal from "../ScrollReveal";

/*
  BuildingAutopsy — Interactive layer dissector for 3 iconic buildings.
  Uses high-quality generated architectural illustrations as backgrounds.
  4 analysis filters reveal hidden layers with animated hotspots.
*/

const W = 720, H = 540;

const BUILDINGS = [
    {
        id: "villa_savoye", label: "Villa Savoye", architect: "Le Corbusier", year: 1931,
        image: "/assets/villa_savoye.png",
        desc: "The manifesto of Modern Architecture — the \"Five Points\" in built form.",
        layers: {
            concept: {
                label: "🧠 Concept: \"Machine for Living\"",
                learn: "Le Corbusier's concept was the \"Five Points of Architecture\": Pilotis (columns lifting the building), Roof Garden, Free Plan (no load-bearing walls), Horizontal Windows, Free Facade. The house is a MANIFESTO — each element proves that modern technology liberates architecture from tradition.",
                hotspots: [
                    { x: 0.50, y: 0.82, label: "Pilotis", tip: "Thin columns lift the building off the ground, freeing the landscape and proving structure ≠ walls." },
                    { x: 0.50, y: 0.10, label: "Roof Garden", tip: "The flat roof becomes a garden — the ground 'taken' by the building is returned on top." },
                    { x: 0.18, y: 0.48, label: "Horizontal Windows", tip: "Ribbon windows run the full width — only possible because walls don't carry loads anymore." },
                    { x: 0.82, y: 0.55, label: "Free Facade", tip: "The facade is a thin curtain, independent of structure. It can be anything the architect wants." },
                ],
            },
            circulation: {
                label: "🚶 Circulation: The Promenade",
                learn: "The ramp is the SPINE. Le Corbusier designed an 'architectural promenade' — a continuous ramp from ground to roof that unfolds views and spaces sequentially, just like a film. You never see the whole building at once; it reveals itself as you move through it.",
                hotspots: [
                    { x: 0.40, y: 0.78, label: "Entry Ramp", tip: "The ramp begins at ground level, drawing you upward in a smooth diagonal — no stairs, pure flow." },
                    { x: 0.35, y: 0.48, label: "Interior Ramp", tip: "The ramp continues inside, connecting all three levels in one continuous movement." },
                    { x: 0.60, y: 0.25, label: "Roof Arrival", tip: "The ramp terminates at the roof garden — the climax of the promenade with sky views." },
                    { x: 0.22, y: 0.60, label: "Double-Height Void", tip: "The double-height void next to the ramp creates dramatic spatial compression and release." },
                ],
            },
            structure: {
                label: "🏗️ Structure: Dom-Ino Frame",
                learn: "The 'Dom-Ino' system: a grid of reinforced concrete columns supporting flat slabs. This is REVOLUTIONARY — it means walls are freed from carrying loads. Interior walls can go anywhere. Facades become curtains. The entire 'Free Plan' depends on this structural innovation.",
                hotspots: [
                    { x: 0.30, y: 0.72, label: "Column Grid", tip: "A regular grid of slender concrete columns carries ALL the weight. No walls needed." },
                    { x: 0.50, y: 0.50, label: "Flat Slab", tip: "Reinforced concrete flat slabs span between columns — enabling the 'free plan' below." },
                    { x: 0.72, y: 0.42, label: "Curtain Wall", tip: "The facade hangs like a curtain from the slab edge. It carries zero structural load." },
                    { x: 0.15, y: 0.52, label: "Cantilever", tip: "The slab extends beyond the columns — creating the overhanging balcony. Structure as expression." },
                ],
            },
            environment: {
                label: "🌍 Environment: Landscape Machine",
                learn: "Villa Savoye sits in a meadow near Paris. The pilotis lift the building above the damp ground and allow views in ALL directions. The ribbon windows frame the landscape like a panoramic film strip. The roof garden reconnects you to nature above.",
                hotspots: [
                    { x: 0.50, y: 0.92, label: "Lifted Above Ground", tip: "Pilotis raise the building, allowing air and landscape to flow beneath — passive ventilation." },
                    { x: 0.12, y: 0.42, label: "360° Panorama", tip: "Ribbon windows on all sides capture the surrounding meadow — the landscape is the decoration." },
                    { x: 0.50, y: 0.06, label: "Green Roof", tip: "The green roof provides insulation and returns ecology to the building footprint." },
                    { x: 0.88, y: 0.65, label: "Sun Exposure", tip: "The square plan + all-side windows mean every room gets sunlight at some point during the day." },
                ],
            },
        },
    },
    {
        id: "barcelona_pavilion", label: "Barcelona Pavilion", architect: "Mies van der Rohe", year: 1929,
        image: "/assets/barcelona_pavilion.png",
        desc: "\"Less is More\" — space defined by thin planes, not rooms.",
        layers: {
            concept: {
                label: "🧠 Concept: \"Less is More\"",
                learn: "Mies stripped architecture to its essence: thin planes of marble, glass, and chrome floating in space. There are NO enclosed rooms — space flows continuously around and between the planes. The building is about the EXPERIENCE of moving through weightless, overlapping spaces.",
                hotspots: [
                    { x: 0.35, y: 0.50, label: "Flowing Space", tip: "Walls don't touch — space flows around them. You're never 'in a room,' you're in continuous space." },
                    { x: 0.68, y: 0.42, label: "Material Richness", tip: "Green marble, onyx, chrome columns — luxurious materials compensate for minimal geometry." },
                    { x: 0.50, y: 0.82, label: "Reflecting Pool", tip: "Water mirrors the building, doubling its visual presence and dissolving the ground plane." },
                    { x: 0.50, y: 0.18, label: "Floating Roof", tip: "The thin hovering roof unifies everything below — one plane rules the entire composition." },
                ],
            },
            circulation: {
                label: "🚶 Circulation: Free Wandering",
                learn: "There is NO prescribed path. Unlike Villa Savoye's scripted promenade, the Barcelona Pavilion invites FREE WANDERING. Walls suggest directions but never force them. You discover the space by exploring — each viewpoint reveals a different composition.",
                hotspots: [
                    { x: 0.12, y: 0.58, label: "Drift Entry", tip: "No grand entrance — you drift in from the side, already immersed in the spatial play." },
                    { x: 0.45, y: 0.48, label: "Indoor-Outdoor", tip: "Walls slide past each other, blurring inside and outside. You're never sure where 'in' ends." },
                    { x: 0.78, y: 0.52, label: "Sculpture Court", tip: "The statue creates a pause point — an anchor in the flowing space." },
                    { x: 0.60, y: 0.35, label: "Transparency", tip: "Glass walls let you see through the building — future paths are visible before you reach them." },
                ],
            },
            structure: {
                label: "🏗️ Structure: Chrome Cruciform Columns",
                learn: "Eight cruciform chrome-plated steel columns hold up the roof slab. The columns are so slender and reflective they almost DISAPPEAR — making the roof appear to float. Walls are pure partition, carrying nothing.",
                hotspots: [
                    { x: 0.32, y: 0.38, label: "Chrome Column", tip: "Cruciform (cross-shaped) chrome columns — structural, yet they reflect surroundings and vanish." },
                    { x: 0.65, y: 0.22, label: "Roof Slab", tip: "A thin concrete slab — visually weightless, it hovers above like a detached plane." },
                    { x: 0.50, y: 0.58, label: "Non-Bearing Walls", tip: "Every wall is freestanding — they could be removed without affecting the building's stability." },
                    { x: 0.25, y: 0.75, label: "Travertine Podium", tip: "The travertine platform elevates the entire composition — a stage for architecture." },
                ],
            },
            environment: {
                label: "🌍 Environment: Framing the View",
                learn: "Built for the 1929 Barcelona International Exposition on Montjuïc hill. The podium raises the pavilion above the exhibition grounds. Water pools reflect the sky. The transparency means climate flows THROUGH the building — barely enclosed.",
                hotspots: [
                    { x: 0.50, y: 0.88, label: "Water as Mirror", tip: "The pool reflects clouds, sky, and marble — multiplying the building's visual depth infinitely." },
                    { x: 0.85, y: 0.30, label: "Cross Ventilation", tip: "Open sides + glass walls allow Mediterranean breezes to flow through — no AC needed." },
                    { x: 0.18, y: 0.28, label: "Shade Plane", tip: "The roof creates deep shade below — critical in Barcelona's hot summers." },
                    { x: 0.50, y: 0.48, label: "Light Play", tip: "Sunlight filters through tinted glass, casting colored light on marble — architecture as light art." },
                ],
            },
        },
    },
    {
        id: "salk_institute", label: "Salk Institute", architect: "Louis Kahn", year: 1965,
        image: "/assets/salk_institute.png",
        desc: "Symmetry, silence, and the power of the void.",
        layers: {
            concept: {
                label: "🧠 Concept: \"The Space Between\"",
                learn: "Kahn's concept was that the VOID — the empty courtyard — is the most important space. Two mirrored wings face each other across a travertine plaza, with a single water channel pointing to the Pacific Ocean. The emptiness isn't a lack of building — it IS the building.",
                hotspots: [
                    { x: 0.50, y: 0.50, label: "The Central Void", tip: "The empty plaza IS the concept. It gives scientists a place for reflection between experiments." },
                    { x: 0.50, y: 0.85, label: "Water Channel", tip: "A thin line of water bisects the plaza, pointing to the ocean — connecting human work to the infinite." },
                    { x: 0.15, y: 0.45, label: "Mirrored Wings", tip: "Perfect bilateral symmetry — two identical lab wings face each other, creating formal dignity." },
                    { x: 0.50, y: 0.08, label: "Ocean Horizon", tip: "The plaza frames the Pacific — the void opens to infinity, symbolizing endless scientific possibility." },
                ],
            },
            circulation: {
                label: "🚶 Circulation: Served & Servant",
                learn: "Kahn invented the 'Served vs. Servant' concept here. LAB SPACES (served) are open and flexible. SERVICE SPACES (ducts, pipes, stairs) are hidden in interstitial floors between labs. Labs can be reconfigured without construction.",
                hotspots: [
                    { x: 0.28, y: 0.38, label: "Lab Floor (Served)", tip: "Completely open lab floors — no columns, no ducts. Pure, flexible space for science." },
                    { x: 0.28, y: 0.58, label: "Service Floor", tip: "Hidden between lab floors: all pipes, ducts, and wiring. Accessible but invisible." },
                    { x: 0.78, y: 0.45, label: "Study Towers", tip: "Private offices project over the ocean — scientists get contemplation with a view." },
                    { x: 0.50, y: 0.72, label: "Ground Entry", tip: "Entry is from below, ascending into the courtyard. The void reveals itself dramatically." },
                ],
            },
            structure: {
                label: "🏗️ Structure: Poured Concrete + Teak",
                learn: "Kahn used POURED-IN-PLACE CONCRETE left unfinished — each board mark from the formwork is visible, giving texture and honesty. Teak wood panels fill windows, contrasting warm against cool. Structure is EXPRESSED — you can read exactly how loads flow.",
                hotspots: [
                    { x: 0.22, y: 0.35, label: "Board-Formed Concrete", tip: "Concrete poured against wooden forms — the wood grain texture is permanent decoration." },
                    { x: 0.75, y: 0.35, label: "Teak Panels", tip: "Teak wood weathers to silver-grey, matching the concrete — materials age together gracefully." },
                    { x: 0.50, y: 0.30, label: "Vierendeel Truss", tip: "Massive trusses span the labs — creating column-free interiors. The structure IS the architecture." },
                    { x: 0.22, y: 0.70, label: "Travertine Paving", tip: "Italian travertine covers the plaza — a warm, natural stone connecting earth to ocean." },
                ],
            },
            environment: {
                label: "🌍 Environment: Ocean, Light, Silence",
                learn: "Perched on cliffs above the Pacific in La Jolla, California. The courtyard faces DUE WEST — at equinox, the sun sets EXACTLY along the water channel. Kahn consulted Barragán, who advised: 'make this a facade to the sky.'",
                hotspots: [
                    { x: 0.50, y: 0.12, label: "Pacific Horizon", tip: "The courtyard opens to an unbroken ocean horizon — contemplation at the scale of infinity." },
                    { x: 0.82, y: 0.50, label: "Equinox Sunset", tip: "At equinox, the sun sets exactly along the water channel — architecture aligned with astronomy." },
                    { x: 0.15, y: 0.30, label: "No Trees", tip: "Barragán advised no plantings — the plaza is intentionally bare, a 'facade to the sky.'" },
                    { x: 0.50, y: 0.65, label: "Cliff Edge", tip: "The site drops to the ocean — perched between earth and sky, grounded yet infinite." },
                ],
            },
        },
    },
];

const FILTERS = [
    { id: "concept", label: "🧠 Concept", color: "#c9a96e" },
    { id: "circulation", label: "🚶 Circulation", color: "#7b9cc7" },
    { id: "structure", label: "🏗️ Structure", color: "#C78F57" },
    { id: "environment", label: "🌍 Environment", color: "#6b8f71" },
];

export default function BuildingAutopsy() {
    const canvasRef = useRef(null);
    const containerRef = useRef(null);
    const [buildingIdx, setBuildingIdx] = useState(0);
    const [filterIdx, setFilterIdx] = useState(0);
    const [hoveredHotspot, setHoveredHotspot] = useState(null);
    const [discoveredHotspots, setDiscoveredHotspots] = useState(new Set());
    const [isFullscreen, setIsFullscreen] = useState(false);
    const frameRef = useRef(0);
    const animRef = useRef(null);
    const imagesRef = useRef({});
    const [imagesLoaded, setImagesLoaded] = useState(false);

    const building = BUILDINGS[buildingIdx];
    const filter = FILTERS[filterIdx];
    const layer = building.layers[filter.id];

    // Preload all building images
    useEffect(() => {
        let loaded = 0;
        const total = BUILDINGS.length;
        BUILDINGS.forEach(b => {
            const img = new Image();
            img.onload = () => {
                imagesRef.current[b.id] = img;
                loaded++;
                if (loaded === total) setImagesLoaded(true);
            };
            img.onerror = () => {
                loaded++;
                if (loaded === total) setImagesLoaded(true);
            };
            img.src = b.image;
        });
    }, []);

    const toggleFullscreen = () => {
        playClick();
        if (!document.fullscreenElement) containerRef.current?.requestFullscreen?.();
        else document.exitFullscreen?.();
    };
    useEffect(() => {
        const h = () => setIsFullscreen(!!document.fullscreenElement);
        document.addEventListener("fullscreenchange", h);
        return () => document.removeEventListener("fullscreenchange", h);
    }, []);

    // Drawing
    const draw = useCallback(() => {
        const cvs = canvasRef.current; if (!cvs) return;
        const ctx = cvs.getContext("2d"); ctx.clearRect(0, 0, W, H);
        frameRef.current++;

        const filterColor = filter.color;

        // ── Background: high-quality building image ──
        const img = imagesRef.current[building.id];
        if (img) {
            // Cover-fit the image into the canvas
            const imgRatio = img.width / img.height;
            const cvsRatio = W / H;
            let sx = 0, sy = 0, sw = img.width, sh = img.height;
            if (imgRatio > cvsRatio) {
                sw = img.height * cvsRatio;
                sx = (img.width - sw) / 2;
            } else {
                sh = img.width / cvsRatio;
                sy = (img.height - sh) / 2;
            }
            ctx.drawImage(img, sx, sy, sw, sh, 0, 0, W, H);
        } else {
            // Fallback grid background
            ctx.fillStyle = "#f8f4ee";
            ctx.fillRect(0, 0, W, H);
            ctx.strokeStyle = "rgba(92,64,51,0.04)"; ctx.lineWidth = 0.5;
            for (let gx = 0; gx < W; gx += 20) { ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, H); ctx.stroke(); }
            for (let gy = 0; gy < H; gy += 20) { ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(W, gy); ctx.stroke(); }
        }

        // ── Filter color overlay (subtle tint) ──
        ctx.fillStyle = filterColor + "12";
        ctx.fillRect(0, 0, W, H);

        // ── Vignette for depth ──
        const grad = ctx.createRadialGradient(W / 2, H / 2, W * 0.3, W / 2, H / 2, W * 0.7);
        grad.addColorStop(0, "rgba(0,0,0,0)");
        grad.addColorStop(1, "rgba(0,0,0,0.15)");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, W, H);

        // ── Hotspots ──
        layer.hotspots.forEach((hs, i) => {
            const hx = hs.x * W, hy = hs.y * H;
            const discovered = discoveredHotspots.has(`${buildingIdx}-${filterIdx}-${i}`);
            const t = frameRef.current * 0.05 + i * 1.5;
            const pulse = Math.sin(t) * 5;
            const alpha = 0.6 + Math.sin(t) * 0.4;

            // Outer glow
            const glowGrad = ctx.createRadialGradient(hx, hy, 0, hx, hy, 22 + pulse);
            glowGrad.addColorStop(0, discovered ? `${filterColor}30` : `${filterColor}50`);
            glowGrad.addColorStop(1, `${filterColor}00`);
            ctx.fillStyle = glowGrad;
            ctx.beginPath(); ctx.arc(hx, hy, 22 + pulse, 0, Math.PI * 2); ctx.fill();

            // Ring
            ctx.globalAlpha = alpha;
            ctx.strokeStyle = discovered ? filterColor + "60" : "#fff";
            ctx.lineWidth = 2.5;
            ctx.beginPath(); ctx.arc(hx, hy, 13 + pulse * 0.5, 0, Math.PI * 2); ctx.stroke();

            // Inner dot
            ctx.fillStyle = discovered ? filterColor : "#fff";
            ctx.shadowColor = discovered ? filterColor : "rgba(255,255,255,0.8)";
            ctx.shadowBlur = 8;
            ctx.beginPath(); ctx.arc(hx, hy, 5, 0, Math.PI * 2); ctx.fill();
            ctx.shadowBlur = 0;
            ctx.globalAlpha = 1;

            // Label background pill
            const labelW = ctx.measureText(hs.label).width + 16;
            ctx.font = "bold 11px Inter, system-ui, sans-serif";
            const lw = ctx.measureText(hs.label).width + 16;
            const lx = hx - lw / 2, ly = hy - 28;
            ctx.fillStyle = "rgba(0,0,0,0.55)";
            ctx.beginPath(); ctx.roundRect(lx, ly, lw, 18, 9); ctx.fill();
            ctx.fillStyle = "#fff"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
            ctx.fillText(hs.label, hx, ly + 9);

            // Hovered tooltip
            if (hoveredHotspot === i) {
                const tw = 240, maxH = 80;
                let tx = hx - tw / 2, ty = hy + 28;
                if (tx < 8) tx = 8; if (tx + tw > W - 8) tx = W - tw - 8;
                if (ty + maxH > H - 8) ty = hy - maxH - 28;

                // Tooltip bg
                ctx.fillStyle = "rgba(0,0,0,0.75)";
                ctx.beginPath(); ctx.roundRect(tx, ty, tw, maxH, 10); ctx.fill();
                ctx.strokeStyle = filterColor; ctx.lineWidth = 1.5; ctx.stroke();

                // Tooltip text
                ctx.fillStyle = "#fff"; ctx.font = "12px Inter, system-ui, sans-serif"; ctx.textAlign = "left"; ctx.textBaseline = "top";
                const words = hs.tip.split(" "); let line = "", ly2 = ty + 10;
                words.forEach(w => {
                    const test = line + w + " ";
                    if (ctx.measureText(test).width > tw - 20) { ctx.fillText(line, tx + 10, ly2); ly2 += 16; line = w + " "; }
                    else { line = test; }
                });
                ctx.fillText(line, tx + 10, ly2);
            }
        });

        // ── Title bar (top) ──
        ctx.fillStyle = "rgba(0,0,0,0.45)";
        ctx.fillRect(0, 0, W, 38);
        ctx.fillStyle = "#fff"; ctx.font = "bold 13px Inter, system-ui, sans-serif"; ctx.textAlign = "left"; ctx.textBaseline = "middle";
        ctx.fillText(layer.label, 14, 19);
        // Discovery counter
        const total = layer.hotspots.length;
        const found = layer.hotspots.filter((_, i) => discoveredHotspots.has(`${buildingIdx}-${filterIdx}-${i}`)).length;
        ctx.fillStyle = "rgba(255,255,255,0.6)"; ctx.font = "11px Inter, system-ui, sans-serif"; ctx.textAlign = "right";
        ctx.fillText(`${found}/${total} discovered`, W - 14, 19);

        // ── Bottom info bar ──
        ctx.fillStyle = "rgba(0,0,0,0.35)";
        ctx.fillRect(0, H - 28, W, 28);
        ctx.fillStyle = "rgba(255,255,255,0.7)"; ctx.font = "11px Inter, system-ui, sans-serif"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
        ctx.fillText(`${building.label}  ·  ${building.architect}  ·  ${building.year}`, W / 2, H - 14);

        animRef.current = requestAnimationFrame(draw);
    }, [building, filter, layer, hoveredHotspot, discoveredHotspots, buildingIdx, filterIdx, imagesLoaded]);

    useEffect(() => { animRef.current = requestAnimationFrame(draw); return () => cancelAnimationFrame(animRef.current); }, [draw]);

    // Canvas mouse interaction
    const handleCanvasClick = (e) => {
        const cvs = canvasRef.current; if (!cvs) return;
        const rect = cvs.getBoundingClientRect();
        const mx = (e.clientX - rect.left) / rect.width * W;
        const my = (e.clientY - rect.top) / rect.height * H;
        layer.hotspots.forEach((hs, i) => {
            const hx = hs.x * W, hy = hs.y * H;
            if (Math.hypot(mx - hx, my - hy) < 25) {
                playClick();
                setHoveredHotspot(hoveredHotspot === i ? null : i);
                setDiscoveredHotspots(prev => new Set([...prev, `${buildingIdx}-${filterIdx}-${i}`]));
            }
        });
    };

    const handleCanvasMove = (e) => {
        const cvs = canvasRef.current; if (!cvs) return;
        const rect = cvs.getBoundingClientRect();
        const mx = (e.clientX - rect.left) / rect.width * W;
        const my = (e.clientY - rect.top) / rect.height * H;
        let found = null;
        layer.hotspots.forEach((hs, i) => {
            if (Math.hypot(mx - hs.x * W, my - hs.y * H) < 25) found = i;
        });
        if (found !== hoveredHotspot) setHoveredHotspot(found);
    };

    return (
        <ScrollReveal className="content-card" delay={200}>
            <div ref={containerRef} style={{ background: isFullscreen ? "#1a1510" : "transparent", padding: isFullscreen ? "1.5rem" : 0, overflow: "auto", maxHeight: isFullscreen ? "100vh" : undefined }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.3rem" }}>
                    <h4 style={{ fontSize: "1.3rem", color: "#5c4033", margin: 0 }}>🔬 Building Autopsy</h4>
                    <button onClick={toggleFullscreen} style={{ padding: "0.3rem 0.6rem", borderRadius: 6, fontSize: "0.8rem", border: "1px solid #ddd", background: "#fefcf7", cursor: "pointer", color: "#5c4033", fontWeight: 600 }}>
                        {isFullscreen ? "✕ Exit" : "⛶ Fullscreen"}
                    </button>
                </div>
                <p style={{ fontSize: "1rem", color: "#8a7560", marginBottom: "0.6rem" }}>
                    Dissect 3 masterpieces through 4 analysis layers. <strong>Click the pulsing hotspots</strong> to discover hidden design logic.
                </p>

                {/* Building selector */}
                <div style={{ display: "flex", gap: "0.4rem", marginBottom: "0.4rem", flexWrap: "wrap" }}>
                    <span style={{ fontSize: "0.8rem", color: "#8a7560", fontWeight: 600, alignSelf: "center" }}>Building:</span>
                    {BUILDINGS.map((b, i) => (
                        <button key={b.id} onClick={() => { setBuildingIdx(i); setHoveredHotspot(null); playWhoosh(); }} style={{
                            padding: "0.4rem 0.7rem", borderRadius: 8, fontSize: "0.85rem",
                            border: `2px solid ${buildingIdx === i ? "#5c4033" : "#ddd"}`,
                            background: buildingIdx === i ? "rgba(92,64,51,0.08)" : "#fefcf7",
                            color: "#5c4033", cursor: "pointer", fontWeight: 600, transition: "all 0.2s",
                        }}>{b.label} <span style={{ fontSize: "0.7rem", opacity: 0.5 }}>({b.year})</span></button>
                    ))}
                </div>

                {/* Filter selector */}
                <div style={{ display: "flex", gap: "0.4rem", marginBottom: "0.5rem", flexWrap: "wrap" }}>
                    <span style={{ fontSize: "0.8rem", color: "#8a7560", fontWeight: 600, alignSelf: "center" }}>Filter:</span>
                    {FILTERS.map((f, i) => (
                        <button key={f.id} onClick={() => { setFilterIdx(i); setHoveredHotspot(null); playToggle(); }} style={{
                            padding: "0.4rem 0.7rem", borderRadius: 8, fontSize: "0.85rem",
                            border: `2px solid ${filterIdx === i ? f.color : "#ddd"}`,
                            background: filterIdx === i ? `${f.color}15` : "#fefcf7",
                            color: "#5c4033", cursor: "pointer", fontWeight: 600, transition: "all 0.2s",
                        }}>{f.label}</button>
                    ))}
                </div>

                {/* Canvas */}
                {!imagesLoaded && (
                    <div style={{ textAlign: "center", padding: "3rem 0", color: "#8a7560" }}>
                        <p style={{ fontSize: "1rem" }}>Loading building illustrations...</p>
                    </div>
                )}
                <canvas ref={canvasRef} width={W} height={H}
                    onClick={handleCanvasClick} onMouseMove={handleCanvasMove}
                    style={{ borderRadius: 12, display: "block", margin: "0 auto", width: "100%", cursor: "crosshair", border: "1px solid rgba(92,64,51,0.08)", opacity: imagesLoaded ? 1 : 0.3 }} />

                {/* Learning panel */}
                <div style={{ marginTop: "0.8rem", background: `${filter.color}08`, borderRadius: 10, padding: "0.8rem 1rem", border: `1px solid ${filter.color}20` }}>
                    <p style={{ fontSize: "0.9rem", color: filter.color, fontWeight: 700, margin: 0 }}>{filter.label} Analysis:</p>
                    <p style={{ fontSize: "0.88rem", color: "#5c4033", marginTop: "0.3rem", lineHeight: 1.6 }}>{layer.learn}</p>
                </div>
            </div>
        </ScrollReveal>
    );
}
