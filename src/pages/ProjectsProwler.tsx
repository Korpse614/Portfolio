import { useState } from "react";
import { ExternalLink } from "lucide-react";

type CategoryId = "web" | "homelab" | "creative";

interface Category {
  id: CategoryId;
  label: string;
  x: number;
  y: number;
  r: number;
}

interface Project {
  id: string;
  label: string;
  tag: string;
  x: number;
  y: number;
  category: CategoryId;
  status: string;
  description: string;
  link?: string;
}

const W = 1000;
const H = 580;
const PURPLE = "#B026FF";
const RED = "#E82323";

const categories: Category[] = [
  { id: "web",      label: "WEB DEV",  x: 300, y: 270, r: 38 },
  { id: "homelab",  label: "HOME LAB", x: 700, y: 395, r: 38 },
  { id: "creative", label: "CREATIVE", x: 740, y: 165, r: 38 },
];

const projects: Project[] = [
  {
    id: "attendly", label: "Attendly", tag: "Web App",
    x: 110, y: 160, category: "web", status: "Live",
    description: "React-based attendance tracker built with Vite. Streamlines logging and managing attendance records with a clean UI.",
  },
  {
    id: "balila", label: "Balila Lebanese", tag: "Website",
    x: 100, y: 400, category: "web", status: "Live",
    description: "Restaurant website for a Lebanese eatery, menu, ambience, and contact info with a warm, inviting design.",
  },
  {
    id: "banyula", label: "Banyula", tag: "Website",
    x: 320, y: 470, category: "web", status: "Live",
    description: "Clean professional website for a local business focused on clear communication and a polished user experience.",
  },
  {
    id: "rousscuts", label: "Rousscuts", tag: "Website",
    x: 468, y: 195, category: "web", status: "Live",
    description: "Barbershop website with a sharp, modern aesthetic to reflect the brand's identity and connect with clients.",
  },
  {
    id: "dns", label: "DNS Sinkhole", tag: "Home Lab",
    x: 555, y: 500, category: "homelab", status: "In Progress",
    description: "Self-hosted Pi-hole blocking ads and trackers across an entire network at DNS level, no browser extensions needed.",
  },
  {
    id: "server", label: "Home Server Cluster", tag: "Home Lab",
    x: 875, y: 455, category: "homelab", status: "Planned",
    description: "3 repurposed laptops turned into a home server cluster for automated scripts, hosted services, and local NAS.",
  },
  {
    id: "s2media", label: "s2.media.au", tag: "Photography",
    x: 905, y: 110, category: "creative", status: "Ongoing",
    description: "Documenting car culture through photography and media. Follow on Instagram for the latest shots and automotive stories.",
    link: "https://www.instagram.com/s2.media.au/",
  },
];

const statusColors: Record<string, string> = {
  Live: RED,
  "In Progress": "#F59E0B",
  Planned: "#6B7280",
  Ongoing: RED,
};

const edges = projects.map((p) => ({ from: p.id, to: p.category }));

