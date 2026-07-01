import { useImperativeHandle, useRef, type Ref } from "react";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&*<>/|{}[]:;=+~^";
const TITLE = "PROJECTS";
const SUB   = "WEB DEV  ·  HOME LAB  ·  CREATIVE";

export interface ScrambleHandle {
  show: () => void;
}

export default function ScrambleTransition({ ref }: { ref?: Ref<ScrambleHandle> }) {
  const rootRef  = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLSpanElement>(null);
  const subRef   = useRef<HTMLSpanElement>(null);
  const bgRef    = useRef<HTMLPreElement>(null);
  const rafRef   = useRef(0);

  const rnd = () => CHARS[Math.floor(Math.random() * CHARS.length)];

  const scramble = (target: string, p: number) =>
    target.split("").map((ch, i) => {
      if (ch === " " || ch === "·") return ch;
      return i / target.length < p ? ch : rnd();
    }).join("");

  const buildBg = () => {
    const cols = 90, rows = 28;
    return Array.from({ length: rows }, () =>
      Array.from({ length: cols }, () => Math.random() > 0.68 ? rnd() : " ").join("")
    ).join("\n");
  };

  useImperativeHandle(ref, () => ({
    show() {
      const root = rootRef.current;
      if (!root) return;

      if (titleRef.current) titleRef.current.textContent = scramble(TITLE, 0);
      if (subRef.current)   subRef.current.textContent   = scramble(SUB, 0);
      if (bgRef.current)    bgRef.current.textContent    = buildBg();

      root.style.transition = "opacity 0.15s ease";
      root.style.opacity    = "1";

      const start    = performance.now();
      const DURATION = 1400;
      const HOLD     = 350;
      const FADE_MS  = 400;

      cancelAnimationFrame(rafRef.current);

      const tick = (now: number) => {
        const elapsed = now - start;
        const p = Math.min(1, elapsed / DURATION);

        if (titleRef.current) {
          titleRef.current.textContent = scramble(TITLE, p);
        }
        if (subRef.current) {
          const subP = Math.max(0, Math.min(1, (elapsed - 350) / (DURATION - 350)));
          subRef.current.textContent = scramble(SUB, subP);
        }
        if (bgRef.current) {
          bgRef.current.textContent = buildBg();
        }

        if (elapsed < DURATION + HOLD) {
          rafRef.current = requestAnimationFrame(tick);
        } else {
          root.style.transition = `opacity ${FADE_MS}ms ease`;
          root.style.opacity    = "0";
        }
      };

      rafRef.current = requestAnimationFrame(tick);
    },
  }));

  return (
    <div
      ref={rootRef}
      aria-hidden
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 200,
        backgroundColor: "#000",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        opacity: 0,
        pointerEvents: "none",
      }}
    >
      <pre
        ref={bgRef}
        style={{
          position: "absolute",
          inset: 0,
          margin: 0,
          padding: "2rem",
          color: "rgba(232,35,35,0.055)",
          fontFamily: "'Fira Code', monospace",
          fontSize: "13px",
          lineHeight: 1.55,
          userSelect: "none",
          overflow: "hidden",
          whiteSpace: "pre",
        }}
      />

      <div style={{ position: "relative", zIndex: 2, textAlign: "center" }}>
        <div
          style={{
            color: "rgba(232,35,35,0.35)",
            fontFamily: "'Fira Code', monospace",
            fontSize: "11px",
            letterSpacing: "0.45em",
            marginBottom: "2rem",
          }}
        >
          // ACCESSING PROJECTS
        </div>

        <div
          style={{
            fontFamily: "'Fira Code', monospace",
            fontWeight: 700,
            fontSize: "clamp(52px, 10vw, 130px)",
            letterSpacing: "0.05em",
            color: "#E82323",
            textShadow: "0 0 30px rgba(232,35,35,0.55), 0 0 70px rgba(232,35,35,0.2)",
            lineHeight: 1,
          }}
        >
          <span ref={titleRef}>{TITLE}</span>
        </div>

        <div
          style={{
            fontFamily: "'Fira Code', monospace",
            fontSize: "clamp(11px, 1.1vw, 14px)",
            letterSpacing: "0.35em",
            color: "rgba(176,38,255,0.6)",
            marginTop: "1.5rem",
          }}
        >
          <span ref={subRef}>{SUB}</span>
        </div>
      </div>
    </div>
  );
}
