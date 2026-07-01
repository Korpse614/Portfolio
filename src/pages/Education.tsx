import { useState, type RefObject } from "react";
import BlurText from "../components/ui/BlurText";

interface EducationProps {
  isDark: boolean;
  headingRef?: RefObject<HTMLDivElement | null>;
  scrambleRef?: RefObject<HTMLSpanElement | null>;
  contentRef?: RefObject<HTMLDivElement | null>;
}

const timeline = [
  {
    period: "2026 – Present",
    institution: "Monash University",
    location: "Melbourne, Australia",
    detail: "Bachelor of Engineering (Honours). Developing expertise in software systems, circuits, and applied engineering with hands-on project experience.",
    tag: "University",
  },
];

export default function Education({ isDark, headingRef, scrambleRef, contentRef }: EducationProps) {
  const [activeIdx, setActiveIdx] = useState<number | null>(null);

  const mutedColor  = "hsl(0 0% 45%)";
  const cardBg      = "hsl(0 0% 5%)";
  const borderColor = isDark ? "hsl(0 0% 12%)" : "hsl(0 0% 86%)";

  return (
    <div className="relative min-h-screen flex flex-col pt-28 pb-20 px-6 md:px-12 lg:px-24">

      <div className="mb-16">
        <div ref={headingRef} className="prowler-flicker" style={{ position: "relative" }}>
          <BlurText
            text="EDUCATION"
            delay={60}
            animateBy="letters"
            direction="top"
            className="font-bold text-[48px] sm:text-[64px] md:text-[80px] tracking-tighter uppercase justify-start"
            style={{ color: "#E82323", fontFamily: "'Fira Code', monospace" }}
          />
          {/* Scramble span — sits over the BlurText, shown only during the transition */}
          <span
            ref={scrambleRef}
            className="font-bold text-[48px] sm:text-[64px] md:text-[80px] tracking-tighter uppercase"
            style={{
              position:   "absolute",
              top:        0,
              left:       0,
              display:    "block",
              opacity:    0,
              color:      "#E82323",
              fontFamily: "'Fira Code', monospace",
              lineHeight: 1,
              whiteSpace: "nowrap",
              pointerEvents: "none",
              textShadow: "0 0 18px rgba(232,35,35,0.9), 0 0 40px rgba(232,35,35,0.5)",
            }}
          >
            EDUCATION
          </span>
        </div>
        <div className="mt-2 h-px w-full" style={{ backgroundColor: borderColor }} />
      </div>

      <div ref={contentRef} className="flex flex-col gap-10 max-w-3xl">
        {timeline.map((s, i) => {
          const isActive = activeIdx === i;
          return (
            <div
              key={i}
              className="relative pl-6 border-l-2 animate-slide-up"
              style={{
                borderColor:     isActive ? "#B026FF" : "#E82323",
                animationDelay: `${i * 120}ms`,
                cursor:          "default",
                transition:      "border-color 0.15s",
              }}
              onMouseEnter={() => setActiveIdx(i)}
              onMouseLeave={() => setActiveIdx(null)}
            >
              <span
                className="inline-block text-xs font-bold tracking-widest px-3 py-1 rounded-full mb-3"
                style={{
                  backgroundColor: isActive ? "rgba(176,38,255,0.12)" : "rgba(232,35,35,0.1)",
                  color:           isActive ? "#B026FF" : "#E82323",
                  fontFamily:      "'Fira Code', monospace",
                  transition:      "all 0.15s",
                }}
              >
                {s.tag}
              </span>

              <p
                className="text-sm font-medium tracking-widest mb-1"
                style={{ color: mutedColor, fontFamily: "'Fira Code', monospace" }}
              >
                {s.period}
              </p>

              <h2
                className="text-xl sm:text-2xl font-bold mb-1"
                style={{ fontFamily: "'Fira Code', monospace" }}
              >
                {s.institution}
              </h2>

              <p
                className="text-sm mb-3"
                style={{ color: mutedColor, fontFamily: "'Antic', sans-serif" }}
              >
                {s.location}
              </p>

              <div
                className="relative overflow-hidden p-4 rounded-lg"
                style={{
                  backgroundColor: cardBg,
                  border:          `1px solid ${isActive ? "rgba(176,38,255,0.35)" : borderColor}`,
                  boxShadow:       isActive ? "0 0 20px rgba(176,38,255,0.1)" : "none",
                  transition:      "border-color 0.15s, box-shadow 0.15s",
                }}
              >
                <div
                  className="card-scan absolute left-0 w-full pointer-events-none"
                  style={{
                    top:        0,
                    height:     "2px",
                    background: "linear-gradient(to right, transparent 0%, rgba(232,35,35,0.6) 40%, rgba(176,38,255,0.4) 60%, transparent 100%)",
                    zIndex:     10,
                  }}
                />
                <p
                  className="text-sm leading-relaxed"
                  style={{ fontFamily: "'Antic', sans-serif", color: mutedColor }}
                >
                  {s.detail}
                </p>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
