import { useState, type RefObject } from "react";

interface HomeProps {
  isDark: boolean;
  photoRef: RefObject<HTMLDivElement | null>;
  nameRef: RefObject<HTMLDivElement | null>;
  bioRef: RefObject<HTMLDivElement | null>;
  dividerRef: RefObject<HTMLDivElement | null>;
  divider2Ref: RefObject<HTMLDivElement | null>;
}

// Glitch name block — base white text with two ghost layers (purple + white)
// that burst on a staggered keyframe loop. Ghosts are opacity:0 except during
// the brief burst window (prowler-rgb-purple / prowler-rgb-white in index.css).
// mix-blend-mode:screen means they brighten whatever's underneath them — keeping
// them at opacity:0 between bursts avoids the permanent letter-edge fringing
// that plagued an earlier constant-opacity version.
function GlitchName({
  text,
  className,
  solid = true,
}: {
  text: string;
  className?: string;
  solid?: boolean;
}) {
  const sharedStyle: React.CSSProperties = {
    fontFamily: "'Fira Code', monospace",
    lineHeight: 0.9,
    letterSpacing: "0.02em",
    whiteSpace: "nowrap",
    display: "block",
    /* Slight red channel offset — mimics a misaligned comic book color plate */
    textShadow: "1.5px 0 rgba(232,35,35,0.3)",
    ...(solid
      ? { color: "#fff" }
      : { color: "transparent", WebkitTextStroke: "1.5px rgba(255,255,255,0.7)" }),
  };
  return (
    <div className={`relative prowler-flicker ${className ?? ""}`}>
      <span style={sharedStyle}>{text}</span>
      {/* Ghost layers — purple + red/pink on staggered burst timers.
          When both fire simultaneously they screen-blend to magenta. */}
      <span
        aria-hidden
        className="prowler-rgb-purple"
        style={{
          ...sharedStyle,
          position: "absolute",
          inset: 0,
          color: "#B026FF",
          WebkitTextStroke: "initial",
          mixBlendMode: "screen",
        }}
      >
        {text}
      </span>
      <span
        aria-hidden
        className="prowler-rgb-red"
        style={{
          ...sharedStyle,
          position: "absolute",
          inset: 0,
          color: "#FF3366",
          WebkitTextStroke: "initial",
          mixBlendMode: "screen",
        }}
      >
        {text}
      </span>
    </div>
  );
}

