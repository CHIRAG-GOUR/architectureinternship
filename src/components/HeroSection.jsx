import { useEffect, useState } from "react";

/*
  HeroSection — Dynamic hero banner.
  Props:
    subtitle — custom subtitle text per chapter (default: main tagline)
    backgroundImage — custom CSS background-image URL per chapter
*/
export default function HeroSection({ subtitle, backgroundImage }) {
    const [offsetY, setOffsetY] = useState(0);

    useEffect(() => {
        const handleScroll = () => setOffsetY(window.scrollY);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const bgStyle = backgroundImage
        ? { backgroundImage: `url(${backgroundImage})`, backgroundPositionY: `${offsetY * 0.35}px` }
        : { backgroundPositionY: `${offsetY * 0.35}px` };

    return (
        <section className="relative h-screen overflow-hidden parallax-bg">
            <div
                className="absolute inset-0 parallax-bg"
                style={bgStyle}
            />
            {/* Light overlays */}
            <div className="absolute inset-0 bg-parchment opacity-70 mix-blend-multiply" />
            <div className="absolute inset-0 bg-black/20" />

            {/* Content */}
            <div className="relative z-10 container mx-auto px-6 h-full flex items-center justify-start">
                <div
                    className="max-w-4xl bg-white/15 backdrop-blur-[3px] p-10 md:p-16 rounded-2xl border border-sand/30 shadow-deep
                      transition-all duration-500 hover:bg-white/25"
                >
                    <h1 className="font-serif text-[clamp(3.5rem,10vw,7rem)] leading-none text-white font-bold tracking-wider text-shadow-hero">
                        Architecture Internship
                    </h1>
                    <p className="text-[clamp(1.8rem,6vw,3rem)] mt-8 font-sans text-limestone font-semibold tracking-wide leading-tight"
                        style={{ textShadow: '1px 1px 4px rgba(0,0,0,0.5)' }}>
                        {subtitle || "Foundations in classical form • heritage • spatial thinking"}
                    </p>
                </div>
            </div>

            {/* Scroll indicator */}
            <div className="absolute bottom-16 sm:bottom-20 left-1/2 transform -translate-x-1/2 text-white opacity-90">
                <svg className="h-14 w-14 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M19 14l-7 7m0 0l-7-7m7 7V3" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                </svg>
            </div>
        </section>
    );
}
