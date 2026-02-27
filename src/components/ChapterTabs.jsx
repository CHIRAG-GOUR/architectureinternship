import ScrollReveal from "./ScrollReveal";

/*
  ChapterTabs — horizontal tab bar for switching between chapters.
  Active chapter is highlighted. Locked chapters show a lock icon.
  Styled as a frosted-glass bar matching the theme.
*/
export default function ChapterTabs({ chapters, activeId, onSelect }) {
    return (
        <div className="chapter-tabs-wrap">
            <ScrollReveal className="chapter-tabs-bar">
                {chapters.map((ch) => {
                    const isActive = ch.id === activeId;
                    const isLocked = ch.locked;

                    return (
                        <button
                            key={ch.id}
                            onClick={() => !isLocked && onSelect(ch.id)}
                            className={`chapter-tab ${isActive ? "active" : ""} ${isLocked ? "locked" : ""}`}
                            disabled={isLocked}
                            title={isLocked ? "Coming soon" : ch.tabLabel}
                        >
                            {isLocked && <span className="lock-icon">🔒</span>}
                            <span className="tab-label">{ch.tabLabel}</span>
                        </button>
                    );
                })}
            </ScrollReveal>
        </div>
    );
}
