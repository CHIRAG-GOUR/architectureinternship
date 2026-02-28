import ScrollReveal from "./ScrollReveal";

export default function ConceptSection({ concept }) {
    return (
        <div className="section-gap">
            {/* Dark heading card */}
            <ScrollReveal className="heading-card">
                <h2>{concept.number ? `${concept.number}. ` : ""}{concept.title}</h2>
            </ScrollReveal>

            {/* Content card */}
            <ScrollReveal className="content-card" delay={150}>
                <p style={{ marginBottom: "1.2rem" }}>{concept.description}</p>
                {concept.bullets && concept.bullets.length > 0 && (
                    <ul>
                        {concept.bullets.map((bullet, i) => (
                            <li key={i}>
                                <strong>{bullet.term}:</strong> {bullet.text}
                            </li>
                        ))}
                    </ul>
                )}
                {concept.image && (
                    <div style={{ marginTop: "1.5rem" }}>
                        <img
                            src={concept.image}
                            alt={concept.title}
                            style={{ width: "100%", borderRadius: "8px", objectFit: "cover" }}
                        />
                    </div>
                )}
            </ScrollReveal>
        </div>
    );
}
