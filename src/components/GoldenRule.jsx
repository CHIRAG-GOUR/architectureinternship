import ScrollReveal from "./ScrollReveal";

export default function GoldenRule({ text }) {
    if (!text) return null;

    return (
        <div className="section-gap">
            <ScrollReveal className="heading-card" style={{ textAlign: "center" }}>
                <h2>✦ The Golden Rule</h2>
            </ScrollReveal>

            <ScrollReveal className="content-card" delay={150}>
                <p style={{ fontSize: "1.2rem", fontStyle: "italic", textAlign: "center", lineHeight: 1.8 }}>
                    "{text}"
                </p>
            </ScrollReveal>
        </div>
    );
}
