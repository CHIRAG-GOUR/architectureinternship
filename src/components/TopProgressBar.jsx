import { useState, useEffect } from "react";

/*
  TopProgressBar — thin scroll progress at the very top of the viewport.
  Fills left→right as user scrolls. Themed warm gold.
*/
export default function TopProgressBar() {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const onScroll = () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            setProgress(docHeight > 0 ? Math.min((scrollTop / docHeight) * 100, 100) : 0);
        };
        window.addEventListener("scroll", onScroll, { passive: true });
        onScroll();
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    return (
        <div
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                height: "4px",
                zIndex: 200,
                background: "rgba(58,46,31,0.1)",
            }}
        >
            <div
                style={{
                    height: "100%",
                    width: `${progress}%`,
                    background: "linear-gradient(90deg, #c9a96e, #C78F57)",
                    borderRadius: "0 2px 2px 0",
                    transition: "width 0.15s ease-out",
                    boxShadow: "0 0 8px rgba(201,169,110,0.4)",
                }}
            />
        </div>
    );
}
