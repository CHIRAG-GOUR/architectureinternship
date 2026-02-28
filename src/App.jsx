import { useEffect, useState } from "react";
import { HashRouter, Routes, Route, useParams, useNavigate } from "react-router-dom";
import "./index.css";

import ThreeBackground from "./components/ThreeBackground";
import BlueprintBackground from "./components/BlueprintBackground";
import HeroSection from "./components/HeroSection";
import ScrollReveal from "./components/ScrollReveal";
import ConceptSection from "./components/ConceptSection";
import ComparisonTable from "./components/ComparisonTable";
import GoldenRule from "./components/GoldenRule";
import TopProgressBar from "./components/TopProgressBar";
import ZigzagProgress from "./components/ZigzagProgress";

/* Chapter 1.1 activities */
import BlockBuilder from "./components/activities/BlockBuilder";
import SpaceDesigner from "./components/activities/SpaceDesigner";
import ConceptExplorer from "./components/activities/ConceptExplorer";

/* Chapter 1.2 activities */
import RadialControlRoom from "./components/activities/RadialControlRoom";
import FlowSimulator from "./components/activities/FlowSimulator";
import ClusterBuilder from "./components/activities/ClusterBuilder";

/* Chapter 1.3 activities */
import ScaleExplorer3D from "./components/activities/ScaleExplorer3D";
import InclusiveDesignSim from "./components/activities/InclusiveDesignSim";

/* Chapter 1.4 activities */
import SunPathSimulator from "./components/activities/SunPathSimulator";
import TerrainBuilder from "./components/activities/TerrainBuilder";

/* Chapter 1.5 activities */
import BuildingAutopsy from "./components/activities/BuildingAutopsy";
import AIPrecedentAnalyzer from "./components/activities/AIPrecedentAnalyzer";

/* Chapter 2.1 activities */
import OrthographicSlicer from "./components/activities/OrthographicSlicer";
import LineWeightStudio from "./components/activities/LineWeightStudio";
import ProjectionPuzzle from "./components/activities/ProjectionPuzzle";

/* Chapter 2.2 activities */
import TheVanishingPoint from "./components/activities/TheVanishingPoint";
import IsometricExtruder from "./components/activities/IsometricExtruder";
import PerspectiveDetective from "./components/activities/PerspectiveDetective";

/* Chapter 2.3 activities */
import CanvasCADSimulator from "./components/activities/CanvasCADSimulator";
import RhinoNurbsDemo from "./components/activities/RhinoNurbsDemo";
import RevitBimInspector from "./components/activities/RevitBimInspector";

/* Chapter 5 activities */
import ExplodedAxonometric from "./components/activities/ExplodedAxonometric";
import AtmosphereDirector from "./components/activities/AtmosphereDirector";

import chaptersData from "./data/chapterData";

/* ── Chapter-specific activity mappings ── */
const CHAPTER_ACTIVITIES = {
  "1.1": [BlockBuilder, SpaceDesigner, ConceptExplorer],
  "1.2": [RadialControlRoom, FlowSimulator, ClusterBuilder],
  "1.3": [ScaleExplorer3D, InclusiveDesignSim],
  "1.4": [SunPathSimulator, TerrainBuilder],
  "1.5": [BuildingAutopsy, AIPrecedentAnalyzer],
  "2.1": [OrthographicSlicer, LineWeightStudio, ProjectionPuzzle],
  "2.2": [TheVanishingPoint, IsometricExtruder, PerspectiveDetective],
  "2.3": [CanvasCADSimulator, RhinoNurbsDemo, RevitBimInspector],
  "5": [ExplodedAxonometric, AtmosphereDirector],
};

