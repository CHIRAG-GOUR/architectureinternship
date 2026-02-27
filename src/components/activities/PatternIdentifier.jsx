import { useState } from "react";
import ScrollReveal from "../ScrollReveal";

/*
  PatternIdentifier — Gamified quiz for Chapter 1.2
  Shows architectural scenarios and asks users to identify 
  the spatial organization type (Linear, Radial, Clustered).
  Includes score tracking, visual feedback, and explanations.
*/

const scenarios = [
    {
        title: "School Hallway",
        description: "A long corridor with classrooms arranged in a straight line on both sides, numbered 101 through 120. Students walk from one end to reach their class.",
        visual: "🏫",
        answer: "Linear",
        explanation: "Classrooms along a corridor form a classic Linear organization — movement is directional with a clear sequence.",
    },
    {
        title: "Airport Terminal",
        description: "A large central departure lounge with 6 gate wings radiating outward. All passengers pass through the central security checkpoint before reaching their gate.",
        visual: "✈️",
        answer: "Radial",
        explanation: "The central lounge is the hub, and gate wings are the spokes — a textbook Radial organization.",
    },
    {
        title: "University Campus",
        description: "Multiple buildings of different sizes — a library, science labs, an art studio, dormitories — scattered across a green campus with winding paths connecting them.",
        visual: "🏛️",
        answer: "Clustered",
        explanation: "Buildings grouped by proximity without strict geometric order — that's Clustered organization, organic and flexible.",
    },
    {
        title: "Museum Gallery",
        description: "Rooms connected one after another in a sequence: Ancient → Medieval → Renaissance → Modern. You must walk through each to reach the next.",
        visual: "🖼️",
        answer: "Linear",
        explanation: "Sequential rooms that must be traversed in order create a Linear journey through time!",
    },
    {
        title: "Hospital",
        description: "A central nurses' station surrounded by patient rooms in a ring. Doctors can see all rooms from the center, and patients are equidistant from care.",
        visual: "🏥",
        answer: "Radial",
        explanation: "Rooms arranged around a central station — Radial organization optimizes surveillance and access from the center.",
    },
    {
        title: "Old European Town Square",
        description: "A church, town hall, market, bakery, and houses all clustered around a small plaza, with no strict alignment. Streets wind organically between them.",
        visual: "⛪",
        answer: "Clustered",
        explanation: "Buildings grow organically around a shared space — the essence of Clustered organization, like a living village.",
    },
];

const ORG_ICONS = { Linear: "📏", Radial: "🎯", Clustered: "🏘️" };
const ORG_COLORS = { Linear: "#C78F57", Radial: "#6b8f71", Clustered: "#c9a96e" };

