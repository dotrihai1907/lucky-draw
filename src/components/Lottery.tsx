import { useState, useEffect, useMemo, useRef } from "react";

type LotteryProps = {
  players: string[];
  disabled: Set<string>;
  spinning: boolean;
  winner: string | null;
  showResult: boolean;
  resetKey: number;
};

export default function LotteryDisplay(props: LotteryProps) {
  const { players, disabled, spinning, winner, showResult, resetKey } = props;

  const [display, setDisplay] = useState("");

  const [fontSize, setFontSize] = useState(2.6);

  const textRef = useRef<HTMLSpanElement>(null);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const text = winner || display || "Ready?";

  const activePlayers = useMemo(
    () => players.filter((p) => !disabled.has(p)),
    [players, disabled]
  );

  useEffect(() => {
    const el = textRef.current;
    if (!el) return;

    const parent = el.parentElement;
    if (!parent) return;

    let size = winner ? 3.2 : 2.6;
    setFontSize(size);

    requestAnimationFrame(() => {
      while (el.scrollWidth > parent.clientWidth * 0.9 && size > 1.4) {
        size -= 0.1;
        setFontSize(size);
      }
    });
  }, [text, winner]);

  useEffect(() => {
    if (!spinning || showResult || winner) {
      if (timerRef.current) clearTimeout(timerRef.current);
      return;
    }
    if (!activePlayers.length) return;

    let i = 0;
    let delay = 50;

    const run = () => {
      if (!spinning || showResult || winner) {
        if (timerRef.current) clearTimeout(timerRef.current);
        return;
      }

      const r = Math.floor(Math.random() * activePlayers.length);
      setDisplay(activePlayers[r]);

      i++;
      if (i > 15) delay = 80;
      if (i > 35) delay = 120;
      if (i > 55) delay = 160;
      if (i > 75) delay = 200;

      timerRef.current = setTimeout(run, delay);
    };

    run();

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [spinning, activePlayers, winner, showResult]);

  useEffect(() => {
    setDisplay("");
    setFontSize(2.6);
    if (timerRef.current) clearTimeout(timerRef.current);
  }, [resetKey]);

  return (
    <div style={{ position: "relative", padding: "2rem 0" }}>
      <div
        style={{
          position: "absolute",
          inset: "-2rem",
          borderRadius: "2rem",
          background:
            "radial-gradient(circle at center,#F4C98A 0%,#2A1C14 65%)",
          filter: "blur(2.2rem)",
          opacity: winner ? 1 : spinning ? 0.7 : 0.35,
          transition: "opacity .4s ease",
          pointerEvents: "none",
        }}
      />

      {/* MAIN LOTTERY BOX */}
      <div
        style={{
          width: "clamp(18rem, 48vw, 38rem)",
          height: "10rem",
          borderRadius: "1.5rem",
          background: "rgba(255,255,255,0.10)",
          backdropFilter: "blur(1.1rem) saturate(160%)",
          WebkitBackdropFilter: "blur(1.1rem) saturate(160%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#fff",
          position: "relative",
          overflow: "hidden",
          boxShadow: winner
            ? "0 0 3.5rem #F4C98A,0 0 6rem #3A2A20"
            : spinning
            ? "inset 0 0 1.8rem #F4C98A"
            : " inset 0 0 1.2rem #3A2A20",
          animation:
            spinning && !winner && !showResult
              ? "lotteryPulse .45s infinite alternate ease-in-out"
              : winner && !showResult
              ? "winnerPop .55s ease forwards"
              : "none",

          transition: "box-shadow .4s ease",
        }}
      >
        {winner && !showResult && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: "inherit",
              boxShadow: "inset 0 0 1.4rem rgba(255,255,255,.25)",
              opacity: 0.9,
              pointerEvents: "none",
            }}
          />
        )}

        {/* GALAXY SWEEP SMOOTH */}
        {spinning && !winner && !showResult && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(120deg, transparent 30%,#F4C98A 45%,#F4C98A 50%,#F4C98A 55%, transparent 70%)",
              filter: "blur(0.25rem)",
              mixBlendMode: "screen",
              animation: "innerSweepGalaxy 2.1s linear infinite",
              pointerEvents: "none",
            }}
          />
        )}

        {/* GLITTER SPARK */}
        {spinning && !winner && !showResult && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              overflow: "hidden",
              pointerEvents: "none",
            }}
          >
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                style={{
                  position: "absolute",
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  width: "0.22rem",
                  height: "0.22rem",
                  borderRadius: "50%",
                  background: "rgba(255,255,255,.75)",
                  boxShadow: "0 0 0.25rem rgba(255,255,255,.8)",
                  animation: "sparkBlink 1.1s infinite ease-in-out",
                  animationDelay: `${i * 0.15}s`,
                  opacity: 0.5,
                }}
              />
            ))}
          </div>
        )}

        {/* 🎰 TEXT */}
        <span
          ref={textRef}
          style={{
            fontSize: `${fontSize}rem`,
            fontWeight: 700,
            maxWidth: "92%",
            padding: "0 1rem",
            textAlign: "center",
            lineHeight: 1.3,
            color: "#fff",
            zIndex: 2,
            whiteSpace: "normal",
            wordBreak: "break-word",
            transition: "font-size .25s ease",
            textShadow: winner
              ? "0 0 1.2rem #F7E6C7,0 0 2.6rem #F4C98A)"
              : "0 0 .9rem #3A2A20)",
          }}
        >
          {text}
        </span>
      </div>
    </div>
  );
}