/* ── Mouse tilt on content cards ── */
function useTilt() {
  useEffect(() => {
    const handler = (e) => {
      const card = e.currentTarget;
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      const tiltX = (y / rect.height) * 12;
      const tiltY = -(x / rect.width) * 12;
      card.style.transform = `translateY(-12px) scale(1.02) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
    };
    const reset = (e) => {
      e.currentTarget.style.transform = "";
    };

    const cards = document.querySelectorAll(".content-card.visible");
    cards.forEach((c) => {
      c.addEventListener("mousemove", handler);
      c.addEventListener("mouseleave", reset);
    });

    const interval = setInterval(() => {
      const newCards = document.querySelectorAll(".content-card.visible");
      newCards.forEach((c) => {
        if (!c._tiltBound) {
          c._tiltBound = true;
          c.addEventListener("mousemove", handler);
          c.addEventListener("mouseleave", reset);
        }
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);
}

/* ── Fullscreen button ── */
/* Cross-browser fullscreen helpers */
function getFullscreenEl() {
  return document.fullscreenElement || document.webkitFullscreenElement || document.msFullscreenElement;
}
function goFullscreen(el) {
  if (el.requestFullscreen) return el.requestFullscreen();
  if (el.webkitRequestFullscreen) return el.webkitRequestFullscreen();
  if (el.msRequestFullscreen) return el.msRequestFullscreen();
  return Promise.reject("Not supported");
}
function leaveFullscreen() {
  if (document.exitFullscreen) return document.exitFullscreen();
  if (document.webkitExitFullscreen) return document.webkitExitFullscreen();
  if (document.msExitFullscreen) return document.msExitFullscreen();
  return Promise.reject("Not supported");
}

function FullscreenToggle() {
  const [fs, setFs] = useState(false);

  useEffect(() => {
    const onChange = () => setFs(!!getFullscreenEl());
    document.addEventListener("fullscreenchange", onChange);
    document.addEventListener("webkitfullscreenchange", onChange);
    document.addEventListener("MSFullscreenChange", onChange);
    return () => {
      document.removeEventListener("fullscreenchange", onChange);
      document.removeEventListener("webkitfullscreenchange", onChange);
      document.removeEventListener("MSFullscreenChange", onChange);
    };
  }, []);

  const toggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!getFullscreenEl()) {
      goFullscreen(document.documentElement).catch(() => {
        goFullscreen(document.body).catch(console.warn);
      });
    } else {
      leaveFullscreen().catch(console.warn);
    }
  };

  return (
    <button
      id="fullscreen-btn"
      onClick={toggle}
      onPointerDown={(e) => e.stopPropagation()}
      style={{
        position: "fixed", top: "1.2rem", right: "1.2rem", zIndex: 9999,
        width: 46, height: 46, borderRadius: "50%",
        background: "rgba(254,252,247,0.95)", backdropFilter: "blur(8px)",
        border: "1px solid #d9c4a5", cursor: "pointer",
        display: "flex", alignItems: "center", justifyContent: "center",
        transition: "all 0.3s", color: "#5c4033",
        pointerEvents: "all",
        boxShadow: "0 2px 12px rgba(0,0,0,0.15)",
      }}
      title={fs ? "Exit Fullscreen" : "Fullscreen"}
    >
      <svg fill="none" width="20" height="20" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
        {fs ? (
          <>
            <polyline points="4 14 10 14 10 20" />
            <polyline points="20 10 14 10 14 4" />
            <line x1="14" y1="10" x2="21" y2="3" />
            <line x1="3" y1="21" x2="10" y2="14" />
          </>
        ) : (
          <>
            <polyline points="15 3 21 3 21 9" />
            <polyline points="9 21 3 21 3 15" />
            <line x1="21" y1="3" x2="14" y2="10" />
            <line x1="3" y1="21" x2="10" y2="14" />
          </>
        )}
      </svg>
    </button>
  );
}

/* ── Chapter Page (renders a single chapter's content) ── */
function ChapterPage({ chapter }) {
  if (!chapter) return null;

  return (
    <div className="page-container">
      {/* MODULE + CHAPTER HEADER */}
      <div className="section-gap">
        <ScrollReveal className="heading-card">
          <h2>{chapter.chapterTitle}</h2>
          <p className="subtitle">{chapter.moduleTitle} — {chapter.moduleSubtitle}</p>
        </ScrollReveal>

        <ScrollReveal className="content-card" delay={200}>
          <h3>{chapter.chapterSubtitle}</h3>
          <p>{chapter.introText}</p>
        </ScrollReveal>
      </div>

      {/* INTRO VIDEOS — only show if there are videos */}
      {chapter.introVideos?.length > 0 && (
        <div className="section-gap">
          <ScrollReveal className="heading-card">
            <h2>Introduction Videos</h2>
            <p className="subtitle">Start here — get the big picture</p>
          </ScrollReveal>
          {chapter.introVideos.map((video, i) => (
            <ScrollReveal key={i} className="content-card" delay={150 + i * 200}>
              <h4>{video.title}</h4>
              <div className="video-wrap">
                <iframe
                  src={`https://www.youtube.com/embed/${getYouTubeId(video.url)}?rel=0`}
                  title={video.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
            </ScrollReveal>
          ))}
        </div>
      )}

      {/* Reference Image */}
      {chapter.chapterImage && (
        <div className="section-gap">
          <ScrollReveal className="content-card" delay={500}>
            <h4>Spatial Design Reference</h4>
            <img
              src={chapter.chapterImage}
              alt="Architecture reference — spatial design principles"
              style={{ width: "100%", borderRadius: "8px", marginTop: "0.5rem" }}
            />
          </ScrollReveal>
        </div>
      )}


      {/* CHAPTER VIDEOS — only show if there are videos */}
      {chapter.chapterVideos?.length > 0 && (
        <div className="section-gap">
          <ScrollReveal className="heading-card">
            <h2>Video Lessons</h2>
            <p className="subtitle">Dive deeper into the concepts</p>
          </ScrollReveal>
          {chapter.chapterVideos.map((video, i) => (
            <ScrollReveal key={i} className="content-card" delay={150 + i * 200}>
              <h4>{video.title}</h4>
              <div className="video-wrap">
                <iframe
                  src={`https://www.youtube.com/embed/${getYouTubeId(video.url)}?rel=0`}
                  title={video.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
            </ScrollReveal>
          ))}
        </div>
      )}

      {/* CONCEPTS */}
      {chapter.concepts.map((concept, i) => (
        <ConceptSection key={i} concept={concept} />
      ))}

      {/* COMPARISON TABLE */}
      <ComparisonTable data={chapter.comparisonTable} />

      {/* GOLDEN RULE */}
      <GoldenRule text={chapter.goldenRule} />

      {/* ACTIVITIES — chapter-specific */}
      <div className="section-gap">
        <ScrollReveal className="heading-card" style={{ textAlign: "center" }}>
          <h2>🎯 Practice Activities</h2>
          <p className="subtitle">Hands-on exploration — learn by doing</p>
        </ScrollReveal>
      </div>

      {(CHAPTER_ACTIVITIES[chapter.id] || []).map((Activity, i) => (
        <Activity key={`${chapter.id}-act-${i}`} />
      ))}

      {/* ENDING QUOTE — unique per chapter */}
      {chapter.endingQuote && (
        <div className="section-gap">
          <ScrollReveal className="content-card" delay={100}>
            <div style={{ textAlign: "center", padding: "2rem 1.5rem" }}>
              <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.2rem, 2.5vw, 1.7rem)", color: "#5c4033", lineHeight: 1.7, fontStyle: "italic" }}>
                "{chapter.endingQuote.quote}"
              </p>
              <p style={{ fontSize: "0.95rem", color: "#c9a96e", fontWeight: 700, marginTop: "1rem", letterSpacing: "0.05em" }}>
                — {chapter.endingQuote.author}
              </p>
              {chapter.endingQuote.image && (
                <img
                  src={chapter.endingQuote.image}
                  alt={chapter.endingQuote.author}
                  style={{ width: 96, height: 96, borderRadius: "50%", objectFit: "cover", border: "3px solid #c9a96e", marginTop: "1rem", display: "block", marginLeft: "auto", marginRight: "auto" }}
                />
              )}
              <div style={{ marginTop: "1rem", display: "flex", justifyContent: "center", gap: 6 }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#c9a96e" }} />
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#c9a96e40" }} />
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#c9a96e" }} />
              </div>
            </div>
          </ScrollReveal>
        </div>
      )}
    </div>
  );
}

