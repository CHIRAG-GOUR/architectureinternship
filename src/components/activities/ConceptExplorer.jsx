import { useState } from "react";
import ScrollReveal from "../ScrollReveal";

const LAYERS = [
    { id: "exterior", label: "Exterior", color: "#EDE4D9", desc: "The building as we see it — a unified form." },
    { id: "mass", label: "Mass", color: "#B89A82", desc: "Solid material — walls, columns, floors. The skeleton." },
    { id: "volume", label: "Volume", color: "#85ABAB", desc: "Enclosed space — rooms, halls. Where life happens." },
    { id: "void", label: "Void", color: "#C78F57", desc: "Openings — doors, windows, passages. Light flows through." },
];

function Building({ value }) {
    const massO = value > 25 ? Math.min((value - 25) / 25, 1) : 0;
    const volO = value > 50 ? Math.min((value - 50) / 25, 1) : 0;
    const voidO = value > 75 ? Math.min((value - 75) / 25, 1) : 0;
    const extO = value < 40 ? 1 : Math.max(0.12, 1 - (value - 40) / 40);

    return (
        <svg viewBox="0 0 400 280" style={{ width: "100%", maxWidth: "520px", display: "block", margin: "0 auto" }}>
            <rect x="20" y="240" width="360" height="24" rx="4" fill="#D9CBB9" opacity="0.4" />
            <g opacity={extO} style={{ transition: "opacity 0.4s" }}>
                <rect x="60" y="90" width="280" height="150" rx="2" fill="#EDE4D9" stroke="#B89A8240" strokeWidth="1.5" />
                <polygon points="50,94 200,22 350,94" fill="#D9CBB9" stroke="#B89A8240" strokeWidth="1.5" />
                {[85, 145, 242, 302].map(x => <rect key={x} x={x} y="94" width="14" height="146" rx="2" fill="#D9CBB9" />)}
            </g>
            <g opacity={massO} style={{ transition: "opacity 0.5s" }}>
                <rect x="60" y="90" width="10" height="150" fill="#B89A82" rx="1" />
                <rect x="330" y="90" width="10" height="150" fill="#B89A82" rx="1" />
                <rect x="60" y="90" width="280" height="10" fill="#B89A82" rx="1" />
                <rect x="60" y="230" width="280" height="10" fill="#B89A82" rx="1" />
                <rect x="192" y="100" width="8" height="130" fill="#B89A82" rx="1" />
                {[85, 145, 242, 302].map(x => <rect key={x} x={x} y="94" width="14" height="146" fill="#B89A82" opacity="0.6" rx="2" />)}
            </g>
            <g opacity={volO} style={{ transition: "opacity 0.5s" }}>
                <rect x="70" y="100" width="122" height="130" fill="#85ABAB" opacity="0.25" rx="4" />
                <text x="131" y="170" textAnchor="middle" fill="#1F3345" fontSize="10" fontWeight="600" fontFamily="Inter">Room A</text>
                <rect x="200" y="100" width="130" height="130" fill="#85ABAB" opacity="0.25" rx="4" />
                <text x="265" y="170" textAnchor="middle" fill="#1F3345" fontSize="10" fontWeight="600" fontFamily="Inter">Room B</text>
            </g>
            <g opacity={voidO} style={{ transition: "opacity 0.5s" }}>
                <rect x="118" y="200" width="36" height="40" fill="#C78F57" opacity="0.4" rx="2" />
                <text x="136" y="225" textAnchor="middle" fill="#1F3345" fontSize="7" fontWeight="600">door</text>
                <rect x="80" y="130" width="26" height="36" fill="#C78F57" opacity="0.4" rx="3" />
                <text x="93" y="152" textAnchor="middle" fill="#1F3345" fontSize="7" fontWeight="600">window</text>
                <rect x="220" y="130" width="26" height="36" fill="#C78F57" opacity="0.4" rx="3" />
                <rect x="280" y="130" width="26" height="36" fill="#C78F57" opacity="0.4" rx="3" />
                <rect x="192" y="150" width="8" height="44" fill="#C78F57" opacity="0.4" rx="1" />
            </g>
        </svg>
    );
}

export default function ConceptExplorer() {
    const [val, setVal] = useState(0);
    const cur = val < 25 ? LAYERS[0] : val < 50 ? LAYERS[1] : val < 75 ? LAYERS[2] : LAYERS[3];

    return (
        <div className="section-gap">
            <ScrollReveal className="heading-card">
                <h2>🔍 X-Ray a Building</h2>
                <p className="subtitle">Drag the slider to peel away layers</p>
            </ScrollReveal>

            <ScrollReveal className="content-card" delay={150}>
                <p style={{ marginBottom: "1.5rem", color: "#4a3728" }}>
                    See what's hiding inside every building — mass, space, and openings working together.
                </p>

                <Building value={val} />

                <div style={{ maxWidth: "520px", margin: "0 auto" }}>
                    <input type="range" min="0" max="100" value={val} onChange={e => setVal(Number(e.target.value))} className="xray-range" />

                    <div style={{ display: "flex", justifyContent: "space-between", marginTop: "8px", fontSize: "0.75rem", fontWeight: 500 }}>
                        {LAYERS.map(l => (
                            <span key={l.id} style={{ color: cur.id === l.id ? l.color : "#3a2e1f30", transition: "color 0.3s" }}>
                                {l.label}
                            </span>
                        ))}
                    </div>

                    <p style={{ marginTop: "1rem", fontStyle: "italic", textAlign: "center", color: cur.color, transition: "color 0.3s", fontSize: "1.05rem" }}>
                        {cur.desc}
                    </p>
                </div>
            </ScrollReveal>
        </div>
    );
}
