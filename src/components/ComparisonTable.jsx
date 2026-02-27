import ScrollReveal from "./ScrollReveal";

export default function ComparisonTable({ data }) {
    if (!data) return null;

    return (
        <div className="section-gap">
            <ScrollReveal className="heading-card">
                <h2>Comparison at a Glance</h2>
            </ScrollReveal>

            <ScrollReveal className="content-card" delay={150}>
                <table>
                    <thead>
                        <tr>
                            {data.headers.map((h, i) => (
                                <th key={i}>{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {data.rows.map((row, ri) => (
                            <tr key={ri}>
                                {row.map((cell, ci) => (
                                    <td key={ci}>{cell}</td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </ScrollReveal>
        </div>
    );
}