/* ── Chapter Route Wrapper ── */
function ChapterRoute() {
  const { chapterId } = useParams();
  const chapter = chaptersData.find((c) => c.id === chapterId && !c.locked);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [chapterId]);

  if (!chapter) {
    return (
      <>
        <HeroSection />
        <div className="page-container" style={{ textAlign: "center", paddingTop: "4rem" }}>
          <ScrollReveal className="content-card">
            <h3>📚 Chapter Coming Soon</h3>
            <p>This chapter is being prepared. Check back later!</p>
          </ScrollReveal>
        </div>
      </>
    );
  }

  return (
    <>
      <HeroSection subtitle={chapter.heroSubtitle} backgroundImage={chapter.heroImage} />
      <ChapterPage chapter={chapter} />
    </>
  );
}

/* ── Footer ── */
function Footer() {
  return (
    <footer className="site-footer">
      <p>
        Architecture Internship — Building minds, one form at a time &nbsp;|&nbsp;
        <a href="https://skillizee.io" target="_blank" rel="noopener noreferrer">skillizee.io</a>
      </p>
    </footer>
  );
}

function getYouTubeId(url) {
  if (!url) return "";
  let m = url.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
  if (m) return m[1];
  m = url.match(/youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/);
  if (m) return m[1];
  m = url.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/);
  if (m) return m[1];
  return "";
}

