import React from "react";

interface LayoutProps {
  children: React.ReactNode;
  isDark: boolean;
  scrollTo: (id: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "#000", color: "#fff" }}>
      {/* Global ambient texture — sits above all sections via z-index but never
          blocks interaction (pointer-events-none). Opacity is intentionally low
          so it reads as texture/grain rather than pattern. Home adds heavier
          per-section overlays on top of this for the hero. */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          zIndex: 500,
          opacity: 0.09,
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.5) 1px, transparent 1.6px)",
          backgroundSize: "7px 7px",
          mixBlendMode: "screen",
        }}
      />
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          zIndex: 501,
          opacity: 0.055,
          backgroundImage: "repeating-linear-gradient(0deg, rgba(255,255,255,0.6) 0px, transparent 1px, transparent 3px)",
        }}
      />
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          zIndex: 502,
          opacity: 0.035,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "200px 200px",
        }}
      />
      <main>{children}</main>
    </div>
  );
};

export default Layout;
