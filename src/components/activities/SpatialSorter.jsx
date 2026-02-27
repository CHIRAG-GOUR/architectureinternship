import { useState, useRef } from "react";
import ScrollReveal from "../ScrollReveal";

/*
  SpatialSorter — Drag-and-drop card sorting game for Chapter 1.2
  Users drag architectural example cards into the correct
  organization category (Linear / Radial / Clustered).
  Includes scoring, visual feedback, and streak tracking.
  
  Completely different from any grid-based activity.
*/

const buildings = [
    { id: 1, name: "School Corridor", desc: "A long hallway with classrooms on both sides, numbered 101–120", answer: "Linear", emoji: "🏫" },
    { id: 2, name: "Airport Terminal", desc: "A central departure lounge with 6 gate wings radiating outward", answer: "Radial", emoji: "✈️" },
    { id: 3, name: "College Campus", desc: "Library, labs, dorms, and studios scattered across a green quad", answer: "Clustered", emoji: "🏛️" },
    { id: 4, name: "Art Gallery", desc: "Rooms connected one after another: Ancient → Medieval → Modern", answer: "Linear", emoji: "🖼️" },
    { id: 5, name: "Roundabout Plaza", desc: "A fountain at the center with shops and cafés around the circle", answer: "Radial", emoji: "⛲" },
    { id: 6, name: "Mountain Village", desc: "Stone houses of different sizes tucked into hillside paths", answer: "Clustered", emoji: "🏘️" },
    { id: 7, name: "Train Station", desc: "Platforms extend in parallel lines from a central grand hall", answer: "Radial", emoji: "🚂" },
    { id: 8, name: "Bazaar Street", desc: "Shops lined up in a continuous row along a single busy road", answer: "Linear", emoji: "🏪" },
    { id: 9, name: "Medieval Castle", desc: "Chapel, barracks, kitchen, stables grouped within fortress walls", answer: "Clustered", emoji: "🏰" },
];

const ZONES = ["Linear", "Radial", "Clustered"];
const ZONE_META = {
    Linear: { emoji: "📏", color: "#C78F57", bg: "rgba(199,143,87,0.08)" },
    Radial: { emoji: "🎯", color: "#6b8f71", bg: "rgba(107,143,113,0.08)" },
    Clustered: { emoji: "🏘️", color: "#c9a96e", bg: "rgba(201,169,110,0.08)" },
};

function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