/* ── Home: hero + auto-loads first chapter ── */
function HomePage() {
  const ch = chaptersData[0];
  return (
    <>
      <HeroSection subtitle={ch.heroSubtitle} backgroundImage={ch.heroImage} />
      <ChapterPage chapter={ch} />
    </>
  );
}

/* ── Background Manager ── */
import { useLocation } from "react-router-dom";
import IsometricBackground from "./components/IsometricBackground";
import DetailedArchitectMapBackground from "./components/DetailedArchitectMapBackground";
import PortfolioBackground from "./components/PortfolioBackground";

function BackgroundManager() {
  const location = useLocation();
  const path = location.pathname;

  let BackgroundComponent = ThreeBackground;

  if (path.includes("/chapter/")) {
    const chapterId = path.split("/chapter/")[1];
    if (chapterId === "1.1" || chapterId === "1.2" || chapterId === "1.3" || chapterId === "1.4" || chapterId === "1.5") {
      BackgroundComponent = ThreeBackground;
    } else if (chapterId === "2.1") {
      BackgroundComponent = BlueprintBackground;
    } else if (chapterId === "2.2") {
      BackgroundComponent = IsometricBackground;
    } else if (chapterId === "2.3") {
      BackgroundComponent = DetailedArchitectMapBackground;
    } else if (chapterId === "5") {
      BackgroundComponent = PortfolioBackground;
    }
  }

  return (
    <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", zIndex: -1 }}>
      <BackgroundComponent />
    </div>
  );
}

/* ── Main App with routing ── */
export default function App() {
  useTilt();

  return (
    <HashRouter>
      <div style={{ minHeight: "100vh", position: "relative" }}>
        <BackgroundManager />
        <TopProgressBar />
        <FullscreenToggle />
        <ZigzagProgress />

        <div className="overlay">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/chapter/:chapterId" element={<ChapterRoute />} />
          </Routes>
          <Footer />
        </div>
      </div>
    </HashRouter>
  );
}