export default function PatternIdentifier() {
    const [current, setCurrent] = useState(0);
    const [score, setScore] = useState(0);
    const [selected, setSelected] = useState(null);
    const [showResult, setShowResult] = useState(false);
    const [completed, setCompleted] = useState(false);

    const scenario = scenarios[current];

    const handleAnswer = (answer) => {
        setSelected(answer);
        setShowResult(true);
        if (answer === scenario.answer) {
            setScore((s) => s + 1);
        }
    };

    const next = () => {
        if (current + 1 >= scenarios.length) {
            setCompleted(true);
        } else {
            setCurrent((c) => c + 1);
            setSelected(null);
            setShowResult(false);
        }
    };

    const restart = () => {
        setCurrent(0);
        setScore(0);
        setSelected(null);
        setShowResult(false);
        setCompleted(false);
    };

    if (completed) {
        const pct = Math.round((score / scenarios.length) * 100);
        const msg = pct >= 80 ? "🌟 Spatial Master!" : pct >= 50 ? "👍 Good spatial awareness!" : "📚 Keep practicing!";
        return (
            <ScrollReveal className="content-card" delay={600}>
                <div style={{ textAlign: "center", padding: "2rem 0" }}>
                    <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🏆</div>
                    <h4 style={{ fontSize: "1.4rem", color: "#5c4033" }}>Challenge Complete!</h4>
                    <p style={{ fontSize: "1.8rem", fontWeight: 700, color: "#c9a96e", margin: "0.5rem 0" }}>
                        {score} / {scenarios.length}
                    </p>
                    <p style={{ fontSize: "1.1rem", color: "#6b4d3b" }}>{msg}</p>
                    <div style={{ marginTop: "1rem", background: "#EDE4D9", borderRadius: 8, height: 10, overflow: "hidden", maxWidth: 300, margin: "1rem auto" }}>
                        <div style={{ width: `${pct}%`, height: "100%", background: "linear-gradient(90deg, #c9a96e, #C78F57)", borderRadius: 8, transition: "width 0.8s" }} />
                    </div>
                    <button onClick={restart}
                        style={{ marginTop: "1rem", padding: "0.7rem 1.5rem", borderRadius: 10, border: "2px solid #c9a96e", background: "#c9a96e", color: "#fff", cursor: "pointer", fontWeight: 700, fontSize: "1rem" }}>
                        🔄 Try Again
                    </button>
                </div>
            </ScrollReveal>
        );
    }

    return (
        <ScrollReveal className="content-card" delay={600}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                <h4 style={{ fontSize: "1.3rem", margin: 0 }}>🔍 Pattern Identifier</h4>
                <span style={{ fontSize: "0.9rem", color: "#8a7560", fontWeight: 600 }}>
                    {current + 1} / {scenarios.length} &nbsp;|&nbsp; Score: {score}
                </span>
            </div>
            <p style={{ fontSize: "1rem", color: "#8a7560", marginBottom: "1rem" }}>
                Identify the spatial organization type for each scenario!
            </p>

            {/* Scenario Card */}
            <div style={{
                background: "rgba(201,169,110,0.08)", borderRadius: 14, padding: "1.5rem",
                border: "1px solid rgba(201,169,110,0.2)", marginBottom: "1rem",
            }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.8rem", marginBottom: "0.8rem" }}>
                    <span style={{ fontSize: "2.2rem" }}>{scenario.visual}</span>
                    <h5 style={{ fontSize: "1.2rem", fontWeight: 700, color: "#5c4033", margin: 0 }}>{scenario.title}</h5>
                </div>
                <p style={{ fontSize: "1.05rem", color: "#3a2e1f", lineHeight: 1.6 }}>{scenario.description}</p>
            </div>

            {/* Answer buttons */}
            <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap", marginBottom: "1rem" }}>
                {["Linear", "Radial", "Clustered"].map((opt) => {
                    const isCorrect = showResult && opt === scenario.answer;
                    const isWrong = showResult && opt === selected && opt !== scenario.answer;
                    return (
                        <button
                            key={opt}
                            onClick={() => !showResult && handleAnswer(opt)}
                            disabled={showResult}
                            style={{
                                flex: 1, minWidth: 120, padding: "0.8rem", borderRadius: 10,
                                border: `2px solid ${isCorrect ? "#4caf50" : isWrong ? "#e57373" : showResult ? "#ddd" : ORG_COLORS[opt]}`,
                                background: isCorrect ? "rgba(76,175,80,0.15)" : isWrong ? "rgba(229,115,115,0.15)" : showResult ? "#f5f0e8" : "#fefcf7",
                                cursor: showResult ? "default" : "pointer",
                                fontWeight: 700, fontSize: "1rem",
                                color: isCorrect ? "#2e7d32" : isWrong ? "#c62828" : "#5c4033",
                                transition: "all 0.25s",
                                opacity: showResult && !isCorrect && !isWrong ? 0.5 : 1,
                            }}
                        >
                            {ORG_ICONS[opt]} {opt}
                        </button>
                    );
                })}
            </div>

            {/* Result feedback */}
            {showResult && (
                <div style={{
                    background: selected === scenario.answer ? "rgba(76,175,80,0.1)" : "rgba(229,115,115,0.1)",
                    borderRadius: 12, padding: "1rem", marginBottom: "1rem",
                    border: `1px solid ${selected === scenario.answer ? "rgba(76,175,80,0.3)" : "rgba(229,115,115,0.3)"}`,
                }}>
                    <p style={{ fontWeight: 700, fontSize: "1.1rem", color: selected === scenario.answer ? "#2e7d32" : "#c62828", margin: 0 }}>
                        {selected === scenario.answer ? "✅ Correct!" : `❌ It's ${scenario.answer}!`}
                    </p>
                    <p style={{ fontSize: "0.95rem", color: "#5c4033", marginTop: "0.3rem" }}>{scenario.explanation}</p>
                </div>
            )}

            {showResult && (
                <div style={{ textAlign: "center" }}>
                    <button onClick={next}
                        style={{ padding: "0.6rem 1.5rem", borderRadius: 10, border: "2px solid #c9a96e", background: "#c9a96e", color: "#fff", cursor: "pointer", fontWeight: 700, fontSize: "1rem" }}>
                        {current + 1 >= scenarios.length ? "🏆 See Results" : "Next →"}
                    </button>
                </div>
            )}
        </ScrollReveal>
    );
}
