import { useEffect, useRef, useState } from "react";

/*
  ScrollReveal — adds .visible class when element enters viewport.
  The CSS handles the actual transition (heading-card.visible, content-card.visible).
*/
export default function ScrollReveal({ children, className = "", delay = 0 }) {
    const ref = useRef(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setTimeout(() => setIsVisible(true), delay);
                    observer.unobserve(el);
                }
            },
            { threshold: 0.12 }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, [delay]);

    return (
        <div ref={ref} className={`${className} ${isVisible ? "visible" : ""}`}>
            {children}
        </div>
    );
}
