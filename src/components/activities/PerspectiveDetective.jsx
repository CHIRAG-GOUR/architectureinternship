import { useState } from "react";
import ScrollReveal from "../ScrollReveal";

// Image options for the detective game
const CASES = [
    {
        id: "case1",
        title: "The Long Hallway",
        type: "1-Point",
        image: "https://images.unsplash.com/photo-1541123437800-1bb1317bc951?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        description: "A classic example of 1-Point Perspective. Notice how the floor lines, ceiling, and walls all converge to a single point directly in front of you.",
        vpCount: 1
    },
    {
        id: "case2",
        title: "The Corner Building",
        type: "2-Point",
        image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        description: "Looking at the corner of a building creates 2-Point Perspective. The horizontal lines angle away to two different vanishing points on the horizon.",
        vpCount: 2
    },
    {
        id: "case3",
        title: "The Skyscraper Grid",
        type: "3-Point",
        image: "https://images.unsplash.com/photo-1428366890462-dd4baecf492b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        description: "Looking drastically up (or down) introduces a third vanishing point. Vertical lines are no longer perfectly parallel—they converge high in the sky.",
        vpCount: 3
    }
];

export default function PerspectiveDetective() {
    const [currentCase, setCurrentCase] = useState(0);
    const [selectedType, setSelectedType] = useState(null);
    const [feedback, setFeedback] = useState("");

    const activeCase = CASES[currentCase];

    const handleGuess = (guessType) => {
        setSelectedType(guessType);
        if (guessType === activeCase.type) {
            setFeedback("Correct! " + activeCase.description);
        } else {
            setFeedback("Not quite. Look at how the parallel lines behave. Do they meet at one point, two points, or three?");
        }
    };

    const nextCase = () => {
        if (currentCase < CASES.length - 1) {
            setCurrentCase(currentCase + 1);
            setSelectedType(null);
            setFeedback("");
        }
    };

    const isCorrect = selectedType === activeCase.type;

    return (
        <div className="section-gap">
            <ScrollReveal className="content-card">
                <h3 style={{ color: "#5c4033", marginBottom: "0.5rem" }}>Perspective Detective</h3>
                <p style={{ color: "#8b7355", fontSize: "0.95rem", marginBottom: "1.5rem" }}>
                    Analyze the architectural photograph below. Identify which type of perspective it represents.
                </p>

                <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap" }}>
                    {/* Image Area */}
                    <div style={{ flex: "1 1 400px", position: "relative" }}>
                        <div style={{
                            border: "4px solid #fff",
                            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                            borderRadius: "4px",
                            overflow: "hidden"
                        }}>
                            <img
                                src={activeCase.image}
                                alt={activeCase.title}
                                style={{ width: "100%", height: "300px", objectFit: "cover", display: "block" }}
                            />
                        </div>
                        <h4 style={{ marginTop: "1rem", color: "#5c4033" }}>Case {currentCase + 1}: {activeCase.title}</h4>
                    </div>

                    {/* Controls & Feedback Area */}
                    <div style={{ flex: "1 1 300px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                        <p style={{ fontWeight: 600, color: "#3e2a21", marginBottom: "1rem" }}>What type of perspective is this?</p>

                        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginBottom: "1.5rem" }}>
                            {["1-Point", "2-Point", "3-Point", "Isometric"].map((type) => (
                                <button
                                    key={type}
                                    onClick={() => handleGuess(type)}
                                    style={{
                                        padding: "0.8rem 1rem",
                                        borderRadius: "6px",
                                        border: `2px solid ${selectedType === type ? (isCorrect ? "#2e7d32" : "#c97a7e") : "#d9cbb9"}`,
                                        background: selectedType === type ? (isCorrect ? "#e8f5e9" : "#ffebee") : "#fff",
                                        color: selectedType === type ? (isCorrect ? "#1b5e20" : "#b71c1c") : "#5c4033",
                                        fontWeight: 600,
                                        cursor: "pointer",
                                        transition: "all 0.2s"
                                    }}
                                >
                                    {type} {type !== "Isometric" && "Perspective"}
                                </button>
                            ))}
                        </div>

                        {feedback && (
                            <div style={{
                                padding: "1rem",
                                background: isCorrect ? "#e8f5e9" : "#fff3e0",
                                borderLeft: `4px solid ${isCorrect ? "#4caf50" : "#ff9800"}`,
                                color: "#333",
                                fontSize: "0.95rem",
                                lineHeight: 1.5,
                                borderRadius: "0 4px 4px 0"
                            }}>
                                {feedback}
                            </div>
                        )}

                        {isCorrect && currentCase < CASES.length - 1 && (
                            <button
                                onClick={nextCase}
                                style={{
                                    marginTop: "1.5rem",
                                    padding: "0.8rem",
                                    background: "#c9a96e",
                                    color: "white",
                                    border: "none",
                                    borderRadius: "4px",
                                    fontWeight: "bold",
                                    cursor: "pointer"
                                }}
                            >
                                Next Case ➔
                            </button>
                        )}

                        {isCorrect && currentCase === CASES.length - 1 && (
                            <div style={{ marginTop: "1.5rem", color: "#2e7d32", fontWeight: "bold" }}>
                                🕵️‍♂️ Detective Work Complete! You've mastered identifying perspective.
                            </div>
                        )}
                    </div>
                </div>
            </ScrollReveal>
        </div>
    );
}