export default function ProjectsProwler() {
  const [hovered, setHovered] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>(null);

  const mutedColor = "hsl(0 0% 45%)";
  const cardBg = "hsl(0 0% 6%)";
  const borderColor = "hsl(0 0% 14%)";

  const selectedProject = projects.find((p) => p.id === selected);

  const isConnected = (nodeId: string): boolean => {
    if (!hovered) return true;
    if (nodeId === hovered) return true;
    const hoveredIsCategory = categories.some((c) => c.id === hovered);
    if (hoveredIsCategory) return projects.some((p) => p.id === nodeId && p.category === hovered);
    const proj = projects.find((p) => p.id === hovered);
    return proj ? nodeId === proj.category : false;
  };

  const edgeHighlighted = (projectId: string): boolean => {
    if (!hovered) return false;
    const proj = projects.find((p) => p.id === projectId);
    if (!proj) return false;
    return hovered === projectId || hovered === proj.category;
  };

  const nodeOpacity = (id: string): number => (!hovered ? 1 : isConnected(id) ? 1 : 0.1);

  return (
    <div className="relative min-h-screen flex flex-col" style={{ paddingTop: "7rem", paddingBottom: "5rem", backgroundColor: "#000" }}>

      {/* Halftone dot overlay, kept neutral white — base identity stays red/black/white,
          purple only shows up in hover/select interactions */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          opacity: 0.14,
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.4) 1px, transparent 1.6px)",
          backgroundSize: "7px 7px",
          mixBlendMode: "screen",
        }}
      />

      {/* Title */}
      <div className="relative px-6 md:px-12 lg:px-24 mb-8" style={{ zIndex: 1 }}>
        <h1
          className="font-black text-[48px] sm:text-[64px] md:text-[80px] tracking-tighter uppercase prowler-flicker"
          style={{ color: RED, fontFamily: "'Fira Code', monospace", textShadow: "0 0 24px rgba(232,35,35,0.4)" }}
        >
          PROJECTS
        </h1>
        <div className="mt-2 h-px w-full" style={{ backgroundColor: borderColor }} />
        <p className="mt-3 text-xs tracking-widest hidden md:block" style={{ color: mutedColor, fontFamily: "'Fira Code', monospace" }}>
          HOVER TO EXPLORE · CLICK FOR DETAILS
        </p>
      </div>

      {/* Mobile fallback list */}
      <div className="relative md:hidden flex flex-col gap-8 px-6" style={{ zIndex: 1 }}>
        {categories.map((cat) => (
          <div key={cat.id}>
            <div className="flex items-center gap-3 mb-4">
              <div style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: RED, flexShrink: 0 }} />
              <span className="text-xs font-bold tracking-[0.3em]" style={{ color: RED, fontFamily: "'Fira Code', monospace" }}>
                {cat.label}
              </span>
              <div className="flex-1 h-px" style={{ backgroundColor: "rgba(232,35,35,0.2)" }} />
            </div>
            <div className="flex flex-col gap-3">
              {projects.filter((p) => p.category === cat.id).map((p) => (
                <div key={p.id} className="p-4 rounded-lg" style={{ backgroundColor: cardBg, border: `1px solid ${borderColor}` }}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold tracking-widest px-2 py-1 rounded-full" style={{ backgroundColor: "rgba(232,35,35,0.1)", color: RED, fontFamily: "'Fira Code', monospace" }}>
                      {p.tag}
                    </span>
                    <span className="text-xs font-semibold" style={{ color: statusColors[p.status] ?? mutedColor, fontFamily: "'Fira Code', monospace" }}>
                      {p.status}
                    </span>
                  </div>
                  <h3 className="text-base font-bold mb-1" style={{ fontFamily: "'Fira Code', monospace" }}>{p.label}</h3>
                  <p className="text-sm leading-relaxed mb-2" style={{ color: mutedColor, fontFamily: "'Antic', sans-serif" }}>{p.description}</p>
                  {p.link && (
                    <a href={p.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sm font-semibold" style={{ color: RED, fontFamily: "'Fira Code', monospace" }}>
                      View <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Graph + Detail panel */}
      <div className="relative hidden md:flex flex-col lg:flex-row flex-1 gap-0" style={{ zIndex: 1 }}>
        <div className="flex-1 min-h-[420px] lg:min-h-0 relative">
          <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-full" style={{ minHeight: 360 }}>
            <defs>
              <filter id="glow-purple" x="-60%" y="-60%" width="220%" height="220%">
                <feGaussianBlur stdDeviation="8" result="blur" />
                <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
              <filter id="glow-white" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
            </defs>

            {edges.map(({ from, to }) => {
              const proj = projects.find((p) => p.id === from)!;
              const cat = categories.find((c) => c.id === to)!;
              const highlighted = edgeHighlighted(from);
              return (
                <line
                  key={`${from}-${to}`}
                  x1={proj.x} y1={proj.y} x2={cat.x} y2={cat.y}
                  stroke={highlighted ? "rgba(176,38,255,0.85)" : "rgba(255,255,255,0.1)"}
                  strokeWidth={highlighted ? 1.8 : 1}
                  style={{ transition: "all 0.2s" }}
                />
              );
            })}

            {categories.map((cat) => {
              const op = nodeOpacity(cat.id);
              const isHov = hovered === cat.id;
              return (
                <g
                  key={cat.id}
                  style={{ cursor: "pointer", opacity: op, transition: "opacity 0.2s" }}
                  onMouseEnter={() => setHovered(cat.id)}
                  onMouseLeave={() => setHovered(null)}
                >
                  <circle cx={cat.x} cy={cat.y} r={cat.r + 12} fill="transparent" />
                  <circle
                    cx={cat.x} cy={cat.y} r={cat.r}
                    fill={isHov ? "rgba(176,38,255,0.18)" : "rgba(232,35,35,0.12)"}
                    stroke={isHov ? PURPLE : RED}
                    strokeWidth={isHov ? 2.2 : 1.5}
                    filter={isHov ? "url(#glow-purple)" : undefined}
                    style={{ transition: "all 0.2s" }}
                  />
                  <text
                    x={cat.x} y={cat.y - 2}
                    textAnchor="middle" dominantBaseline="middle"
                    fill={isHov ? PURPLE : RED}
                    fontSize={isHov ? 11 : 10}
                    fontFamily="'Fira Code', monospace"
                    fontWeight="bold"
                    letterSpacing="0.08em"
                    style={{ transition: "all 0.2s", userSelect: "none" }}
                  >
                    {cat.label}
                  </text>
                </g>
              );
            })}

            {projects.map((proj) => {
              const op = nodeOpacity(proj.id);
              const isHov = hovered === proj.id;
              const isSel = selected === proj.id;
              return (
                <g
                  key={proj.id}
                  style={{ cursor: "pointer", opacity: op, transition: "opacity 0.2s" }}
                  onMouseEnter={() => setHovered(proj.id)}
                  onMouseLeave={() => setHovered(null)}
                  onClick={() => setSelected(selected === proj.id ? null : proj.id)}
                >
                  <circle cx={proj.x} cy={proj.y} r={22} fill="transparent" />
                  <circle
                    cx={proj.x} cy={proj.y} r={14}
                    fill={isSel || isHov ? "rgba(176,38,255,0.22)" : "rgba(255,255,255,0.04)"}
                    stroke={isSel || isHov ? PURPLE : "rgba(255,255,255,0.25)"}
                    strokeWidth={isSel || isHov ? 1.8 : 1}
                    filter={isHov || isSel ? "url(#glow-purple)" : undefined}
                    style={{ transition: "all 0.2s" }}
                  />
                  <circle
                    cx={proj.x} cy={proj.y} r={4}
                    fill={isSel || isHov ? PURPLE : "rgba(255,255,255,0.3)"}
                    style={{ transition: "all 0.2s" }}
                  />
                  <text
                    x={proj.x} y={proj.y + 24}
                    textAnchor="middle"
                    fill={isHov || isSel ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.4)"}
                    fontSize={9.5}
                    fontFamily="'Fira Code', monospace"
                    letterSpacing="0.04em"
                    style={{ transition: "all 0.2s", userSelect: "none" }}
                  >
                    {proj.label}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Detail panel */}
        <div className="lg:w-[340px] xl:w-[380px] flex-shrink-0 mx-6 md:mx-12 lg:mx-0 lg:mr-12 lg:mt-0 mt-4" style={{ minHeight: 280 }}>
          {selectedProject ? (
            <div
              className="h-full p-6 rounded-xl flex flex-col gap-4 animate-slide-up"
              style={{ backgroundColor: cardBg, border: `1px solid rgba(176,38,255,0.3)`, boxShadow: "0 0 30px rgba(176,38,255,0.08)" }}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="inline-block text-xs font-bold tracking-widest px-3 py-1 rounded-full mb-3" style={{ backgroundColor: "rgba(176,38,255,0.12)", color: PURPLE, fontFamily: "'Fira Code', monospace" }}>
                    {selectedProject.tag}
                  </span>
                  <h2 className="text-xl font-bold" style={{ fontFamily: "'Fira Code', monospace" }}>{selectedProject.label}</h2>
                </div>
                <span className="text-xs font-semibold tracking-wide flex-shrink-0 mt-1" style={{ color: statusColors[selectedProject.status] ?? mutedColor, fontFamily: "'Fira Code', monospace" }}>
                  {selectedProject.status}
                </span>
              </div>
              <p className="text-sm leading-relaxed flex-1" style={{ color: mutedColor, fontFamily: "'Antic', sans-serif" }}>{selectedProject.description}</p>
              {selectedProject.link && (
                <a href={selectedProject.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm font-semibold transition-opacity duration-200 hover:opacity-70" style={{ color: PURPLE, fontFamily: "'Fira Code', monospace" }}>
                  View <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          ) : (
            <div className="h-full p-6 rounded-xl flex flex-col items-center justify-center gap-3" style={{ border: `1px dashed ${borderColor}` }}>
              <div className="prowler-pulse" style={{ width: 32, height: 32, borderRadius: "50%", border: "1px solid rgba(232,35,35,0.4)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: "rgba(232,35,35,0.5)" }} />
              </div>
              <p className="text-xs text-center tracking-widest" style={{ color: mutedColor, fontFamily: "'Fira Code', monospace" }}>SELECT A NODE</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