export default function SpatialSorter() {
    const [deck, setDeck] = useState(() => shuffle(buildings));
    const [sorted, setSorted] = useState({ Linear: [], Radial: [], Clustered: [] });
    const [feedback, setFeedback] = useState(null); // { correct, card, zone }
    const [score, setScore] = useState(0);
    const [streak, setStreak] = useState(0);
    const [bestStreak, setBestStreak] = useState(0);
    const dragRef = useRef(null);

    const currentCard = deck[0];
    const totalSorted = Object.values(sorted).flat().length;
    const isComplete = deck.length === 0;

    const handleDrop = (zone) => {
        if (!currentCard || feedback) return;
        const correct = currentCard.answer === zone;
        setFeedback({ correct, card: currentCard, zone });

        if (correct) {
            setScore((s) => s + 10 + streak * 2);
            setStreak((s) => {
                const newStreak = s + 1;
                setBestStreak((b) => Math.max(b, newStreak));
                return newStreak;
            });
        } else {
            setStreak(0);
        }

        setTimeout(() => {
            setSorted((prev) => ({
                ...prev,
                [currentCard.answer]: [...prev[currentCard.answer], currentCard],
            }));
            setDeck((prev) => prev.slice(1));
            setFeedback(null);
        }, 1200);
    };

    const restart = () => {
        setDeck(shuffle(buildings));
        setSorted({ Linear: [], Radial: [], Clustered: [] });
        setScore(0);
        setStreak(0);
        setBestStreak(0);
        setFeedback(null);
    };

    /* Completion screen */
    if (isComplete) {
        const pct = Math.round((score / (buildings.length * 12)) * 100);
        return (
            <ScrollReveal className="content-card" delay={200}>
                <div style={{ textAlign: "center", padding: "2rem 0" }}>
                    <div style={{ fontSize: "3rem" }}>🏆</div>
                    <h4 style={{ fontSize: "1.4rem", color: "#5c4033" }}>All Buildings Sorted!</h4>
                    <p style={{ fontSize: "2rem", fontWeight: 700, color: "#c9a96e", margin: "0.5rem 0" }}>
                        {score} points
                    </p>
                    <p style={{ fontSize: "1rem", color: "#6b4d3b" }}>Best streak: {bestStreak} 🔥</p>

                    {/* Show final categorization */}
                    <div style={{ display: "flex", gap: "0.8rem", marginTop: "1.5rem", flexWrap: "wrap", justifyContent: "center" }}>
                        {ZONES.map((z) => (
                            <div key={z} style={{
                                flex: "1 1 150px", maxWidth: 200, background: ZONE_META[z].bg,
                                borderRadius: 12, padding: "0.8rem", border: `1px solid ${ZONE_META[z].color}30`,
                            }}>
                                <p style={{ fontWeight: 700, fontSize: "0.95rem", color: ZONE_META[z].color }}>
                                    {ZONE_META[z].emoji} {z}
                                </p>
                                {sorted[z].map((c) => (
                                    <p key={c.id} style={{ fontSize: "0.8rem", color: "#5c4033", margin: "0.2rem 0" }}>
                                        {c.emoji} {c.name}
                                    </p>
                                ))}
                            </div>
                        ))}
                    </div>

                    <button onClick={restart}
                        style={{ marginTop: "1.2rem", padding: "0.7rem 1.5rem", borderRadius: 10, border: "2px solid #c9a96e", background: "#c9a96e", color: "#fff", cursor: "pointer", fontWeight: 700, fontSize: "1rem" }}>
                        🔄 Play Again
                    </button>
                </div>
            </ScrollReveal>
        );
    }

    return (
        <ScrollReveal className="content-card" delay={200}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.3rem" }}>
                <h4 style={{ fontSize: "1.3rem", margin: 0 }}>🗂️ Spatial Sorter</h4>
                <span style={{ fontSize: "0.9rem", color: "#8a7560", fontWeight: 600 }}>
                    {totalSorted}/{buildings.length} &nbsp;|&nbsp; Score: {score} {streak > 1 && <span>🔥{streak}</span>}
                </span>
            </div>
            <p style={{ fontSize: "1rem", color: "#8a7560", marginBottom: "1rem" }}>
                Drag each building card to the correct organization category!
            </p>

            {/* Current card to sort */}
            {currentCard && (
                <div
                    draggable
                    onDragStart={() => { dragRef.current = currentCard; }}
                    style={{
                        background: feedback
                            ? feedback.correct ? "rgba(76,175,80,0.1)" : "rgba(229,115,115,0.1)"
                            : "rgba(201,169,110,0.08)",
                        borderRadius: 14, padding: "1.2rem 1.5rem", marginBottom: "1rem",
                        border: feedback
                            ? `2px solid ${feedback.correct ? "#4caf50" : "#e57373"}`
                            : "2px solid rgba(201,169,110,0.25)",
                        cursor: feedback ? "default" : "grab",
                        textAlign: "center",
                        transition: "all 0.3s",
                        transform: feedback ? (feedback.correct ? "scale(1.02)" : "scale(0.98) rotate(-1deg)") : "none",
                    }}
                >
                    <span style={{ fontSize: "2.4rem" }}>{currentCard.emoji}</span>
                    <h5 style={{ fontSize: "1.2rem", fontWeight: 700, color: "#5c4033", margin: "0.4rem 0 0.2rem" }}>
                        {currentCard.name}
                    </h5>
                    <p style={{ fontSize: "1rem", color: "#6b4d3b" }}>{currentCard.desc}</p>

                    {feedback && (
                        <p style={{
                            fontWeight: 700, fontSize: "1rem", marginTop: "0.5rem",
                            color: feedback.correct ? "#2e7d32" : "#c62828",
                        }}>
                            {feedback.correct ? "✅ Correct!" : `❌ It's ${currentCard.answer}!`}
                        </p>
                    )}
                </div>
            )}

            {/* Drop zones */}
            <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap" }}>
                {ZONES.map((zone) => (
                    <div
                        key={zone}
                        onDragOver={(e) => { e.preventDefault(); e.currentTarget.style.borderColor = ZONE_META[zone].color; }}
                        onDragLeave={(e) => { e.currentTarget.style.borderColor = `${ZONE_META[zone].color}30`; }}
                        onDrop={(e) => { e.preventDefault(); e.currentTarget.style.borderColor = `${ZONE_META[zone].color}30`; handleDrop(zone); }}
                        onClick={() => !feedback && handleDrop(zone)}
                        style={{
                            flex: "1 1 120px", minHeight: 100, borderRadius: 12, padding: "0.8rem",
                            background: ZONE_META[zone].bg,
                            border: `2px dashed ${ZONE_META[zone].color}30`,
                            textAlign: "center", cursor: feedback ? "default" : "pointer",
                            transition: "border-color 0.2s",
                        }}
                    >
                        <p style={{ fontWeight: 700, fontSize: "1.05rem", color: ZONE_META[zone].color, margin: 0 }}>
                            {ZONE_META[zone].emoji} {zone}
                        </p>
                        <p style={{ fontSize: "0.8rem", color: "#8a7560", marginTop: "0.3rem" }}>
                            {sorted[zone].length} sorted
                        </p>
                        {/* Show sorted items */}
                        {sorted[zone].map((c) => (
                            <span key={c.id} style={{ fontSize: "1.2rem", marginRight: 4 }} title={c.name}>{c.emoji}</span>
                        ))}
                    </div>
                ))}
            </div>
        </ScrollReveal>
    );
}
