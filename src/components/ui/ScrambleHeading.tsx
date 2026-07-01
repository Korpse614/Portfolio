import { useRef, useImperativeHandle, type Ref } from "react";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*<>[]";
const rnd = () => CHARS[Math.floor(Math.random() * CHARS.length)];

export interface ScrambleHeadingHandle {
  trigger: () => void;
}

interface Props {
  text: string;
  className?: string;
  style?: React.CSSProperties;
  ref?: Ref<ScrambleHeadingHandle>;
}

export default function ScrambleHeading({ text, className, style, ref }: Props) {
  const spanRef = useRef<HTMLSpanElement>(null);
  const rafRef  = useRef(0);

  useImperativeHandle(ref, () => ({
    trigger() {
      const span = spanRef.current;
      if (!span) return;
      cancelAnimationFrame(rafRef.current);
      const start    = performance.now();
      const DURATION = 1200;
      const tick = (now: number) => {
        const p        = Math.min(1, (now - start) / DURATION);
        const resolved = Math.floor(p * text.length);
        let out = "";
        for (let i = 0; i < text.length; i++) {
          out += i < resolved ? text[i] : rnd();
        }
        span.textContent = out;
        if (p < 1) rafRef.current = requestAnimationFrame(tick);
        else span.textContent = text;
      };
      rafRef.current = requestAnimationFrame(tick);
    },
  }));

  return (
    <span ref={spanRef} className={className} style={style}>
      {text}
    </span>
  );
}
