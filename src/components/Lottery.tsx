import { useState, useEffect } from "react";

type LotteryDisplayProps = {
  players: string[];
  disabled: Set<string>;
  spinning: boolean;
  winner: string | null;
};

export default function LotteryDisplay(props: LotteryDisplayProps) {
  const { players, disabled, spinning, winner } = props;

  const [display, setDisplay] = useState("");

  useEffect(() => {
    if (!spinning) return;

    const id = setInterval(() => {
      const active = players.filter((p) => !disabled.has(p));
      setDisplay(active[Math.floor(Math.random() * active.length)]);
    }, 60);

    return () => clearInterval(id);
  }, [spinning, players, disabled]);

  return (
    <div
      style={{
        width: "60vw",
        maxWidth: "600px",
        height: "160px",
        fontSize: "3rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "25px",
        background: "rgba(255,255,255,0.15)",
        backdropFilter: "blur(10px)",
        boxShadow: "0 0 30px rgba(255,255,255,0.2) inset",
        color: "#fff",
        marginTop: 40,
        border: "2px solid rgba(255,255,255,0.3)",
      }}
    >
      {winner || display || "Ready?"}
    </div>
  );
}
