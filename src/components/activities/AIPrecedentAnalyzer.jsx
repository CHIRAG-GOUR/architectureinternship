import { useState, useRef, useEffect } from "react";
import { playClick, playToggle, playWhoosh } from "../../utils/useSound";
import ScrollReveal from "../ScrollReveal";

/*
  AIPrecedentAnalyzer — Camera/Upload + Groq Vision API.
  Users photograph or upload ANY building and get a structured
  4-layer precedent analysis from Groq AI (Llama vision models).
*/

const GROQ_MODELS = [
    "meta-llama/llama-4-scout-17b-16e-instruct",
    "meta-llama/llama-4-maverick-17b-128e-instruct",
];

const ANALYSIS_PROMPT = `You are an expert architecture professor conducting a Precedent Study analysis.

Analyze this building image through 4 analytical layers. For EACH layer, provide:
1. A clear, educational explanation (2-3 sentences)
2. One specific design insight

Return ONLY valid JSON in this exact format:
{
  "buildingName": "Best guess of the building name or type",
  "architect": "Architect name if known, or 'Unknown'",
  "era": "Approximate era or style",
  "concept": {
    "analysis": "What is the 'Big Idea' behind this building? What was the architect trying to express?",
    "insight": "One specific concept insight"
  },
  "circulation": {
    "analysis": "How do people move through this space? Where are entries, paths, and destinations?",
    "insight": "One specific circulation insight"
  },
  "structure": {
    "analysis": "How does this building stand up? What structural system is visible? What materials are used?",
    "insight": "One specific structural insight"
  },
  "environment": {
    "analysis": "How does this building respond to its climate, orientation, and site?",
    "insight": "One specific environmental insight"
  }
}`;

