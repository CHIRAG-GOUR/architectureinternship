import ScrollReveal from "./ScrollReveal";

export default function ConceptSection({ concept }) {
    return (
        <div className="section-gap">
            {/* Dark heading card */}
            <ScrollReveal className="heading-card">
                <h2>{concept.number}. {concept.title}</h2>
            </ScrollReveal>

            {/* Content card */}
            <ScrollReveal className="content-card" delay={150}>
                <p style={{ marginBottom: "1.2rem" }}>{concept.description}</p>
                <ul>
                    {concept.bullets.map((bullet, i) => (
                        <li key={i}>
                            <strong>{bullet.term}:</strong> {bullet.text}
                        </li>
                    ))}
                </ul>
            </ScrollReveal>
        </div>
    );
}
