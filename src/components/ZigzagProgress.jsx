import { useState, useEffect } from "react";

/*
  ZigzagProgress — 3D zigzag/staircase SVG in the bottom-right corner.
  Fills with color as user scrolls. Shows percentage number.
  Inspired by the reference image (Loading... staircase shape).
  No "Loading" text — just the number.
*/

// The zigzag path — goes right, down-right, right, down-right, right, down — like a staircase
const ZIGZAG_PATH = "M 10,10 L 80,10 L 80,30 L 50,30 L 50,55 L 80,55 L 80,75 L 55,75 L 55,95 L 90,95 L 90,120 L 60,120 L 60,145 L 100,145";
// 3D shadow offset path (same shape shifted)
const ZIGZAG_3D = "M 14,14 L 84,14 L 84,34 L 54,34 L 54,59 L 84,59 L 84,79 L 59,79 L 59,99 L 94,99 L 94,124 L 64,124 L 64,149 L 104,149";

export default function ZigzagProgress() {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const onScroll = () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            setProgress(docHeight > 0 ? Math.min(Math.round((scrollTop / docHeight) * 100), 100) : 0);
        };
        window.addEventListener("scroll", onScroll, { passive: true });
        onScroll();
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    // The total path length for stroke-dasharray animation
    const pathLength = 520;
    const fillLength = (progress / 100) * pathLength;

    return (
        <div
            style={{
                position: "fixed",
                bottom: "1.5rem",
                right: "1.5rem",
                zIndex: 200,
                pointerEvents: "none",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "4px",
            }}
        >
            <svg
                width="80"
                height="115"
                viewBox="0 0 114 160"
                style={{ filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.15))" }}
            >
                {/* 3D shadow layer */}
                <path
                    d={ZIGZAG_3D}
                    fill="none"
                    stroke="rgba(58,46,31,0.12)"
                    strokeWidth="8"
                    strokeLinecap="square"
                    strokeLinejoin="miter"
                />
                {/* Background path (unfilled) */}
                <path
                    d={ZIGZAG_PATH}
                    fill="none"
                    stroke="rgba(58,46,31,0.15)"
                    strokeWidth="8"
                    strokeLinecap="square"
                    strokeLinejoin="miter"
                />
                {/* Filled path (progress) */}
                <path
                    d={ZIGZAG_PATH}
                    fill="none"
                    stroke="url(#zigzagGrad)"
                    strokeWidth="8"
                    strokeLinecap="square"
                    strokeLinejoin="miter"
                    strokeDasharray={`${pathLength}`}
                    strokeDashoffset={pathLength - fillLength}
                    style={{ transition: "stroke-dashoffset 0.2s ease-out" }}
                />
                <defs>
                    <linearGradient id="zigzagGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#c9a96e" />
                        <stop offset="100%" stopColor="#C78F57" />
                    </linearGradient>
                </defs>
            </svg>
            {/* Percentage number */}
            <span
                style={{
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 700,
                    fontSize: "0.85rem",
                    color: "#5c4033",
                    background: "rgba(254,252,247,0.85)",
                    backdropFilter: "blur(6px)",
                    padding: "3px 8px",
                    borderRadius: "6px",
                    border: "1px solid rgba(201,169,110,0.3)",
                    minWidth: "36px",
                    textAlign: "center",
                }}
            >
                {progress}%
            </span>
        </div>
    );
}
