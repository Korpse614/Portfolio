import { useRef, useImperativeHandle, type Ref } from "react";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*<>[]";
const START = "EDUCATION";
const END   = "PROJECTS";

// Word stays pinned at the heading position throughout.
// Only the text scrambles — no movement, no backdrop.
//   p 0   → 0.33  card exits, word frozen showing START
//   p 0.33 → 0.67  scramble (START → END)
//   p 0.67 → 1     word frozen showing END, proj content slides in
const P_SCRAM_START = 0.33;
const P_SCRAM_END   = 0.67;
const P_MID         = 0.50;

const rnd = () => CHARS[Math.floor(Math.random() * CHARS.length)];

export interface ZoomScrambleHandle {
  setProgress: (p: number) => void;
  configure: (cfg: {
    eduX: number; eduY: number; eduScale: number;
    projX: number; projY: number; projScale: number;
  }) => void;
  updateProjPos: (pos: { projX: number; projY: number; projScale: number }) => void;
  activate: () => void;
  deactivate: () => void;
}

export default function ZoomScramble({ ref }: { ref?: Ref<ZoomScrambleHandle> }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const pRef    = useRef(0);
  const rafRef  = useRef(0);

  const cfgRef = useRef({
    eduX: 0, eduY: 0, eduScale: 1,
    projX: 0, projY: 0, projScale: 1,
  });

  const tick = () => {
    const p    = pRef.current;
    const text = textRef.current;
    if (!text || p <= P_SCRAM_START || p >= P_SCRAM_END) return;
    let out = "";
    if (p < P_MID) {
      const broken = Math.min(START.length, Math.floor((p - P_SCRAM_START) / (P_MID - P_SCRAM_START) * START.length));
      for (let i = 0; i < START.length; i++) out += i < broken ? rnd() : START[i];
    } else {
      const resolved = Math.min(END.length, Math.floor((p - P_MID) / (P_SCRAM_END - P_MID) * END.length));
      for (let i = 0; i < END.length; i++) out += i < resolved ? END[i] : rnd();
    }
    text.textContent = out;
    rafRef.current   = requestAnimationFrame(tick);
  };

  useImperativeHandle(ref, () => ({
    configure(cfg) {
      cfgRef.current = cfg;
    },

    updateProjPos(pos) {
      cfgRef.current = { ...cfgRef.current, ...pos };
    },

    activate() {
      if (wrapRef.current) wrapRef.current.style.opacity = "1";
    },

    deactivate() {
      if (wrapRef.current) wrapRef.current.style.opacity = "0";
    },

    setProgress(p: number) {
      const wrap = wrapRef.current;
      const text = textRef.current;
      if (!wrap || !text) return;

      const prev = pRef.current;
      pRef.current = p;

      // Word stays pinned at the edu heading position throughout — no movement.
      const { eduX, eduY, eduScale } = cfgRef.current;
      wrap.style.transform = `translate(${eduX}px, ${eduY}px) scale(${eduScale})`;

      // Scramble lifecycle.
      const inScramble  = p > P_SCRAM_START && p < P_SCRAM_END;
      const wasScramble = prev > P_SCRAM_START && prev < P_SCRAM_END;
      if (inScramble && !wasScramble) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = requestAnimationFrame(tick);
      } else if (!inScramble) {
        if (wasScramble) cancelAnimationFrame(rafRef.current);
        text.textContent = p <= P_SCRAM_START ? START : END;
      }
    },
  }));

  return (
    <div
      aria-hidden
      style={{
        position:      "fixed",
        inset:         0,
        zIndex:        300,
        overflow:      "hidden",
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          position:       "relative",
          display:        "flex",
          alignItems:     "center",
          justifyContent: "center",
          width:          "100%",
          height:         "100%",
        }}
      >
        <div ref={wrapRef} style={{ transformOrigin: "center center", opacity: 0 }}>
          <span
            ref={textRef}
            style={{
              display:       "block",
              fontFamily:    "'Fira Code', monospace",
              fontWeight:    700,
              fontSize:      "clamp(60px, 8vw, 110px)",
              letterSpacing: "0.05em",
              color:         "#E82323",
              textShadow:    "0 0 40px rgba(232,35,35,0.6), 0 0 80px rgba(232,35,35,0.25)",
              lineHeight:    1,
              whiteSpace:    "nowrap",
            }}
          >
            {START}
          </span>
        </div>
      </div>
    </div>
  );
}
