import { useEffect, useRef } from "react";
import HomeProwler from "./pages/HomeProwler";
import ProjectsProwler from "./pages/ProjectsProwler";

// Standalone "Playboi Carti x Prowler" aesthetic trial — purple/glitch palette,
// halftone Spider-Verse texture, energy-claw accents. Only reachable via
// ?trial=prowler (see main.tsx) — isolated entirely so there's zero risk to
// the live site.
//
// Wheel-jack mechanic ported from App.tsx's Home<->Education zone: locked
// scroll, a continuously-eased 0->1 progress value driving the transition,
// momentum suppression after lock/unlock, and reverse re-engagement when
// scrolling back up near the boundary. The live site needs an intro/pause/
// outro split because Home's own photo/name/bio get rearranged before
// Education ever rises. This trial only has two pages with nothing to
// rearrange internally, so it collapses to a single eject stage: name fades
// and slides off, photo recedes, Projects rises to take Home's place.
export default function ProwlerTrial() {
  const useWheelJack = useRef(
    typeof window !== "undefined" &&
      window.matchMedia("(pointer: fine)").matches &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ).current;

  const homeWrapRef = useRef<HTMLDivElement>(null);
  const projWrapRef = useRef<HTMLDivElement>(null);
  const photoRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLDivElement>(null);
  const lockedRef = useRef(true);

  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (!useWheelJack) return;
    document.body.style.overflow = "hidden";

    let progress = 0;
    let targetProgress = 0;
    let rafId = 0;
    let wantsAdvance = false;
    let lastScrollY = window.scrollY;
    let suppressUntil = 0;
    const SCROLL_DISTANCE = 900;
    const MAX_TICK_DELTA = 60;
    const EASE = 0.12;
    const MOMENTUM_SUPPRESS_MS = 500;

    const apply = (p: number) => {
      if (nameRef.current) {
        nameRef.current.style.transform = `translateX(${p * 70}%)`;
        nameRef.current.style.opacity = `${1 - p}`;
      }
      if (photoRef.current) {
        photoRef.current.style.transform = `scale(${1 - p * 0.08}) translateY(${-p * 8}%)`;
        photoRef.current.style.opacity = `${1 - p * 0.7}`;
      }
      if (projWrapRef.current) {
        projWrapRef.current.style.transform = `translateY(${(1 - p) * 100}%)`;
      }
    };

    const lock = (seedProgress: number) => {
      lockedRef.current = true;
      progress = seedProgress;
      targetProgress = seedProgress;
      wantsAdvance = false;
      suppressUntil = performance.now() + MOMENTUM_SUPPRESS_MS;
      document.body.style.overflow = "hidden";
      if (homeWrapRef.current) {
        homeWrapRef.current.style.position = "fixed";
        homeWrapRef.current.style.top = "0";
        homeWrapRef.current.style.left = "0";
        homeWrapRef.current.style.width = "100%";
      }
      if (projWrapRef.current) {
        projWrapRef.current.style.position = "fixed";
        projWrapRef.current.style.top = "0";
        projWrapRef.current.style.left = "0";
        projWrapRef.current.style.width = "100%";
      }
      apply(seedProgress);
    };

    const unlock = () => {
      if (!lockedRef.current) return;
      lockedRef.current = false;
      suppressUntil = performance.now() + MOMENTUM_SUPPRESS_MS;
      document.body.style.overflow = "";
      if (homeWrapRef.current) {
        homeWrapRef.current.style.position = "relative";
        homeWrapRef.current.style.top = "";
        homeWrapRef.current.style.left = "";
        homeWrapRef.current.style.width = "";
      }
      if (projWrapRef.current) {
        projWrapRef.current.style.position = "relative";
        projWrapRef.current.style.top = "";
        projWrapRef.current.style.left = "";
        projWrapRef.current.style.width = "";
        projWrapRef.current.style.transform = "";
      }
      // Name/photo stay at their fully-ejected end state — same lesson as the
      // live site's "glimpse of myself" bug: resetting them to neutral here
      // would briefly flash Home fully visible if the scroll listener hasn't
      // caught up yet on reverse re-engagement.
      window.scrollTo({ top: window.innerHeight, left: 0, behavior: "instant" });
      lastScrollY = window.innerHeight;
    };

    const tick = () => {
      const diff = targetProgress - progress;
      if (Math.abs(diff) < 0.001) {
        progress = targetProgress;
        apply(progress);
        rafId = 0;
        if (progress >= 1 && wantsAdvance) unlock();
        return;
      }
      progress += diff * EASE;
      apply(progress);
      if (progress >= 0.999 && wantsAdvance) {
        progress = 1;
        apply(1);
        rafId = 0;
        unlock();
        return;
      }
      rafId = requestAnimationFrame(tick);
    };

    const ensureLoop = () => {
      if (!rafId) rafId = requestAnimationFrame(tick);
    };

    const onWheel = (e: WheelEvent) => {
      if (!lockedRef.current) {
        if (performance.now() < suppressUntil) e.preventDefault();
        return;
      }
      e.preventDefault();
      const delta = Math.max(-MAX_TICK_DELTA, Math.min(MAX_TICK_DELTA, e.deltaY));
      targetProgress = Math.min(1, Math.max(0, targetProgress + delta / SCROLL_DISTANCE));
      wantsAdvance = targetProgress >= 1 && e.deltaY > 0;
      ensureLoop();
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (!lockedRef.current) return;
      if (e.key === "ArrowDown" || e.key === "PageDown" || e.key === " ") {
        e.preventDefault();
        targetProgress = Math.min(1, targetProgress + 0.12);
        wantsAdvance = targetProgress >= 1;
        ensureLoop();
      } else if (e.key === "ArrowUp" || e.key === "PageUp") {
        e.preventDefault();
        targetProgress = Math.max(0, targetProgress - 0.12);
        ensureLoop();
      }
    };

    const onScroll = () => {
      const y = window.scrollY;
      const scrollingUp = y < lastScrollY;
      lastScrollY = y;
      if (!lockedRef.current && scrollingUp && y <= window.innerHeight * 1.15) {
        lock(1);
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
      document.body.style.overflow = "";
    };
  }, [useWheelJack]);

  return (
    <div style={{ backgroundColor: "#000" }}>
      <div
        ref={homeWrapRef}
        className="h-screen overflow-hidden"
        style={useWheelJack ? { position: "fixed", top: 0, left: 0, width: "100%", zIndex: 10 } : { position: "relative", zIndex: 10 }}
      >
        <HomeProwler photoRef={photoRef} nameRef={nameRef} />
      </div>
      <div
        ref={projWrapRef}
        style={
          useWheelJack
            ? { position: "fixed", top: 0, left: 0, width: "100%", transform: "translateY(100%)", backgroundColor: "#000", zIndex: 15 }
            : { position: "relative", backgroundColor: "#000" }
        }
      >
        <ProjectsProwler />
      </div>
    </div>
  );
}
