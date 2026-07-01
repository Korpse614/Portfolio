import { useState, type RefObject } from "react";

interface HomeProwlerProps {
  photoRef?: RefObject<HTMLDivElement | null>;
  nameRef?: RefObject<HTMLDivElement | null>;
}

interface GlitchNameProps {
  text: string;
  fontSize: string;
}

function GlitchName({ text, fontSize }: GlitchNameProps) {
  const base = {
    fontFamily: "'Fira Code', monospace",
    fontWeight: 900 as const,
    fontSize,
    letterSpacing: "0.03em",
    transform: "scaleY(1.16) scaleX(0.96)",
    transformOrigin: "right bottom",
    whiteSpace: "nowrap" as const,
    lineHeight: 0.85,
  };
  return (
    <div className="relative inline-block prowler-flicker">
      <span style={{ ...base, display: "block", color: "#fff" }}>{text}</span>
      <span
        aria-hidden
        className="prowler-rgb-purple"
        style={{ ...base, position: "absolute", inset: 0, color: "#B026FF", mixBlendMode: "screen" }}
      >
        {text}
      </span>
      <span
        aria-hidden
        className="prowler-rgb-red"
        style={{ ...base, position: "absolute", inset: 0, color: "#FF3366", mixBlendMode: "screen" }}
      >
        {text}
      </span>
    </div>
  );
}

export default function HomeProwler({ photoRef, nameRef }: HomeProwlerProps) {
  const [photoFailed, setPhotoFailed] = useState(false);

  return (
    <div className="relative h-screen overflow-hidden" style={{ backgroundColor: "#000" }}>

      {/* Halftone dot screen — Spider-Verse comic texture, kept neutral white so
          purple reads as a surprise in the glitch bursts, not the base palette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          zIndex: 25,
          opacity: 0.4,
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.45) 1px, transparent 1.6px)",
          backgroundSize: "7px 7px",
          mixBlendMode: "screen",
        }}
      />

      {/* Film grain */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          zIndex: 30,
          opacity: 0.08,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.1' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "180px 180px",
        }}
      />

      {/* Scan lines */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          zIndex: 26,
          opacity: 0.16,
          backgroundImage: "repeating-linear-gradient(0deg, rgba(255,255,255,0.5) 0px, transparent 1px, transparent 3px)",
        }}
      />

      {/* Vignette, deep and moody */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ zIndex: 0, background: "radial-gradient(ellipse at center, transparent 26%, rgba(0,0,0,0.94) 100%)" }}
      />

      {/* Red floor energy — base identity is red/black/white, matching the live
          site; purple is reserved for the name's glitch bursts only */}
      <div
        className="absolute bottom-0 left-0 right-0 pointer-events-none prowler-pulse"
        style={{
          zIndex: 1,
          height: "62%",
          background: "radial-gradient(ellipse 78% 65% at 50% 100%, rgba(232,35,35,0.5) 0%, rgba(80,8,8,0.18) 55%, transparent 100%)",
        }}
      />

      {/* Diagonal energy-claw slash */}
      <div
        className="absolute pointer-events-none"
        style={{
          zIndex: 2,
          top: "-10%",
          left: "55%",
          width: "3px",
          height: "130%",
          background: "linear-gradient(to bottom, transparent, rgba(232,35,35,0.55), transparent)",
          transform: "rotate(18deg)",
          filter: "blur(1px)",
        }}
      />
      <div
        className="absolute pointer-events-none"
        style={{
          zIndex: 2,
          top: "-10%",
          left: "60%",
          width: "1.5px",
          height: "130%",
          background: "linear-gradient(to bottom, transparent, rgba(255,255,255,0.35), transparent)",
          transform: "rotate(18deg)",
        }}
      />

      {/* Photo — duotone red, scaled up (matching the live site's identity, not
          a purple tint — purple is reserved for the name's glitch bursts).
          Falls back to a styled initials mark */}
      <div ref={photoRef} className="absolute pointer-events-none" style={{ zIndex: 10, left: 0, top: 0, width: "52%", height: "100%", overflow: "hidden", willChange: "transform, opacity" }}>
        {photoFailed ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <span
              style={{
                fontFamily: "'Fira Code', monospace",
                fontWeight: 900,
                fontSize: "clamp(48px, 10vw, 120px)",
                color: "transparent",
                WebkitTextStroke: "2px rgba(232,35,35,0.5)",
              }}
            >
              SS
            </span>
          </div>
        ) : (
          <>
            <img
              src={`${import.meta.env.BASE_URL}photo.png`}
              alt="Sricharan Sridhar"
              onError={() => setPhotoFailed(true)}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
                objectPosition: "center bottom",
                filter: "grayscale(1) contrast(1.5) brightness(0.85)",
                transform: "scale(1.2)",
                transformOrigin: "center bottom",
                WebkitMaskImage: "linear-gradient(to bottom, black 70%, transparent 96%)",
                maskImage: "linear-gradient(to bottom, black 70%, transparent 96%)",
              }}
            />
            <div style={{ position: "absolute", inset: 0, backgroundColor: "rgba(232,35,35,0.4)", mixBlendMode: "color" }} />
          </>
        )}
      </div>

      {/* Name */}
      <div
        ref={nameRef}
        className="absolute right-0 flex flex-col items-end pr-8 md:pr-16"
        style={{ top: "50%", transform: "translateY(-50%)", zIndex: 20, width: "58%", willChange: "transform, opacity" }}
      >
        <div className="flex items-center gap-3 mb-5">
          <div style={{ height: "1px", width: "40px", backgroundColor: "rgba(232,35,35,0.45)" }} />
          <span style={{ color: "rgba(232,35,35,0.8)", fontFamily: "'Fira Code', monospace", fontSize: "clamp(8px, 0.8vw, 11px)", letterSpacing: "0.5em" }}>
            DEVELOPER · CREATOR
          </span>
        </div>
        <GlitchName text="SRICHARAN" fontSize="clamp(30px, 7.5vw, 135px)" />
        <div style={{ height: "clamp(2px, 0.5vh, 8px)" }} />
        <GlitchName text="SRIDHAR" fontSize="clamp(38px, 9.8vw, 178px)" />

        <p
          className="mt-6 text-right"
          style={{
            color: "rgba(255,255,255,0.45)",
            fontFamily: "'Fira Code', monospace",
            fontSize: "clamp(10px, 1vw, 13px)",
            letterSpacing: "0.06em",
          }}
        >
          Code. Circuits. Car culture.
        </p>
      </div>

      {/* Bottom-left */}
      <div className="absolute bottom-8 left-8" style={{ zIndex: 20 }}>
        <span style={{ color: "rgba(232,35,35,0.5)", fontFamily: "'Fira Code', monospace", fontSize: "10px", letterSpacing: "0.25em" }}>
          CHENNAI · MELBOURNE
        </span>
      </div>

      {/* Bottom-right */}
      <div className="absolute bottom-8 right-8" style={{ zIndex: 20 }}>
        <span style={{ color: "rgba(232,35,35,0.5)", fontFamily: "'Fira Code', monospace", fontSize: "10px", letterSpacing: "0.25em" }}>
          © {new Date().getFullYear()}
        </span>
      </div>
    </div>
  );
}