export default function Home({ photoRef, nameRef, bioRef, dividerRef, divider2Ref }: HomeProps) {
  const [photoFailed, setPhotoFailed] = useState(false);

  return (
    <>
      {/* --- Atmospheric overlays (stronger than the global Layout ones, local to hero) --- */}

      {/* Film grain */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          zIndex: 30,
          opacity: 0.07,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "200px 200px",
        }}
      />

      {/* Edge vignette — deep and moody */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          zIndex: 0,
          background: "radial-gradient(ellipse at center, transparent 26%, rgba(0,0,0,0.92) 100%)",
        }}
      />

      {/* Red floor energy glow */}
      <div
        className="absolute bottom-0 left-0 right-0 pointer-events-none prowler-pulse"
        style={{
          zIndex: 1,
          height: "60%",
          background:
            "radial-gradient(ellipse 70% 65% at 50% 100%, rgba(232,35,35,0.45) 0%, rgba(120,10,10,0.18) 50%, transparent 100%)",
        }}
      />

      {/* Diagonal energy-claw slash — red/white pair like the Prowler suit detail */}
      <div
        className="absolute pointer-events-none"
        style={{
          zIndex: 2,
          top: "-10%",
          left: "55%",
          width: "3px",
          height: "130%",
          background: "linear-gradient(to bottom, transparent, rgba(232,35,35,0.5), transparent)",
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
          background: "linear-gradient(to bottom, transparent, rgba(255,255,255,0.28), transparent)",
          transform: "rotate(18deg)",
        }}
      />

      {/* Speed lines — comic book action-line starburst radiating from behind the
          figure. repeating-conic-gradient gives thin ray lines (0.5° wide every
          6°) emanating from 20% left / 55% top, roughly the subject's center.
          Very low opacity so they read as atmosphere rather than decoration. */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          zIndex: 1,
          opacity: 0.08,
          background:
            "repeating-conic-gradient(from 0deg at 20% 55%, rgba(255,255,255,0.9) 0deg, rgba(255,255,255,0.9) 0.5deg, transparent 0.5deg, transparent 6deg)",
        }}
      />

      {/* CRT ambient scan-bar — occasional horizontal stripe that sweeps the hero */}
      <div
        className="prowler-scanbar fixed pointer-events-none"
        style={{
          zIndex: 25,
          left: 0,
          width: "100%",
          height: "3px",
          background: "linear-gradient(to right, transparent 0%, rgba(176,38,255,0.7) 30%, rgba(232,35,35,0.6) 70%, transparent 100%)",
          filter: "blur(1px)",
        }}
      />

      {/* --- Photo — LEFT column (40%). App.tsx drives fly-up/fade via photoRef. --- */}
      <div className="absolute inset-0 flex flex-col md:flex-row" style={{ zIndex: 2 }}>

        <div className="order-2 md:order-1 w-full md:w-[40%] flex-1 md:flex-none relative overflow-hidden">
          <div
            ref={photoRef}
            className="absolute inset-0"
            style={{ willChange: "transform, opacity" }}
          >
            {photoFailed ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <span
                  style={{
                    fontFamily: "'Fira Code', monospace",
                    fontWeight: 700,
                    fontSize: "clamp(48px, 10vw, 120px)",
                    color: "transparent",
                    WebkitTextStroke: "2px rgba(232,35,35,0.4)",
                  }}
                >
                  SS
                </span>
              </div>
            ) : (
              <>
                {/* Base photo — grayscale/high-contrast, red-tinted */}
                <img
                  src={`${import.meta.env.BASE_URL}photo.png`}
                  alt="Sricharan Sridhar"
                  onError={() => setPhotoFailed(true)}
                  className="absolute inset-0 w-full h-full pointer-events-none"
                  style={{
                    objectFit: "contain",
                    objectPosition: "center bottom",
                    filter: "grayscale(1) contrast(1.5) brightness(0.85)",
                    transform: "scale(1.22)",
                    transformOrigin: "center bottom",
                    WebkitMaskImage: "linear-gradient(to bottom, black 72%, transparent 96%)",
                    maskImage: "linear-gradient(to bottom, black 72%, transparent 96%)",
                  }}
                />
                {/* Red duotone tint */}
                <div style={{ position: "absolute", inset: 0, backgroundColor: "rgba(232,35,35,0.35)", mixBlendMode: "color" }} />
              </>
            )}
          </div>
        </div>

        {/* RIGHT column — name + bio share this space. Name is visible at rest;
            bio slides in from the right as the user scrolls (App.tsx drives both).
            Left-anchored so text grows rightward — avoids the clipping-at-viewport-
            edge bug that plagued right-anchored versions. */}
        <div className="order-1 md:order-2 w-full md:flex-1 relative">

          <div
            ref={nameRef}
            className="absolute inset-0 flex flex-col items-center md:items-start justify-center px-6 md:pl-[95px] pt-14 md:pt-0 select-none"
            style={{ willChange: "transform, opacity" }}
          >
            {/* Role badge */}
            <div className="flex items-center gap-4 mb-5 md:mb-6">
              <div style={{ height: "1px", width: "40px", backgroundColor: "rgba(232,35,35,0.45)" }} />
              <span
                style={{
                  color: "rgba(232,35,35,0.8)",
                  fontFamily: "'Fira Code', monospace",
                  fontSize: "clamp(8px, 0.8vw, 11px)",
                  letterSpacing: "0.4em",
                }}
              >
                DEVELOPER · CREATOR
              </span>
            </div>

            {/* SRICHARAN — glitch ghost layers */}
            <GlitchName
              text="SRICHARAN"
              solid
              className="font-bold uppercase text-[clamp(28px,11.5vw,58px)] md:text-[clamp(30px,6.8vw,125px)]"
            />
            <div style={{ height: "clamp(4px, 1vh, 14px)" }} />
            {/* SRIDHAR — outline treatment + glitch ghosts */}
            <GlitchName
              text="SRIDHAR"
              solid={false}
              className="font-bold uppercase text-[clamp(34px,14.5vw,74px)] md:text-[clamp(36px,8.8vw,165px)]"
            />

            <p
              className="mt-5 md:mt-7 text-center md:text-left"
              style={{
                color: "rgba(255,255,255,0.3)",
                fontFamily: "'Fira Code', monospace",
                fontSize: "clamp(10px, 1vw, 13px)",
                letterSpacing: "0.08em",
              }}
            >
              Code. Circuits. Car culture.
            </p>
          </div>

          {/* About-me paragraph — starts off-screen right, slides in during intro,
              then ejects right again during outro. App.tsx drives via bioRef. */}
          <div
            ref={bioRef}
            className="absolute inset-0 flex items-center pl-10 md:pl-[314px] pr-6 md:pr-10 pointer-events-none"
            style={{ transform: "translateX(120%)", opacity: 0, willChange: "transform, opacity" }}
          >
            <p
              style={{
                color: "rgba(255,255,255,0.55)",
                fontFamily: "'Antic', sans-serif",
                fontSize: "clamp(12px, 1.3vw, 16px)",
                lineHeight: 1.6,
                maxWidth: "420px",
              }}
            >
              I'm studying Engineering at Monash University, splitting time
              between code, home lab projects, and car culture. Cars have been
              a long running passion of mine, from documenting builds to just
              appreciating good design. I like building things that work, then
              making them look like they were meant to.
            </p>
          </div>

        </div>
      </div>

      {/* Vertical divider — photo/name boundary. Fades out while scrolling
          (App.tsx drives via dividerRef). */}
      <div
        ref={dividerRef}
        className="hidden md:block absolute pointer-events-none"
        style={{
          left: "40%",
          top: "18%",
          height: "64%",
          width: "2px",
          backgroundColor: "rgba(232,35,35,0.55)",
          zIndex: 3,
          willChange: "opacity",
        }}
      />

      {/* Corner labels */}
      <div className="absolute bottom-4 md:bottom-8 left-4 md:left-8" style={{ zIndex: 20 }}>
        <span
          style={{
            color: "rgba(232,35,35,0.45)",
            fontFamily: "'Fira Code', monospace",
            fontSize: "9px",
            letterSpacing: "0.25em",
          }}
        >
          CHENNAI · MELBOURNE
        </span>
      </div>
      <div className="absolute bottom-4 md:bottom-8 right-4 md:right-8" style={{ zIndex: 20 }}>
        <span
          style={{
            color: "rgba(255,255,255,0.15)",
            fontFamily: "'Fira Code', monospace",
            fontSize: "9px",
            letterSpacing: "0.2em",
          }}
        >
          © {new Date().getFullYear()}
        </span>
      </div>
    </>
  );
}
