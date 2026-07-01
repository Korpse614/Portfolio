import { useEffect, useRef } from "react";
import Layout from "./components/ui/Layout";
import Home from "./pages/Home";
import Education from "./pages/Education";
import Projects from "./pages/Projects";
import KeyLearnings from "./pages/KeyLearnings";
import Contact from "./pages/Contact";

type SectionKey = "home" | "education" | "projects" | "arsenal" | "contact";

const isDark = true;

function App() {
  // Wheel-jacking only makes sense on a device with an actual wheel/trackpad —
  // touch-scrolling doesn't fire `wheel` events, so locking body scroll on a
  // touch device would just strand the user on Home with no way to proceed.
  // Reduced-motion users also skip it, same reasoning as before.
  const useWheelJack = useRef(
    typeof window !== "undefined" &&
      window.matchMedia("(pointer: fine)").matches &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ).current;

  const refs = useRef<Record<SectionKey, HTMLElement | null>>({
    home: null,
    education: null,
    projects: null,
    arsenal: null,
    contact: null,
  });
  const heroWrapRef = useRef<HTMLDivElement>(null);
  const eduWrapRef = useRef<HTMLDivElement>(null);
  const photoRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLDivElement>(null);
  const bioRef = useRef<HTMLDivElement>(null);
  const dividerRef = useRef<HTMLDivElement>(null);
  const divider2Ref = useRef<HTMLDivElement>(null);
  const lockedRef      = useRef(true);
  const unlockRef      = useRef<() => void>(() => {});
  const eduHeadingRef  = useRef<HTMLDivElement>(null);
  const eduScramblerRef = useRef<HTMLSpanElement>(null);
  const eduContentRef  = useRef<HTMLDivElement>(null);
  const projContentRef  = useRef<HTMLDivElement>(null);
  const projHeadingRef  = useRef<HTMLDivElement>(null);
  // Root-level overlay span — lives OUTSIDE every section so no parent opacity
  // or prowler-flicker animation can affect it during the zoom transition.
  const overlaySpanRef  = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);

    // The browser's native scroll restoration remembers the last scroll
    // position across reloads — after testing by scrolling down repeatedly,
    // a reload would restore that position. But the wheel-jack state always
    // assumes a fresh start (zone locked, scrollY=0, Home pinned via
    // position:fixed) — if the browser instead jumps scrollY elsewhere while
    // that assumption still holds, Home's fixed overlay ends up pinned on top
    // of whatever's normally sitting at the restored scroll position. Forcing
    // manual restoration + scrolling to top on mount guarantees the page
    // always starts in the state the JS actually expects.
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    window.scrollTo(0, 0);
  }, []);

  // True scroll-jacking for the Home intro, split into two sequenced phases:
  //
  //   PHASE "intro": name slides right and fades, photo recedes.
  //   PHASE "paused": 1s hard window — eye gets a beat before Education rises.
  //   PHASE "outro": Education rises to fill the screen, then unlocks.
  //
  // Each phase eases toward its target via continuous rAF (progress +=
  // (target-progress)*EASE) so wheel input never snaps the value.
  useEffect(() => {
    if (!useWheelJack) return;
    document.body.style.overflow = "hidden";

    type Stage = "intro" | "paused" | "outro";
    let stage: Stage = "intro";
    let progress = 0;
    let targetProgress = 0;
    let rafId = 0;
    let wantsAdvance = false;
    let lastScrollY = window.scrollY;
    let suppressUntil = 0;
    let pauseTimer = 0;
    const EASE = 0.055;               // slow, cinematic easing (~700 ms per step)
    const MOMENTUM_SUPPRESS_MS = 350; // extra buffer after each step completes
    const PAUSE_MS = 800;

    const applyIntro = (p: number) => {
      if (photoRef.current) {
        photoRef.current.style.transform = `translateY(${-p * 100}%)`;
        photoRef.current.style.opacity = `${1 - p}`;
      }
      if (nameRef.current) {
        nameRef.current.style.transform = `translateX(${-p * (200 / 3)}%)`;
      }
      if (bioRef.current) {
        bioRef.current.style.transform = `translateX(${120 - p * 120}%)`;
        bioRef.current.style.opacity = `${p}`;
      }
      if (dividerRef.current) {
        dividerRef.current.style.opacity = `${Math.max(0, 1 - p * 2.5)}`;
      }
      if (divider2Ref.current) {
        divider2Ref.current.style.opacity = `${Math.max(0, (p - 0.7) / 0.3)}`;
      }
    };

    const applyOutro = (p: number) => {
      if (nameRef.current) {
        nameRef.current.style.transform = `translateX(${-(200 / 3) - p * 80}%)`;
        nameRef.current.style.opacity = `${1 - p}`;
      }
      if (bioRef.current) {
        bioRef.current.style.transform = `translateX(${p * 60}%)`;
        bioRef.current.style.opacity = `${1 - p}`;
      }
      if (divider2Ref.current) {
        divider2Ref.current.style.opacity = `${Math.max(0, 1 - p / 0.3)}`;
      }
      if (eduWrapRef.current) {
        eduWrapRef.current.style.transform = `translateY(${(1 - p) * 100}%)`;
      }
    };

    const apply = (p: number) => {
      if (stage === "intro") applyIntro(p);
      else if (stage === "outro") applyOutro(p);
    };

    const enterOutro = () => {
      stage = "outro";
      progress = 0;
      targetProgress = 0;
      wantsAdvance = false;
      applyOutro(0);
    };

    const enterPause = () => {
      stage = "paused";
      window.clearTimeout(pauseTimer);
      pauseTimer = window.setTimeout(enterOutro, PAUSE_MS);
    };

    const tick = () => {
      const diff = targetProgress - progress;
      if (Math.abs(diff) < 0.001) {
        progress = targetProgress;
        apply(progress);
        rafId = 0;
        // Brief suppress to kill trackpad momentum before accepting next step.
        suppressUntil = performance.now() + MOMENTUM_SUPPRESS_MS;
        if (progress >= 1 && wantsAdvance) {
          if (stage === "intro") enterPause();
          else if (stage === "outro") unlock();
        } else if (progress <= 0 && stage === "outro") {
          // Outro reversed to zero → auto-chain into intro reverse so photo comes back
          // without requiring an extra scroll.
          stage = "intro"; progress = 1; targetProgress = 0;
          applyIntro(1);
          suppressUntil = 0;
          ensureLoop();
        }
        return;
      }
      progress += diff * EASE;
      apply(progress);
      if (progress >= 0.999 && wantsAdvance) {
        progress = 1;
        apply(1);
        rafId = 0;
        suppressUntil = performance.now() + MOMENTUM_SUPPRESS_MS;
        if (stage === "intro") enterPause();
        else if (stage === "outro") unlock();
        return;
      }
      rafId = requestAnimationFrame(tick);
    };

    const ensureLoop = () => {
      if (!rafId) rafId = requestAnimationFrame(tick);
    };

    const lock = (seedStage: Stage, seedProgress: number) => {
      lockedRef.current = true;
      stage = seedStage;
      progress = seedProgress;
      targetProgress = seedProgress;
      wantsAdvance = false;
      window.clearTimeout(pauseTimer);
      suppressUntil = performance.now() + MOMENTUM_SUPPRESS_MS;
      document.body.style.overflow = "hidden";
      if (heroWrapRef.current) {
        heroWrapRef.current.style.position = "fixed";
        heroWrapRef.current.style.top = "0";
        heroWrapRef.current.style.left = "0";
        heroWrapRef.current.style.width = "100%";
      }
      if (eduWrapRef.current) {
        eduWrapRef.current.style.position = "fixed";
        eduWrapRef.current.style.top = "0";
        eduWrapRef.current.style.left = "0";
        eduWrapRef.current.style.width = "100%";
      }
      apply(seedProgress);
    };

    const unlock = () => {
      if (!lockedRef.current) return;
      lockedRef.current = false;
      suppressUntil = performance.now() + MOMENTUM_SUPPRESS_MS;
      document.body.style.overflow = "";

      if (heroWrapRef.current) {
        heroWrapRef.current.style.position = "relative";
        heroWrapRef.current.style.top = "";
        heroWrapRef.current.style.left = "";
        heroWrapRef.current.style.width = "";
      }
      if (eduWrapRef.current) {
        eduWrapRef.current.style.position = "relative";
        eduWrapRef.current.style.top = "";
        eduWrapRef.current.style.left = "";
        eduWrapRef.current.style.width = "";
        eduWrapRef.current.style.transform = "";
      }
      // Deliberately NOT resetting photo/name/bio here. They're already sitting
      // at their fully-ejected, invisible end state from applyIntro(1)/applyOutro(1)
      // — that's correct and should stay. Resetting them to "" (neutral, fully
      // visible) was the bug: when the user scrolls back up near the boundary,
      // lock() re-pins heroWrap to position:fixed at the top, and for however many
      // frames it takes the scroll listener to catch up, the photo would be sitting
      // there fully visible and untransformed. That's the "glimpse of myself" —
      // resetting to neutral assumed Home would always be safely scrolled off-screen,
      // which isn't true once reverse re-locking is in play.

      // Jump the real scroll position to exactly where Education's normal in-flow
      // position now sits (one viewport down) — instant, not smooth, so it lines
      // up with zero visible jump against what was already on screen.
      window.scrollTo({ top: window.innerHeight, left: 0, behavior: "instant" });
      lastScrollY = window.innerHeight;
    };

    unlockRef.current = () => {
      // Forced unlock (e.g. nav click) — skip straight through any remaining
      // phase/pause to the fully-revealed end state.
      window.clearTimeout(pauseTimer);
      stage = "outro";
      applyOutro(1);
      unlock();
    };

    // ─── Zoom transition (Education → Projects) ──────────────────────────────
    // Step-based: one wheel event = one discrete stage.
    //   step 0 (p=0)    initial state
    //   step 1 (p=0.33) card exited, word pinned
    //   step 2 (p=0.67) word scrambled to PROJECTS
    //   step 3 (p=1)    projects content slid in
    const ZOOM_STEPS: number[]   = [0, 0.33, 0.67, 1];
    let zoomStep                 = 0;
    let zoomLocked               = false;
    let zoomProgress             = 0;
    let zoomTarget               = 0;
    let zoomRafId                = 0;
    let zoomScrolledToProjects   = false;

    // Scramble constants
    const SCRAM_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*<>[]";
    const SCRAM_START = "EDUCATION";
    const SCRAM_END   = "PROJECTS";
    const P_SCRAM_S   = 0.33;
    const P_SCRAM_E   = 0.67;
    const P_SCRAM_M   = 0.50;
    const scrnd = () => SCRAM_CHARS[Math.floor(Math.random() * SCRAM_CHARS.length)];

    const ss3 = (t: number) => t * t * (3 - 2 * t);

    const applyZoomTransforms = (p: number) => {
      // Phase 1 — edu card slides out left (p 0→0.33)
      const p1 = Math.min(1, Math.max(0, p / 0.33));
      if (eduContentRef.current) {
        eduContentRef.current.style.transform = `translateX(calc(-${ss3(p1) * 110}vw))`;
      }

      // Phase 2 — scramble in-place: EDUCATION → PROJECTS (p 0.33→0.67)
      const span = eduScramblerRef.current;
      if (span) {
        if (p > P_SCRAM_S && p < P_SCRAM_E) {
          let out = "";
          if (p < P_SCRAM_M) {
            const broken = Math.min(SCRAM_START.length, Math.floor((p - P_SCRAM_S) / (P_SCRAM_M - P_SCRAM_S) * SCRAM_START.length));
            for (let i = 0; i < SCRAM_START.length; i++) out += i < broken ? scrnd() : SCRAM_START[i];
          } else {
            const resolved = Math.min(SCRAM_END.length, Math.floor((p - P_SCRAM_M) / (P_SCRAM_E - P_SCRAM_M) * SCRAM_END.length));
            for (let i = 0; i < SCRAM_END.length; i++) out += i < resolved ? SCRAM_END[i] : scrnd();
          }
          span.textContent = out;
        } else {
          span.textContent = p <= P_SCRAM_S ? SCRAM_START : SCRAM_END;
        }
      }

      // Phase 3 — eduWrap cross-fades out, projHeading cross-fades in, proj content flies in (p 0.67→1).
      // The scroll snap is invisible because eduWrap is still fully opaque at p=0.67 (ss3(0)=0).
      const p3 = Math.min(1, Math.max(0, (p - 0.67) / 0.33));
      if (eduWrapRef.current) {
        eduWrapRef.current.style.opacity = `${1 - ss3(p3)}`;
      }
      // Cross-fade the Projects heading in at the same position as the scramble span
      if (projHeadingRef.current) {
        projHeadingRef.current.style.opacity = `${ss3(p3)}`;
      }
      if (projContentRef.current) {
        projContentRef.current.style.transform = `translateX(calc(-${(1 - ss3(p3)) * 110}vw))`;
      }

      if (p >= 0.67 && !zoomScrolledToProjects) {
        zoomScrolledToProjects = true;
        window.scrollTo({ top: window.innerHeight * 2, left: 0, behavior: "instant" });
        lastScrollY = window.innerHeight * 2;
      } else if (p < 0.67 && zoomScrolledToProjects) {
        zoomScrolledToProjects = false;
        window.scrollTo({ top: window.innerHeight, left: 0, behavior: "instant" });
        lastScrollY = window.innerHeight;
      }
    };

    const zoomTick = () => {
      const diff = zoomTarget - zoomProgress;
      if (Math.abs(diff) < 0.001) {
        zoomProgress = zoomTarget;
        /* no overlay */
        applyZoomTransforms(zoomProgress);
        zoomRafId = 0;
        if (zoomProgress >= 1)  { unlockFromZoom(true);  return; }
        if (zoomProgress <= 0)  { unlockFromZoom(false); return; }
        return;
      }
      zoomProgress += diff * EASE;
      /* no overlay */
      applyZoomTransforms(zoomProgress);
      if (zoomProgress >= 0.999 && zoomTarget >= 1) {
        zoomProgress = 1;
        /* no overlay */
        applyZoomTransforms(1);
        zoomRafId = 0;
        unlockFromZoom(true);
        return;
      }
      if (zoomProgress <= 0.001 && zoomTarget <= 0) {
        zoomProgress = 0;
        /* no overlay */
        applyZoomTransforms(0);
        zoomRafId = 0;
        unlockFromZoom(false);
        return;
      }
      zoomRafId = requestAnimationFrame(zoomTick);
    };

    const ensureZoomLoop = () => {
      if (!zoomRafId) zoomRafId = requestAnimationFrame(zoomTick);
    };

    const lockZoom = (initialP: number) => {
      zoomLocked             = true;
      zoomProgress           = initialP;
      zoomTarget             = initialP;
      zoomScrolledToProjects = initialP >= 0.67;
      zoomStep = ZOOM_STEPS.reduce((best, p, i) =>
        Math.abs(p - initialP) < Math.abs(ZOOM_STEPS[best] - initialP) ? i : best, 0);
      if (zoomRafId) { cancelAnimationFrame(zoomRafId); zoomRafId = 0; }
      document.body.style.overflow = "hidden";
      suppressUntil = performance.now() + MOMENTUM_SUPPRESS_MS;
      const anchor = initialP >= 0.5 ? window.innerHeight * 2 : window.innerHeight;
      window.scrollTo({ top: anchor, left: 0, behavior: "instant" });
      lastScrollY = anchor;

      // 1. Pin eduWrap as a fixed overlay over the viewport.
      if (eduWrapRef.current) {
        eduWrapRef.current.style.position = "fixed";
        eduWrapRef.current.style.top      = "0";
        eduWrapRef.current.style.left     = "0";
        eduWrapRef.current.style.width    = "100%";
        eduWrapRef.current.style.opacity  = initialP >= 0.67 ? "0" : "1";
      }

      // 2. Kill prowler-flicker on the Education heading (its opacity animation
      //    overrides inline styles in the CSS cascade), then hide BlurText and
      //    show the in-place scramble span. Both live in the same div so they
      //    are pixel-perfect with zero measurement error.
      if (eduHeadingRef.current) eduHeadingRef.current.style.animation = "none";
      const blurP = eduHeadingRef.current?.querySelector('p');
      if (blurP) (blurP as HTMLElement).style.opacity = "0";
      const span = eduScramblerRef.current;
      if (span) {
        span.textContent   = initialP <= P_SCRAM_S ? SCRAM_START : SCRAM_END;
        span.style.opacity = "1";
      }

      // 3. Kill prowler-flicker on the Projects heading and hide it.
      //    applyZoomTransforms cross-fades it in during phase 3.
      if (projHeadingRef.current) {
        projHeadingRef.current.style.animation = "none";
        projHeadingRef.current.style.opacity   = "0";
      }

      applyZoomTransforms(initialP);
    };

    const unlockFromZoom = (forward: boolean) => {
      if (!zoomLocked) return;
      zoomLocked = false;
      if (zoomRafId) { cancelAnimationFrame(zoomRafId); zoomRafId = 0; }
      suppressUntil = performance.now() + MOMENTUM_SUPPRESS_MS;

      // Hide scramble span, restore BlurText, restore Education heading animation.
      if (eduScramblerRef.current) eduScramblerRef.current.style.opacity = "0";
      const blurP = eduHeadingRef.current?.querySelector('p');
      if (blurP) (blurP as HTMLElement).style.opacity = "";
      if (eduHeadingRef.current) eduHeadingRef.current.style.animation = "";

      // Restore Projects heading animation (opacity is already set by phase-3 cross-fade).
      if (projHeadingRef.current) {
        projHeadingRef.current.style.animation = "";
        projHeadingRef.current.style.opacity   = "";
      }

      // Clean up slide transforms.
      if (eduContentRef.current)  eduContentRef.current.style.transform  = "";
      if (projContentRef.current) projContentRef.current.style.transform = "";
      zoomScrolledToProjects = false;

      if (forward) {
        zoomProgress = 1; zoomTarget = 1;
        // Restore eduWrap to normal flow and clear the zoom-specific fixed overlay.
        if (eduWrapRef.current) {
          eduWrapRef.current.style.position = "relative";
          eduWrapRef.current.style.top      = "";
          eduWrapRef.current.style.left     = "";
          eduWrapRef.current.style.width    = "";
          eduWrapRef.current.style.opacity  = "";
        }
        document.body.style.overflow = "";
        window.scrollTo({ top: window.innerHeight * 2, left: 0, behavior: "instant" });
        lastScrollY = window.innerHeight * 2;
      } else {
        zoomProgress = 0; zoomTarget = 0;
        // eduWrap stays fixed — lock("outro", 1) will re-own it immediately.
        if (eduWrapRef.current) {
          eduWrapRef.current.style.opacity = "";
        }
        window.scrollTo({ top: window.innerHeight, left: 0, behavior: "instant" });
        lastScrollY = window.innerHeight;
        lock("outro", 1);
      }
    };
    // ─────────────────────────────────────────────────────────────────────────

    const onWheel = (e: WheelEvent) => {
      if (zoomLocked) {
        e.preventDefault();
        // Block while current step is still animating OR during momentum bleed.
        if (zoomRafId > 0 || performance.now() < suppressUntil) return;
        const dir     = e.deltaY > 0 ? 1 : -1;
        const newStep = Math.max(0, Math.min(ZOOM_STEPS.length - 1, zoomStep + dir));
        if (newStep !== zoomStep) {
          zoomStep    = newStep;
          zoomTarget  = ZOOM_STEPS[newStep];
          suppressUntil = performance.now() + MOMENTUM_SUPPRESS_MS;
          ensureZoomLoop();
        }
        return;
      }
      if (!lockedRef.current) {
        // Residual momentum from the gesture that just completed the sequence —
        // swallow it so the swap hard-stops instead of bleeding into normal scroll.
        if (performance.now() < suppressUntil) e.preventDefault();
        return;
      }
      e.preventDefault();
      if (stage === "paused") return;
      // Block while current step is still animating OR during momentum bleed.
      if (rafId > 0 || performance.now() < suppressUntil) return;
      suppressUntil = performance.now() + MOMENTUM_SUPPRESS_MS;
      if (e.deltaY > 0) {
        targetProgress = 1;
        wantsAdvance = true;
      } else {
        if (targetProgress > 0) {
          targetProgress = 0;
          wantsAdvance = false;
        } else if (stage === "outro") {
          stage = "intro"; progress = 1; targetProgress = 0;
          wantsAdvance = false; applyIntro(1);
        }
      }
      ensureLoop();
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (!lockedRef.current || stage === "paused") return;
      if (e.key === "ArrowDown" || e.key === "PageDown" || e.key === " ") {
        e.preventDefault();
        targetProgress = Math.min(1, targetProgress + 0.12);
        wantsAdvance = targetProgress >= 1;
        ensureLoop();
      } else if (e.key === "ArrowUp" || e.key === "PageUp") {
        e.preventDefault();
        targetProgress = Math.max(0, targetProgress - 0.12);
        wantsAdvance = false;
        ensureLoop();
      }
    };

    // Once fully unlocked, normal scrolling takes over for the rest of the page.
    // If the user scrolls back UP near the Home/Education boundary, re-engage
    // the lock seeded at the end of "outro" (matching what was already fully
    // visible) so continued upward wheel input smoothly reverses the sequence.
    const onScroll = () => {
      const y = window.scrollY;
      const scrollingUp = y < lastScrollY;
      lastScrollY = y;

      if (lockedRef.current || zoomLocked) return;

      // Re-engage Education outro when scrolling back up near boundary
      if (scrollingUp && y <= window.innerHeight * 1.15) {
        lock("outro", 1);
        window.scrollTo({ top: window.innerHeight, left: 0, behavior: "instant" });
        lastScrollY = window.innerHeight;
        return;
      }
      // Engage zoom when scrolling down into Projects area
      if (!scrollingUp && y > window.innerHeight && y < window.innerHeight * 1.5) {
        lockZoom(0);
        return;
      }
      // Re-engage zoom when scrolling back up from Projects
      if (scrollingUp && y >= window.innerHeight * 1.5 && y < window.innerHeight * 2.05) {
        lockZoom(1);
      }
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("scroll", onScroll);
      if (rafId) cancelAnimationFrame(rafId);
      if (zoomRafId) cancelAnimationFrame(zoomRafId);
      window.clearTimeout(pauseTimer);
      document.body.style.overflow = "";
    };
  }, [useWheelJack]);

  const scrollTo = (id: string) => {
    // If a nav link is clicked while still locked, force the swap to complete
    // first (so the page is actually scrollable), then continue to the target.
    if (useWheelJack && lockedRef.current && id !== "home") {
      unlockRef.current();
      requestAnimationFrame(() => {
        refs.current[id as SectionKey]?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
      return;
    }
    refs.current[id as SectionKey]?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <Layout isDark={isDark} scrollTo={scrollTo}>
      <section ref={(el) => { refs.current.home = el; }} style={{ position: "relative", minHeight: "100vh" }}>
        <div
          ref={heroWrapRef}
          className="h-screen overflow-hidden"
          style={
            useWheelJack
              ? { position: "fixed", top: 0, left: 0, width: "100%", zIndex: 10, backgroundColor: "#000" }
              : { position: "relative", zIndex: 10, backgroundColor: "#000" }
          }
        >
          <Home isDark={isDark} photoRef={photoRef} nameRef={nameRef} bioRef={bioRef} dividerRef={dividerRef} divider2Ref={divider2Ref} />
        </div>
      </section>

      <section ref={(el) => { refs.current.education = el; }} style={{ position: "relative", zIndex: 15, minHeight: "100vh" }}>
        <div
          ref={eduWrapRef}
          className="h-screen overflow-hidden"
          style={
            useWheelJack
              ? { position: "fixed", top: 0, left: 0, width: "100%", transform: "translateY(100%)", backgroundColor: "hsl(0 0% 0%)" }
              : { position: "relative", backgroundColor: "hsl(0 0% 0%)" }
          }
        >
          <Education isDark={isDark} headingRef={eduHeadingRef} scrambleRef={eduScramblerRef} contentRef={eduContentRef} />
        </div>
      </section>

      <section ref={(el) => { refs.current.projects = el; }} style={{ minHeight: "100vh" }}>
        <Projects isDark={isDark} headingRef={projHeadingRef} contentRef={projContentRef} />
      </section>
      <section ref={(el) => { refs.current.arsenal = el; }} style={{ minHeight: "100vh" }}>
        <KeyLearnings isDark={isDark} />
      </section>
      <section ref={(el) => { refs.current.contact = el; }} style={{ minHeight: "100vh" }}>
        <Contact isDark={isDark} />
      </section>

      {/* Root-level scramble overlay — sits outside every section so prowler-flicker
          opacity and eduWrapRef phase-3 fade can never affect it. Position is set
          dynamically in lockZoom after fixing eduWrapRef to the viewport. */}
      <span
        ref={overlaySpanRef}
        aria-hidden
        className="font-bold text-[48px] sm:text-[64px] md:text-[80px] tracking-tighter uppercase"
        style={{
          position:      "fixed",
          display:       "block",
          opacity:       0,
          pointerEvents: "none",
          color:         "#E82323",
          fontFamily:    "'Fira Code', monospace",
          lineHeight:    1,
          whiteSpace:    "nowrap",
          zIndex:        1000,
          textShadow:    "0 0 18px rgba(232,35,35,0.9), 0 0 40px rgba(232,35,35,0.5)",
        }}
      >
        EDUCATION
      </span>
    </Layout>
  );
}

export default App;
