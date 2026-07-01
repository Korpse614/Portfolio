import { useState } from "react";
import { Mail } from "lucide-react";
import BlurText from "../components/ui/BlurText";

const HEX_STREAM = [
  "3A F2 01 CC 8E 44 BB 10 97 D3 5F 24 A1 7B 6C 09 FF 38 C4 72",
  "1D 8A 55 E7 29 4B 90 63 17 AA D8 2F 6E B5 41 C9 03 7D F1 58",
  "E3 0C 84 2B 96 5A 11 D4 7F 3E BC 68 A9 22 4F 81 C7 35 09 F6",
  "52 BD 1A 77 E0 43 9C 28 B1 64 08 D7 5B 3F C2 8D 16 A0 71 EE",
  "4C 93 20 6B F8 37 D1 5E 0A 88 C5 4A 19 72 BF 2E 9F 61 D6 33",
  "A7 14 5C 87 2A E9 06 7C B3 40 FC 1E 6D 95 31 CB 78 04 E5 50",
  "8B 47 C0 1F 69 B8 3A 90 D2 55 0E 7A F3 28 C4 66 1C A3 4D 82",
  "23 DC 59 11 8F 42 B6 7E 3D C8 05 91 6A 2C FE 48 9D 01 74 BD",
  "CF 36 A8 53 1B 6F E2 0D 85 C1 4E 97 30 BB 67 F9 22 5D 8E 43",
  "70 AC 19 E6 3C 8A 57 02 CB 4F B0 24 6C D9 1A 7F 38 95 C6 4B",
  "FA 0B 62 2E A5 50 17 D4 83 3B 9E 6B 04 C3 71 28 B9 5F 13 E8",
  "46 D0 8C 39 1D 75 BB 02 EA 57 C9 3F 86 14 6E A0 4C 92 25 DB",
].join("\n");


interface ContactProps {
  isDark: boolean;
}

const contacts = [
  {
    icon: Mail,
    label: "Email",
    value: "ssricharan2510@gmail.com",
    href: "mailto:ssricharan2510@gmail.com",
  },
];

export default function Contact({ isDark }: ContactProps) {
  const [activeIdx, setActiveIdx] = useState<number | null>(null);

  const mutedColor = "hsl(0 0% 45%)";
  const cardBg = "hsl(0 0% 5%)";
  const borderColor = isDark ? "hsl(0 0% 12%)" : "hsl(0 0% 86%)";

  return (
    <div className="relative min-h-screen flex flex-col pt-28 pb-20 px-6 md:px-12 lg:px-24 overflow-hidden">

      {/* Faint scrolling hex stream background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
        <pre
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            fontFamily: "'Fira Code', monospace",
            fontSize: "11px",
            lineHeight: "22px",
            color: "rgba(232,35,35,0.055)",
            whiteSpace: "pre-wrap",
            wordBreak: "break-all",
            padding: "120px 48px 0",
            userSelect: "none",
          }}
        >
          {HEX_STREAM}
        </pre>
      </div>

      <div className="mb-16" style={{ position: "relative", zIndex: 1 }}>
        <div className="prowler-flicker">
          <BlurText
            text="CONTACT"
            delay={60}
            animateBy="letters"
            direction="top"
            className="font-bold text-[48px] sm:text-[64px] md:text-[80px] tracking-tighter uppercase justify-start"
            style={{ color: "#E82323", fontFamily: "'Fira Code', monospace" }}
          />
        </div>
        <div className="mt-2 h-px w-full" style={{ backgroundColor: borderColor }} />
      </div>

      <p className="text-base sm:text-lg mb-12 max-w-xl" style={{ color: mutedColor, fontFamily: "'Antic', sans-serif", position: "relative", zIndex: 1 }}>
        Got a project in mind or just want to connect?
      </p>

      <div className="flex flex-col gap-4 max-w-lg" style={{ position: "relative", zIndex: 1 }}>
        {contacts.map(({ icon: Icon, label, value, href }, i) => {
          const isActive = activeIdx === i;
          return (
            <a
              key={i}
              href={href}
              target={href.startsWith("mailto") ? undefined : "_blank"}
              rel="noopener noreferrer"
              className="flex items-center gap-5 p-5 rounded-lg hover:-translate-y-0.5"
              style={{
                backgroundColor: cardBg,
                border: `1px solid ${isActive ? "rgba(176,38,255,0.45)" : borderColor}`,
                boxShadow: isActive ? "0 0 28px rgba(176,38,255,0.12)" : "none",
                transition: "border-color 0.15s, box-shadow 0.15s, transform 0.2s",
              }}
              onMouseEnter={() => setActiveIdx(i)}
              onMouseLeave={() => setActiveIdx(null)}
            >
              <div
                className="flex items-center justify-center w-11 h-11 rounded-full flex-shrink-0"
                style={{
                  backgroundColor: isActive ? "#B026FF" : "rgba(232, 35, 35, 0.1)",
                  boxShadow: isActive ? "0 0 18px rgba(176,38,255,0.45)" : "none",
                  transition: "all 0.15s",
                }}
              >
                <Icon
                  className="w-5 h-5"
                  style={{ color: isActive ? "#fff" : "#E82323", transition: "color 0.15s" }}
                />
              </div>
              <div>
                <p className="text-xs font-bold tracking-widest mb-0.5" style={{ color: mutedColor, fontFamily: "'Fira Code', monospace" }}>
                  {label}
                </p>
                <p className="text-base font-semibold" style={{ fontFamily: "'Fira Code', monospace" }}>
                  {value}<span className="cursor-blink" style={{ color: "#E82323", marginLeft: 1 }}>_</span>
                </p>
              </div>
            </a>
          );
        })}
      </div>

      <div className="mt-auto pt-16" style={{ position: "relative", zIndex: 1 }}>
        <p className="text-xs tracking-widest" style={{ color: mutedColor, fontFamily: "'Fira Code', monospace" }}>
          © {new Date().getFullYear()} SRICHARAN SRIDHAR
        </p>
      </div>
    </div>
  );
}
