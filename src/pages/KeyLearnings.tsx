import { useState } from "react";
import BlurText from "../components/ui/BlurText";

interface KeyLearningsProps {
  isDark: boolean;
}

interface Skill {
  name: string;
  projects: string[];
}

interface LearningCategory {
  id: string;
  label: string;
  skills: Skill[];
}

const learnings: LearningCategory[] = [
  {
    id: "frontend",
    label: "FRONTEND",
    skills: [
      { name: "React",           projects: ["Attendly", "Portfolio"] },
      { name: "TypeScript",      projects: ["Attendly", "Portfolio"] },
      { name: "Vite",            projects: ["Attendly", "Portfolio"] },
      { name: "Tailwind CSS",    projects: ["Portfolio"] },
      { name: "HTML & CSS",      projects: ["Balila Lebanese", "Banyula", "Rousscuts"] },
      { name: "SVG & Animation", projects: ["Portfolio"] },
    ],
  },
  {
    id: "networking",
    label: "NETWORKING",
    skills: [
      { name: "DNS protocol",          projects: ["DNS Sinkhole"] },
      { name: "Pi-hole",               projects: ["DNS Sinkhole"] },
      { name: "Linux CLI",             projects: ["DNS Sinkhole", "Home Server Cluster"] },
      { name: "SSH",                   projects: ["Home Server Cluster", "DNS Sinkhole"] },
      { name: "Network-level blocking", projects: ["DNS Sinkhole"] },
    ],
  },
  {
    id: "infrastructure",
    label: "INFRASTRUCTURE",
    skills: [
      { name: "Server provisioning", projects: ["Home Server Cluster"] },
      { name: "Service hosting",     projects: ["Home Server Cluster"] },
      { name: "Automation scripts",  projects: ["Home Server Cluster"] },
      { name: "NAS setup",           projects: ["Home Server Cluster"] },
    ],
  },
  {
    id: "design",
    label: "DESIGN",
    skills: [
      { name: "UI/UX principles",  projects: ["Portfolio", "Attendly"] },
      { name: "Responsive layout", projects: ["Balila Lebanese", "Banyula", "Rousscuts", "Portfolio"] },
      { name: "Typography",        projects: ["Portfolio"] },
      { name: "Brand identity",    projects: ["Balila Lebanese", "Banyula", "Rousscuts"] },
      { name: "Dark UI patterns",  projects: ["Portfolio"] },
    ],
  },
  {
    id: "creative",
    label: "CREATIVE",
    skills: [
      { name: "Automotive photography", projects: ["s2.media.au"] },
      { name: "Content creation",       projects: ["s2.media.au"] },
      { name: "Social media strategy",  projects: ["s2.media.au"] },
    ],
  },
];

export default function KeyLearnings({ isDark }: KeyLearningsProps) {
  const [activeKey, setActiveKey] = useState<string | null>(null);

  const mutedColor = "hsl(0 0% 45%)";
  const borderColor = isDark ? "hsl(0 0% 12%)" : "hsl(0 0% 86%)";

  const hoveredSkill = (() => {
    for (const cat of learnings) {
      const s = cat.skills.find((sk) => `${cat.id}-${sk.name}` === activeKey);
      if (s) return s;
    }
    return null;
  })();


  return (
    <div className="relative min-h-screen flex flex-col pt-28 pb-20 px-6 md:px-12 lg:px-24">

      <div className="mb-12">
        <div className="prowler-flicker">
          <BlurText
            text="ARSENAL"
            delay={60}
            animateBy="letters"
            direction="top"
            className="font-bold text-[48px] sm:text-[64px] md:text-[80px] tracking-tighter uppercase justify-start"
            style={{ color: "#E82323", fontFamily: "'Fira Code', monospace" }}
          />
        </div>
        <div className="mt-2 h-px w-full" style={{ backgroundColor: borderColor }} />
        <div className="mt-3">
          <p className="text-xs tracking-widest" style={{ color: mutedColor, fontFamily: "'Fira Code', monospace" }}>
            TOOLS & SKILLS ACQUIRED THROUGH REAL PROJECTS
          </p>
          <p className="mt-1.5 text-sm" style={{
            fontFamily: "'Fira Code', monospace",
            color: hoveredSkill ? "#B026FF" : "transparent",
            transition: "color 0.12s",
            minHeight: "1.4em",
          }}>
            {hoveredSkill ? `→ ${hoveredSkill.projects.join(", ")}` : "·"}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {learnings.map((cat, ci) => (
          <div key={cat.id} className="animate-slide-up" style={{ animationDelay: `${ci * 80}ms` }}>
            <div className="flex items-center gap-3 mb-4">
              <div style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: "#E82323", flexShrink: 0 }} />
              <span className="text-xs font-bold tracking-[0.3em]" style={{ color: "#E82323", fontFamily: "'Fira Code', monospace" }}>
                {cat.label}
              </span>
              <div className="flex-1 h-px" style={{ backgroundColor: "rgba(232,35,35,0.2)" }} />
            </div>

            <div className="flex flex-col gap-2.5">
              {cat.skills.map((skill) => {
                const key = `${cat.id}-${skill.name}`;
                const isActive = activeKey === key;
                return (
                  <div
                    key={skill.name}
                    className="flex items-center justify-between gap-3 cursor-default"
                    onMouseEnter={() => setActiveKey(key)}
                    onMouseLeave={() => setActiveKey(null)}
                    onClick={() => setActiveKey(activeKey === key ? null : key)}
                  >
                    <span style={{
                      fontFamily: "'Fira Code', monospace",
                      fontSize: "11px",
                      letterSpacing: "0.03em",
                      color: isActive ? "#fff" : mutedColor,
                      transition: "color 0.12s",
                    }}>
                      {skill.name}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