export default function AIPrecedentAnalyzer() {
    const containerRef = useRef(null);
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const fileInputRef = useRef(null);

    const [mode, setMode] = useState("idle"); // idle | camera | preview | analyzing | result | error
    const [imageData, setImageData] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [activeTab, setActiveTab] = useState("concept");

    const apiKey = import.meta.env.VITE_GROQ_API_KEY;

    // Fullscreen
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

    // Camera
    const startCamera = async () => {
        playClick();
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment", width: { ideal: 1280 }, height: { ideal: 720 } } });
            setMode("camera");
            setTimeout(() => { if (videoRef.current) { videoRef.current.srcObject = stream; videoRef.current.play(); } }, 100);
        } catch (err) {
            setError("Camera access denied. Try uploading an image instead.");
            setMode("error");
        }
    };

    const capturePhoto = () => {
        playWhoosh();
        const video = videoRef.current;
        const canvas = canvasRef.current;
        if (!video || !canvas) return;
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas.getContext("2d").drawImage(video, 0, 0);
        const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
        setImageData(dataUrl.split(",")[1]);
        setPreviewUrl(dataUrl);
        // Stop camera
        video.srcObject?.getTracks().forEach(t => t.stop());
        setMode("preview");
    };

    const stopCamera = () => {
        if (videoRef.current?.srcObject) videoRef.current.srcObject.getTracks().forEach(t => t.stop());
        setMode("idle");
    };

    // File upload
    const handleUpload = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        playClick();
        const reader = new FileReader();
        reader.onload = () => {
            setPreviewUrl(reader.result);
            setImageData(reader.result.split(",")[1]);
            setMode("preview");
        };
        reader.readAsDataURL(file);
    };

    // Analyze with Groq
    const analyze = async () => {
        const key = apiKey?.replace(/^["']|["']$/g, "").trim();
        if (!key) {
            setError("No Groq API key found. Add VITE_GROQ_API_KEY to your .env file.");
            setMode("error");
            return;
        }
        playWhoosh();
        setMode("analyzing");

        const dataUrl = `data:image/jpeg;base64,${imageData}`;

        // Try models in order until one works
        let lastError = null;
        for (const model of GROQ_MODELS) {
            try {
                console.log(`Trying Groq model: ${model}`);
                const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${key}`,
                    },
                    body: JSON.stringify({
                        model,
                        messages: [
                            {
                                role: "user",
                                content: [
                                    { type: "text", text: ANALYSIS_PROMPT },
                                    { type: "image_url", image_url: { url: dataUrl } },
                                ],
                            },
                        ],
                        temperature: 0.4,
                        max_tokens: 1500,
                        response_format: { type: "json_object" },
                    }),
                });

                if (!res.ok) {
                    const errBody = await res.text();
                    console.warn(`Model ${model} failed (${res.status}):`, errBody);
                    lastError = `${model}: ${res.status}`;
                    continue; // try next model
                }

                const data = await res.json();
                console.log(`Groq response (${model}):`, JSON.stringify(data, null, 2));

                const text = data.choices?.[0]?.message?.content || "";

                if (!text) {
                    lastError = `${model}: empty response`;
                    continue;
                }

                // Parse JSON
                let parsed = null;
                try {
                    parsed = JSON.parse(text);
                } catch {
                    const cleaned = text.replace(/```json\s*/gi, "").replace(/```\s*/g, "").trim();
                    try {
                        parsed = JSON.parse(cleaned);
                    } catch {
                        const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
                        if (jsonMatch) parsed = JSON.parse(jsonMatch[0]);
                    }
                }

                if (parsed) {
                    console.log(`✅ Success with model: ${model}`);
                    setResult(parsed);
                    setMode("result");
                    playWhoosh();
                    return; // success — stop trying models
                } else {
                    lastError = `${model}: could not parse response`;
                    continue;
                }
            } catch (err) {
                console.warn(`Model ${model} error:`, err.message);
                lastError = `${model}: ${err.message}`;
                continue;
            }
        }

        // All models failed
        setError(`Analysis failed with all models. Last error: ${lastError}`);
        setMode("error");
    };

    const reset = () => {
        playClick();
        setMode("idle");
        setImageData(null);
        setPreviewUrl(null);
        setResult(null);
        setError(null);
    };

    const TABS = [
        { id: "concept", label: "🧠 Concept", color: "#c9a96e" },
        { id: "circulation", label: "🚶 Circulation", color: "#7b9cc7" },
        { id: "structure", label: "🏗️ Structure", color: "#C78F57" },
        { id: "environment", label: "🌍 Environment", color: "#6b8f71" },
    ];

    return (
        <ScrollReveal className="content-card" delay={400}>
            <div ref={containerRef} style={{ background: isFullscreen ? "#fefcf7" : "transparent", padding: isFullscreen ? "1.5rem" : 0, overflow: "auto", maxHeight: isFullscreen ? "100vh" : undefined }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.3rem" }}>
                    <h4 style={{ fontSize: "1.3rem", color: "#5c4033", margin: 0 }}>🤖 AI Precedent Analyzer</h4>
                    <button onClick={toggleFullscreen} style={{ padding: "0.3rem 0.6rem", borderRadius: 6, fontSize: "0.8rem", border: "1px solid #ddd", background: "#fefcf7", cursor: "pointer", color: "#5c4033", fontWeight: 600 }}>
                        {isFullscreen ? "✕ Exit" : "⛶ Fullscreen"}
                    </button>
                </div>
                <p style={{ fontSize: "1rem", color: "#8a7560", marginBottom: "0.8rem" }}>
                    Photograph or upload <strong>any building</strong> — AI will analyze it through 4 architectural lenses.
                </p>

                {/* ── IDLE STATE ── */}
                {mode === "idle" && (
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem", padding: "2rem 0" }}>
                        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", justifyContent: "center" }}>
                            <button onClick={startCamera} style={{
                                padding: "1rem 1.5rem", borderRadius: 14, fontSize: "1.1rem", fontWeight: 700,
                                border: "2px solid #6b8f71", background: "rgba(107,143,113,0.08)",
                                color: "#5c4033", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.5rem",
                            }}>📸 Open Camera</button>
                            <button onClick={() => fileInputRef.current?.click()} style={{
                                padding: "1rem 1.5rem", borderRadius: 14, fontSize: "1.1rem", fontWeight: 700,
                                border: "2px solid #c9a96e", background: "rgba(201,169,110,0.08)",
                                color: "#5c4033", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.5rem",
                            }}>📁 Upload Image</button>
                        </div>
                        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleUpload} style={{ display: "none" }} />
                        <p style={{ fontSize: "0.85rem", color: "#b0a090", textAlign: "center", maxWidth: 420 }}>
                            Point your camera at a building, or upload a photo of any structure — from famous landmarks to your own neighborhood. The AI will break it down like an architecture professor.
                        </p>
                        {!apiKey && (
                            <div style={{ background: "rgba(220,80,60,0.08)", borderRadius: 10, padding: "0.7rem 1rem", border: "1px solid rgba(220,80,60,0.2)", maxWidth: 500 }}>
                                <p style={{ fontSize: "0.85rem", color: "#c04030", margin: 0 }}>
                                    ⚠️ <strong>API key needed:</strong> Create a <code>.env</code> file in your project root with:
                                    <br /><code style={{ background: "rgba(0,0,0,0.05)", padding: "2px 6px", borderRadius: 4 }}>VITE_GEMINI_API_KEY=your_key_here</code>
                                    <br />Get a free key at <a href="https://aistudio.google.com" target="_blank" style={{ color: "#6b8f71" }}>aistudio.google.com</a>
                                </p>
                            </div>
                        )}
                    </div>
                )}

                {/* ── CAMERA STATE ── */}
                {mode === "camera" && (
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                        <video ref={videoRef} autoPlay playsInline muted
                            style={{ width: "100%", maxWidth: 640, borderRadius: 12, border: "2px solid #6b8f71" }} />
                        <canvas ref={canvasRef} style={{ display: "none" }} />
                        <div style={{ display: "flex", gap: "0.8rem", marginTop: "0.8rem" }}>
                            <button onClick={capturePhoto} style={{
                                padding: "0.7rem 1.5rem", borderRadius: 10, fontSize: "1rem", fontWeight: 700,
                                border: "2px solid #6b8f71", background: "#6b8f71", color: "#fff", cursor: "pointer",
                            }}>📸 Capture</button>
                            <button onClick={stopCamera} style={{
                                padding: "0.7rem 1rem", borderRadius: 10, fontSize: "0.9rem",
                                border: "1px solid #ddd", background: "#fefcf7", color: "#5c4033", cursor: "pointer",
                            }}>✕ Cancel</button>
                        </div>
                    </div>
                )}

                {/* ── PREVIEW STATE ── */}
                {mode === "preview" && (
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                        <img src={previewUrl} alt="Captured building" style={{ width: "100%", maxWidth: 640, borderRadius: 12, border: "2px solid #c9a96e" }} />
                        <div style={{ display: "flex", gap: "0.8rem", marginTop: "0.8rem" }}>
                            <button onClick={analyze} style={{
                                padding: "0.7rem 1.5rem", borderRadius: 10, fontSize: "1rem", fontWeight: 700,
                                border: "2px solid #6b8f71", background: "#6b8f71", color: "#fff", cursor: "pointer",
                            }}>🔬 Analyze with AI</button>
                            <button onClick={reset} style={{
                                padding: "0.7rem 1rem", borderRadius: 10, fontSize: "0.9rem",
                                border: "1px solid #ddd", background: "#fefcf7", color: "#5c4033", cursor: "pointer",
                            }}>← Retake</button>
                        </div>
                    </div>
                )}

                {/* ── ANALYZING STATE ── */}
                {mode === "analyzing" && (
                    <div style={{ textAlign: "center", padding: "3rem 0" }}>
                        <div style={{ fontSize: "3rem", animation: "spin 1s linear infinite" }}>🔬</div>
                        <p style={{ fontSize: "1.1rem", color: "#5c4033", fontWeight: 600, marginTop: "1rem" }}>
                            Analyzing building through 4 lenses...
                        </p>
                        <p style={{ fontSize: "0.85rem", color: "#b0a090" }}>Gemini AI is examining concept, circulation, structure, and environment.</p>
                        <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
                    </div>
                )}

                {/* ── RESULT STATE ── */}
                {mode === "result" && result && (
                    <div>
                        <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem", flexWrap: "wrap" }}>
                            {/* Image thumbnail */}
                            <img src={previewUrl} alt="Analyzed" style={{ width: 160, height: 120, objectFit: "cover", borderRadius: 10, flexShrink: 0 }} />
                            <div style={{ flex: 1, minWidth: 200 }}>
                                <h5 style={{ fontSize: "1.2rem", color: "#5c4033", margin: "0 0 0.3rem" }}>{result.buildingName}</h5>
                                <p style={{ fontSize: "0.9rem", color: "#8a7560", margin: 0 }}>
                                    <strong>Architect:</strong> {result.architect} · <strong>Era:</strong> {result.era}
                                </p>
                            </div>
                        </div>

                        {/* Analysis tabs */}
                        <div style={{ display: "flex", gap: "0.3rem", marginBottom: "0.5rem", flexWrap: "wrap" }}>
                            {TABS.map(tab => (
                                <button key={tab.id} onClick={() => { setActiveTab(tab.id); playToggle(); }} style={{
                                    padding: "0.4rem 0.7rem", borderRadius: 8, fontSize: "0.82rem",
                                    border: `2px solid ${activeTab === tab.id ? tab.color : "#ddd"}`,
                                    background: activeTab === tab.id ? `${tab.color}15` : "#fefcf7",
                                    color: "#5c4033", cursor: "pointer", fontWeight: 600,
                                }}>{tab.label}</button>
                            ))}
                        </div>

                        {/* Active analysis */}
                        {TABS.map(tab => tab.id === activeTab && result[tab.id] && (
                            <div key={tab.id} style={{
                                background: `${tab.color}08`, borderRadius: 12, padding: "1rem 1.2rem",
                                border: `1px solid ${tab.color}25`,
                            }}>
                                <p style={{ fontSize: "0.95rem", color: "#5c4033", lineHeight: 1.7, margin: "0 0 0.6rem" }}>
                                    {result[tab.id].analysis}
                                </p>
                                <div style={{ background: `${tab.color}10`, borderRadius: 8, padding: "0.5rem 0.8rem", border: `1px dashed ${tab.color}40` }}>
                                    <p style={{ fontSize: "0.85rem", color: tab.color, fontWeight: 700, margin: 0 }}>
                                        💡 Key Insight:
                                    </p>
                                    <p style={{ fontSize: "0.88rem", color: "#5c4033", marginTop: "0.2rem" }}>
                                        {result[tab.id].insight}
                                    </p>
                                </div>
                            </div>
                        ))}

                        <button onClick={reset} style={{
                            marginTop: "1rem", padding: "0.5rem 1.2rem", borderRadius: 8, fontSize: "0.9rem",
                            border: "1px solid #ddd", background: "#fefcf7", color: "#5c4033", cursor: "pointer", fontWeight: 600,
                        }}>🔄 Analyze Another Building</button>
                    </div>
                )}

                {/* ── ERROR STATE ── */}
                {mode === "error" && (
                    <div style={{ textAlign: "center", padding: "2rem 0" }}>
                        <p style={{ fontSize: "1rem", color: "#c04030" }}>{error}</p>
                        <button onClick={reset} style={{
                            marginTop: "0.5rem", padding: "0.5rem 1.2rem", borderRadius: 8,
                            border: "1px solid #ddd", background: "#fefcf7", color: "#5c4033", cursor: "pointer", fontWeight: 600,
                        }}>← Try Again</button>
                    </div>
                )}
            </div>
        </ScrollReveal>
    );
}
